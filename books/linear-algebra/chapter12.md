---
layout: book-chapter
title: 向量微积分
description: 探索向量微积分的基本概念和应用，包括向量场、梯度、散度、旋度和相关定理
chapter_number: 12
---

# 向量微积分

## 12.1 向量场

向量场是在空间中每一点都赋予一个向量的函数。

<div class="visualization-container">
    <div class="visualization-title">向量场可视化</div>
    <div id="vector-field"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createVectorFieldViz('#vector-field');
});
</script>

```python
import numpy as np
import matplotlib.pyplot as plt

def plot_vector_field(f, x_range=(-5, 5), y_range=(-5, 5), density=20):
    """绘制二维向量场
    
    Args:
        f: 向量场函数，接收(x, y)返回(dx, dy)
        x_range: x轴范围
        y_range: y轴范围
        density: 网格密度
    """
    x = np.linspace(x_range[0], x_range[1], density)
    y = np.linspace(y_range[0], y_range[1], density)
    X, Y = np.meshgrid(x, y)
    
    # 计算向量场
    U = np.zeros_like(X)
    V = np.zeros_like(Y)
    for i in range(density):
        for j in range(density):
            U[i,j], V[i,j] = f(X[i,j], Y[i,j])
    
    # 绘制
    plt.figure(figsize=(10, 10))
    plt.quiver(X, Y, U, V)
    plt.grid(True)
    plt.axis('equal')
    plt.show()

# 示例：旋转场
f = lambda x, y: (-y, x)
plot_vector_field(f)

# 示例：径向场
f = lambda x, y: (x, y)
plot_vector_field(f)

# 示例：鞍点场
f = lambda x, y: (x, -y)
plot_vector_field(f)
```

## 12.2 梯度

梯度是标量场的一阶导数，表示标量场在该点变化最快的方向。

```python
def gradient_field(f, x_range=(-5, 5), y_range=(-5, 5), density=20, h=1e-5):
    """计算并绘制梯度场
    
    Args:
        f: 标量场函数
        x_range, y_range: 坐标范围
        density: 网格密度
        h: 数值微分步长
    """
    import numpy as np
    
    x = np.linspace(x_range[0], x_range[1], density)
    y = np.linspace(y_range[0], y_range[1], density)
    X, Y = np.meshgrid(x, y)
    
    # 计算梯度
    grad_x = np.zeros_like(X)
    grad_y = np.zeros_like(Y)
    
    for i in range(density):
        for j in range(density):
            # 数值计算偏导数
            grad_x[i,j] = (f(X[i,j] + h, Y[i,j]) - f(X[i,j] - h, Y[i,j])) / (2*h)
            grad_y[i,j] = (f(X[i,j], Y[i,j] + h) - f(X[i,j], Y[i,j] - h)) / (2*h)
    
    # 绘制梯度场和等高线
    plt.figure(figsize=(12, 5))
    
    # 绘制等高线
    plt.subplot(121)
    plt.contour(X, Y, f(X, Y))
    plt.title('等高线')
    plt.grid(True)
    
    # 绘制梯度场
    plt.subplot(122)
    plt.quiver(X, Y, grad_x, grad_y)
    plt.title('梯度场')
    plt.grid(True)
    
    plt.show()

# 示例：二次函数
f = lambda x, y: x**2 + y**2
gradient_field(f)

# 示例：鞍点函数
f = lambda x, y: x**2 - y**2
gradient_field(f)
```

## 12.3 曲线积分

曲线积分是沿着曲线计算的积分。

<div class="visualization-container">
    <div class="visualization-title">曲线积分可视化</div>
    <div id="line-integral"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createLineIntegralViz('#line-integral');
});
</script>

```python
def line_integral(f, curve, t_range=(0, 2*np.pi), steps=1000):
    """计算向量场沿曲线的线积分
    
    Args:
        f: 向量场函数，接收(x, y)返回(dx, dy)
        curve: 参数曲线函数，接收t返回(x, y)
        t_range: 参数范围
        steps: 积分步数
    
    Returns:
        积分值
    """
    import numpy as np
    
    t = np.linspace(t_range[0], t_range[1], steps)
    dt = t[1] - t[0]
    
    integral = 0
    for i in range(steps-1):
        # 计算曲线上的点
        x, y = curve(t[i])
        # 计算向量场在该点的值
        fx, fy = f(x, y)
        # 计算曲线的切向量
        dx, dy = (np.array(curve(t[i+1])) - np.array(curve(t[i]))) / dt
        # 计算点积并累加
        integral += (fx*dx + fy*dy) * dt
    
    return integral

# 示例：计算旋转场沿单位圆的线积分
f = lambda x, y: (-y, x)  # 旋转场
curve = lambda t: (np.cos(t), np.sin(t))  # 单位圆

result = line_integral(f, curve)
print(f"线积分结果: {result}")  # 应该接近2π
```

