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
    drawVector(g, {x: 0, y: 0}, 
        {x: v1.x * scale, y: v1.y * scale}, 
        "blue", "e₁");
    drawVector(g, {x: 0, y: 0}, 
        {x: v2.x * scale, y: v2.y * scale}, 
        "green", "e₂");
    
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

// 向量空间可视化
function createVectorSpaceViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制平面（二维子空间）
    function drawPlane(normal) {
        const planeLength = 400;
        
        // 计算平面上的两个方向向量
        let v1, v2;
        if (Math.abs(normal[2]) < 0.99) {
            v1 = [-normal[1], normal[0], 0];
            v2 = cross(normal, v1);
        } else {
            v1 = [1, 0, 0];
            v2 = [0, 1, 0];
        }
        
        // 归一化
        const len1 = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1] + v1[2]*v1[2]);
        const len2 = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1] + v2[2]*v2[2]);
        v1 = v1.map(x => x/len1);
        v2 = v2.map(x => x/len2);
        
        // 绘制网格
        const gridSize = 5;
        const step = planeLength / gridSize;
        
        for (let i = -gridSize; i <= gridSize; i++) {
            // 平行于v1的线
            const start1 = [
                i * step * v1[0],
                i * step * v1[1]
            ];
            const end1 = [
                i * step * v1[0] + planeLength * v2[0],
                i * step * v1[1] + planeLength * v2[1]
            ];
            
            g.append("line")
                .attr("x1", start1[0])
                .attr("y1", -start1[1])
                .attr("x2", end1[0])
                .attr("y2", -end1[1])
                .attr("stroke", "#ddd")
                .attr("stroke-width", 0.5);
                
            // 平行于v2的线
            const start2 = [
                i * step * v2[0],
                i * step * v2[1]
            ];
            const end2 = [
                i * step * v2[0] + planeLength * v1[0],
                i * step * v2[1] + planeLength * v1[1]
            ];
            
            g.append("line")
                .attr("x1", start2[0])
                .attr("y1", -start2[1])
                .attr("x2", end2[0])
                .attr("y2", -end2[1])
                .attr("stroke", "#ddd")
                .attr("stroke-width", 0.5);
        }
    }
    
    // 绘制基向量
    function drawBasisVectors(vectors) {
        vectors.forEach((v, i) => {
            drawVector(g, 
                {x: 0, y: 0}, 
                {x: v[0] * scale, y: v[1] * scale}, 
                ["red", "blue", "green"][i],
                `v${i+1}`
            );
        });
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "vector-space-controls");
    
    // 基向量输入
    controls.append("div")
        .html(`
            <div class="basis-input">
                <label>基向量 1:</label><br>
                <input type="number" id="v1x" value="1" step="0.1" style="width:60px">
                <input type="number" id="v1y" value="0" step="0.1" style="width:60px">
            </div>
            <div class="basis-input">
                <label>基向量 2:</label><br>
                <input type="number" id="v2x" value="0" step="0.1" style="width:60px">
                <input type="number" id="v2y" value="1" step="0.1" style="width:60px">
            </div>
        `);
    
    // 预设按钮
    controls.append("div")
        .attr("class", "preset-buttons")
        .html(`
            <button onclick="updateBasis([[1,0],[0,1]])">标准基</button>
            <button onclick="updateBasis([[1,1],[-1,1]])">旋转45°基</button>
            <button onclick="updateBasis([[2,0],[0,0.5]])">拉伸基</button>
        `);
    
    // 更新函数
    function updateVectorSpace() {
        // 清除旧的绘制
        g.selectAll("line").remove();
        g.selectAll("path").remove();
        g.selectAll("text").remove();
        
        // 获取基向量
        const basis = [
            [parseFloat(d3.select("#v1x").property("value")),
             parseFloat(d3.select("#v1y").property("value"))],
            [parseFloat(d3.select("#v2x").property("value")),
             parseFloat(d3.select("#v2y").property("value"))]
        ];
        
        // 重新绘制
        drawPlane([0, 0, 1]);  // xy平面
        drawBasisVectors(basis);
    }
    
    // 添加事件监听器
    ["v1x", "v1y", "v2x", "v2y"].forEach(id => {
        d3.select("#" + id).on("input", updateVectorSpace);
    });
    
    // 暴露更新基的函数给全局作用域
    window.updateBasis = function(basis) {
        d3.select("#v1x").property("value", basis[0][0]);
        d3.select("#v1y").property("value", basis[0][1]);
        d3.select("#v2x").property("value", basis[1][0]);
        d3.select("#v2y").property("value", basis[1][1]);
        updateVectorSpace();
    };
    
    // 初始化
    updateVectorSpace();
}

// 子空间可视化
function createSubspaceViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制子空间（直线或平面）
    function drawSubspace(vectors) {
        // 清除旧的绘制
        g.selectAll(".subspace").remove();
        
        if (vectors.length === 1) {
            // 一维子空间（直线）
            const v = vectors[0];
            const len = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
            const normalized = [v[0]/len, v[1]/len];
            
            g.append("line")
                .attr("class", "subspace")
                .attr("x1", -normalized[0] * 200)
                .attr("y1", normalized[1] * 200)
                .attr("x2", normalized[0] * 200)
                .attr("y2", -normalized[1] * 200)
                .attr("stroke", "#ddd")
                .attr("stroke-width", 1)
                .style("stroke-dasharray", "5,5");
        } else if (vectors.length === 2) {
            // 二维子空间（平面）
            drawPlane([0, 0, 1]);
        }
        
        // 绘制基向量
        drawBasisVectors(vectors);
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "subspace-controls");
    
    // 向量输入
    controls.append("div")
        .html(`
            <div class="vector-input">
                <label>向量:</label><br>
                <input type="number" id="vx" value="1" step="0.1" style="width:60px">
                <input type="number" id="vy" value="1" step="0.1" style="width:60px">
            </div>
        `);
    
    // 维度选择
    controls.append("div")
        .html(`
            <div class="dimension-select">
                <label>子空间维度:</label><br>
                <select id="dimension">
                    <option value="1">1维（直线）</option>
                    <option value="2">2维（平面）</option>
                </select>
            </div>
        `);
    
    // 更新函数
    function updateSubspace() {
        const v = [
            parseFloat(d3.select("#vx").property("value")),
            parseFloat(d3.select("#vy").property("value"))
        ];
        
        const dim = parseInt(d3.select("#dimension").property("value"));
        
        if (dim === 1) {
            drawSubspace([v]);
        } else {
            // 为二维子空间添加一个垂直的向量
            const perpV = [-v[1], v[0]];
            drawSubspace([v, perpV]);
        }
    }
    
    // 添加事件监听器
    ["vx", "vy"].forEach(id => {
        d3.select("#" + id).on("input", updateSubspace);
    });
    d3.select("#dimension").on("change", updateSubspace);
    
    // 初始化
    updateSubspace();
}

