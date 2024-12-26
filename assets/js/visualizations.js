// 注意力机制可视化
function visualizeAttention(container, attentionWeights, tokens) {
    const margin = { top: 20, right: 20, bottom: 90, left: 90 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // 清除已有内容
    d3.select(container).selectAll("*").remove();

    // 创建 SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 创建色标比例尺
    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
        .domain([0, 1]);

    // 绘制热力图单元格
    const cells = svg.selectAll("rect")
        .data(attentionWeights.flat())
        .enter()
        .append("rect")
        .attr("x", (d, i) => (i % attentionWeights.length) * (width / attentionWeights.length))
        .attr("y", (d, i) => Math.floor(i / attentionWeights.length) * (height / attentionWeights.length))
        .attr("width", width / attentionWeights.length)
        .attr("height", height / attentionWeights.length)
        .style("fill", d => colorScale(d))
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", 2);
            
            // 显示数值
            const i = d3.select(this).datum();
            const row = Math.floor(event.target.y.baseVal.value / (height / attentionWeights.length));
            const col = Math.floor(event.target.x.baseVal.value / (width / attentionWeights.length));
            
            svg.append("text")
                .attr("class", "value-text")
                .attr("x", width / 2)
                .attr("y", -5)
                .style("text-anchor", "middle")
                .text(`${tokens[row]} → ${tokens[col]}: ${d.toFixed(3)}`);
        })
        .on("mouseout", function() {
            d3.select(this)
                .style("stroke", "none");
            svg.selectAll(".value-text").remove();
        });

    // 添加标签
    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .selectAll("text")
        .data(tokens)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * (width / tokens.length) + (width / tokens.length) / 2)
        .attr("y", 20)
        .attr("transform", (d, i) => `rotate(45,${i * (width / tokens.length) + (width / tokens.length) / 2},20)`)
        .style("text-anchor", "start")
        .text(d => d);

    const yAxis = svg.append("g")
        .selectAll("text")
        .data(tokens)
        .enter()
        .append("text")
        .attr("x", -10)
        .attr("y", (d, i) => i * (height / tokens.length) + (height / tokens.length) / 2)
        .style("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text(d => d);
}

// Transformer 架构动画
function animateTransformer(container) {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // 清除已有内容
    d3.select(container).selectAll("*").remove();

    // 创建 SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 定义组件位置
    const components = {
        input: { x: 50, y: height/2 },
        embedding: { x: 150, y: height/2 },
        attention: { x: 300, y: height/2 },
        ffn: { x: 450, y: height/2 },
        norm: { x: 600, y: height/2 },
        output: { x: 700, y: height/2 }
    };

    // 绘制连接线
    Object.keys(components).forEach((key, i) => {
        if (i < Object.keys(components).length - 1) {
            const nextKey = Object.keys(components)[i + 1];
            svg.append("path")
                .attr("d", `M${components[key].x},${components[key].y} L${components[nextKey].x},${components[nextKey].y}`)
                .attr("stroke", "#999")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)");
        }
    });

    // 绘制组件
    Object.entries(components).forEach(([key, pos]) => {
        const group = svg.append("g")
            .attr("transform", `translate(${pos.x},${pos.y})`);

        group.append("circle")
            .attr("r", 30)
            .attr("fill", "#4CAF50")
            .attr("stroke", "#45a049")
            .attr("stroke-width", 2);

        group.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .attr("fill", "white")
            .text(key);
    });

    // 添加动画效果
    function animateFlow() {
        const particle = svg.append("circle")
            .attr("r", 5)
            .attr("fill", "#FFC107")
            .attr("cx", components.input.x)
            .attr("cy", components.input.y);

        Object.values(components).forEach((pos, i) => {
            particle.transition()
                .delay(i * 1000)
                .duration(1000)
                .attr("cx", pos.x)
                .attr("cy", pos.y);
        });

        particle.transition()
            .delay(Object.keys(components).length * 1000)
            .duration(200)
            .attr("r", 0)
            .remove();
    }

    // 每3秒重复动画
    setInterval(animateFlow, 3000);
    animateFlow();
}

// 训练过程可视化
function visualizeTraining(container, data) {
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // 清除已有内容
    d3.select(container).selectAll("*").remove();

    // 创建 SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 创建比例尺
    const x = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([height, 0]);

    // 创建线条生成器
    const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d));

    // 添加X轴
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5));

    // 添加Y轴
    svg.append("g")
        .call(d3.axisLeft(y));

    // 绘制损失曲线
    const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#4CAF50")
        .attr("stroke-width", 2)
        .attr("d", line);

    // 添加动画效果
    const pathLength = path.node().getTotalLength();
    
    path.attr("stroke-dasharray", pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);
}
