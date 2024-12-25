---
layout: book-chapter
title: Transformer 架构
description: 深入理解 Transformer 架构及其工作原理
chapter_number: 2
---

# Transformer 架构

## 2.1 为什么需要 Transformer？

在 Transformer 出现之前，RNN（循环神经网络）和 LSTM（长短期记忆网络）是处理序列数据的主要选择。然而，这些模型存在以下问题：

1. **串行计算**：无法并行处理序列
2. **长距离依赖**：难以捕捉远距离的关系
3. **梯度问题**：容易出现梯度消失/爆炸

Transformer 通过自注意力机制解决了这些问题。

## 2.2 Transformer 整体架构

Transformer 采用编码器-解码器（Encoder-Decoder）架构：

```
输入序列 → [编码器] → 上下文向量 → [解码器] → 输出序列
```

### 2.2.1 核心组件

1. **多头自注意力（Multi-Head Self-Attention）**
2. **位置编码（Positional Encoding）**
3. **前馈神经网络（Feed-Forward Network）**
4. **残差连接（Residual Connection）**
5. **层归一化（Layer Normalization）**

## 2.3 自注意力机制

### 2.3.1 计算步骤

1. **计算查询（Query）、键（Key）和值（Value）**：
   
   $Q = XW^Q, K = XW^K, V = XW^V$

2. **计算注意力权重**：

   $\text{Attention}(Q,K,V) = \text{softmax}(\frac{QK^T}{\sqrt{d_k}})V$

   其中 $d_k$ 是键向量的维度。

### 2.3.2 多头注意力

多头注意力允许模型关注不同的表示子空间：

$\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1,...,\text{head}_h)W^O$

其中每个头的计算为：

$\text{head}_i = \text{Attention}(QW^Q_i,KW^K_i,VW^V_i)$

## 2.4 位置编码

由于自注意力机制本身不包含位置信息，需要添加位置编码：

$PE_{(pos,2i)} = \sin(pos/10000^{2i/d_{model}})$
$PE_{(pos,2i+1)} = \cos(pos/10000^{2i/d_{model}})$

其中：
- pos 是位置
- i 是维度
- $d_{model}$ 是模型维度

## 2.5 前馈神经网络

每个编码器和解码器层都包含一个前馈神经网络：

$FFN(x) = \max(0, xW_1 + b_1)W_2 + b_2$

这是一个包含两个线性变换和一个 ReLU 激活函数的前馈网络。

## 2.6 规范化和残差连接

### 2.6.1 层归一化

对每一层的输出进行归一化：

$\text{LayerNorm}(x) = \gamma \odot \frac{x-\mu}{\sqrt{\sigma^2 + \epsilon}} + \beta$

其中：
- $\mu$ 是均值
- $\sigma^2$ 是方差
- $\gamma, \beta$ 是可学习参数

### 2.6.2 残差连接

每个子层的输出：

$\text{Output} = \text{LayerNorm}(x + \text{Sublayer}(x))$

## 2.7 训练技巧

1. **Warm-up 学习率调度**：
   
   $lr = d_{model}^{-0.5} \cdot \min(step^{-0.5}, step \cdot warmup\_steps^{-1.5})$

2. **标签平滑（Label Smoothing）**
3. **Dropout**

## 练习与思考

1. 为什么在注意力计算中需要除以 $\sqrt{d_k}$？
2. 多头注意力相比单头注意力有什么优势？
3. 位置编码为什么选择正弦和余弦函数？

## 代码实现

在下一章中，我们将用 PyTorch 实现一个简单的 Transformer 模型。

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/llm/chapter1">← 上一章：自然语言处理基础</a>
    </div>
    <div class="next">
        <a href="/books/llm/chapter3">下一章：PyTorch 实现 →</a>
    </div>
</div>