// 正交性和投影可视化
function createOrthogonalityViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制向量和其投影
    function drawVectorAndProjection(v1, v2) {
        // 清除旧的绘制
        g.selectAll(".vector-projection").remove();
        
        // 计算投影
        const dot = v1[0]*v2[0] + v1[1]*v2[1];
        const v2_len_sq = v2[0]*v2[0] + v2[1]*v2[1];
        const proj_scale = dot / v2_len_sq;
        const proj = [v2[0]*proj_scale, v2[1]*proj_scale];
        
        // 计算垂直分量
        const perp = [v1[0] - proj[0], v1[1] - proj[1]];
        
        // 绘制原向量
        drawVector(g, {x: 0, y: 0}, 
            {x: v1[0] * scale, y: -v1[1] * scale}, 
            "blue", "v").attr("class", "vector-projection");
        
        // 绘制投影向量
        drawVector(g, {x: 0, y: 0}, 
            {x: proj[0] * scale, y: -proj[1] * scale}, 
            "red", "proj(v)").attr("class", "vector-projection");
        
        // 绘制垂直分量
        drawVector(g, {x: proj[0] * scale, y: -proj[1] * scale}, 
            {x: v1[0] * scale, y: -v1[1] * scale}, 
            "green", "v⊥").attr("class", "vector-projection");
        
        // 绘制被投影向量
        drawVector(g, {x: 0, y: 0}, 
            {x: v2[0] * scale, y: -v2[1] * scale}, 
            "purple", "u").attr("class", "vector-projection");
        
        // 绘制投影线（虚线）
        g.append("line")
            .attr("class", "vector-projection")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", v1[0] * scale)
            .attr("y2", -v1[1] * scale)
            .attr("stroke", "#999")
            .attr("stroke-width", 1)
            .style("stroke-dasharray", "5,5");
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "orthogonality-controls");
    
    // 向量输入
    controls.append("div")
        .html(`
            <div class="vector-input">
                <label>向量 v:</label><br>
                <input type="number" id="v1x" value="2" step="0.1" style="width:60px">
                <input type="number" id="v1y" value="1" step="0.1" style="width:60px">
            </div>
            <div class="vector-input">
                <label>向量 u:</label><br>
                <input type="number" id="v2x" value="1" step="0.1" style="width:60px">
                <input type="number" id="v2y" value="0" step="0.1" style="width:60px">
            </div>
        `);
    
    // 更新函数
    function updateProjection() {
        const v1 = [
            parseFloat(d3.select("#v1x").property("value")),
            parseFloat(d3.select("#v1y").property("value"))
        ];
        const v2 = [
            parseFloat(d3.select("#v2x").property("value")),
            parseFloat(d3.select("#v2y").property("value"))
        ];
        
        drawVectorAndProjection(v1, v2);
    }
    
    // 添加事件监听器
    ["v1x", "v1y", "v2x", "v2y"].forEach(id => {
        d3.select("#" + id).on("input", updateProjection);
    });
    
    // 初始化
    updateProjection();
}

// Gram-Schmidt正交化可视化
function createGramSchmidtViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制向量组
    function drawVectorSet(vectors, colors) {
        // 清除旧的绘制
        g.selectAll(".gram-schmidt").remove();
        
        vectors.forEach((v, i) => {
            drawVector(g, {x: 0, y: 0}, 
                {x: v[0] * scale, y: -v[1] * scale}, 
                colors[i], `v${i+1}`).attr("class", "gram-schmidt");
        });
    }
    
    // Gram-Schmidt正交化
    function gramSchmidt(vectors) {
        const orthogonal = [];
        
        vectors.forEach((v, i) => {
            let u = [...v];
            // 减去在之前向量上的投影
            for (let j = 0; j < i; j++) {
                const prev = orthogonal[j];
                const dot = u[0]*prev[0] + u[1]*prev[1];
                const prev_len_sq = prev[0]*prev[0] + prev[1]*prev[1];
                const proj_scale = dot / prev_len_sq;
                u[0] -= prev[0] * proj_scale;
                u[1] -= prev[1] * proj_scale;
            }
            orthogonal.push(u);
        });
        
        return orthogonal;
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "gram-schmidt-controls");
    
    // 向量输入
    controls.append("div")
        .html(`
            <div class="vector-set">
                <label>向量组:</label><br>
                <div class="vector-input">
                    <label>v₁:</label>
                    <input type="number" id="v1x" value="1" step="0.1" style="width:60px">
                    <input type="number" id="v1y" value="1" step="0.1" style="width:60px">
                </div>
                <div class="vector-input">
                    <label>v₂:</label>
                    <input type="number" id="v2x" value="0" step="0.1" style="width:60px">
                    <input type="number" id="v2y" value="1" step="0.1" style="width:60px">
                </div>
            </div>
        `);
    
    // 添加按钮
    controls.append("div")
        .attr("class", "gram-schmidt-buttons")
        .html(`
            <button id="show-original">显示原始向量</button>
            <button id="show-orthogonal">显示正交化结果</button>
        `);
    
    // 更新函数
    function updateVectors(orthogonalize = false) {
        const vectors = [
            [parseFloat(d3.select("#v1x").property("value")),
             parseFloat(d3.select("#v1y").property("value"))]
            [parseFloat(d3.select("#v2x").property("value")),
             parseFloat(d3.select("#v2y").property("value"))]
        ];
        
        if (orthogonalize) {
            const orthogonal = gramSchmidt(vectors);
            drawVectorSet(orthogonal, ["red", "blue"]);
        } else {
            drawVectorSet(vectors, ["purple", "orange"]);
        }
    }
    
    // 添加事件监听器
    ["v1x", "v1y", "v2x", "v2y"].forEach(id => {
        d3.select("#" + id).on("input", () => updateVectors(false));
    });
    
    d3.select("#show-original").on("click", () => updateVectors(false));
    d3.select("#show-orthogonal").on("click", () => updateVectors(true));
    
    // 初始化
    updateVectors(false);
}

