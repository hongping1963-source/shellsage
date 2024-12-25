---
layout: book-chapter
title: 矩阵分解
description: 探索矩阵分解的各种方法，包括LU分解、QR分解和奇异值分解，以及它们在实际应用中的重要性
chapter_number: 11
---

# 矩阵分解

## 11.1 LU分解

LU分解将矩阵分解为一个下三角矩阵L和一个上三角矩阵U的乘积：$A = LU$

<div class="visualization-container">
    <div class="visualization-title">LU分解可视化</div>
    <div id="lu-decomp"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createLUDecompViz('#lu-decomp');
});
</script>

```python
def lu_decomposition(A):
    """LU分解
    
    Args:
        A: 输入矩阵
    
    Returns:
        (L, U) 下三角矩阵和上三角矩阵
    """
    import numpy as np
    
    n = len(A)
    L = np.zeros((n, n))
    U = np.array(A, copy=True)
    
    # 初始化L的对角线为1
    np.fill_diagonal(L, 1)
    
    for i in range(n):
        for j in range(i + 1, n):
            factor = U[j,i] / U[i,i]
            L[j,i] = factor
            U[j,i:] -= factor * U[i,i:]
    
    return L, U

def solve_lu(L, U, b):
    """使用LU分解求解线性方程组
    
    Args:
        L: 下三角矩阵
        U: 上三角矩阵
        b: 右侧向量
    
    Returns:
        解向量
    """
    import numpy as np
    
    # 前向替换求解Ly = b
    n = len(b)
    y = np.zeros(n)
    for i in range(n):
        y[i] = b[i] - np.dot(L[i,:i], y[:i])
    
    # 后向替换求解Ux = y
    x = np.zeros(n)
    for i in range(n-1, -1, -1):
        x[i] = (y[i] - np.dot(U[i,i+1:], x[i+1:])) / U[i,i]
    
    return x

# 示例
A = np.array([
    [2, 1],
    [1, 3]
])
b = np.array([4, 5])

L, U = lu_decomposition(A)
x = solve_lu(L, U, b)

print("L矩阵:")
print(L)
print("\nU矩阵:")
print(U)
print("\n解向量:")
print(x)
print("\n验证:")
print(f"Ax = {A @ x}")
print(f"b = {b}")
```

## 11.2 QR分解

QR分解将矩阵分解为一个正交矩阵Q和一个上三角矩阵R的乘积：$A = QR$

<div class="visualization-container">
    <div class="visualization-title">QR分解可视化</div>
    <div id="qr-decomp"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createQRDecompViz('#qr-decomp');
});
</script>

```python
def qr_decomposition(A):
    """QR分解（使用Gram-Schmidt正交化）
    
    Args:
        A: 输入矩阵
    
    Returns:
        (Q, R) 正交矩阵和上三角矩阵
    """
    import numpy as np
    
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    
    # Gram-Schmidt过程
    for j in range(n):
        v = A[:,j].copy()
        
        # 减去在前面向量上的投影
        for i in range(j):
            R[i,j] = np.dot(Q[:,i], A[:,j])
            v -= R[i,j] * Q[:,i]
        
        # 计算范数
        R[j,j] = np.linalg.norm(v)
        
        # 归一化
        if R[j,j] > 0:
            Q[:,j] = v / R[j,j]
    
    return Q, R

def solve_qr(Q, R, b):
    """使用QR分解求解最小二乘问题
    
    Args:
        Q: 正交矩阵
        R: 上三角矩阵
        b: 右侧向量
    
    Returns:
        最小二乘解
    """
    import numpy as np
    
    # 计算Q^T b
    y = Q.T @ b
    
    # 后向替换求解Rx = y
    n = R.shape[1]
    x = np.zeros(n)
    for i in range(n-1, -1, -1):
        x[i] = (y[i] - np.dot(R[i,i+1:], x[i+1:])) / R[i,i]
    
    return x

# 示例：最小二乘拟合
import numpy as np

# 生成数据
X = np.array([
    [1, 0],
    [1, 1],
    [1, 2]
])
y = np.array([1, 2, 4])

# QR分解
Q, R = qr_decomposition(X)
beta = solve_qr(Q, R, y)

print("Q矩阵:")
print(Q)
print("\nR矩阵:")
print(R)
print("\n回归系数:")
print(beta)
print("\n拟合值:")
print(X @ beta)
```

## 11.3 特征值分解

特征值分解将矩阵分解为：$A = P\Lambda P^{-1}$，其中 $\Lambda$ 是对角矩阵，对角线上是特征值。

```python
def eigen_decomposition(A):
    """特征值分解
    
    Args:
        A: 输入矩阵
    
    Returns:
        (eigenvals, eigenvecs) 特征值和特征向量
    """
    import numpy as np
    
    # 计算特征值和特征向量
    eigenvals, eigenvecs = np.linalg.eig(A)
    
    # 构造对角矩阵
    D = np.diag(eigenvals)
    
    # 验证分解
    A_reconstructed = eigenvecs @ D @ np.linalg.inv(eigenvecs)
    
    return eigenvals, eigenvecs, D, A_reconstructed

# 示例
A = np.array([
    [3, 1],
    [1, 3]
])

eigenvals, eigenvecs, D, A_reconstructed = eigen_decomposition(A)
print("特征值:")
print(eigenvals)
print("\n特征向量:")
print(eigenvecs)
print("\n对角矩阵:")
print(D)
print("\n重构矩阵:")
print(A_reconstructed)
print("\n原始矩阵:")
print(A)
```

## 11.4 奇异值分解（SVD）

