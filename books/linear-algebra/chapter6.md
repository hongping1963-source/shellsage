---
layout: book-chapter
title: 奇异值分解
description: 探索矩阵的奇异值分解及其在数据压缩、降维等领域的应用
chapter_number: 6
---

# 奇异值分解

## 6.1 基本概念

奇异值分解（SVD）是一种将矩阵分解为三个特殊矩阵乘积的方法：

$A = U\Sigma V^T$

其中：
- $U$ 是左奇异向量矩阵（正交矩阵）
- $\Sigma$ 是奇异值对角矩阵
- $V^T$ 是右奇异向量矩阵的转置（也是正交矩阵）

<div class="visualization-container">
    <div class="visualization-title">SVD分解可视化</div>
    <div id="svd"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createSVDViz('#svd');
});
</script>

```python
def compute_svd(A):
    """计算矩阵的SVD分解
    
    Args:
        A: numpy矩阵
    
    Returns:
        U: 左奇异向量矩阵
        S: 奇异值
        Vh: 右奇异向量矩阵的转置
    """
    U, S, Vh = np.linalg.svd(A)
    return U, S, Vh

# 示例
A = np.array([[2, 1],
              [1, 2]])
U, S, Vh = compute_svd(A)
print(f"左奇异向量矩阵 U:\n{U}")
print(f"奇异值 S:\n{S}")
print(f"右奇异向量矩阵的转置 Vh:\n{Vh}")
```

### 6.1.1 几何解释

SVD可以看作是三个连续的线性变换：
1. $V^T$：坐标旋转
2. $\Sigma$：沿主轴方向的缩放
3. $U$：再次旋转

```python
def visualize_svd_steps(A):
    """可视化SVD的几何步骤
    
    Args:
        A: 2x2矩阵
    """
    U, S, Vh = np.linalg.svd(A)
    
    # 创建单位圆上的点
    theta = np.linspace(0, 2*np.pi, 100)
    circle = np.array([np.cos(theta), np.sin(theta)])
    
    # 1. 应用V^T
    step1 = Vh @ circle
    
    # 2. 应用Σ
    step2 = np.diag(S) @ step1
    
    # 3. 应用U
    step3 = U @ step2
    
    return {
        'original': circle,
        'step1': step1,
        'step2': step2,
        'final': step3
    }

# 示例
A = np.array([[2, 1],
              [1, 2]])
steps = visualize_svd_steps(A)
```

## 6.2 SVD的性质

### 6.2.1 奇异值的性质

1. 奇异值总是非负的
2. 通常按降序排列
3. 奇异值的平方是 $A^TA$ 的特征值

```python
def svd_properties(A):
    """验证SVD的一些性质
    
    Args:
        A: numpy矩阵
    
    Returns:
        性质验证结果
    """
    U, S, Vh = np.linalg.svd(A)
    
    # 验证奇异值非负
    is_nonnegative = np.all(S >= 0)
    
    # 验证奇异值降序排列
    is_descending = np.all(S[:-1] >= S[1:])
    
    # 验证与特征值的关系
    eigenvals = np.linalg.eigvals(A.T @ A)
    eigenvals = np.sort(eigenvals)[::-1]
    singular_squared = S**2
    
    return {
        'nonnegative': is_nonnegative,
        'descending': is_descending,
        'singular_values': S,
        'eigenvalues_sqrt': np.sqrt(eigenvals)
    }

# 示例
A = np.array([[2, 1],
              [1, 2]])
props = svd_properties(A)
print(f"奇异值: {props['singular_values']}")
print(f"特征值平方根: {props['eigenvalues_sqrt']}")
```

### 6.2.2 正交性

$U$ 和 $V$ 的列向量都是正交的：

```python
def verify_orthogonality(A):
    """验证SVD分解得到的矩阵正交性
    
    Args:
        A: numpy矩阵
    
    Returns:
        U和V的正交性验证结果
    """
    U, _, Vh = np.linalg.svd(A)
    V = Vh.T
    
    # 验证U的正交性
    U_orthogonal = np.allclose(U.T @ U, np.eye(U.shape[1]))
    
    # 验证V的正交性
    V_orthogonal = np.allclose(V.T @ V, np.eye(V.shape[1]))
    
    return {
        'U_orthogonal': U_orthogonal,
        'V_orthogonal': V_orthogonal
    }

# 示例
A = np.array([[2, 1],
              [1, 2]])
ortho = verify_orthogonality(A)
print(f"U是否正交: {ortho['U_orthogonal']}")
print(f"V是否正交: {ortho['V_orthogonal']}")
```

## 6.3 矩阵近似

SVD最重要的应用之一是矩阵的低秩近似。

<div class="visualization-container">
    <div class="visualization-title">低秩近似可视化</div>
    <div id="svd-approx"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createSVDApplicationViz('#svd-approx');
});
</script>

### 6.3.1 截断SVD

保留前k个最大的奇异值及其对应的奇异向量：