// 特征值和特征向量可视化
function createEigenViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制矩阵变换和特征向量
    function drawEigenVectors(matrix, eigenvals, eigenvecs) {
        // 清除旧的绘制
        g.selectAll(".eigen").remove();
        
        // 绘制网格
        drawGrid(g);
        
        // 绘制变换后的网格
        drawTransformedGrid(g, matrix);
        
        // 绘制特征向量及其变换
        eigenvecs.forEach((v, i) => {
            const eigenval = eigenvals[i];
            const transformed = [
                matrix[0][0]*v[0] + matrix[0][1]*v[1],
                matrix[1][0]*v[0] + matrix[1][1]*v[1]
            ];
            
            // 原始特征向量
            drawVector(g, {x: 0, y: 0}, 
                {x: v[0] * scale, y: -v[1] * scale}, 
                "blue", `v${i+1}`).attr("class", "eigen");
            
            // 变换后的特征向量
            drawVector(g, {x: 0, y: 0}, 
                {x: transformed[0] * scale, y: -transformed[1] * scale}, 
                "red", `λ${i+1}v${i+1}`).attr("class", "eigen");
            
            // 添加特征值标签
            g.append("text")
                .attr("class", "eigen")
                .attr("x", v[0] * scale + 10)
                .attr("y", -v[1] * scale + 10)
                .text(`λ${i+1} = ${eigenval.toFixed(2)}`)
                .style("font-size", "12px");
        });
    }
    
    // 计算2x2矩阵的特征值和特征向量
    function computeEigen(matrix) {
        // 计算特征多项式系数
        const a = 1;
        const b = -(matrix[0][0] + matrix[1][1]);
        const c = matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
        
        // 求解特征值
        const discriminant = Math.sqrt(b*b - 4*a*c);
        const eigenvals = [
            (-b + discriminant)/(2*a),
            (-b - discriminant)/(2*a)
        ];
        
        // 求解特征向量
        const eigenvecs = eigenvals.map(lambda => {
            const temp = matrix[0][1] !== 0 ? 
                [matrix[0][1], lambda - matrix[0][0]] :
                [lambda - matrix[1][1], matrix[1][0]];
            const norm = Math.sqrt(temp[0]*temp[0] + temp[1]*temp[1]);
            return [temp[0]/norm, temp[1]/norm];
        });
        
        return {eigenvals, eigenvecs};
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "eigen-controls");
    
    // 矩阵输入
    controls.append("div")
        .html(`
            <div class="matrix-input">
                <label>变换矩阵:</label><br>
                <input type="number" id="m11" value="2" step="0.1" style="width:60px">
                <input type="number" id="m12" value="1" step="0.1" style="width:60px"><br>
                <input type="number" id="m21" value="1" step="0.1" style="width:60px">
                <input type="number" id="m22" value="2" step="0.1" style="width:60px">
            </div>
        `);
    
    // 更新函数
    function updateEigenVectors() {
        const matrix = [
            [parseFloat(d3.select("#m11").property("value")), 
             parseFloat(d3.select("#m12").property("value"))],
            [parseFloat(d3.select("#m21").property("value")), 
             parseFloat(d3.select("#m22").property("value"))]
        ];
        
        const {eigenvals, eigenvecs} = computeEigen(matrix);
        drawEigenVectors(matrix, eigenvals, eigenvecs);
    }
    
    // 添加事件监听器
    ["m11", "m12", "m21", "m22"].forEach(id => {
        d3.select("#" + id).on("input", updateEigenVectors);
    });
    
    // 初始化
    updateEigenVectors();
}

// 特征值分解可视化
function createEigenDecompViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制矩阵分解
    function drawEigenDecomposition(matrix) {
        // 清除旧的绘制
        g.selectAll(".eigen-decomp").remove();
        
        // 计算特征值和特征向量
        const {eigenvals, eigenvecs} = computeEigen(matrix);
        
        // 构造对角矩阵
        const D = [
            [eigenvals[0], 0],
            [0, eigenvals[1]]
        ];
        
        // 构造特征向量矩阵
        const P = eigenvecs;
        
        // 绘制原始变换
        drawTransformedGrid(g, matrix);
        
        // 绘制分解步骤
        // 1. P: 特征向量基变换
        // 2. D: 缩放
        // 3. P^(-1): 逆变换
        
        // 添加分解说明
        g.append("text")
            .attr("class", "eigen-decomp")
            .attr("x", -150)
            .attr("y", -150)
            .html("A = PDP<sup>-1</sup>")
            .style("font-size", "16px");
            
        // 添加矩阵值
        g.append("text")
            .attr("class", "eigen-decomp")
            .attr("x", -150)
            .attr("y", -130)
            .text(`D = diag(${eigenvals[0].toFixed(2)}, ${eigenvals[1].toFixed(2)})`)
            .style("font-size", "12px");
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "eigen-decomp-controls");
    
    // 矩阵输入
    controls.append("div")
        .html(`
            <div class="matrix-input">
                <label>矩阵 A:</label><br>
                <input type="number" id="a11" value="2" step="0.1" style="width:60px">
                <input type="number" id="a12" value="1" step="0.1" style="width:60px"><br>
                <input type="number" id="a21" value="1" step="0.1" style="width:60px">
                <input type="number" id="a22" value="2" step="0.1" style="width:60px">
            </div>
        `);
    
    // 更新函数
    function updateDecomposition() {
        const matrix = [
            [parseFloat(d3.select("#a11").property("value")),
             parseFloat(d3.select("#a12").property("value"))],
            [parseFloat(d3.select("#a21").property("value")),
             parseFloat(d3.select("#a22").property("value"))]
        ];
        
        drawEigenDecomposition(matrix);
    }
    
    // 添加事件监听器
    ["a11", "a12", "a21", "a22"].forEach(id => {
        d3.select("#" + id).on("input", updateDecomposition);
    });
    
    // 初始化
    updateDecomposition();
}

// SVD可视化
function createSVDViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制SVD分解步骤
    function drawSVDSteps(matrix) {
        // 清除旧的绘制
        g.selectAll(".svd").remove();
        
        // 计算SVD
        const {U, S, V} = computeSVD(matrix);
        
        // 绘制原始变换
        drawTransformedGrid(g, matrix);
        
        // 绘制左奇异向量
        U.forEach((v, i) => {
            drawVector(g, {x: 0, y: 0}, 
                {x: v[0] * scale, y: -v[1] * scale}, 
                "blue", `u${i+1}`).attr("class", "svd");
        });
        
        // 绘制右奇异向量
        V.forEach((v, i) => {
            drawVector(g, {x: 0, y: 0}, 
                {x: v[0] * scale, y: -v[1] * scale}, 
                "red", `v${i+1}`).attr("class", "svd");
        });
        
        // 添加奇异值标签
        g.append("text")
            .attr("class", "svd")
            .attr("x", -150)
            .attr("y", -150)
            .text(`σ₁ = ${S[0].toFixed(2)}, σ₂ = ${S[1].toFixed(2)}`)
            .style("font-size", "14px");
    }
    
    // 计算2x2矩阵的SVD
    function computeSVD(A) {
        // 计算AᵀA和AAᵀ
        const ATA = [
            [A[0][0]*A[0][0] + A[1][0]*A[1][0], A[0][0]*A[0][1] + A[1][0]*A[1][1]],
            [A[0][1]*A[0][0] + A[1][1]*A[1][0], A[0][1]*A[0][1] + A[1][1]*A[1][1]]
        ];
        
        const AAT = [
            [A[0][0]*A[0][0] + A[0][1]*A[0][1], A[0][0]*A[1][0] + A[0][1]*A[1][1]],
            [A[1][0]*A[0][0] + A[1][1]*A[0][1], A[1][0]*A[1][0] + A[1][1]*A[1][1]]
        ];
        
        // 计算特征值和特征向量
        const {eigenvals: S_squared, eigenvecs: V} = computeEigen(ATA);
        const {eigenvecs: U} = computeEigen(AAT);
        
        // 计算奇异值
        const S = S_squared.map(Math.sqrt);
        
        return {U, S, V};
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "svd-controls");
    
    // 矩阵输入
    controls.append("div")
        .html(`
            <div class="matrix-input">
                <label>矩阵 A:</label><br>
                <input type="number" id="svd11" value="2" step="0.1" style="width:60px">
                <input type="number" id="svd12" value="1" step="0.1" style="width:60px"><br>
                <input type="number" id="svd21" value="1" step="0.1" style="width:60px">
                <input type="number" id="svd22" value="2" step="0.1" style="width:60px">
            </div>
        `);
    
    // 更新函数
    function updateSVD() {
        const matrix = [
            [parseFloat(d3.select("#svd11").property("value")),
             parseFloat(d3.select("#svd12").property("value"))],
            [parseFloat(d3.select("#svd21").property("value")),
             parseFloat(d3.select("#svd22").property("value"))]
        ];
        
        drawSVDSteps(matrix);
    }
    
    // 添加事件监听器
    ["svd11", "svd12", "svd21", "svd22"].forEach(id => {
        d3.select("#" + id).on("input", updateSVD);
    });
    
    // 初始化
    updateSVD();
}

