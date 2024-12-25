---
layout: book-chapter
title: 特征值与特征向量
description: 探索矩阵的特征值和特征向量，理解其几何意义和应用
chapter_number: 5
---

# 特征值与特征向量

## 5.1 基本概念

特征值和特征向量是描述线性变换最重要的工具之一。如果一个非零向量 $\vec{v}$ 经过线性变换 $A$ 后，方向保持不变（可能会伸缩），那么 $\vec{v}$ 就是 $A$ 的特征向量：

$A\vec{v} = \lambda\vec{v}$

其中：
- $\lambda$ 是特征值
- $\vec{v}$ 是对应的特征向量

<div class="visualization-container">
    <div class="visualization-title">特征向量可视化</div>
    <div id="eigenvectors"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createEigenViz('#eigenvectors');
});
</script>

```python
def find_eigenvectors(A):
    """计算矩阵的特征值和特征向量
    
    Args:
        A: numpy矩阵
    
    Returns:
        eigenvals: 特征值
        eigenvecs: 特征向量
    """
    eigenvals, eigenvecs = np.linalg.eig(A)
    return eigenvals, eigenvecs

# 示例
A = np.array([[2, 1],
              [1, 2]])
eigenvals, eigenvecs = find_eigenvectors(A)
print(f"特征值:\n{eigenvals}")
print(f"特征向量:\n{eigenvecs}")

# 验证 Av = λv
for i in range(len(eigenvals)):
    v = eigenvecs[:, i]
    Av = A @ v
    lambda_v = eigenvals[i] * v
    print(f"验证第{i+1}个特征向量:")
    print(f"Av = {Av}")
    print(f"λv = {lambda_v}")
```

### 5.1.1 特征多项式

要找到特征值，我们需要解特征方程：

$det(A - \lambda I) = 0$

这个行列式展开后得到的多项式称为特征多项式。

```python
def characteristic_polynomial(A):
    """计算特征多项式的系数
    
    Args:
        A: 2x2矩阵
    
    Returns:
        系数列表 [a, b, c] 表示 ax² + bx + c
    """
    # 对于2x2矩阵
    a = 1
    b = -(A[0,0] + A[1,1])  # -trace
    c = np.linalg.det(A)     # determinant
    
    return [a, b, c]

# 示例
A = np.array([[2, 1],
              [1, 2]])
coeffs = characteristic_polynomial(A)
print(f"特征多项式: λ² + ({coeffs[1]})λ + ({coeffs[2]})")
```

## 5.2 特征值分解

如果 $n×n$ 矩阵 $A$ 有 $n$ 个线性无关的特征向量，那么 $A$ 可以分解为：

$A = PDP^{-1}$

其中：
- $P$ 是特征向量矩阵
- $D$ 是特征值对角矩阵

<div class="visualization-container">
    <div class="visualization-title">特征值分解可视化</div>
    <div id="eigendecomposition"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createEigenDecompViz('#eigendecomposition');
});
</script>

```python
def eigen_decomposition(A):
    """矩阵的特征值分解
    
    Args:
        A: numpy矩阵
    
    Returns:
        P: 特征向量矩阵
        D: 特征值对角矩阵
    """
    eigenvals, eigenvecs = np.linalg.eig(A)
    P = eigenvecs
    D = np.diag(eigenvals)
    
    # 验证分解
    A_reconstructed = P @ D @ np.linalg.inv(P)
    error = np.max(np.abs(A - A_reconstructed))
    
    return P, D, error

# 示例
A = np.array([[2, 1],
              [1, 2]])
P, D, error = eigen_decomposition(A)
print(f"特征向量矩阵 P:\n{P}")
print(f"特征值对角矩阵 D:\n{D}")
print(f"重构误差: {error}")
```

### 5.2.1 对角化条件

并非所有矩阵都可以对角化。矩阵可对角化的充要条件是：
1. 特征值的重数等于对应特征空间的维数
2. 特征向量线性无关

```python
def is_diagonalizable(A, tolerance=1e-10):
    """检查矩阵是否可对角化
    
    Args:
        A: numpy矩阵
        tolerance: 数值误差容忍度
    
    Returns:
        bool: 是否可对角化
    """
    eigenvals, eigenvecs = np.linalg.eig(A)
    
    # 检查特征向量是否线性无关
    rank = np.linalg.matrix_rank(eigenvecs, tol=tolerance)
    n = A.shape[0]
    
    return rank == n

# 示例
A1 = np.array([[2, 1],
               [1, 2]])  # 可对角化
A2 = np.array([[1, 1],
               [0, 1]])  # 不可对角化
print(f"A1是否可对角化: {is_diagonalizable(A1)}")
print(f"A2是否可对角化: {is_diagonalizable(A2)}")
```

## 5.3 特殊矩阵的特征值

### 5.3.1 对称矩阵

对称矩阵有以下性质：
1. 所有特征值都是实数
2. 特征向量相互正交
3. 一定可以对角化

```python
def symmetric_eigen_properties(A):
    """验证对称矩阵的特征值性质
    
    Args:
        A: 对称矩阵
    
    Returns:
        特征值和特征向量的性质
    """
    eigenvals, eigenvecs = np.linalg.eigh(A)  # 使用eigh而不是eig
    
    # 验证特征值是实数
    is_real = np.allclose(eigenvals, np.real(eigenvals))
    
    # 验证特征向量正交
    is_orthogonal = np.allclose(eigenvecs.T @ eigenvecs, np.eye(len(eigenvals)))
    
    return {
        'eigenvals_real': is_real,
        'eigenvecs_orthogonal': is_orthogonal,
        'eigenvals': eigenvals,
        'eigenvecs': eigenvecs
    }

# 示例
A = np.array([[2, 1],
              [1, 2]])
props = symmetric_eigen_properties(A)
print(f"特征值是实数: {props['eigenvals_real']}")
print(f"特征向量正交: {props['eigenvecs_orthogonal']}")
```

