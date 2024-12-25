---
layout: book-chapter
title: 矩阵与线性变换
description: 理解矩阵作为线性变换的本质，掌握矩阵运算和特征值分析
chapter_number: 2
---

# 矩阵与线性变换

## 2.1 线性变换的本质

线性变换是保持向量加法和标量乘法的变换，即对于任意向量 $\vec{v}$, $\vec{w}$ 和标量 $c$：

1. $T(\vec{v} + \vec{w}) = T(\vec{v}) + T(\vec{w})$
2. $T(c\vec{v}) = cT(\vec{v})$

<div class="visualization-container">
    <div class="visualization-title">线性变换的可视化</div>
    <div id="matrix-transformation"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createMatrixTransformation('#matrix-transformation');
});
</script>

### 2.1.1 矩阵作为线性变换

在二维空间中，任何线性变换都可以用一个 2×2 矩阵表示：

$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}$

矩阵的列向量表示基向量变换后的位置：
- 第一列 $(a,c)^T$ 是 $(1,0)^T$ 变换后的位置
- 第二列 $(b,d)^T$ 是 $(0,1)^T$ 变换后的位置

### 2.1.2 常见的线性变换

1. **旋转**：
   $\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$

2. **缩放**：
   $\begin{pmatrix} s_x & 0 \\ 0 & s_y \end{pmatrix}$

3. **剪切**：
   $\begin{pmatrix} 1 & k \\ 0 & 1 \end{pmatrix}$

## 2.2 矩阵运算

### 2.2.1 矩阵乘法

矩阵乘法代表线性变换的复合：

$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} e & f \\ g & h \end{pmatrix} = \begin{pmatrix} ae+bg & af+bh \\ ce+dg & cf+dh \end{pmatrix}$

```python
import numpy as np

def matrix_multiply(A, B):
    """矩阵乘法
    
    Args:
        A: 第一个矩阵
        B: 第二个矩阵
    
    Returns:
        矩阵乘积 AB
    """
    return np.dot(A, B)

# 示例：旋转90度后放大2倍
rotation = np.array([[0, -1], [1, 0]])  # 90度旋转
scaling = np.array([[2, 0], [0, 2]])    # 放大2倍
result = matrix_multiply(scaling, rotation)
print(f"变换矩阵:\n{result}")
```

### 2.2.2 矩阵的逆

如果矩阵 A 是可逆的，那么：
- $AA^{-1} = A^{-1}A = I$
- 几何意义：变换的"撤销"

```python
def matrix_inverse(A):
    """计算矩阵的逆
    
    Args:
        A: 输入矩阵
    
    Returns:
        A的逆矩阵
    """
    return np.linalg.inv(A)

# 示例
A = np.array([[2, 1], [1, 1]])
A_inv = matrix_inverse(A)
print(f"原矩阵:\n{A}")
print(f"逆矩阵:\n{A_inv}")
print(f"验证 AA^(-1) = I:\n{np.dot(A, A_inv)}")
```

## 2.3 特征值和特征向量

### 2.3.1 定义

如果存在非零向量 $\vec{v}$ 和标量 $\lambda$，使得：

$A\vec{v} = \lambda\vec{v}$

则称 $\lambda$ 为矩阵 A 的特征值，$\vec{v}$ 为对应的特征向量。

<div class="visualization-container">
    <div class="visualization-title">特征向量的可视化</div>
    <div id="eigen-demo"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    LinearAlgebraViz.createEigenDemo('#eigen-demo');
});
</script>

### 2.3.2 计算特征值和特征向量

对于2×2矩阵，特征值可以通过求解特征方程获得：

$det(A - \lambda I) = 0$

```python
def find_eigenvalues(A):
    """计算矩阵的特征值和特征向量
    
    Args:
        A: 输入矩阵
    
    Returns:
        eigenvalues: 特征值
        eigenvectors: 特征向量
    """
    eigenvalues, eigenvectors = np.linalg.eig(A)
    return eigenvalues, eigenvectors

# 示例
A = np.array([[2, 1], [1, 2]])
eigenvalues, eigenvectors = find_eigenvalues(A)
print(f"特征值:\n{eigenvalues}")
print(f"特征向量:\n{eigenvectors}")
```