// SVD应用可视化
function createSVDApplicationViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制低秩近似
    function drawLowRankApproximation(matrix, rank) {
        // 清除旧的绘制
        g.selectAll(".svd-approx").remove();
        
        // 计算SVD
        const {U, S, V} = computeSVD(matrix);
        
        // 构造近似矩阵
        const approx = [
            [0, 0],
            [0, 0]
        ];
        
        // 只使用前rank个奇异值
        for (let i = 0; i < rank; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {
                    approx[j][k] += S[i] * U[j][i] * V[k][i];
                }
            }
        }
        
        // 绘制原始变换和近似变换
        drawTransformedGrid(g, matrix, "blue", 0.3);
        drawTransformedGrid(g, approx, "red", 0.7);
        
        // 添加误差信息
        const error = Math.sqrt(
            (matrix[0][0] - approx[0][0])**2 +
            (matrix[0][1] - approx[0][1])**2 +
            (matrix[1][0] - approx[1][0])**2 +
            (matrix[1][1] - approx[1][1])**2
        );
        
        g.append("text")
            .attr("class", "svd-approx")
            .attr("x", -150)
            .attr("y", -150)
            .text(`Frobenius误差: ${error.toFixed(3)}`)
            .style("font-size", "14px");
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "svd-app-controls");
    
    // 矩阵输入和秩选择
    controls.append("div")
        .html(`
            <div class="matrix-input">
                <label>矩阵 A:</label><br>
                <input type="number" id="app11" value="2" step="0.1" style="width:60px">
                <input type="number" id="app12" value="1" step="0.1" style="width:60px"><br>
                <input type="number" id="app21" value="1" step="0.1" style="width:60px">
                <input type="number" id="app22" value="2" step="0.1" style="width:60px">
            </div>
            <div class="rank-select">
                <label>近似秩:</label>
                <select id="rank">
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </div>
        `);
    
    // 更新函数
    function updateApproximation() {
        const matrix = [
            [parseFloat(d3.select("#app11").property("value")),
             parseFloat(d3.select("#app12").property("value"))],
            [parseFloat(d3.select("#app21").property("value")),
             parseFloat(d3.select("#app22").property("value"))]
        ];
        
        const rank = parseInt(d3.select("#rank").property("value"));
        drawLowRankApproximation(matrix, rank);
    }
    
    // 添加事件监听器
    ["app11", "app12", "app21", "app22", "rank"].forEach(id => {
        d3.select("#" + id).on("input", updateApproximation);
    });
    
    // 初始化
    updateApproximation();
}

// 线性方程组可视化
function createLinearSystemViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制线性方程组的几何表示
    function drawLinearSystem(equations) {
        // 清除旧的绘制
        g.selectAll(".linear-system").remove();
        
        // 绘制每个方程的直线
        equations.forEach((eq, i) => {
            // ax + by = c
            const [a, b, c] = eq;
            
            // 计算两个点来绘制直线
            const x1 = -5;
            const x2 = 5;
            const y1 = (c - a*x1) / b;
            const y2 = (c - a*x2) / b;
            
            // 绘制直线
            g.append("line")
                .attr("class", "linear-system")
                .attr("x1", x1 * scale)
                .attr("y1", -y1 * scale)
                .attr("x2", x2 * scale)
                .attr("y2", -y2 * scale)
                .attr("stroke", i === 0 ? "blue" : "red")
                .attr("stroke-width", 2);
            
            // 添加方程标签
            g.append("text")
                .attr("class", "linear-system")
                .attr("x", x2 * scale - 20)
                .attr("y", -y2 * scale - 10)
                .text(`${a}x + ${b}y = ${c}`)
                .style("font-size", "12px")
                .style("fill", i === 0 ? "blue" : "red");
        });
        
        // 如果有解，绘制解点
        if (equations.length === 2) {
            const solution = solveSystem(equations[0], equations[1]);
            if (solution) {
                const [x, y] = solution;
                g.append("circle")
                    .attr("class", "linear-system")
                    .attr("cx", x * scale)
                    .attr("cy", -y * scale)
                    .attr("r", 4)
                    .attr("fill", "green");
                
                g.append("text")
                    .attr("class", "linear-system")
                    .attr("x", x * scale + 5)
                    .attr("y", -y * scale - 5)
                    .text(`(${x.toFixed(2)}, ${y.toFixed(2)})`)
                    .style("font-size", "12px");
            }
        }
    }
    
    // 求解2x2线性方程组
    function solveSystem(eq1, eq2) {
        const [a1, b1, c1] = eq1;
        const [a2, b2, c2] = eq2;
        
        const det = a1*b2 - a2*b1;
        if (Math.abs(det) < 1e-10) return null;  // 无解或无穷多解
        
        const x = (c1*b2 - c2*b1) / det;
        const y = (a1*c2 - a2*c1) / det;
        
        return [x, y];
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "linear-system-controls");
    
    // 方程输入
    controls.append("div")
        .html(`
            <div class="equation-input">
                <label>方程 1: ax + by = c</label><br>
                <input type="number" id="a1" value="1" step="0.1" style="width:60px">x +
                <input type="number" id="b1" value="1" step="0.1" style="width:60px">y =
                <input type="number" id="c1" value="2" step="0.1" style="width:60px">
            </div>
            <div class="equation-input">
                <label>方程 2: ax + by = c</label><br>
                <input type="number" id="a2" value="1" step="0.1" style="width:60px">x +
                <input type="number" id="b2" value="-1" step="0.1" style="width:60px">y =
                <input type="number" id="c2" value="0" step="0.1" style="width:60px">
            </div>
        `);
    
    // 更新函数
    function updateSystem() {
        const equations = [
            [parseFloat(d3.select("#a1").property("value")),
             parseFloat(d3.select("#b1").property("value")),
             parseFloat(d3.select("#c1").property("value"))],
            [parseFloat(d3.select("#a2").property("value")),
             parseFloat(d3.select("#b2").property("value")),
             parseFloat(d3.select("#c2").property("value"))]
        ];
        
        drawLinearSystem(equations);
    }
    
    // 添加事件监听器
    ["a1", "b1", "c1", "a2", "b2", "c2"].forEach(id => {
        d3.select("#" + id).on("input", updateSystem);
    });
    
    // 初始化
    updateSystem();
}

