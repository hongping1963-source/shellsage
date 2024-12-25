---
layout: book-chapter
title: 向量空间
description: 探索向量空间的基本概念、子空间、基和维数，以及它们在实际应用中的重要性
chapter_number: 8
---

# 向量空间

## 8.1 向量空间的定义

向量空间是一个代数结构，它满足以下公理：

1. **加法封闭性**：$\forall u,v \in V, u + v \in V$
2. **加法交换律**：$\forall u,v \in V, u + v = v + u$
3. **加法结合律**：$\forall u,v,w \in V, (u + v) + w = u + (v + w)$
4. **加法零元**：$\exists 0 \in V, \forall v \in V, v + 0 = v$
5. **加法逆元**：$\forall v \in V, \exists (-v) \in V, v + (-v) = 0$
6. **标量乘法封闭性**：$\forall c \in F, v \in V, cv \in V$
7. **标量乘法单位元**：$\forall v \in V, 1v = v$
8. **标量乘法结合律**：$\forall a,b \in F, v \in V, (ab)v = a(bv)$
9. **标量乘法分配律**：$\forall a \in F, u,v \in V, a(u + v) = au + av$
10. **标量加法分配律**：$\forall a,b \in F, v \in V, (a + b)v = av + bv$

### 8.1.1 向量空间运算

让我们通过可视化来理解向量空间中的基本运算：

<div class="visualization-container">
    <div class="visualization-title">向量空间运算</div>
    <div id="vector-operations"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createVectorSpaceOperationsViz('#vector-operations');
});
</script>

```python
def verify_vector_space_axioms():
    """验证向量空间公理
    
    Returns:
        验证结果字典
    """
    import numpy as np
    
    # 创建测试向量
    u = np.array([1, 2])
    v = np.array([3, 4])
    w = np.array([5, 6])
    
    # 验证加法封闭性
    closure = isinstance(u + v, np.ndarray)
    
    # 验证加法交换律
    commutative = np.array_equal(u + v, v + u)
    
    # 验证加法结合律
    associative = np.array_equal((u + v) + w, u + (v + w))
    
    # 验证零元
    zero = np.zeros_like(u)
    has_zero = np.array_equal(u + zero, u)
    
    # 验证逆元
    has_inverse = np.array_equal(u + (-u), zero)
    
    return {
        'closure': closure,
        'commutative': commutative,
        'associative': associative,
        'has_zero': has_zero,
        'has_inverse': has_inverse
    }

# 示例
results = verify_vector_space_axioms()
for axiom, satisfied in results.items():
    print(f"{axiom}: {'满足' if satisfied else '不满足'}")
```

## 8.2 子空间

子空间是向量空间的一个非空子集，它对向量加法和标量乘法运算是封闭的。

### 8.2.1 子空间的判定

一个子集是子空间，当且仅当它满足：
1. 包含零向量
2. 对加法封闭
3. 对标量乘法封闭

<div class="visualization-container">
    <div class="visualization-title">子空间可视化</div>
    <div id="subspace"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createSubspaceViz('#subspace');
});
</script>

```python
def is_subspace(vectors):
    """判断向量集是否能生成子空间
    
    Args:
        vectors: 向量列表
    
    Returns:
        是否为子空间
    """
    import numpy as np
    
    # 转换为numpy数组
    V = np.array(vectors)
    
    # 检查是否包含零向量
    has_zero = np.any(np.all(V == 0, axis=1))
    
    # 检查加法封闭性
    sum_closure = True
    for i in range(len(vectors)):
        for j in range(i, len(vectors)):
            sum_vec = vectors[i] + vectors[j]
            # 检查和是否在张成空间中
            if not is_linear_combination(sum_vec, vectors):
                sum_closure = False
                break
    
    # 检查标量乘法封闭性
    scalar_closure = True
    for v in vectors:
        for scalar in [-2, -1, 2]:  # 测试几个标量
            scaled_vec = scalar * v
            if not is_linear_combination(scaled_vec, vectors):
                scalar_closure = False
                break
    
    return has_zero and sum_closure and scalar_closure

def is_linear_combination(vector, basis_vectors, tolerance=1e-10):
    """检查向量是否是基向量的线性组合
    
    Args:
        vector: 待检查的向量
        basis_vectors: 基向量列表
        tolerance: 数值误差容限
    
    Returns:
        是否为线性组合
    """
    import numpy as np
    
    # 构造线性方程组
    A = np.array(basis_vectors).T
    b = vector
    
    try:
        # 求解线性方程组
        coefficients = np.linalg.solve(A, b)
        # 验证解
        residual = np.linalg.norm(A @ coefficients - b)
        return residual < tolerance
    except np.linalg.LinAlgError:
        return False

# 示例
vectors = [
    np.array([1, 0]),
    np.array([0, 1]),
    np.array([0, 0])
]
print(f"是否为子空间: {is_subspace(vectors)}")
```

