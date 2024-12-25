---
layout: book-chapter
title: 线性方程组
description: 探索线性方程组的解法、几何意义以及在实际问题中的应用
chapter_number: 7
---

# 线性方程组

## 7.1 基本概念

线性方程组是由多个线性方程构成的方程组。每个方程都是变量的线性组合：

$$
\begin{cases}
a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = b_1 \\
a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = b_2 \\
\vdots \\
a_{m1}x_1 + a_{m2}x_2 + \cdots + a_{mn}x_n = b_m
\end{cases}
$$

### 7.1.1 矩阵形式

线性方程组可以用矩阵形式表示：

$$Ax = b$$

其中：
- $A$ 是系数矩阵
- $x$ 是未知数向量
- $b$ 是常数项向量

### 7.1.2 几何解释

在二维平面上，每个线性方程表示一条直线。方程组的解就是这些直线的交点。

<div class="visualization-container">
    <div class="visualization-title">线性方程组的几何表示</div>
    <div id="linear-system"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createLinearSystemViz('#linear-system');
});
</script>

```python
def plot_linear_system_2d(A, b):
    """绘制二维线性方程组的几何表示
    
    Args:
        A: 2x2系数矩阵
        b: 2维常数向量
    """
    import numpy as np
    import matplotlib.pyplot as plt
    
    x = np.linspace(-5, 5, 100)
    
    # 绘制第一个方程
    y1 = (b[0] - A[0,0]*x) / A[0,1]
    plt.plot(x, y1, label=f'{A[0,0]}x + {A[0,1]}y = {b[0]}')
    
    # 绘制第二个方程
    y2 = (b[1] - A[1,0]*x) / A[1,1]
    plt.plot(x, y2, label=f'{A[1,0]}x + {A[1,1]}y = {b[1]}')
    
    # 求解方程组
    solution = np.linalg.solve(A, b)
    plt.plot(solution[0], solution[1], 'ro', label='解')
    
    plt.grid(True)
    plt.legend()
    plt.axis('equal')
    plt.show()

# 示例
A = np.array([[2, 1],
              [1, -1]])
b = np.array([4, 1])
plot_linear_system_2d(A, b)
```

## 7.2 解的存在性和唯一性

线性方程组的解可能有三种情况：
1. 唯一解
2. 无解（不相容）
3. 无穷多解

### 7.2.1 秩的作用

方程组解的情况与矩阵的秩有关：
- 若 $rank(A) = rank(A|b) = n$，则有唯一解
- 若 $rank(A) < rank(A|b)$，则无解
- 若 $rank(A) = rank(A|b) < n$，则有无穷多解

```python
def analyze_solution(A, b):
    """分析线性方程组解的情况
    
    Args:
        A: 系数矩阵
        b: 常数向量
    
    Returns:
        解的类型和具体解（如果存在）
    """
    import numpy as np
    
    # 构造增广矩阵
    aug = np.column_stack([A, b])
    
    # 计算秩
    rank_A = np.linalg.matrix_rank(A)
    rank_aug = np.linalg.matrix_rank(aug)
    n = A.shape[1]  # 未知数个数
    
    if rank_A == rank_aug == n:
        solution = np.linalg.solve(A, b)
        return "唯一解", solution
    elif rank_A < rank_aug:
        return "无解", None
    else:
        return "无穷多解", None

# 示例
A1 = np.array([[1, 1], [2, 2]])
b1 = np.array([2, 4])
print(analyze_solution(A1, b1))  # 无穷多解

A2 = np.array([[1, 1], [2, 2]])
b2 = np.array([2, 5])
print(analyze_solution(A2, b2))  # 无解
```

## 7.3 求解方法

### 7.3.1 高斯消元法

高斯消元法是求解线性方程组最基本的方法。它通过初等行变换将增广矩阵化为行阶梯形。

<div class="visualization-container">
    <div class="visualization-title">高斯消元过程</div>
    <div id="gaussian-elimination"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createGaussianEliminationViz('#gaussian-elimination');
});
</script>

```python
def gaussian_elimination(A, b):
    """使用高斯消元法求解线性方程组
    
    Args:
        A: 系数矩阵
        b: 常数向量
    
    Returns:
        解向量
    """
    import numpy as np
    
    # 构造增广矩阵
    n = len(A)
    aug = np.column_stack([A, b])
    
    # 前向消元
    for i in range(n):
        # 选主元
        pivot = abs(aug[i:, i]).argmax() + i
        if pivot != i:
            aug[[i, pivot]] = aug[[pivot, i]]
        
        # 消元
        for j in range(i+1, n):
            factor = aug[j,i] / aug[i,i]
            aug[j] = aug[j] - factor * aug[i]
    
    # 回代
    x = np.zeros(n)
    for i in range(n-1, -1, -1):
        x[i] = (aug[i,-1] - np.dot(aug[i,i+1:n], x[i+1:])) / aug[i,i]
    
    return x

# 示例
A = np.array([[2, 1],
              [1, -1]])
b = np.array([4, 1])
x = gaussian_elimination(A, b)
print(f"解: {x}")
print(f"验证: {np.allclose(A @ x, b)}")
```

### 7.3.2 LU分解

LU分解是高斯消元的矩阵形式，它将矩阵 $A$ 分解为下三角矩阵 $L$ 和上三角矩阵 $U$ 的乘积。