// 高斯消元法可视化
function createGaussianEliminationViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制消元过程
    function drawEliminationStep(matrix, step) {
        // 清除旧的绘制
        g.selectAll(".gaussian").remove();
        
        // 绘制矩阵
        const cellWidth = 40;
        const cellHeight = 30;
        const startX = -150;
        const startY = 100;
        
        // 绘制矩阵边框
        g.append("rect")
            .attr("class", "gaussian")
            .attr("x", startX)
            .attr("y", -startY)
            .attr("width", cellWidth * (matrix[0].length))
            .attr("height", cellHeight * matrix.length)
            .attr("fill", "none")
            .attr("stroke", "#999");
        
        // 绘制矩阵元素
        matrix.forEach((row, i) => {
            row.forEach((val, j) => {
                g.append("text")
                    .attr("class", "gaussian")
                    .attr("x", startX + j*cellWidth + cellWidth/2)
                    .attr("y", -startY + i*cellHeight + cellHeight/2)
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .text(val.toFixed(2))
                    .style("font-size", "12px")
                    .style("fill", step && step.pivot[0] === i && step.pivot[1] === j ? "red" : "black");
            });
        });
        
        // 如果有消元步骤，显示操作说明
        if (step) {
            g.append("text")
                .attr("class", "gaussian")
                .attr("x", startX)
                .attr("y", -startY - 20)
                .text(step.description)
                .style("font-size", "14px");
        }
    }
    
    // 高斯消元法
    function gaussianElimination(matrix) {
        const m = matrix.length;
        const n = matrix[0].length;
        const steps = [];
        
        // 深拷贝矩阵
        const A = matrix.map(row => [...row]);
        
        // 前向消元
        for (let i = 0; i < Math.min(m, n-1); i++) {
            // 找主元
            let pivot = i;
            for (let j = i + 1; j < m; j++) {
                if (Math.abs(A[j][i]) > Math.abs(A[pivot][i])) {
                    pivot = j;
                }
            }
            
            // 交换行
            if (pivot !== i) {
                [A[i], A[pivot]] = [A[pivot], A[i]];
                steps.push({
                    matrix: A.map(row => [...row]),
                    pivot: [i, i],
                    description: `交换第${i+1}行和第${pivot+1}行`
                });
            }
            
            // 消元
            for (let j = i + 1; j < m; j++) {
                const factor = A[j][i] / A[i][i];
                for (let k = i; k < n; k++) {
                    A[j][k] -= factor * A[i][k];
                }
                steps.push({
                    matrix: A.map(row => [...row]),
                    pivot: [i, i],
                    description: `用第${i+1}行消去第${j+1}行`
                });
            }
        }
        
        return steps;
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "gaussian-controls");
    
    // 矩阵输入
    controls.append("div")
        .html(`
            <div class="matrix-input">
                <label>增广矩阵:</label><br>
                <input type="number" id="m11" value="1" step="0.1" style="width:60px">
                <input type="number" id="m12" value="1" step="0.1" style="width:60px">
                <input type="number" id="m13" value="2" step="0.1" style="width:60px"><br>
                <input type="number" id="m21" value="1" step="0.1" style="width:60px">
                <input type="number" id="m22" value="-1" step="0.1" style="width:60px">
                <input type="number" id="m23" value="0" step="0.1" style="width:60px">
            </div>
            <div class="step-controls">
                <button id="prev-step">上一步</button>
                <button id="next-step">下一步</button>
                <span id="step-info"></span>
            </div>
        `);
    
    let currentStep = 0;
    let eliminationSteps = [];
    
    // 更新函数
    function updateElimination() {
        const matrix = [
            [parseFloat(d3.select("#m11").property("value")),
             parseFloat(d3.select("#m12").property("value")),
             parseFloat(d3.select("#m13").property("value"))],
            [parseFloat(d3.select("#m21").property("value")),
             parseFloat(d3.select("#m22").property("value")),
             parseFloat(d3.select("#m23").property("value"))]
        ];
        
        eliminationSteps = gaussianElimination(matrix);
        currentStep = 0;
        
        drawEliminationStep(matrix);
        updateStepInfo();
    }
    
    function updateStepInfo() {
        d3.select("#step-info").text(
            `步骤 ${currentStep + 1} / ${eliminationSteps.length + 1}`
        );
    }
    
    // 添加事件监听器
    ["m11", "m12", "m13", "m21", "m22", "m23"].forEach(id => {
        d3.select("#" + id).on("input", updateElimination);
    });
    
    d3.select("#prev-step").on("click", () => {
        if (currentStep > 0) {
            currentStep--;
            if (currentStep === 0) {
                const matrix = [
                    [parseFloat(d3.select("#m11").property("value")),
                     parseFloat(d3.select("#m12").property("value")),
                     parseFloat(d3.select("#m13").property("value"))],
                    [parseFloat(d3.select("#m21").property("value")),
                     parseFloat(d3.select("#m22").property("value")),
                     parseFloat(d3.select("#m23").property("value"))]
                ];
                drawEliminationStep(matrix);
            } else {
                drawEliminationStep(eliminationSteps[currentStep-1].matrix,
                                  eliminationSteps[currentStep-1]);
            }
            updateStepInfo();
        }
    });
    
    d3.select("#next-step").on("click", () => {
        if (currentStep < eliminationSteps.length) {
            drawEliminationStep(eliminationSteps[currentStep].matrix,
                              eliminationSteps[currentStep]);
            currentStep++;
            updateStepInfo();
        }
    });
    
    // 初始化
    updateElimination();
}

// 向量空间运算可视化
function createVectorSpaceOperationsViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制向量运算
    function drawVectorOperation(v1, v2, operation) {
        // 清除旧的绘制
        g.selectAll(".vector-op").remove();
        
        // 绘制第一个向量
        drawVector(g, {x: 0, y: 0}, 
            {x: v1.x * scale, y: -v1.y * scale}, 
            "blue", "v₁").attr("class", "vector-op");
        
        // 绘制第二个向量
        drawVector(g, {x: 0, y: 0}, 
            {x: v2.x * scale, y: -v2.y * scale}, 
            "red", "v₂").attr("class", "vector-op");
        
        // 计算结果向量
        let result;
        switch(operation) {
            case 'add':
                result = {x: v1.x + v2.x, y: v1.y + v2.y};
                // 绘制平行四边形
                g.append("path")
                    .attr("class", "vector-op")
                    .attr("d", `M 0 0 
                              L ${v1.x * scale} ${-v1.y * scale} 
                              L ${(v1.x + v2.x) * scale} ${-(v1.y + v2.y) * scale} 
                              L ${v2.x * scale} ${-v2.y * scale} Z`)
                    .attr("fill", "none")
                    .attr("stroke", "#999")
                    .attr("stroke-dasharray", "5,5");
                break;
            case 'subtract':
                result = {x: v1.x - v2.x, y: v1.y - v2.y};
                // 绘制v2的反向向量
                drawVector(g, {x: v1.x * scale, y: -v1.y * scale},
                    {x: result.x * scale, y: -result.y * scale},
                    "#999", "-v₂").attr("class", "vector-op");
                break;
            case 'scale':
                const scalar = parseFloat(d3.select("#scalar").property("value"));
                result = {x: v1.x * scalar, y: v1.y * scalar};
                break;
        }
        
        // 绘制结果向量
        drawVector(g, {x: 0, y: 0}, 
            {x: result.x * scale, y: -result.y * scale}, 
            "green", "result").attr("class", "vector-op");
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "vector-space-controls");
    
    // 向量输入
    controls.append("div")
        .html(`
            <div class="vector-input">
                <label>向量 1:</label><br>
                <input type="number" id="v1x" value="1" step="0.1" style="width:60px">
                <input type="number" id="v1y" value="0" step="0.1" style="width:60px">
            </div>
            <div class="vector-input">
                <label>向量 2:</label><br>
                <input type="number" id="v2x" value="0" step="0.1" style="width:60px">
                <input type="number" id="v2y" value="1" step="0.1" style="width:60px">
            </div>
            <div class="operation-input">
                <label>运算:</label>
                <select id="operation">
                    <option value="add">加法</option>
                    <option value="subtract">减法</option>
                    <option value="scale">标量乘法</option>
                </select>
                <input type="number" id="scalar" value="2" step="0.1" style="width:60px">
            </div>
        `);
    
    // 更新函数
    function updateOperation() {
        const v1 = {
            x: parseFloat(d3.select("#v1x").property("value")),
            y: parseFloat(d3.select("#v1y").property("value"))
        };
        const v2 = {
            x: parseFloat(d3.select("#v2x").property("value")),
            y: parseFloat(d3.select("#v2y").property("value"))
        };
        const operation = d3.select("#operation").property("value");
        
        drawVectorOperation(v1, v2, operation);
        
        // 显示/隐藏标量输入
        d3.select("#scalar").style("display", 
            operation === "scale" ? "inline" : "none");
    }
    
    // 添加事件监听器
    ["v1x", "v1y", "v2x", "v2y", "operation", "scalar"].forEach(id => {
        d3.select("#" + id).on("input", updateOperation);
    });
    
    // 初始化
    updateOperation();
}

