---
layout: book-chapter
title: 向量空间与子空间
description: 理解向量空间的抽象概念，掌握子空间的性质和应用
chapter_number: 3
---

# 向量空间与子空间

## 3.1 向量空间的概念

向量空间是一个代数结构，它满足以下公理：

1. **加法封闭性**：$\vec{u} + \vec{v} \in V$
2. **加法交换律**：$\vec{u} + \vec{v} = \vec{v} + \vec{u}$
3. **加法结合律**：$(\vec{u} + \vec{v}) + \vec{w} = \vec{u} + (\vec{v} + \vec{w})$
4. **加法零元**：存在 $\vec{0}$ 使得 $\vec{v} + \vec{0} = \vec{v}$
5. **加法逆元**：对每个 $\vec{v}$，存在 $-\vec{v}$ 使得 $\vec{v} + (-\vec{v}) = \vec{0}$
6. **标量乘法封闭性**：$c\vec{v} \in V$
7. **标量乘法单位元**：$1\vec{v} = \vec{v}$
8. **标量乘法结合律**：$a(b\vec{v}) = (ab)\vec{v}$
9. **标量乘法分配律**：$a(\vec{u} + \vec{v}) = a\vec{u} + a\vec{v}$
10. **标量加法分配律**：$(a + b)\vec{v} = a\vec{v} + b\vec{v}$

<div class="visualization-container">
    <div class="visualization-title">向量空间的可视化</div>
    <div id="vector-space"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createVectorSpaceViz('#vector-space');
});
</script>

### 3.1.1 基和维数

基是向量空间中的一组线性无关向量，它可以生成整个空间。维数是基中向量的个数。

```python
import numpy as np

def is_linearly_independent(vectors):
    """检查向量组是否线性无关
    
    Args:
        vectors: 向量列表
    
    Returns:
        bool: 是否线性无关
    """
    matrix = np.array(vectors)
    rank = np.linalg.matrix_rank(matrix)
    return rank == len(vectors)

# 示例
vectors = [
    [1, 0],
    [0, 1]
]
print(f"向量组是否线性无关: {is_linearly_independent(vectors)}")
```

### 3.1.2 坐标和坐标变换

给定一组基 $\{\vec{v}_1, \vec{v}_2, ..., \vec{v}_n\}$，任何向量 $\vec{u}$ 都可以唯一表示为：

$\vec{u} = c_1\vec{v}_1 + c_2\vec{v}_2 + ... + c_n\vec{v}_n$

其中 $(c_1, c_2, ..., c_n)$ 是 $\vec{u}$ 在这组基下的坐标。

```python
def change_basis(vector, old_basis, new_basis):
    """坐标变换
    
    Args:
        vector: 向量
        old_basis: 原基
        new_basis: 新基
    
    Returns:
        在新基下的坐标
    """
    # 构造变换矩阵
    P = np.array(new_basis).T
    P_inv = np.linalg.inv(P)
    
    # 变换坐标
    return np.dot(P_inv, vector)

# 示例
vector = [2, 3]
standard_basis = [[1, 0], [0, 1]]
new_basis = [[1, 1], [-1, 1]]
new_coords = change_basis(vector, standard_basis, new_basis)
print(f"新坐标: {new_coords}")
```

## 3.2 子空间

子空间是向量空间的一个非空子集，它对向量加法和标量乘法运算是封闭的。

<div class="visualization-container">
    <div class="visualization-title">子空间的可视化</div>
    <div id="subspace"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createSubspaceViz('#subspace');
});
</script>

### 3.2.1 常见的子空间

1. **零子空间**：只包含零向量
2. **列空间**：矩阵所有列的线性组合
3. **零空间**：使得 $A\vec{x} = \vec{0}$ 的所有向量 $\vec{x}$ 的集合
4. **行空间**：矩阵所有行的线性组合

```python
def nullspace(A):
    """计算矩阵的零空间
    
    Args:
        A: 输入矩阵
    
    Returns:
        零空间的基
    """
    # 使用SVD分解
    U, s, Vh = np.linalg.svd(A)
    
    # 找到奇异值接近0的列
    null_mask = (s < 1e-10)
    null_space = Vh[null_mask]
    
    return null_space

# 示例
A = np.array([[1, 2, 3],
              [2, 4, 6]])
null_basis = nullspace(A)
print(f"零空间的基:\n{null_basis}")
```

### 3.2.2 子空间的维数关系

对于矩阵 $A_{m×n}$：

1. $rank(A) + dim(Null(A)) = n$
2. $rank(A) = dim(Col(A)) = dim(Row(A))$

