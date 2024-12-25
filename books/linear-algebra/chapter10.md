---
layout: book-chapter
title: 线性变换
description: 探索线性变换的性质、矩阵表示、特征值和特征向量，以及它们在实际应用中的重要性
chapter_number: 10
---

# 线性变换

## 10.1 线性变换的定义与性质

线性变换是满足以下两个性质的函数 $T: V \rightarrow W$：

1. **加法保持性**：$T(u + v) = T(u) + T(v)$
2. **标量乘法保持性**：$T(cu) = cT(u)$

让我们通过可视化来理解线性变换：

<div class="visualization-container">
    <div class="visualization-title">线性变换可视化</div>
    <div id="linear-transform"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createLinearTransformViz('#linear-transform');
});
</script>

```python
def verify_linear_transform(T, u, v, c):
    """验证变换的线性性
    
    Args:
        T: 线性变换函数
        u: 向量1
        v: 向量2
        c: 标量
    
    Returns:
        验证结果字典
    """
    import numpy as np
    
    # 验证加法保持性
    additivity = np.allclose(
        T(u + v),
        T(u) + T(v)
    )
    
    # 验证标量乘法保持性
    homogeneity = np.allclose(
        T(c * u),
        c * T(u)
    )
    
    return {
        'additivity': additivity,
        'homogeneity': homogeneity
    }

def rotation_transform(theta):
    """创建旋转变换
    
    Args:
        theta: 旋转角度（弧度）
    
    Returns:
        旋转变换函数
    """
    import numpy as np
    
    def T(v):
        R = np.array([
            [np.cos(theta), -np.sin(theta)],
            [np.sin(theta), np.cos(theta)]
        ])
        return R @ v
    
    return T

# 示例
import numpy as np

theta = np.pi/4  # 45度
T = rotation_transform(theta)
u = np.array([1, 0])
v = np.array([0, 1])
c = 2

results = verify_linear_transform(T, u, v, c)
for property_name, satisfied in results.items():
    print(f"{property_name}: {'满足' if satisfied else '不满足'}")
```

## 10.2 矩阵表示

每个线性变换都可以用矩阵表示。矩阵的列就是基向量的像。

```python
def get_transform_matrix(T, basis):
    """获取线性变换的矩阵表示
    
    Args:
        T: 线性变换函数
        basis: 基向量列表
    
    Returns:
        变换矩阵
    """
    import numpy as np
    
    # 将基向量转换为列向量
    basis = [np.array(v).reshape(-1, 1) for v in basis]
    
    # 计算基向量的像
    images = [T(v) for v in basis]
    
    # 构造矩阵
    return np.hstack(images)

def apply_transform(A, v):
    """应用线性变换
    
    Args:
        A: 变换矩阵
        v: 向量
    
    Returns:
        变换后的向量
    """
    import numpy as np
    return A @ v

# 示例
# 创建旋转矩阵
theta = np.pi/4
R = np.array([
    [np.cos(theta), -np.sin(theta)],
    [np.sin(theta), np.cos(theta)]
])

# 应用变换
v = np.array([1, 0])
w = apply_transform(R, v)
print(f"原向量: {v}")
print(f"变换后: {w}")
```

## 10.3 特征值和特征向量

特征向量是在线性变换下方向保持不变的非零向量。

<div class="visualization-container">
    <div class="visualization-title">特征值和特征向量可视化</div>
    <div id="eigen"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createEigenViz('#eigen');
});
</script>

```python
def compute_eigenvalues(A):
    """计算特征值和特征向量
    
    Args:
        A: 矩阵
    
    Returns:
        特征值和特征向量
    """
    import numpy as np
    
    # 计算特征值和特征向量
    eigenvals, eigenvecs = np.linalg.eig(A)
    
    # 将特征向量归一化
    eigenvecs = eigenvecs / np.linalg.norm(eigenvecs, axis=0)
    
    return eigenvals, eigenvecs

def verify_eigenvector(A, v, lambda_):
    """验证特征向量
    
    Args:
        A: 矩阵
        v: 特征向量
        lambda_: 特征值
    
    Returns:
        是否为特征向量
    """
    import numpy as np
    
    # 验证 Av = λv
    return np.allclose(A @ v, lambda_ * v)

# 示例
A = np.array([
    [3, 1],
    [1, 3]
])

eigenvals, eigenvecs = compute_eigenvalues(A)
print("特征值:")
print(eigenvals)
print("\n特征向量:")
print(eigenvecs)

# 验证
for i in range(len(eigenvals)):
    is_eigenvector = verify_eigenvector(A, eigenvecs[:,i], eigenvals[i])
    print(f"\n特征对 {i+1} 验证: {'通过' if is_eigenvector else '失败'}")
```

## 10.4 对角化

如果矩阵 $A$ 有 $n$ 个线性无关的特征向量，那么 $A$ 可以对角化：

$$A = PDP^{-1}$$

其中 $D$ 是对角矩阵，对角线上是特征值，$P$ 的列是对应的特征向量。