// 子空间可视化
function createSubspaceViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制子空间
    function drawSubspace(vectors) {
        // 清除旧的绘制
        g.selectAll(".subspace").remove();
        
        // 绘制基向量
        vectors.forEach((v, i) => {
            drawVector(g, {x: 0, y: 0}, 
                {x: v.x * scale, y: -v.y * scale}, 
                ["blue", "red"][i], `v${i+1}`).attr("class", "subspace");
        });
        
        // 根据维数绘制子空间
        if (vectors.length === 1) {
            // 一维子空间：直线
            const v = vectors[0];
            const t = 5;  // 延伸倍数
            g.append("line")
                .attr("class", "subspace")
                .attr("x1", -v.x * scale * t)
                .attr("y1", v.y * scale * t)
                .attr("x2", v.x * scale * t)
                .attr("y2", -v.y * scale * t)
                .attr("stroke", "#999")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");
        } else if (vectors.length === 2) {
            // 二维子空间：平面
            const t = 5;  // 延伸倍数
            const points = [];
            for (let i = -t; i <= t; i++) {
                for (let j = -t; j <= t; j++) {
                    const x = vectors[0].x * i + vectors[1].x * j;
                    const y = vectors[0].y * i + vectors[1].y * j;
                    points.push([x * scale, -y * scale]);
                }
            }
            
            // 使用d3的hull生成凸包
            const hull = d3.polygonHull(points);
            if (hull) {
                g.append("path")
                    .attr("class", "subspace")
                    .attr("d", `M ${hull.join("L")} Z`)
                    .attr("fill", "#999")
                    .attr("fill-opacity", 0.1)
                    .attr("stroke", "#999")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "5,5");
            }
        }
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "subspace-controls");
    
    // 向量输入
    controls.append("div")
        .html(`
            <div class="vector-input">
                <label>基向量 1:</label><br>
                <input type="number" id="b1x" value="1" step="0.1" style="width:60px">
                <input type="number" id="b1y" value="0" step="0.1" style="width:60px">
            </div>
            <div class="vector-input">
                <label>基向量 2:</label><br>
                <input type="number" id="b2x" value="0" step="0.1" style="width:60px">
                <input type="number" id="b2y" value="1" step="0.1" style="width:60px">
            </div>
            <div class="dimension-select">
                <label>维数:</label>
                <select id="dimension">
                    <option value="1">1维</option>
                    <option value="2">2维</option>
                </select>
            </div>
        `);
    
    // 更新函数
    function updateSubspace() {
        const v1 = {
            x: parseFloat(d3.select("#b1x").property("value")),
            y: parseFloat(d3.select("#b1y").property("value"))
        };
        const v2 = {
            x: parseFloat(d3.select("#b2x").property("value")),
            y: parseFloat(d3.select("#b2y").property("value"))
        };
        const dim = parseInt(d3.select("#dimension").property("value"));
        
        drawSubspace(dim === 1 ? [v1] : [v1, v2]);
    }
    
    // 添加事件监听器
    ["b1x", "b1y", "b2x", "b2y", "dimension"].forEach(id => {
        d3.select("#" + id).on("input", updateSubspace);
    });
    
    // 初始化
    updateSubspace();
}

// 内积空间可视化
function createInnerProductViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制向量和内积
    function drawInnerProduct(v1, v2) {
        // 清除旧的绘制
        g.selectAll(".inner-product").remove();
        
        // 绘制向量
        drawVector(g, {x: 0, y: 0}, 
            {x: v1.x * scale, y: -v1.y * scale}, 
            "blue", "v₁").attr("class", "inner-product");
        
        drawVector(g, {x: 0, y: 0}, 
            {x: v2.x * scale, y: -v2.y * scale}, 
            "red", "v₂").attr("class", "inner-product");
        
        // 计算内积
        const dot = v1.x * v2.x + v1.y * v2.y;
        
        // 计算投影
        const v2_norm_squared = v2.x * v2.x + v2.y * v2.y;
        const proj_scale = dot / v2_norm_squared;
        const proj = {
            x: v2.x * proj_scale,
            y: v2.y * proj_scale
        };
        
        // 绘制投影
        drawVector(g, {x: 0, y: 0}, 
            {x: proj.x * scale, y: -proj.y * scale}, 
            "green", "proj").attr("class", "inner-product");
        
        // 绘制投影线
        g.append("line")
            .attr("class", "inner-product")
            .attr("x1", v1.x * scale)
            .attr("y1", -v1.y * scale)
            .attr("x2", proj.x * scale)
            .attr("y2", -proj.y * scale)
            .attr("stroke", "#999")
            .attr("stroke-dasharray", "5,5");
        
        // 添加角度标记
        const angle = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
        const r = 30;
        const arcPath = d3.arc()({
            innerRadius: r,
            outerRadius: r,
            startAngle: Math.atan2(-v1.y, v1.x),
            endAngle: Math.atan2(-v2.y, v2.x)
        });
        
        g.append("path")
            .attr("class", "inner-product")
            .attr("d", arcPath)
            .attr("fill", "none")
            .attr("stroke", "#999");
        
        // 添加信息标签
        g.append("text")
            .attr("class", "inner-product")
            .attr("x", -150)
            .attr("y", -150)
            .text(`内积: ${dot.toFixed(2)}`)
            .style("font-size", "14px");
        
        g.append("text")
            .attr("class", "inner-product")
            .attr("x", -150)
            .attr("y", -130)
            .text(`角度: ${(angle * 180 / Math.PI).toFixed(2)}°`)
            .style("font-size", "14px");
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "inner-product-controls");
    
    // 向量输入
    controls.append("div")
        .html(`
            <div class="vector-input">
                <label>向量 1:</label><br>
                <input type="number" id="ip1x" value="1" step="0.1" style="width:60px">
                <input type="number" id="ip1y" value="0" step="0.1" style="width:60px">
            </div>
            <div class="vector-input">
                <label>向量 2:</label><br>
                <input type="number" id="ip2x" value="0" step="0.1" style="width:60px">
                <input type="number" id="ip2y" value="1" step="0.1" style="width:60px">
            </div>
        `);
    
    // 更新函数
    function updateInnerProduct() {
        const v1 = {
            x: parseFloat(d3.select("#ip1x").property("value")),
            y: parseFloat(d3.select("#ip1y").property("value"))
        };
        const v2 = {
            x: parseFloat(d3.select("#ip2x").property("value")),
            y: parseFloat(d3.select("#ip2y").property("value"))
        };
        
        drawInnerProduct(v1, v2);
    }
    
    // 添加事件监听器
    ["ip1x", "ip1y", "ip2x", "ip2y"].forEach(id => {
        d3.select("#" + id).on("input", updateInnerProduct);
    });
    
    // 初始化
    updateInnerProduct();
}