## 12.4 散度

散度衡量向量场的"发散"程度。

<div class="visualization-container">
    <div class="visualization-title">散度可视化</div>
    <div id="divergence"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createDivergenceViz('#divergence');
});
</script>

```python
def divergence(f, x, y, h=1e-5):
    """计算向量场的散度
    
    Args:
        f: 向量场函数，接收(x, y)返回(dx, dy)
        x, y: 计算点的坐标
        h: 数值微分步长
    
    Returns:
        散度值
    """
    # 计算∂fx/∂x
    fx1, _ = f(x + h, y)
    fx2, _ = f(x - h, y)
    div_x = (fx1 - fx2) / (2*h)
    
    # 计算∂fy/∂y
    _, fy1 = f(x, y + h)
    _, fy2 = f(x, y - h)
    div_y = (fy1 - fy2) / (2*h)
    
    return div_x + div_y

def plot_divergence(f, x_range=(-5, 5), y_range=(-5, 5), density=20):
    """绘制散度场
    """
    x = np.linspace(x_range[0], x_range[1], density)
    y = np.linspace(y_range[0], y_range[1], density)
    X, Y = np.meshgrid(x, y)
    
    # 计算散度
    div = np.zeros_like(X)
    for i in range(density):
        for j in range(density):
            div[i,j] = divergence(f, X[i,j], Y[i,j])
    
    # 绘制
    plt.figure(figsize=(10, 10))
    plt.pcolormesh(X, Y, div, shading='auto')
    plt.colorbar(label='散度')
    
    # 叠加向量场
    U = np.zeros_like(X)
    V = np.zeros_like(Y)
    for i in range(density):
        for j in range(density):
            U[i,j], V[i,j] = f(X[i,j], Y[i,j])
    
    plt.quiver(X, Y, U, V, alpha=0.3)
    plt.title('散度场')
    plt.axis('equal')
    plt.show()

# 示例：源场
f = lambda x, y: (x, y)
plot_divergence(f)

# 示例：无散度场
f = lambda x, y: (-y, x)
plot_divergence(f)
```

## 12.5 旋度

旋度衡量向量场的"旋转"程度。

<div class="visualization-container">
    <div class="visualization-title">旋度可视化</div>
    <div id="curl"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createCurlViz('#curl');
});
</script>

```python
def curl(f, x, y, h=1e-5):
    """计算向量场的旋度（二维情况下是标量）
    
    Args:
        f: 向量场函数，接收(x, y)返回(dx, dy)
        x, y: 计算点的坐标
        h: 数值微分步长
    
    Returns:
        旋度值
    """
    # 计算∂fy/∂x
    _, fy1 = f(x + h, y)
    _, fy2 = f(x - h, y)
    dfy_dx = (fy1 - fy2) / (2*h)
    
    # 计算∂fx/∂y
    fx1, _ = f(x, y + h)
    fx2, _ = f(x, y - h)
    dfx_dy = (fx1 - fx2) / (2*h)
    
    return dfy_dx - dfx_dy

def plot_curl(f, x_range=(-5, 5), y_range=(-5, 5), density=20):
    """绘制旋度场
    """
    x = np.linspace(x_range[0], x_range[1], density)
    y = np.linspace(y_range[0], y_range[1], density)
    X, Y = np.meshgrid(x, y)
    
    # 计算旋度
    c = np.zeros_like(X)
    for i in range(density):
        for j in range(density):
            c[i,j] = curl(f, X[i,j], Y[i,j])
    
    # 绘制
    plt.figure(figsize=(10, 10))
    plt.pcolormesh(X, Y, c, shading='auto')
    plt.colorbar(label='旋度')
    
    # 叠加向量场
    U = np.zeros_like(X)
    V = np.zeros_like(Y)
    for i in range(density):
        for j in range(density):
            U[i,j], V[i,j] = f(X[i,j], Y[i,j])
    
    plt.quiver(X, Y, U, V, alpha=0.3)
    plt.title('旋度场')
    plt.axis('equal')
    plt.show()

# 示例：旋转场
f = lambda x, y: (-y, x)
plot_curl(f)

# 示例：无旋场
f = lambda x, y: (x, y)
plot_curl(f)
```

