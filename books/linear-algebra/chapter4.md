---
layout: book-chapter
title: 正交性与投影
description: 探索向量的正交性质，学习投影的概念和应用
chapter_number: 4
---

# 正交性与投影

## 4.1 内积与正交性

内积（点积）是衡量两个向量相似度的重要工具。在欧几里得空间中，内积定义为：

$\langle \vec{u}, \vec{v} \rangle = \vec{u} \cdot \vec{v} = \sum_{i=1}^n u_iv_i$

两个向量正交当且仅当它们的内积为零：

$\vec{u} \perp \vec{v} \iff \langle \vec{u}, \vec{v} \rangle = 0$

<div class="visualization-container">
    <div class="visualization-title">向量正交性可视化</div>
    <div id="orthogonality"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createOrthogonalityViz('#orthogonality');
});
</script>

```python
def is_orthogonal(u, v, tolerance=1e-10):
    """检查两个向量是否正交
    
    Args:
        u, v: 向量
        tolerance: 数值误差容忍度
    
    Returns:
        bool: 是否正交
    """
    return abs(np.dot(u, v)) < tolerance

# 示例
u = np.array([1, 0])
v = np.array([0, 1])
print(f"向量是否正交: {is_orthogonal(u, v)}")  # True
```

### 4.1.1 正交补空间

给定子空间 $W$，其正交补 $W^\perp$ 是与 $W$ 中所有向量正交的所有向量的集合：

$W^\perp = \{\vec{v} \in V : \langle \vec{v}, \vec{w} \rangle = 0 \text{ for all } \vec{w} \in W\}$

性质：
1. $(W^\perp)^\perp = W$
2. $\dim W + \dim W^\perp = \dim V$
3. $V = W \oplus W^\perp$

```python
def orthogonal_complement_basis(basis, dim):
    """计算子空间的正交补基
    
    Args:
        basis: 子空间的基向量列表
        dim: 全空间的维数
    
    Returns:
        正交补空间的基
    """
    # 构造系数矩阵
    A = np.array(basis)
    
    # 使用QR分解
    Q = np.linalg.qr(A.T)[0]
    
    # 取Q的后几列作为正交补的基
    complement_basis = Q[:, len(basis):]
    
    return complement_basis

# 示例
basis = [[1, 0, 0], [0, 1, 0]]  # xy平面的基
complement = orthogonal_complement_basis(basis, 3)
print(f"正交补的基:\n{complement}")  # 应该是z轴方向
```

## 4.2 向量投影

向量 $\vec{v}$ 在向量 $\vec{u}$ 上的投影定义为：

$proj_{\vec{u}}\vec{v} = \frac{\langle \vec{v}, \vec{u} \rangle}{\|\vec{u}\|^2}\vec{u}$

这可以分解为标量投影和方向：
- 标量投影：$\|\vec{v}\|\cos\theta = \frac{\langle \vec{v}, \vec{u} \rangle}{\|\vec{u}\|}$
- 方向：$\frac{\vec{u}}{\|\vec{u}\|}$

<div class="visualization-container">
    <div class="visualization-title">向量投影可视化</div>
    <div id="projection"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createOrthogonalityViz('#projection');
});
</script>

```python
def vector_projection(v, u):
    """计算向量v在向量u上的投影
    
    Args:
        v, u: numpy数组表示的向量
    
    Returns:
        投影向量
    """
    # 计算投影系数
    coeff = np.dot(v, u) / np.dot(u, u)
    
    # 计算投影向量
    proj = coeff * u
    
    return proj

# 示例
v = np.array([2, 1])
u = np.array([1, 0])
proj = vector_projection(v, u)
print(f"投影向量: {proj}")  # 应该是[2, 0]
```

### 4.2.1 正交分解

任何向量 $\vec{v}$ 都可以唯一地分解为平行和垂直于 $\vec{u}$ 的分量之和：

$\vec{v} = proj_{\vec{u}}\vec{v} + (\vec{v} - proj_{\vec{u}}\vec{v})$

这种分解在许多应用中都很有用，比如：
- 最小二乘法
- 信号处理
- 图像压缩

```python
def orthogonal_decomposition(v, u):
    """计算向量的正交分解
    
    Args:
        v, u: numpy数组表示的向量
    
    Returns:
        (parallel, perpendicular): 平行和垂直分量
    """
    # 计算平行分量（投影）
    parallel = vector_projection(v, u)
    
    # 计算垂直分量
    perpendicular = v - parallel
    
    return parallel, perpendicular

# 示例
v = np.array([2, 1])
u = np.array([1, 0])
parallel, perp = orthogonal_decomposition(v, u)
print(f"平行分量: {parallel}")  # [2, 0]
print(f"垂直分量: {perp}")     # [0, 1]
```

## 4.3 Gram-Schmidt正交化

Gram-Schmidt过程是一种将线性无关向量组转换为正交向量组的方法。