// 正交性可视化
function createOrthogonalityViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制正交向量组
    function drawOrthogonalVectors(vectors) {
        // 清除旧的绘制
        g.selectAll(".orthogonal").remove();
        
        // 绘制向量
        vectors.forEach((v, i) => {
            drawVector(g, {x: 0, y: 0}, 
                {x: v.x * scale, y: -v.y * scale}, 
                ["blue", "red", "green"][i], 
                `v${i+1}`).attr("class", "orthogonal");
        });
        
        // 计算内积矩阵
        const n = vectors.length;
        const dots = Array(n).fill().map(() => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) {
                const dot = vectors[i].x * vectors[j].x + 
                           vectors[i].y * vectors[j].y;
                dots[i][j] = dots[j][i] = dot;
            }
        }
        
        // 添加内积信息
        g.append("text")
            .attr("class", "orthogonal")
            .attr("x", -150)
            .attr("y", -150)
            .text("内积矩阵:")
            .style("font-size", "14px");
        
        dots.forEach((row, i) => {
            g.append("text")
                .attr("class", "orthogonal")
                .attr("x", -150)
                .attr("y", -130 + i*20)
                .text(`[${row.map(x => x.toFixed(2)).join(", ")}]`)
                .style("font-size", "12px");
        });
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "orthogonality-controls");
    
    // 向量输入
    controls.append("div")
        .html(`
            <div class="vector-input">
                <label>向量 1:</label><br>
                <input type="number" id="o1x" value="1" step="0.1" style="width:60px">
                <input type="number" id="o1y" value="0" step="0.1" style="width:60px">
            </div>
            <div class="vector-input">
                <label>向量 2:</label><br>
                <input type="number" id="o2x" value="0" step="0.1" style="width:60px">
                <input type="number" id="o2y" value="1" step="0.1" style="width:60px">
            </div>
            <div class="vector-input">
                <label>向量 3:</label><br>
                <input type="number" id="o3x" value="1" step="0.1" style="width:60px">
                <input type="number" id="o3y" value="1" step="0.1" style="width:60px">
            </div>
        `);
    
    // 更新函数
    function updateOrthogonality() {
        const vectors = [
            {
                x: parseFloat(d3.select("#o1x").property("value")),
                y: parseFloat(d3.select("#o1y").property("value"))
            },
            {
                x: parseFloat(d3.select("#o2x").property("value")),
                y: parseFloat(d3.select("#o2y").property("value"))
            },
            {
                x: parseFloat(d3.select("#o3x").property("value")),
                y: parseFloat(d3.select("#o3y").property("value"))
            }
        ];
        
        drawOrthogonalVectors(vectors);
    }
    
    // 添加事件监听器
    ["o1x", "o1y", "o2x", "o2y", "o3x", "o3y"].forEach(id => {
        d3.select("#" + id).on("input", updateOrthogonality);
    });
    
    // 初始化
    updateOrthogonality();
}

// 线性变换可视化
function createLinearTransformViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制网格和变换后的网格
    function drawGrid(matrix, color = "#999", opacity = 0.2) {
        const gridSize = 10;
        const step = 1;
        
        // 绘制网格线
        for (let i = -gridSize; i <= gridSize; i += step) {
            // 垂直线
            const v1 = transformPoint([i, -gridSize], matrix);
            const v2 = transformPoint([i, gridSize], matrix);
            g.append("line")
                .attr("class", "grid-line")
                .attr("x1", v1[0] * scale)
                .attr("y1", -v1[1] * scale)
                .attr("x2", v2[0] * scale)
                .attr("y2", -v2[1] * scale)
                .attr("stroke", color)
                .attr("stroke-width", 1)
                .attr("opacity", opacity);
            
            // 水平线
            const h1 = transformPoint([-gridSize, i], matrix);
            const h2 = transformPoint([gridSize, i], matrix);
            g.append("line")
                .attr("class", "grid-line")
                .attr("x1", h1[0] * scale)
                .attr("y1", -h1[1] * scale)
                .attr("x2", h2[0] * scale)
                .attr("y2", -h2[1] * scale)
                .attr("stroke", color)
                .attr("stroke-width", 1)
                .attr("opacity", opacity);
        }
    }
    
    // 变换点
    function transformPoint(point, matrix) {
        return [
            matrix[0][0] * point[0] + matrix[0][1] * point[1],
            matrix[1][0] * point[0] + matrix[1][1] * point[1]
        ];
    }
    
    // 绘制基向量
    function drawBasisVectors(matrix) {
        // 绘制原始基向量
        drawVector(g, {x: 0, y: 0}, {x: scale, y: 0}, "blue", "e₁");
        drawVector(g, {x: 0, y: 0}, {x: 0, y: scale}, "red", "e₂");
        
        // 绘制变换后的基向量
        const v1 = transformPoint([1, 0], matrix);
        const v2 = transformPoint([0, 1], matrix);
        
        drawVector(g, {x: 0, y: 0}, 
            {x: v1[0] * scale, y: -v1[1] * scale}, 
            "blue", "T(e₁)");
        drawVector(g, {x: 0, y: 0}, 
            {x: v2[0] * scale, y: -v2[1] * scale}, 
            "red", "T(e₂)");
    }
    
    // 绘制变换
    function drawTransformation(matrix) {
        // 清除旧的绘制
        g.selectAll(".grid-line").remove();
        g.selectAll(".vector").remove();
        
        // 绘制原始网格
        drawGrid([[1, 0], [0, 1]], "#999", 0.1);
        
        // 绘制变换后的网格
        drawGrid(matrix, "#666", 0.2);
        
        // 绘制基向量
        drawBasisVectors(matrix);
        
        // 添加变换矩阵信息
        g.append("text")
            .attr("x", -150)
            .attr("y", -150)
            .text(`变换矩阵:`)
            .style("font-size", "14px");
        
        g.append("text")
            .attr("x", -150)
            .attr("y", -130)
            .text(`[${matrix[0][0].toFixed(2)}, ${matrix[0][1].toFixed(2)}]`)
            .style("font-size", "12px");
        
        g.append("text")
            .attr("x", -150)
            .attr("y", -110)
            .text(`[${matrix[1][0].toFixed(2)}, ${matrix[1][1].toFixed(2)}]`)
            .style("font-size", "12px");
        
        // 计算行列式
        const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        g.append("text")
            .attr("x", -150)
            .attr("y", -80)
            .text(`行列式: ${det.toFixed(2)}`)
            .style("font-size", "14px");
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "transformation-controls");
    
    // 矩阵输入
    controls.append("div")
        .html(`
            <div class="matrix-input">
                <label>变换矩阵:</label><br>
                <input type="number" id="m11" value="1" step="0.1" style="width:60px">
                <input type="number" id="m12" value="0" step="0.1" style="width:60px"><br>
                <input type="number" id="m21" value="0" step="0.1" style="width:60px">
                <input type="number" id="m22" value="1" step="0.1" style="width:60px">
            </div>
        `);
    
    // 预设变换
    controls.append("div")
        .html(`
            <div class="preset-transforms">
                <label>预设变换:</label><br>
                <select id="preset-transform">
                    <option value="identity">恒等变换</option>
                    <option value="rotation">旋转 (90°)</option>
                    <option value="scale">缩放 (2x)</option>
                    <option value="shear">切变</option>
                    <option value="reflection">反射 (x轴)</option>
                    <option value="projection">投影 (x轴)</option>
                </select>
            </div>
        `);
    
    // 更新函数
    function updateTransformation() {
        const matrix = [
            [parseFloat(d3.select("#m11").property("value")),
             parseFloat(d3.select("#m12").property("value"))],
            [parseFloat(d3.select("#m21").property("value")),
             parseFloat(d3.select("#m22").property("value"))]
        ];
        
        drawTransformation(matrix);
    }
    
    // 预设变换处理
    function handlePresetTransform() {
        const preset = d3.select("#preset-transform").property("value");
        let matrix;
        
        switch (preset) {
            case "identity":
                matrix = [[1, 0], [0, 1]];
                break;
            case "rotation":
                matrix = [[0, -1], [1, 0]];
                break;
            case "scale":
                matrix = [[2, 0], [0, 2]];
                break;
            case "shear":
                matrix = [[1, 1], [0, 1]];
                break;
            case "reflection":
                matrix = [[1, 0], [0, -1]];
                break;
            case "projection":
                matrix = [[1, 0], [0, 0]];
                break;
            default:
                matrix = [[1, 0], [0, 1]];
        }
        
        // 更新输入框
        d3.select("#m11").property("value", matrix[0][0]);
        d3.select("#m12").property("value", matrix[0][1]);
        d3.select("#m21").property("value", matrix[1][0]);
        d3.select("#m22").property("value", matrix[1][1]);
        
        // 更新可视化
        drawTransformation(matrix);
    }
    
    // 添加事件监听器
    ["m11", "m12", "m21", "m22"].forEach(id => {
        d3.select("#" + id).on("input", updateTransformation);
    });
    
    d3.select("#preset-transform").on("change", handlePresetTransform);
    
    // 初始化
    updateTransformation();
}