## 12.6 重要定理

### 12.6.1 格林定理

格林定理将曲线积分转化为二重积分：

$$\oint_C (P\,dx + Q\,dy) = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)\,dx\,dy$$

```python
def green_theorem_example():
    """格林定理示例
    """
    import numpy as np
    from scipy import integrate
    
    # 向量场
    P = lambda x, y: -y
    Q = lambda x, y: x
    
    # 区域：单位圆
    def boundary(t):
        return np.cos(t), np.sin(t)
    
    # 计算曲线积分
    def integrand(t):
        x, y = boundary(t)
        dx_dt = -np.sin(t)
        dy_dt = np.cos(t)
        return P(x, y)*dx_dt + Q(x, y)*dy_dt
    
    line_integral, _ = integrate.quad(integrand, 0, 2*np.pi)
    
    # 计算二重积分
    def curl_integrand(x, y):
        return (Q(x + 1e-10, y) - Q(x - 1e-10, y))/(2e-10) - \
               (P(x, y + 1e-10) - P(x, y - 1e-10))/(2e-10)
    
    def bounds_y(x):
        return -np.sqrt(1 - x**2), np.sqrt(1 - x**2)
    
    double_integral, _ = integrate.dblquad(curl_integrand, -1, 1,
                                         lambda x: -np.sqrt(1 - x**2),
                                         lambda x: np.sqrt(1 - x**2))
    
    print(f"曲线积分结果: {line_integral}")
    print(f"二重积分结果: {double_integral}")
    print(f"相对误差: {abs(line_integral - double_integral)/abs(line_integral)}")

# 运行示例
green_theorem_example()
```

### 12.6.2 斯托克斯定理

斯托克斯定理将曲面积分转化为曲线积分：

$$\oint_C \mathbf{F}\cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{F})\cdot \mathbf{n}\,dS$$

### 12.6.3 散度定理

散度定理将体积积分转化为曲面积分：

$$\iiint_V (\nabla \cdot \mathbf{F})\,dV = \oiint_S \mathbf{F}\cdot \mathbf{n}\,dS$$

## 练习

1. 证明：如果向量场 $\mathbf{F}$ 是保守场，则 $\nabla \times \mathbf{F} = \mathbf{0}$。

2. 计算以下向量场的散度和旋度：
   a) $\mathbf{F}(x,y) = (x^2, xy)$
   b) $\mathbf{F}(x,y) = (-y, x)$
   c) $\mathbf{F}(x,y) = (e^x\cos y, e^x\sin y)$

3. 使用格林定理计算 $\oint_C (x^2\,dx + xy\,dy)$，其中 $C$ 是单位圆。

4. 判断以下向量场是否是保守场：
   a) $\mathbf{F}(x,y) = (2x, 2y)$
   b) $\mathbf{F}(x,y) = (-y, x)$
   c) $\mathbf{F}(x,y) = (x^2-y^2, -2xy)$

## 深入思考

1. 为什么保守场的旋度为零？这与物理中的能量守恒有什么关系？

2. 散度定理和斯托克斯定理有什么共同点？它们在物理中有什么应用？

3. 如何判断一个向量场是保守场？这与路径无关性有什么关系？

## 扩展阅读

1. [Vector Calculus](https://www.math.ucla.edu/~tao/resource/general/131ah.1.03w/week1.pdf)
2. [Divergence and Curl](https://mathinsight.org/divergence_curl_introduction)
3. [Conservative Vector Fields](https://tutorial.math.lamar.edu/Classes/CalcIII/ConservativeVectorField.aspx)

<style>
.vector-field-controls,
.line-integral-controls,
.divergence-controls,
.curl-controls {
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
}

select {
    padding: 5px;
    margin: 5px 0;
    width: 200px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .vector-field-controls,
    .line-integral-controls,
    .divergence-controls,
    .curl-controls {
        background: #2a2a2a;
    }
    
    select {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
}
</style>

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/linear-algebra/chapter11">← 上一章：矩阵分解</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter13">下一章：傅里叶分析 →</a>
    </div>
</div>
