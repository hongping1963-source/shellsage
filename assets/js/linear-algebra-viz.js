// 基础工具函数
function createSVG(container, width, height) {
    // 清除已有内容
    d3.select(container).selectAll("*").remove();
    
    // 创建新的 SVG
    return d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
}

function createCoordinateSystem(svg, origin, size) {
    const g = svg.append("g")
        .attr("transform", `translate(${origin.x},${origin.y})`);
    
    // X轴
    g.append("line")
        .attr("x1", -size.width/2)
        .attr("y1", 0)
        .attr("x2", size.width/2)
        .attr("y2", 0)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    
    // Y轴
    g.append("line")
        .attr("x1", 0)
        .attr("y1", -size.height/2)
        .attr("x2", 0)
        .attr("y2", size.height/2)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    
    // 添加刻度
    const ticks = [-4, -3, -2, -1, 1, 2, 3, 4];
    const scale = 40; // 每个单位的像素数
    
    // X轴刻度
    ticks.forEach(tick => {
        g.append("line")
            .attr("x1", tick * scale)
            .attr("y1", -5)
            .attr("x2", tick * scale)
            .attr("y2", 5)
            .attr("stroke", "black");
        
        g.append("text")
            .attr("x", tick * scale)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text(tick);
    });
    
    // Y轴刻度
    ticks.forEach(tick => {
        g.append("line")
            .attr("x1", -5)
            .attr("y1", tick * scale)
            .attr("x2", 5)
            .attr("y2", tick * scale)
            .attr("stroke", "black");
        
        g.append("text")
            .attr("x", -20)
            .attr("y", -tick * scale)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text(tick);
    });
    
    return g;
}

// 绘制向量
function drawVector(g, start, end, color = "red", label = "") {
    // 绘制向量线段
    g.append("line")
        .attr("x1", start.x)
        .attr("y1", -start.y)  // 注意Y轴方向相反
        .attr("x2", end.x)
        .attr("y2", -end.y)    // 注意Y轴方向相反
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("marker-end", `url(#arrow-${color})`);
    
    // 添加标签
    if (label) {
        const midX = (start.x + end.x) / 2;
        const midY = -(start.y + end.y) / 2;  // 注意Y轴方向相反
        g.append("text")
            .attr("x", midX + 10)
            .attr("y", midY)
            .attr("fill", color)
            .text(label);
    }
}

// 创建向量可视化
function createVectorVisualization(container) {
    const width = 400;
    const height = 400;
    const svg = createSVG(container, width, height);
    
    // 添加箭头标记
    const defs = svg.append("defs");
    ["red", "blue", "green"].forEach(color => {
        defs.append("marker")
            .attr("id", `arrow-${color}`)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", color);
    });
    
    const g = createCoordinateSystem(svg, {x: width/2, y: height/2}, {width, height});
    
    return g;
}

// 向量加法可视化
function createVectorAddition(container, v1, v2) {
    const g = createVectorVisualization(container);
    const scale = 40; // 缩放因子
    
    // 绘制第一个向量
    drawVector(g, 
        {x: 0, y: 0}, 
        {x: v1.x * scale, y: v1.y * scale}, 
        "blue", 
        "v₁"
    );
    
    // 绘制第二个向量（从第一个向量的终点开始）
    drawVector(g, 
        {x: v1.x * scale, y: v1.y * scale}, 
        {x: (v1.x + v2.x) * scale, y: (v1.y + v2.y) * scale}, 
        "green", 
        "v₂"
    );
    
    // 绘制和向量
    drawVector(g, 
        {x: 0, y: 0}, 
        {x: (v1.x + v2.x) * scale, y: (v1.y + v2.y) * scale}, 
        "red", 
        "v₁ + v₂"
    );
}

// 线性组合可视化
function createLinearCombination(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 基向量
    const v1 = {x: 1, y: 0};
    const v2 = {x: 0, y: 1};
    
    // 绘制基向量
    drawVector(g, {x: 0, y: 0}, {x: v1.x * scale, y: v1.y * scale}, "blue", "e₁");
    drawVector(g, {x: 0, y: 0}, {x: v2.x * scale, y: v2.y * scale}, "green", "e₂");
    
    // 添加滑块控制
    const controls = d3.select(container)
        .append("div")
        .attr("class", "vector-controls");
    
    // 第一个系数滑块
    controls.append("div")
        .html(`<label>c₁: <span id="c1-value">1</span></label>
               <input type="range" id="c1" min="-2" max="2" step="0.1" value="1">`);
    
    // 第二个系数滑块
    controls.append("div")
        .html(`<label>c₂: <span id="c2-value">1</span></label>
               <input type="range" id="c2" min="-2" max="2" step="0.1" value="1">`);
    
    // 更新函数
    function updateVector() {
        const c1 = parseFloat(d3.select("#c1").property("value"));
        const c2 = parseFloat(d3.select("#c2").property("value"));
        
        d3.select("#c1-value").text(c1.toFixed(1));
        d3.select("#c2-value").text(c2.toFixed(1));
        
        // 移除旧的结果向量
        g.selectAll(".result-vector").remove();
        
        // 绘制新的结果向量
        drawVector(g, 
            {x: 0, y: 0}, 
            {x: (c1 * v1.x + c2 * v2.x) * scale, y: (c1 * v1.y + c2 * v2.y) * scale}, 
            "red", 
            `${c1.toFixed(1)}e₁ + ${c2.toFixed(1)}e₂`
        ).attr("class", "result-vector");
    }
    
    // 添加事件监听器
    d3.select("#c1").on("input", updateVector);
    d3.select("#c2").on("input", updateVector);
    
    // 初始化向量
    updateVector();
}

// 向量旋转可视化
function createVectorRotation(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 初始向量
    const vector = {x: 1, y: 0};
    
    // 添加角度滑块
    const controls = d3.select(container)
        .append("div")
        .attr("class", "vector-controls");
    
    controls.append("div")
        .html(`<label>θ: <span id="theta-value">0°</span></label>
               <input type="range" id="theta" min="0" max="360" step="1" value="0">`);
    
    function updateRotation() {
        const theta = parseFloat(d3.select("#theta").property("value"));
        d3.select("#theta-value").text(theta + "°");
        
        // 计算旋转后的向量
        const rad = theta * Math.PI / 180;
        const rotated = {
            x: vector.x * Math.cos(rad) - vector.y * Math.sin(rad),
            y: vector.x * Math.sin(rad) + vector.y * Math.cos(rad)
        };
        
        // 移除旧的向量
        g.selectAll(".rotated-vector").remove();
        
        // 绘制新的向量
        drawVector(g, 
            {x: 0, y: 0}, 
            {x: rotated.x * scale, y: rotated.y * scale}, 
            "red", 
            `θ = ${theta}°`
        ).attr("class", "rotated-vector");
    }
    
    // 添加事件监听器
    d3.select("#theta").on("input", updateRotation);
    
    // 初始化向量
    updateRotation();
}

// 导出函数
window.LinearAlgebraViz = {
    createVectorVisualization,
    createVectorAddition,
    createLinearCombination,
    createVectorRotation
};
