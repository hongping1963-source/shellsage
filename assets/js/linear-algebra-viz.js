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

// 矩阵变换可视化
function createMatrixTransformation(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 网格
    function drawGrid() {
        const gridSize = 8;
        const gridStep = scale;
        
        // 移除旧的网格
        g.selectAll(".grid-line").remove();
        
        // 绘制新的网格
        for (let i = -gridSize; i <= gridSize; i++) {
            // 垂直线
            g.append("line")
                .attr("class", "grid-line")
                .attr("x1", i * gridStep)
                .attr("y1", -gridSize * gridStep)
                .attr("x2", i * gridStep)
                .attr("y2", gridSize * gridStep)
                .attr("stroke", "#ddd")
                .attr("stroke-width", 0.5);
            
            // 水平线
            g.append("line")
                .attr("class", "grid-line")
                .attr("x1", -gridSize * gridStep)
                .attr("y1", i * gridStep)
                .attr("x2", gridSize * gridStep)
                .attr("y2", i * gridStep)
                .attr("stroke", "#ddd")
                .attr("stroke-width", 0.5);
        }
    }
    
    // 绘制基向量
    function drawBasisVectors(matrix) {
        // 移除旧的基向量
        g.selectAll(".basis-vector").remove();
        
        // 绘制变换后的基向量
        const i_hat = {x: matrix[0][0], y: -matrix[1][0]};  // 第一列
        const j_hat = {x: matrix[0][1], y: -matrix[1][1]};  // 第二列
        
        drawVector(g, {x: 0, y: 0}, 
            {x: i_hat.x * scale, y: i_hat.y * scale}, 
            "red", "i").attr("class", "basis-vector");
        
        drawVector(g, {x: 0, y: 0}, 
            {x: j_hat.x * scale, y: j_hat.y * scale}, 
            "blue", "j").attr("class", "basis-vector");
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "matrix-controls");
    
    // 矩阵输入
    controls.append("div")
        .html(`
            <label>变换矩阵:</label><br>
            <input type="number" id="m11" value="1" step="0.1" style="width:60px">
            <input type="number" id="m12" value="0" step="0.1" style="width:60px"><br>
            <input type="number" id="m21" value="0" step="0.1" style="width:60px">
            <input type="number" id="m22" value="1" step="0.1" style="width:60px">
        `);
    
    // 预设变换按钮
    controls.append("div")
        .attr("class", "preset-buttons")
        .html(`
            <button onclick="updateMatrix([1,0,0,1])">单位矩阵</button>
            <button onclick="updateMatrix([0,-1,1,0])">旋转90°</button>
            <button onclick="updateMatrix([2,0,0,2])">放大2倍</button>
            <button onclick="updateMatrix([1,1,0,1])">剪切</button>
        `);
    
    // 更新函数
    function updateTransformation() {
        const matrix = [
            [parseFloat(d3.select("#m11").property("value")), 
             parseFloat(d3.select("#m12").property("value"))],
            [parseFloat(d3.select("#m21").property("value")), 
             parseFloat(d3.select("#m22").property("value"))]
        ];
        
        drawGrid();
        drawBasisVectors(matrix);
    }
    
    // 添加事件监听器
    ["m11", "m12", "m21", "m22"].forEach(id => {
        d3.select("#" + id).on("input", updateTransformation);
    });
    
    // 初始化
    updateTransformation();
    
    // 暴露更新矩阵的函数给全局作用域
    window.updateMatrix = function(values) {
        d3.select("#m11").property("value", values[0]);
        d3.select("#m12").property("value", values[1]);
        d3.select("#m21").property("value", values[2]);
        d3.select("#m22").property("value", values[3]);
        updateTransformation();
    };
}

// 特征值和特征向量可视化
function createEigenDemo(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    function drawEigenVectors(matrix, vector) {
        // 移除旧的向量
        g.selectAll(".eigen-vector").remove();
        
        // 原始向量
        const x = vector[0];
        const y = vector[1];
        drawVector(g, {x: 0, y: 0}, 
            {x: x * scale, y: -y * scale}, 
            "blue", "v").attr("class", "eigen-vector");
        
        // 变换后的向量
        const transformed = [
            matrix[0][0] * x + matrix[0][1] * y,
            matrix[1][0] * x + matrix[1][1] * y
        ];
        drawVector(g, {x: 0, y: 0}, 
            {x: transformed[0] * scale, y: -transformed[1] * scale}, 
            "red", "Av").attr("class", "eigen-vector");
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "eigen-controls");
    
    controls.append("div")
        .html(`
            <label>向量:</label><br>
            <input type="range" id="angle" min="0" max="360" value="0">
            <span id="angle-value">0°</span>
        `);
    
    // 更新函数
    function updateEigenDemo() {
        const angle = parseFloat(d3.select("#angle").property("value"));
        d3.select("#angle-value").text(angle + "°");
        
        const rad = angle * Math.PI / 180;
        const vector = [Math.cos(rad), Math.sin(rad)];
        
        // 使用一个简单的2x2矩阵作为示例
        const matrix = [[2, 1], [1, 2]];  // 这个矩阵的特征值是3和1
        
        drawEigenVectors(matrix, vector);
    }
    
    // 添加事件监听器
    d3.select("#angle").on("input", updateEigenDemo);
    
    // 初始化
    updateEigenDemo();
}

// 导出函数
window.LinearAlgebraViz = {
    createVectorVisualization,
    createVectorAddition,
    createLinearCombination,
    createVectorRotation,
    createMatrixTransformation,
    createEigenDemo
};