// 特征值和特征向量可视化
function createEigenViz(container) {
    const g = createVectorVisualization(container);
    const scale = 40;
    
    // 绘制矩阵变换和特征向量
    function drawEigenVectors(matrix, eigenvals, eigenvecs) {
        // 清除旧的绘制
        g.selectAll(".eigen").remove();
        
        // 绘制网格
        drawGrid(g);
        
        // 绘制变换后的网格
        drawTransformedGrid(g, matrix);
        
        // 绘制特征向量及其变换
        eigenvecs.forEach((v, i) => {
            const eigenval = eigenvals[i];
            const transformed = [
                matrix[0][0]*v[0] + matrix[0][1]*v[1],
                matrix[1][0]*v[0] + matrix[1][1]*v[1]
            ];
            
            // 原始特征向量
            drawVector(g, {x: 0, y: 0}, 
                {x: v[0] * scale, y: -v[1] * scale}, 
                "blue", `v${i+1}`).attr("class", "eigen");
            
            // 变换后的特征向量
            drawVector(g, {x: 0, y: 0}, 
                {x: transformed[0] * scale, y: -transformed[1] * scale}, 
                "red", `λ${i+1}v${i+1}`).attr("class", "eigen");
            
            // 添加特征值标签
            g.append("text")
                .attr("class", "eigen")
                .attr("x", v[0] * scale + 10)
                .attr("y", -v[1] * scale + 10)
                .text(`λ${i+1} = ${eigenval.toFixed(2)}`)
                .style("font-size", "12px");
        });
    }
    
    // 计算2x2矩阵的特征值和特征向量
    function computeEigen(matrix) {
        // 计算特征多项式系数
        const a = 1;
        const b = -(matrix[0][0] + matrix[1][1]);
        const c = matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
        
        // 求解特征值
        const discriminant = Math.sqrt(b*b - 4*a*c);
        const eigenvals = [
            (-b + discriminant)/(2*a),
            (-b - discriminant)/(2*a)
        ];
        
        // 求解特征向量
        const eigenvecs = eigenvals.map(lambda => {
            const temp = matrix[0][1] !== 0 ? 
                [matrix[0][1], lambda - matrix[0][0]] :
                [lambda - matrix[1][1], matrix[1][0]];
            const norm = Math.sqrt(temp[0]*temp[0] + temp[1]*temp[1]);
            return [temp[0]/norm, temp[1]/norm];
        });
        
        return {eigenvals, eigenvecs};
    }
    
    // 添加控制面板
    const controls = d3.select(container)
        .append("div")
        .attr("class", "eigen-controls");
    
    // 矩阵输入
    controls.append("div")
        .html(`
            <div class="matrix-input">
                <label>变换矩阵:</label><br>
                <input type="number" id="m11" value="2" step="0.1" style="width:60px">
                <input type="number" id="m12" value="1" step="0.1" style="width:60px"><br>
                <input type="number" id="m21" value="1" step="0.1" style="width:60px">
                <input type="number" id="m22" value="2" step="0.1" style="width:60px">
            </div>
        `);
    
    // 更新函数
    function updateEigenVectors() {
        const matrix = [
            [parseFloat(d3.select("#m11").property("value")), 
             parseFloat(d3.select("#m12").property("value"))],
            [parseFloat(d3.select("#m21").property("value")), 
             parseFloat(d3.select("#m22").property("value"))]
        ];
        
        const {eigenvals, eigenvecs} = computeEigen(matrix);
        drawEigenVectors(matrix, eigenvals, eigenvecs);
    }
    
    // 添加事件监听器
    ["m11", "m12", "m21", "m22"].forEach(id => {
        d3.select("#" + id).on("input", updateEigenVectors);
    });
    
    // 初始化
    updateEigenVectors();
}

// 导出函数
window.LinearAlgebraViz = {
    createVectorVisualization,
    createVectorAddition,
    createLinearCombination,
    createVectorRotation,
    createMatrixTransformation,
    createEigenDemo,
    createVectorSpaceViz,
    createSubspaceViz,
    createOrthogonalityViz,
    createGramSchmidtViz,
    createEigenViz,
    createEigenDecompViz,
    createSVDViz,
    createSVDApplicationViz,
    createLinearSystemViz,
    createGaussianEliminationViz,
    createVectorSpaceOperationsViz,
    createSubspaceViz,
    createInnerProductViz,
    createOrthogonalityViz,
    createLinearTransformViz,
    createEigenViz
};

// 辅助函数：计算叉积
function cross(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}