```python
def dimension_relations(A):
    """验证子空间的维数关系
    
    Args:
        A: 输入矩阵
    
    Returns:
        各个子空间的维数
    """
    rank = np.linalg.matrix_rank(A)
    n = A.shape[1]
    nullity = n - rank
    
    return {
        'rank': rank,
        'nullity': nullity,
        'sum': rank + nullity,
        'n': n
    }

# 示例
A = np.array([[1, 2, 3],
              [2, 4, 6],
              [3, 6, 9]])
dims = dimension_relations(A)
print(f"维数关系: {dims}")
```

## 3.3 正交补

如果两个子空间 $U$ 和 $V$ 满足：

1. $U \cap V = \{\vec{0}\}$
2. 对任意 $\vec{u} \in U$ 和 $\vec{v} \in V$，有 $\vec{u} \cdot \vec{v} = 0$

则称 $V$ 是 $U$ 的正交补。

```python
def orthogonal_complement(basis):
    """计算子空间的正交补
    
    Args:
        basis: 子空间的基
    
    Returns:
        正交补的基
    """
    # 构造系数矩阵
    A = np.array(basis)
    
    # 使用QR分解
    Q = np.linalg.qr(A.T)[0]
    
    # 取Q的后几列作为正交补的基
    complement_basis = Q[:, len(basis):]
    
    return complement_basis

# 示例
basis = [[1, 0, 0],
         [0, 1, 0]]
complement = orthogonal_complement(basis)
print(f"正交补的基:\n{complement}")
```

## 3.4 实践应用

### 3.4.1 图像压缩

使用子空间来近似和压缩图像：

```python
def compress_image(image, k):
    """使用SVD压缩图像
    
    Args:
        image: 图像矩阵
        k: 保留的奇异值个数
    
    Returns:
        压缩后的图像
    """
    U, s, Vh = np.linalg.svd(image)
    
    # 只保留前k个奇异值
    compressed = np.dot(U[:, :k], np.dot(np.diag(s[:k]), Vh[:k, :]))
    
    return compressed

# 示例
from PIL import Image
import numpy as np

# 读取图像
img = Image.open('example.jpg').convert('L')
img_array = np.array(img)

# 压缩
compressed = compress_image(img_array, 50)

# 显示压缩率
original_size = img_array.size
compressed_size = k * (img_array.shape[0] + img_array.shape[1])
compression_ratio = compressed_size / original_size
print(f"压缩率: {compression_ratio:.2%}")
```

### 3.4.2 主成分分析

使用子空间进行数据降维：

```python
from sklearn.decomposition import PCA

def analyze_principal_components(data, n_components):
    """主成分分析
    
    Args:
        data: 输入数据
        n_components: 主成分个数
    
    Returns:
        降维后的数据和主成分
    """
    pca = PCA(n_components=n_components)
    transformed = pca.fit_transform(data)
    
    return {
        'transformed_data': transformed,
        'components': pca.components_,
        'explained_variance_ratio': pca.explained_variance_ratio_
    }

# 示例
data = np.random.randn(100, 10)
results = analyze_principal_components(data, 2)
print(f"解释方差比: {results['explained_variance_ratio']}")
```

## 练习

1. 证明 $\mathbb{R}^3$ 中所有经过原点的平面都是子空间。

2. 找出矩阵 $A = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \end{pmatrix}$ 的：
   - 列空间的基
   - 零空间的基
   - 行空间的基

3. 实现一个函数，判断一个向量集是否是一个子空间。

4. 使用PCA对一个高维数据集进行降维，并可视化结果。

## 深入思考

1. 为什么向量空间的公理中需要加法逆元？

2. 子空间的交集一定是子空间吗？和呢？

3. 在机器学习中，为什么要使用子空间方法？

## 扩展阅读

1. [线性代数中的子空间理论](https://www.math.ubc.ca/~tbjw/ila/subspaces.html)
2. [PCA的数学原理](https://arxiv.org/abs/1404.1100)
3. [子空间跟踪算法](https://ieeexplore.ieee.org/document/7347404)

<style>
.vector-space-controls, .subspace-controls {
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
}

.basis-input, .vector-input {
    margin-bottom: 10px;
}

.basis-input label, .vector-input label {
    font-weight: bold;
}

.dimension-select {
    margin-top: 10px;
}

.dimension-select select {
    margin-top: 5px;
    padding: 5px;
    width: 150px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .vector-space-controls, .subspace-controls {
        background: #2a2a2a;
    }
    
    .dimension-select select {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
}
</style>

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/linear-algebra/chapter2">← 上一章：矩阵与线性变换</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter4">下一章：正交性与投影 →</a>
    </div>
</div>