### 5.3.2 正定矩阵

正定矩阵是一类特殊的对称矩阵，它的所有特征值都是正数。

```python
def is_positive_definite(A, tolerance=1e-10):
    """检查矩阵是否正定
    
    Args:
        A: numpy矩阵
        tolerance: 数值误差容忍度
    
    Returns:
        bool: 是否正定
    """
    # 检查是否对称
    if not np.allclose(A, A.T):
        return False
    
    # 检查特征值是否都为正
    eigenvals = np.linalg.eigvals(A)
    return np.all(eigenvals > tolerance)

# 示例
A1 = np.array([[2, -1],
               [-1, 2]])  # 正定
A2 = np.array([[1, 2],
               [2, 1]])  # 不是正定
print(f"A1是否正定: {is_positive_definite(A1)}")
print(f"A2是否正定: {is_positive_definite(A2)}")
```

## 5.4 应用

### 5.4.1 谷歌的PageRank算法

PageRank使用特征向量来计算网页的重要性：

```python
def pagerank(adjacency_matrix, damping=0.85, epsilon=1e-8):
    """实现简化版PageRank算法
    
    Args:
        adjacency_matrix: 网页邻接矩阵
        damping: 阻尼系数
        epsilon: 收敛阈值
    
    Returns:
        网页重要性得分
    """
    n = len(adjacency_matrix)
    
    # 构造转移矩阵
    out_degrees = np.sum(adjacency_matrix, axis=1)
    transition = adjacency_matrix / out_degrees[:, np.newaxis]
    
    # 处理零出度页面
    transition = np.nan_to_num(transition, 0)
    
    # PageRank矩阵
    M = damping * transition + (1 - damping) / n
    
    # 幂迭代法求主特征向量
    r = np.ones(n) / n
    while True:
        r_next = M @ r
        if np.sum(np.abs(r_next - r)) < epsilon:
            return r_next
        r = r_next

# 示例
A = np.array([[0, 1, 1],
              [1, 0, 0],
              [1, 0, 0]])
ranks = pagerank(A)
print(f"PageRank得分: {ranks}")
```

### 5.4.2 主成分分析（PCA）

PCA使用协方差矩阵的特征向量来降维：

```python
def pca_visualization(X, n_components=2):
    """PCA降维和可视化
    
    Args:
        X: 数据矩阵
        n_components: 主成分个数
    
    Returns:
        降维后的数据
    """
    # 中心化
    X_centered = X - np.mean(X, axis=0)
    
    # 计算协方差矩阵
    cov = np.cov(X_centered.T)
    
    # 特征值分解
    eigenvals, eigenvecs = np.linalg.eigh(cov)
    
    # 选择前n_components个特征向量
    idx = np.argsort(eigenvals)[::-1]
    eigenvecs = eigenvecs[:, idx]
    eigenvals = eigenvals[idx]
    
    # 投影数据
    components = eigenvecs[:, :n_components]
    transformed = X_centered @ components
    
    # 计算解释方差比
    explained_variance_ratio = eigenvals[:n_components] / np.sum(eigenvals)
    
    return transformed, explained_variance_ratio

# 示例：生成螺旋数据
t = np.linspace(0, 10, 100)
X = np.column_stack([
    t * np.cos(t),
    t * np.sin(t),
    t
])
transformed, ratio = pca_visualization(X)
print(f"解释方差比: {ratio}")
```

## 练习

1. 证明：如果 $\lambda$ 是 $A$ 的特征值，那么 $\lambda^k$ 是 $A^k$ 的特征值。

2. 实现一个函数，计算给定矩阵的所有特征值和特征向量。

3. 使用特征值分解实现图像压缩：
   - 读取一张灰度图像
   - 计算其SVD分解
   - 只保留前k个奇异值
   - 比较压缩前后的图像质量

4. 编写代码验证对称矩阵的特征向量是正交的。

## 深入思考

1. 为什么不是所有矩阵都可以对角化？

2. 特征值的几何意义是什么？

3. 在机器学习中，特征值和特征向量有哪些应用？

## 扩展阅读

1. [特征值算法的数值稳定性](https://www.cs.cornell.edu/cv/ResearchPDF/19ways+.pdf)
2. [PageRank算法的数学原理](https://www.ams.org/journals/bull/2006-43-03/S0273-0979-06-01111-9/S0273-0979-06-01111-9.pdf)
3. [PCA在图像压缩中的应用](https://www.cs.toronto.edu/~rgrosse/courses/csc411_f18/tutorials/tut8_pca.pdf)

<style>
.eigen-controls, .eigen-decomp-controls {
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
}

.matrix-input {
    margin-bottom: 10px;
}

.matrix-input label {
    font-weight: bold;
}

.matrix-input input {
    margin: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .eigen-controls, .eigen-decomp-controls {
        background: #2a2a2a;
    }
    
    .matrix-input input {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
}
</style>

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/linear-algebra/chapter4">← 上一章：正交性与投影</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter6">下一章：奇异值分解 →</a>
    </div>
</div>