```python
def lu_solve(A, b):
    """使用LU分解求解线性方程组
    
    Args:
        A: 系数矩阵
        b: 常数向量
    
    Returns:
        解向量
    """
    import numpy as np
    from scipy.linalg import lu_factor, lu_solve
    
    # LU分解
    lu, piv = lu_factor(A)
    
    # 求解
    x = lu_solve((lu, piv), b)
    
    return x

# 示例
A = np.array([[2, 1],
              [1, -1]])
b = np.array([4, 1])
x = lu_solve(A, b)
print(f"解: {x}")
print(f"验证: {np.allclose(A @ x, b)}")
```

## 7.4 特殊方程组

### 7.4.1 齐次线性方程组

形如 $Ax = 0$ 的方程组称为齐次线性方程组。它至少有零解，关键是判断是否有非零解。

```python
def analyze_homogeneous(A):
    """分析齐次线性方程组的解
    
    Args:
        A: 系数矩阵
    
    Returns:
        解的描述
    """
    import numpy as np
    
    rank = np.linalg.matrix_rank(A)
    n = A.shape[1]
    
    if rank == n:
        return "只有零解"
    else:
        # 计算零空间的基
        null_space = np.linalg.null_space(A)
        return f"有非零解，零空间维数为{n-rank}，基为:\n{null_space}"

# 示例
A = np.array([[1, 1],
              [2, 2]])
print(analyze_homogeneous(A))
```

### 7.4.2 超定方程组

当方程个数多于未知数个数时，方程组称为超定的。这种情况下，通常使用最小二乘法求近似解。

```python
def least_squares_solve(A, b):
    """使用最小二乘法求解超定方程组
    
    Args:
        A: 系数矩阵
        b: 常数向量
    
    Returns:
        最小二乘解和残差
    """
    import numpy as np
    
    # 求解正规方程
    x = np.linalg.lstsq(A, b, rcond=None)[0]
    
    # 计算残差
    residual = np.linalg.norm(A @ x - b)
    
    return x, residual

# 示例
A = np.array([[1, 1],
              [1, 2],
              [1, 3]])
b = np.array([2, 4, 5])
x, residual = least_squares_solve(A, b)
print(f"最小二乘解: {x}")
print(f"残差: {residual}")
```

## 7.5 应用

### 7.5.1 电路分析

使用基尔霍夫定律分析电路时，需要解线性方程组：

```python
def analyze_circuit():
    """分析简单的电路网络
    
    Returns:
        各支路的电流
    """
    import numpy as np
    
    # 电路方程：
    # 2I₁ - I₂ = 5  (欧姆定律)
    # I₁ + I₂ = 3   (基尔霍夫电流定律)
    A = np.array([[2, -1],
                  [1, 1]])
    b = np.array([5, 3])
    
    currents = np.linalg.solve(A, b)
    return {f"I{i+1}": curr for i, curr in enumerate(currents)}

# 计算电路中的电流
print(analyze_circuit())
```

### 7.5.2 平衡方程

化学反应的平衡方程配平：

```python
def balance_equation():
    """配平化学方程
    例如：Fe + Cl₂ = FeCl₃
    """
    import numpy as np
    
    # 配平方程：
    # Fe: x = y    (Fe原子守恒)
    # Cl: 2z = 3y  (Cl原子守恒)
    A = np.array([[1, -1, 0],
                  [0, 0, 2, -3]])
    b = np.array([0, 0])
    
    # 求解齐次方程组
    null_space = np.linalg.null_space(A)
    # 取第一个基向量并化为最简整数比
    coeffs = null_space[:,0]
    coeffs = coeffs / np.gcd.reduce(np.abs(coeffs).astype(int))
    
    return {
        "Fe": coeffs[0],
        "Cl₂": coeffs[1],
        "FeCl₃": coeffs[2]
    }

# 配平化学方程
print(balance_equation())
```

## 练习

1. 编写程序判断一个3×3的线性方程组是否有唯一解。

2. 实现一个函数，使用高斯-若尔当消元法求解线性方程组。

3. 给定一个齐次线性方程组，找出其基本解系。

4. 使用最小二乘法拟合一组数据点。

## 深入思考

1. 为什么高斯消元法在计算机实现时需要选主元？

2. LU分解相比高斯消元有什么优势？

3. 在实际应用中，如何处理病态方程组？

## 扩展阅读

1. [数值分析中的线性方程组求解](https://www.cs.cornell.edu/~bindel/class/cs6210-f09/lec03.pdf)
2. [迭代法求解大型稀疏线性方程组](https://www.sciencedirect.com/science/article/pii/S0377042700003939)
3. [病态方程组的数值处理](https://epubs.siam.org/doi/abs/10.1137/1.9780898718027)

<style>
.linear-system-controls, .gaussian-controls {
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
}

.equation-input, .matrix-input {
    margin-bottom: 10px;
}

.equation-input label, .matrix-input label {
    font-weight: bold;
}

.equation-input input, .matrix-input input {
    margin: 2px;
}

.step-controls {
    margin-top: 10px;
}

.step-controls button {
    margin-right: 10px;
    padding: 5px 10px;
}

#step-info {
    margin-left: 10px;
    font-style: italic;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .linear-system-controls, .gaussian-controls {
        background: #2a2a2a;
    }
    
    .equation-input input, .matrix-input input {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
    
    .step-controls button {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
}
</style>

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/linear-algebra/chapter6">← 上一章：奇异值分解</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter8">下一章：向量空间 →</a>
    </div>
</div>