<div class="visualization-container">
    <div class="visualization-title">Gram-Schmidt正交化过程</div>
    <div id="gram-schmidt"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createGramSchmidtViz('#gram-schmidt');
});
</script>

算法步骤：
1. 保持第一个向量不变
2. 从第二个向量开始，减去它在之前所有向量上的投影
3. 标准化得到的向量（如果需要）

```python
def gram_schmidt(vectors):
    """Gram-Schmidt正交化过程
    
    Args:
        vectors: 向量列表
    
    Returns:
        正交化后的向量列表
    """
    orthogonal = []
    
    for v in vectors:
        # 复制当前向量
        u = v.copy()
        
        # 减去在之前向量上的投影
        for w in orthogonal:
            u -= vector_projection(v, w)
            
        # 添加到正交向量组
        orthogonal.append(u)
    
    return orthogonal

# 示例
vectors = [
    np.array([1, 1]),
    np.array([1, 0])
]
orthogonal = gram_schmidt(vectors)
print("正交化后的向量:")
for v in orthogonal:
    print(v)
```

### 4.3.1 QR分解

QR分解是Gram-Schmidt过程的矩阵形式。对于矩阵 $A$，我们可以将其分解为：

$A = QR$

其中：
- $Q$ 是正交矩阵（列向量是单位正交的）
- $R$ 是上三角矩阵

```python
def qr_decomposition(A):
    """计算矩阵的QR分解
    
    Args:
        A: numpy矩阵
    
    Returns:
        (Q, R): 正交矩阵Q和上三角矩阵R
    """
    # 使用numpy的QR分解
    Q, R = np.linalg.qr(A)
    
    return Q, R

# 示例
A = np.array([[1, 1],
              [1, 0],
              [0, 1]])
Q, R = qr_decomposition(A)
print(f"Q:\n{Q}")
print(f"R:\n{R}")
print(f"验证 A = QR:\n{np.dot(Q, R)}")
```

## 4.4 应用

### 4.4.1 最小二乘法

最小二乘法是使用正交投影来找到最佳拟合线的方法。

```python
def least_squares_fit(X, y):
    """计算最小二乘拟合
    
    Args:
        X: 设计矩阵
        y: 目标值
    
    Returns:
        最优参数
    """
    # 正规方程
    beta = np.linalg.inv(X.T @ X) @ X.T @ y
    
    return beta

# 示例：拟合直线
X = np.array([[1, x] for x in range(10)])
y = 2*np.arange(10) + 1 + np.random.randn(10)*0.1
beta = least_squares_fit(X, y)
print(f"拟合参数: {beta}")  # [截距, 斜率]
```

### 4.4.2 主成分分析

PCA使用正交变换将数据投影到新的坐标系。

```python
def pca(X, n_components):
    """主成分分析
    
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
    components = eigenvecs[:, ::-1][:, :n_components]
    
    # 投影数据
    transformed = X_centered @ components
    
    return transformed

# 示例
X = np.random.randn(100, 10)  # 100个样本，10个特征
X_reduced = pca(X, n_components=2)
print(f"降维后的数据形状: {X_reduced.shape}")
```

## 练习

1. 证明：如果 $\{\vec{v}_1, \vec{v}_2\}$ 是正交的，那么它们一定线性无关。

2. 实现一个函数，计算向量 $\vec{v}$ 在子空间 $W$ 上的投影。

3. 使用Gram-Schmidt过程将以下向量组正交化：
   $\{(1,1,0), (1,0,1), (0,1,1)\}$

4. 编写代码实现最小二乘法，并用它拟合一个二次函数。

## 深入思考

1. 为什么正交基在计算中特别有用？

2. QR分解和特征值分解有什么关系？

3. 在机器学习中，正交性和投影的概念如何应用？

## 扩展阅读

1. [正交矩阵的几何意义](https://www.math.utah.edu/~gustafso/s2017/2270/projects-2017/orthogonal-matrices.pdf)
2. [QR算法与特征值计算](https://people.inf.ethz.ch/arbenz/ewp/Lnotes/chapter4.pdf)
3. [最小二乘法的几何解释](https://www.math.ucla.edu/~tao/preprints/forms.pdf)

<style>
.orthogonality-controls, .gram-schmidt-controls {
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
}

.vector-input {
    margin-bottom: 10px;
}

.vector-input label {
    font-weight: bold;
}

.gram-schmidt-buttons {
    margin-top: 10px;
}

.gram-schmidt-buttons button {
    margin-right: 10px;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
}

.gram-schmidt-buttons button:hover {
    background: #f0f0f0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .orthogonality-controls, .gram-schmidt-controls {
        background: #2a2a2a;
    }
    
    .gram-schmidt-buttons button {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
    
    .gram-schmidt-buttons button:hover {
        background: #444;
    }
}
</style>

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/linear-algebra/chapter3">← 上一章：向量空间与子空间</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter5">下一章：特征值与特征向量 →</a>
    </div>
</div>