### 2.3.3 应用

特征值和特征向量在多个领域都有重要应用：

1. **主成分分析 (PCA)**：
   - 数据降维
   - 特征提取

2. **图像处理**：
   - 图像压缩
   - 人脸识别

3. **网页排名**：
   - Google的PageRank算法

## 2.4 实践应用

### 2.4.1 图像处理中的线性变换

```python
from PIL import Image
import numpy as np

def transform_image(image_array, matrix):
    """对图像应用线性变换
    
    Args:
        image_array: 图像数组
        matrix: 变换矩阵
    
    Returns:
        变换后的图像数组
    """
    height, width = image_array.shape[:2]
    result = np.zeros_like(image_array)
    
    for y in range(height):
        for x in range(width):
            # 将像素坐标转换为向量
            vec = np.array([x - width/2, y - height/2])
            # 应用变换
            transformed = np.dot(matrix, vec)
            # 转回像素坐标
            new_x = int(transformed[0] + width/2)
            new_y = int(transformed[1] + height/2)
            
            # 检查边界
            if 0 <= new_x < width and 0 <= new_y < height:
                result[new_y, new_x] = image_array[y, x]
    
    return result

# 示例：旋转图像
theta = np.pi/4  # 45度
rotation_matrix = np.array([
    [np.cos(theta), -np.sin(theta)],
    [np.sin(theta), np.cos(theta)]
])
```

### 2.4.2 机器学习中的应用

```python
from sklearn.decomposition import PCA

def reduce_dimensions(data, n_components):
    """使用PCA降维
    
    Args:
        data: 输入数据
        n_components: 目标维度
    
    Returns:
        降维后的数据
    """
    pca = PCA(n_components=n_components)
    return pca.fit_transform(data)

# 示例
data = np.random.randn(100, 10)  # 100个10维数据点
reduced_data = reduce_dimensions(data, 2)  # 降到2维
print(f"原始数据形状: {data.shape}")
print(f"降维后数据形状: {reduced_data.shape}")
```

## 练习

1. 计算矩阵 $A = \begin{pmatrix} 2 & 1 \\ 1 & 3 \end{pmatrix}$ 的特征值和特征向量。

2. 给定向量 $\vec{v} = \begin{pmatrix} 1 \\ 2 \end{pmatrix}$，计算其经过以下变换后的结果：
   - 顺时针旋转45度
   - 在x方向拉伸2倍，y方向压缩0.5倍
   - 沿y轴剪切，剪切因子为1

3. 实现一个函数，将图像旋转任意角度。

4. 使用PCA对一个高维数据集进行降维，并可视化结果。

## 深入思考

1. 为什么矩阵乘法不满足交换律？从几何角度解释。

2. 并非所有矩阵都有特征值和特征向量，请举例说明。

3. 在什么情况下，一个线性变换会将空间"压缩"到更低的维度？

## 扩展阅读

1. [线性代数的几何意义](https://www.3blue1brown.com/topics/linear-algebra)
2. [特征值和特征向量的应用](https://www.cs.cornell.edu/courses/cs4780/2018fa/lectures/lecturenote12.html)
3. [PCA的数学原理](https://arxiv.org/abs/1404.1100)

<style>
.matrix-controls {
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
}

.matrix-controls label {
    font-weight: bold;
}

.matrix-controls input[type="number"] {
    margin: 5px;
}

.preset-buttons {
    margin-top: 10px;
}

.preset-buttons button {
    margin: 5px;
    padding: 5px 10px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.preset-buttons button:hover {
    background: #45a049;
}

.eigen-controls {
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
}

.eigen-controls input[type="range"] {
    width: 200px;
    margin-left: 10px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .matrix-controls, .eigen-controls {
        background: #2a2a2a;
    }
    
    .preset-buttons button {
        background: #388E3C;
    }
    
    .preset-buttons button:hover {
        background: #2E7D32;
    }
}
</style>

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/linear-algebra/chapter1">← 上一章：向量和线性组合</a>
    </div>
    <div class="next">
        <a href="/books/linear-algebra/chapter3">下一章：向量空间与子空间 →</a>
    </div>
</div>
