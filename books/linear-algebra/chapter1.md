---
layout: book-chapter
title: 向量和线性组合
description: 理解向量的基本概念，掌握向量运算和线性组合的本质
chapter_number: 1
---

# 向量和线性组合

## 1.1 向量的直观理解

向量是线性代数的基本概念。从几何角度看，向量可以表示为空间中的一个带方向的箭头。

<div class="visualization-container">
    <div class="visualization-title">二维向量的几何表示</div>
    <div id="vector-visualization"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // 创建一个简单的向量可视化
    const svg = d3.select('#vector-visualization')
        .append('svg')
        .attr('width', 400)
        .attr('height', 400);
    
    // 添加坐标轴
    const g = svg.append('g')
        .attr('transform', 'translate(200, 200)');
    
    // X轴
    g.append('line')
        .attr('x1', -180)
        .attr('y1', 0)
        .attr('x2', 180)
        .attr('y2', 0)
        .attr('stroke', 'black');
    
    // Y轴
    g.append('line')
        .attr('x1', 0)
        .attr('y1', -180)
        .attr('x2', 0)
        .attr('y2', 180)
        .attr('stroke', 'black');
    
    // 绘制向量
    const vector = g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 100)
        .attr('y2', -50)
        .attr('stroke', 'red')
        .attr('marker-end', 'url(#arrow)');
    
    // 添加箭头标记
    svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'red');
});
</script>

### 1.1.1 向量的表示

向量可以用多种方式表示：

1. **几何表示**：箭头的长度和方向
2. **代数表示**：有序数对 $(x, y)$ 或有序数组 $(x_1, x_2, ..., x_n)$
3. **列向量表示**：
   
   $\vec{v} = \begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix}$

### 1.1.2 向量的性质

1. **方向性**：向量有明确的方向
2. **大小**：向量的长度或模
3. **可平移性**：起点的位置不影响向量

## 1.2 向量运算

### 1.2.1 向量加法

向量加法可以通过平行四边形法则或三角形法则进行：

$\vec{a} + \vec{b} = \vec{c}$

<div class="visualization-container">
    <div class="visualization-title">向量加法的几何解释</div>
    <div id="vector-addition"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // 向量加法可视化
    const svg = d3.select('#vector-addition')
        .append('svg')
        .attr('width', 400)
        .attr('height', 400);
    
    const g = svg.append('g')
        .attr('transform', 'translate(100, 300)');
    
    // 绘制第一个向量
    g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 100)
        .attr('y2', -50)
        .attr('stroke', 'blue')
        .attr('marker-end', 'url(#arrow-blue)');
    
    // 绘制第二个向量
    g.append('line')
        .attr('x1', 100)
        .attr('y1', -50)
        .attr('x2', 150)
        .attr('y2', -150)
        .attr('stroke', 'green')
        .attr('marker-end', 'url(#arrow-green)');
    
    // 绘制和向量
    g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 150)
        .attr('y2', -150)
        .attr('stroke', 'red')
        .attr('stroke-dasharray', '5,5')
        .attr('marker-end', 'url(#arrow-red)');
});
</script>

### 1.2.2 标量乘法

标量乘法改变向量的长度和（可能的）方向：

$c\vec{v} = \begin{pmatrix} cx_1 \\ cx_2 \\ \vdots \\ cx_n \end{pmatrix}$

性质：
1. $c(d\vec{v}) = (cd)\vec{v}$
2. $(c + d)\vec{v} = c\vec{v} + d\vec{v}$
3. $c(\vec{v} + \vec{w}) = c\vec{v} + c\vec{w}$

## 1.3 线性组合

### 1.3.1 定义

给定向量 $\vec{v}_1, \vec{v}_2, ..., \vec{v}_k$ 和标量 $c_1, c_2, ..., c_k$，它们的线性组合是：

$c_1\vec{v}_1 + c_2\vec{v}_2 + ... + c_k\vec{v}_k$