SVD将矩阵分解为：$A = U\Sigma V^T$，其中 $U$ 和 $V$ 是正交矩阵，$\Sigma$ 是对角矩阵。

```python
def singular_value_decomposition(A):
    """奇异值分解
    
    Args:
        A: 输入矩阵
    
    Returns:
        (U, S, Vh) 左奇异向量、奇异值和右奇异向量
    """
    import numpy as np
    
    # 计算SVD
    U, s, Vh = np.linalg.svd(A)
    
    # 构造对角矩阵Σ
    m, n = A.shape
    Sigma = np.zeros((m, n))
    np.fill_diagonal(Sigma, s)
    
    # 验证分解
    A_reconstructed = U @ Sigma @ Vh
    
    return U, s, Vh, Sigma, A_reconstructed

def low_rank_approximation(A, k):
    """使用SVD进行低秩近似
    
    Args:
        A: 输入矩阵
        k: 保留的奇异值个数
    
    Returns:
        近似矩阵
    """
    import numpy as np
    
    U, s, Vh = np.linalg.svd(A)
    
    # 只保留前k个奇异值
    Sigma_k = np.zeros((A.shape[0], A.shape[1]))
    np.fill_diagonal(Sigma_k, s[:k])
    
    # 计算近似矩阵
    A_k = U @ Sigma_k @ Vh
    
    # 计算近似误差
    error = np.linalg.norm(A - A_k, 'fro')
    
    return A_k, error

# 示例
A = np.array([
    [4, 0],
    [3, -5]
])

# SVD分解
U, s, Vh, Sigma, A_reconstructed = singular_value_decomposition(A)
print("左奇异向量 U:")
print(U)
print("\n奇异值:")
print(s)
print("\n右奇异向量 V^T:")
print(Vh)

# 低秩近似
k = 1
A_k, error = low_rank_approximation(A, k)
print(f"\n秩{k}近似:")
print(A_k)
print(f"Frobenius范数误差: {error}")
```

## 11.5 应用

### 11.5.1 图像压缩

使用SVD进行图像压缩：

```python
def compress_image(image, k):
    """使用SVD压缩图像
    
    Args:
        image: 图像数组
        k: 保留的奇异值个数
    
    Returns:
        压缩后的图像
    """
    import numpy as np
    
    # 对每个颜色通道进行SVD
    compressed_channels = []
    for channel in range(3):  # RGB
        # SVD分解
        U, s, Vh = np.linalg.svd(image[:,:,channel])
        
        # 只保留前k个奇异值
        compressed = U[:,:k] @ np.diag(s[:k]) @ Vh[:k,:]
        compressed_channels.append(compressed)
    
    # 合并通道
    compressed_image = np.stack(compressed_channels, axis=2)
    
    # 确保像素值在[0, 255]范围内
    compressed_image = np.clip(compressed_image, 0, 255)
    
    # 计算压缩率
    original_size = image.shape[0] * image.shape[1] * 3
    compressed_size = k * (image.shape[0] + image.shape[1] + 1) * 3
    compression_ratio = compressed_size / original_size
    
    return compressed_image.astype(np.uint8), compression_ratio

# 示例
from PIL import Image
import numpy as np

# 读取图像
image = np.array(Image.open('example.jpg'))

# 压缩
k = 50  # 保留的奇异值个数
compressed, ratio = compress_image(image, k)
print(f"压缩率: {ratio:.2%}")

# 保存结果
Image.fromarray(compressed).save('compressed.jpg')
```

### 11.5.2 主成分分析（PCA）

使用SVD实现PCA：

```python
def pca_svd(X, n_components):
    """使用SVD实现PCA
    
    Args:
        X: 数据矩阵，每行是一个样本
        n_components: 主成分个数
    
    Returns:
        降维后的数据
    """
    import numpy as np
    
    # 中心化
    X_centered = X - np.mean(X, axis=0)
    
    # SVD分解
    U, s, Vh = np.linalg.svd(X_centered)
    
    # 选择前n_components个主成分
    components = Vh[:n_components]
    
    # 投影
    X_transformed = X_centered @ components.T
    
    # 计算解释方差比
    explained_variance_ratio = s[:n_components]**2 / np.sum(s**2)
    
    return X_transformed, components, explained_variance_ratio

# 示例：降维
np.random.seed(42)
X = np.random.randn(100, 10)  # 100个10维样本

# PCA降维
n_components = 2
X_transformed, components, explained_variance_ratio = pca_svd(X, n_components)

print(f"降维后数据形状: {X_transformed.shape}")
print("\n主成分:")
print(components)
print("\n解释方差比:")
print(explained_variance_ratio)
```

## 练习

1. 证明：如果A是对称矩阵，那么它的特征向量是正交的。

2. 实现幂迭代法计算最大特征值和对应的特征向量。

3. 使用QR分解实现特征值算法。

4. 实现截断SVD算法。

## 深入思考

1. 为什么QR分解在最小二乘问题中比LU分解更稳定？

2. SVD和特征值分解有什么关系？

3. 在什么情况下应该选择使用哪种矩阵分解？

## 扩展阅读

1. [数值线性代数](https://www.cs.cornell.edu/~bindel/class/cs6210-f12/)
2. [矩阵分解的应用](https://arxiv.org/pdf/1607.00404.pdf)
3. [SVD的几何解释](https://www.ams.org/journals/bull/1995-32-02/S0273-0979-1995-00563-1/)

<style>
.lu-controls, .qr-controls {
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
    .lu-controls,
    .qr-controls {
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
        <a href="/books/linear-algebra/chapter10">← 上一章：线性变换</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter12">下一章：向量微积分 →</a>
    </div>
</div>