```python
def truncated_svd(A, k):
    """计算截断SVD
    
    Args:
        A: 输入矩阵
        k: 保留的奇异值个数
    
    Returns:
        近似矩阵
    """
    U, S, Vh = np.linalg.svd(A)
    
    # 只保留前k个奇异值
    S_k = np.zeros_like(S)
    S_k[:k] = S[:k]
    
    # 重构矩阵
    return U @ np.diag(S_k) @ Vh

# 示例
A = np.random.randn(10, 10)
A_approx = truncated_svd(A, 2)
error = np.linalg.norm(A - A_approx, 'fro')
print(f"Frobenius范数误差: {error}")
```

### 6.3.2 Eckart-Young定理

在Frobenius范数下，截断SVD给出了最优的低秩近似。

```python
def compare_approximations(A, k):
    """比较不同低秩近似方法
    
    Args:
        A: 输入矩阵
        k: 目标秩
    
    Returns:
        不同方法的近似误差
    """
    # SVD近似
    svd_approx = truncated_svd(A, k)
    svd_error = np.linalg.norm(A - svd_approx, 'fro')
    
    # 随机低秩矩阵
    n_trials = 100
    random_errors = []
    for _ in range(n_trials):
        R = np.random.randn(A.shape[0], k) @ np.random.randn(k, A.shape[1])
        error = np.linalg.norm(A - R, 'fro')
        random_errors.append(error)
    
    return {
        'svd_error': svd_error,
        'random_min_error': min(random_errors),
        'random_avg_error': np.mean(random_errors)
    }

# 示例
A = np.random.randn(10, 10)
results = compare_approximations(A, 2)
print(f"SVD近似误差: {results['svd_error']}")
print(f"随机近似最小误差: {results['random_min_error']}")
```

## 6.4 应用

### 6.4.1 图像压缩

使用SVD压缩图像：

```python
def compress_image(image, k):
    """使用SVD压缩图像
    
    Args:
        image: 灰度图像数组
        k: 保留的奇异值个数
    
    Returns:
        压缩后的图像
    """
    U, S, Vh = np.linalg.svd(image)
    
    # 计算压缩率
    original_size = image.shape[0] * image.shape[1]
    compressed_size = k * (image.shape[0] + image.shape[1] + 1)
    compression_ratio = compressed_size / original_size
    
    # 重构图像
    compressed = U[:, :k] @ np.diag(S[:k]) @ Vh[:k, :]
    
    return compressed, compression_ratio

# 示例
from PIL import Image
import numpy as np

# 读取图像
img = Image.open('example.jpg').convert('L')
img_array = np.array(img)

# 压缩
k = 50
compressed, ratio = compress_image(img_array, k)
print(f"压缩率: {ratio:.2%}")
```

### 6.4.2 推荐系统

使用SVD进行协同过滤：

```python
def collaborative_filtering(ratings, k):
    """使用SVD进行协同过滤
    
    Args:
        ratings: 用户-物品评分矩阵
        k: 潜在特征数
    
    Returns:
        预测的评分矩阵
    """
    # 处理缺失值
    mask = ~np.isnan(ratings)
    mean_ratings = np.nanmean(ratings, axis=1)
    normalized = ratings - mean_ratings[:, np.newaxis]
    normalized[~mask] = 0
    
    # SVD分解
    U, S, Vh = np.linalg.svd(normalized)
    
    # 重构评分矩阵
    predicted = mean_ratings[:, np.newaxis] + U[:, :k] @ np.diag(S[:k]) @ Vh[:k, :]
    
    return predicted

# 示例
ratings = np.array([
    [5, 3, np.nan, 1],
    [4, np.nan, np.nan, 1],
    [1, 1, np.nan, 5],
    [1, np.nan, 4, 4]
])

predicted = collaborative_filtering(ratings, k=2)
print("预测评分矩阵:")
print(predicted)
```

## 练习

1. 证明：矩阵的奇异值是唯一的，但奇异向量可能不唯一。

2. 实现一个函数，使用SVD对彩色图像进行压缩。

3. 编写代码验证Eckart-Young定理：
   - 生成一个随机矩阵
   - 计算其不同秩的最优近似
   - 比较与其他低秩近似方法的误差

4. 使用SVD实现一个简单的人脸识别系统。

## 深入思考

1. SVD和特征值分解有什么关系？

2. 为什么SVD在数据压缩中如此有效？

3. 在机器学习中，SVD和PCA的关系是什么？

## 扩展阅读

1. [SVD的数值计算方法](https://www.cs.utexas.edu/users/flame/laff/alaff/chapter-svd.pdf)
2. [SVD在推荐系统中的应用](https://www.cs.carleton.edu/cs_comps/0607/recommend/recommender/svd.html)
3. [图像压缩中的SVD优化](https://www.math.ucla.edu/~tao/preprints/matrix.pdf)

<style>
.svd-controls, .svd-app-controls {
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

.rank-select {
    margin-top: 10px;
}

.rank-select select {
    margin-left: 10px;
    padding: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .svd-controls, .svd-app-controls {
        background: #2a2a2a;
    }
    
    .matrix-input input {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
    
    .rank-select select {
        background: #333;
        color: #fff;
        border: 1px solid #555;
    }
}
</style>

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/linear-algebra/chapter5">← 上一章：特征值与特征向量</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter7">下一章：线性方程组 →</a>
    </div>
</div>