<div class="visualization-container">
    <div class="visualization-title">线性组合的动态演示</div>
    <div id="linear-combination"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // 线性组合的动态可视化
    const svg = d3.select('#linear-combination')
        .append('svg')
        .attr('width', 400)
        .attr('height', 400);
    
    const g = svg.append('g')
        .attr('transform', 'translate(200, 200)');
    
    // 基向量
    const v1 = {x: 100, y: 0};
    const v2 = {x: 0, y: -100};
    
    // 绘制基向量
    g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', v1.x)
        .attr('y2', v1.y)
        .attr('stroke', 'blue')
        .attr('marker-end', 'url(#arrow-blue)');
    
    g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', v2.x)
        .attr('y2', v2.y)
        .attr('stroke', 'green')
        .attr('marker-end', 'url(#arrow-green)');
    
    // 添加滑块控制系数
    // 这部分将在后续的交互式功能中实现
});
</script>

### 1.3.2 几何意义

线性组合的几何意义：
1. 二维空间中两个不共线向量的线性组合可以覆盖整个平面
2. 三维空间中三个不共面向量的线性组合可以覆盖整个空间

### 1.3.3 线性相关性

向量组 $\{\vec{v}_1, \vec{v}_2, ..., \vec{v}_k\}$ 线性相关，当且仅当存在不全为零的标量 $c_1, c_2, ..., c_k$ 使得：

$c_1\vec{v}_1 + c_2\vec{v}_2 + ... + c_k\vec{v}_k = \vec{0}$

## 1.4 实践应用

### 1.4.1 计算机图形学中的应用

```python
import numpy as np

def rotate_vector(v, theta):
    """旋转二维向量
    
    Args:
        v: 二维向量 [x, y]
        theta: 旋转角度（弧度）
    
    Returns:
        旋转后的向量
    """
    rotation_matrix = np.array([
        [np.cos(theta), -np.sin(theta)],
        [np.sin(theta), np.cos(theta)]
    ])
    return np.dot(rotation_matrix, v)

# 示例
v = np.array([1, 0])
theta = np.pi / 4  # 45度
rotated_v = rotate_vector(v, theta)
print(f"原向量: {v}")
print(f"旋转后: {rotated_v}")
```

### 1.4.2 物理学中的应用

```python
def calculate_force_resultant(forces):
    """计算多个力的合力
    
    Args:
        forces: 力向量列表，每个力是 [Fx, Fy]
    
    Returns:
        合力向量
    """
    return np.sum(forces, axis=0)

# 示例
forces = [
    [3, 4],   # 第一个力
    [-1, 2],  # 第二个力
    [2, -3]   # 第三个力
]
resultant = calculate_force_resultant(forces)
magnitude = np.linalg.norm(resultant)
print(f"合力: {resultant}")
print(f"合力大小: {magnitude}")
```

## 练习

1. 计算向量 $\vec{a} = (2,3)$ 和 $\vec{b} = (-1,4)$ 的和。

2. 判断向量组 $\{(1,2,3), (2,4,6), (0,0,0)\}$ 是否线性相关。

3. 实现一个函数，计算两个向量的夹角。

4. 给定三个向量 $\vec{v}_1 = (1,0)$, $\vec{v}_2 = (0,1)$，求 $\vec{w} = (3,2)$ 关于这两个向量的线性组合系数。

## 深入思考

1. 为什么向量加法满足平行四边形法则？

2. 在什么情况下，$n$ 个 $n$ 维向量一定线性相关？

3. 线性组合在机器学习中有什么应用？

## 扩展阅读

1. [线性代数及其应用](https://book.douban.com/subject/1425950/)
2. [3Blue1Brown 线性代数系列](https://www.3blue1brown.com/topics/linear-algebra)
3. [MIT 线性代数公开课](https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/)

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/linear-algebra/introduction">← 上一章：导论</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter2">下一章：矩阵与线性变换 →</a>
    </div>
</div>