## 8.3 基和维数

### 8.3.1 线性相关性

向量组 $\{v_1, \ldots, v_n\}$ 线性相关，当且仅当存在不全为零的标量 $c_1, \ldots, c_n$ 使得：

$$c_1v_1 + c_2v_2 + \cdots + c_nv_n = 0$$

```python
def is_linearly_dependent(vectors):
    """判断向量组是否线性相关
    
    Args:
        vectors: 向量列表
    
    Returns:
        是否线性相关
    """
    import numpy as np
    
    # 构造矩阵
    A = np.array(vectors).T
    
    # 计算秩
    rank = np.linalg.matrix_rank(A)
    
    # 如果秩小于向量个数，则线性相关
    return rank < len(vectors)

# 示例
vectors = [
    np.array([1, 0]),
    np.array([2, 0])
]
print(f"是否线性相关: {is_linearly_dependent(vectors)}")
```

### 8.3.2 基的概念

基是向量空间中的一组线性无关向量，它可以张成整个空间。

```python
def find_basis(vectors):
    """从向量组中找出一组基
    
    Args:
        vectors: 向量列表
    
    Returns:
        基向量列表
    """
    import numpy as np
    
    # 转换为numpy数组
    V = np.array(vectors)
    
    # 计算秩
    rank = np.linalg.matrix_rank(V.T)
    
    # 使用QR分解找出线性无关的向量
    Q, R = np.linalg.qr(V.T)
    
    # 选择前rank个向量作为基
    basis = V[:rank]
    
    return basis

# 示例
vectors = [
    np.array([1, 0]),
    np.array([0, 1]),
    np.array([1, 1])
]
basis = find_basis(vectors)
print(f"一组基: {basis}")
```

### 8.3.3 维数

向量空间的维数是其任意一组基中向量的个数。

```python
def compute_dimension(vectors):
    """计算向量组张成的空间的维数
    
    Args:
        vectors: 向量列表
    
    Returns:
        维数
    """
    import numpy as np
    
    # 转换为numpy数组
    V = np.array(vectors)
    
    # 维数等于秩
    dim = np.linalg.matrix_rank(V.T)
    
    return dim

# 示例
vectors = [
    np.array([1, 0]),
    np.array([0, 1]),
    np.array([1, 1])
]
print(f"维数: {compute_dimension(vectors)}")
```

## 8.4 坐标和坐标变换

### 8.4.1 坐标表示

给定一组基 $\{v_1, \ldots, v_n\}$，任何向量 $v$ 都可以唯一表示为：

$$v = c_1v_1 + c_2v_2 + \cdots + c_nv_n$$

其中 $(c_1, \ldots, c_n)$ 就是 $v$ 在这组基下的坐标。

```python
def compute_coordinates(vector, basis):
    """计算向量在给定基下的坐标
    
    Args:
        vector: 向量
        basis: 基向量列表
    
    Returns:
        坐标
    """
    import numpy as np
    
    # 构造基矩阵
    A = np.array(basis).T
    
    # 求解线性方程组获取坐标
    coordinates = np.linalg.solve(A, vector)
    
    return coordinates

# 示例
basis = [np.array([1, 1]), np.array([-1, 1])]
vector = np.array([2, 0])
coords = compute_coordinates(vector, basis)
print(f"坐标: {coords}")
```

### 8.4.2 坐标变换

当基变化时，向量的坐标也会相应变化。从基 $B$ 到基 $B'$ 的坐标变换矩阵为：