```python
def diagonalize(A):
    """对角化矩阵
    
    Args:
        A: 矩阵
    
    Returns:
        (P, D, P_inv) 其中 A = PDP^(-1)
    """
    import numpy as np
    
    # 计算特征值和特征向量
    eigenvals, P = np.linalg.eig(A)
    
    # 构造对角矩阵
    D = np.diag(eigenvals)
    
    # 计算P的逆
    P_inv = np.linalg.inv(P)
    
    return P, D, P_inv

def verify_diagonalization(A, P, D, P_inv):
    """验证对角化结果
    
    Args:
        A: 原矩阵
        P: 特征向量矩阵
        D: 对角矩阵
        P_inv: P的逆矩阵
    
    Returns:
        验证结果
    """
    import numpy as np
    
    # 验证 A = PDP^(-1)
    return np.allclose(A, P @ D @ P_inv)

# 示例
A = np.array([
    [3, 1],
    [1, 3]
])

P, D, P_inv = diagonalize(A)
print("特征向量矩阵 P:")
print(P)
print("\n对角矩阵 D:")
print(D)
print("\n验证结果:", verify_diagonalization(A, P, D, P_inv))
```

## 10.5 应用

### 10.5.1 主成分分析（PCA）

PCA是线性变换的一个重要应用，它可以用来降维和数据压缩。

```python
def pca(X, n_components):
    """主成分分析
    
    Args:
        X: 数据矩阵，每行是一个样本
        n_components: 主成分个数
    
    Returns:
        降维后的数据
    """
    import numpy as np
    
    # 中心化
    X_centered = X - np.mean(X, axis=0)
    
    # 计算协方差矩阵
    cov = np.cov(X_centered.T)
    
    # 计算特征值和特征向量
    eigenvals, eigenvecs = np.linalg.eig(cov)
    
    # 按特征值大小排序
    idx = eigenvals.argsort()[::-1]
    eigenvals = eigenvals[idx]
    eigenvecs = eigenvecs[:,idx]
    
    # 选择前n_components个特征向量
    components = eigenvecs[:,:n_components]
    
    # 投影
    return X_centered @ components

# 示例：降维
np.random.seed(42)
X = np.random.randn(100, 10)  # 100个10维样本
X_reduced = pca(X, n_components=2)
print(f"原始数据维度: {X.shape}")
print(f"降维后维度: {X_reduced.shape}")
```

### 10.5.2 图像处理

线性变换在图像处理中有广泛应用。

```python
def image_transform(image, transform_matrix):
    """对图像应用线性变换
    
    Args:
        image: 图像数组
        transform_matrix: 变换矩阵
    
    Returns:
        变换后的图像
    """
    import numpy as np
    from scipy import ndimage
    
    # 获取图像中心
    center = np.array(image.shape) / 2
    
    # 应用变换
    return ndimage.affine_transform(
        image,
        transform_matrix,
        offset=center - np.dot(transform_matrix, center)
    )

# 示例：旋转图像
def rotate_image(image, angle_degrees):
    """旋转图像
    
    Args:
        image: 图像数组
        angle_degrees: 旋转角度
    
    Returns:
        旋转后的图像
    """
    import numpy as np
    
    # 转换为弧度
    theta = np.radians(angle_degrees)
    
    # 构造旋转矩阵
    c, s = np.cos(theta), np.sin(theta)
    R = np.array([[c, -s],
                  [s, c]])
    
    return image_transform(image, R)

# 使用示例
# image = load_image("example.png")
# rotated = rotate_image(image, 45)
# save_image(rotated, "rotated.png")
```

## 练习

1. 证明：如果 $T$ 是线性变换，那么 $T(0) = 0$。

2. 找出给定矩阵的所有特征值和特征向量。

3. 实现幂迭代法求最大特征值。

4. 使用线性变换实现图像的各种变换效果。

## 深入思考

1. 为什么线性变换可以用矩阵表示？

2. 特征值和特征向量的几何意义是什么？

3. 对角化在实际应用中有什么优势？

## 扩展阅读

1. [线性变换的几何理解](https://www.math.brown.edu/~treil/papers/LADW/LADW.html)
2. [特征值算法](https://www.cs.cornell.edu/~bindel/class/cs6210-f09/lec18.pdf)
3. [PCA的数学原理](https://arxiv.org/pdf/1404.1100.pdf)

<style>
.transformation-controls, .eigen-controls {
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

.preset-transforms, .preset-matrices {
    margin-top: 10px;
}

.preset-transforms select,
.preset-matrices select {
    margin-top: 5px;
    padding: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .transformation-controls,
    .eigen-controls {
        background: #2a2a2a;
    }
    
    .matrix-input input {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
    
    .preset-transforms select,
    .preset-matrices select {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
}
</style>

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/linear-algebra/chapter9">← 上一章：内积空间</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter11">下一章：矩阵分解 →</a>
    </div>
</div>