$$P_{B'\leftarrow B} = [b'_1 \cdots b'_n]^{-1}[b_1 \cdots b_n]$$

```python
def change_of_basis_matrix(old_basis, new_basis):
    """计算基变换矩阵
    
    Args:
        old_basis: 原基向量列表
        new_basis: 新基向量列表
    
    Returns:
        基变换矩阵
    """
    import numpy as np
    
    # 构造基矩阵
    B = np.array(old_basis).T
    B_prime = np.array(new_basis).T
    
    # 计算变换矩阵
    P = np.linalg.inv(B_prime) @ B
    
    return P

# 示例
old_basis = [np.array([1, 0]), np.array([0, 1])]
new_basis = [np.array([1, 1]), np.array([-1, 1])]
P = change_of_basis_matrix(old_basis, new_basis)
print(f"基变换矩阵:\n{P}")
```

## 8.5 应用

### 8.5.1 信号处理

向量空间在信号处理中的应用：

```python
def fourier_basis(n):
    """生成离散傅里叶基
    
    Args:
        n: 维数
    
    Returns:
        傅里叶基向量列表
    """
    import numpy as np
    
    basis = []
    t = np.linspace(0, 2*np.pi, n)
    
    # 常数项
    basis.append(np.ones(n) / np.sqrt(n))
    
    # 正弦和余弦项
    for k in range(1, n//2 + 1):
        # 余弦基
        basis.append(np.cos(k*t) * np.sqrt(2/n))
        # 正弦基
        if k < n//2:
            basis.append(np.sin(k*t) * np.sqrt(2/n))
    
    return basis

def analyze_signal(signal, basis):
    """在给定基下分析信号
    
    Args:
        signal: 信号数据
        basis: 基向量列表
    
    Returns:
        信号在各基向量上的投影系数
    """
    import numpy as np
    
    coefficients = []
    for b in basis:
        # 计算内积
        coeff = np.dot(signal, b)
        coefficients.append(coeff)
    
    return np.array(coefficients)

# 示例
n = 8
t = np.linspace(0, 2*np.pi, n)
signal = np.sin(2*t) + 0.5*np.cos(t)
basis = fourier_basis(n)
coeffs = analyze_signal(signal, basis)
print(f"信号分析系数: {coeffs}")
```

### 8.5.2 图像处理

使用向量空间进行图像压缩：

```python
def compress_image_svd(image, k):
    """使用SVD进行图像压缩
    
    Args:
        image: 图像数组
        k: 保留的奇异值个数
    
    Returns:
        压缩后的图像
    """
    import numpy as np
    
    # SVD分解
    U, S, Vh = np.linalg.svd(image)
    
    # 只保留前k个奇异值
    compressed = U[:,:k] @ np.diag(S[:k]) @ Vh[:k,:]
    
    # 计算压缩率
    original_size = image.shape[0] * image.shape[1]
    compressed_size = k * (image.shape[0] + image.shape[1] + 1)
    compression_ratio = compressed_size / original_size
    
    return compressed, compression_ratio

# 示例
from PIL import Image
import numpy as np

# 读取图像
img = Image.open('example.jpg').convert('L')
img_array = np.array(img)

# 压缩
k = 20
compressed, ratio = compress_image_svd(img_array, k)
print(f"压缩率: {ratio:.2%}")
```

## 练习

1. 证明：$\mathbb{R}^n$ 中的标准基是线性无关的。

2. 找出给定向量组的一组基，并计算其维数。

3. 实现一个函数，判断一个子集是否是子空间。

4. 编写程序计算向量在不同基下的坐标。

## 深入思考

1. 为什么基的概念在线性代数中如此重要？

2. 向量空间的维数与其几何性质有什么关系？

3. 在实际应用中，如何选择合适的基？

## 扩展阅读

1. [抽象向量空间理论](https://www.math.ucdavis.edu/~linear/linear-guest.pdf)
2. [向量空间在量子力学中的应用](https://physics.mit.edu/wp-content/uploads/2020/09/8.05_F13.pdf)
3. [信号处理中的基变换](https://www.sciencedirect.com/science/article/pii/S1063520306000242)

<style>
.vector-space-controls, .subspace-controls {
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

.vector-input input {
    margin: 2px;
}

.operation-input {
    margin-top: 10px;
}

.operation-input select {
    margin: 0 10px;
    padding: 2px;
}

.dimension-select {
    margin-top: 10px;
}

.dimension-select select {
    margin-left: 10px;
    padding: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .vector-space-controls, .subspace-controls {
        background: #2a2a2a;
    }
    
    .vector-input input {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
    
    .operation-input select,
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
        <a href="/books/linear-algebra/chapter7">← 上一章：线性方程组</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter9">下一章：内积空间 →</a>
    </div>
</div>
