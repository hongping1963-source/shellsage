---
layout: book-chapter
title: PyTorch 实现 Transformer
description: 使用 PyTorch 实现 Transformer 模型的核心组件
chapter_number: 3
---

# PyTorch 实现 Transformer

在本章中，我们将使用 PyTorch 实现 Transformer 的核心组件。我们将逐步构建每个模块，并最终组装成完整的模型。

## 3.1 环境准备

首先，导入必要的库：

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math
import numpy as np
```

## 3.2 位置编码实现

```python
class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_seq_length=5000):
        super().__init__()
        
        # 创建位置编码矩阵
        pe = torch.zeros(max_seq_length, d_model)
        position = torch.arange(0, max_seq_length, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * 
                           (-math.log(10000.0) / d_model))
        
        # 计算正弦和余弦位置编码
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        
        # 添加批次维度并注册为缓冲区
        pe = pe.unsqueeze(0)
        self.register_buffer('pe', pe)
        
    def forward(self, x):
        # x: [batch_size, seq_len, d_model]
        return x + self.pe[:, :x.size(1)]
```

## 3.3 多头注意力实现

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        assert d_model % num_heads == 0
        
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        # 创建 Q、K、V 的线性变换层
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        # 计算注意力分数
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        
        # 应用掩码（如果提供）
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        # 计算注意力权重和加权值
        attention_weights = F.softmax(scores, dim=-1)
        return torch.matmul(attention_weights, V), attention_weights
    
    def forward(self, Q, K, V, mask=None):
        batch_size = Q.size(0)
        
        # 线性变换
        Q = self.W_q(Q).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(K).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(V).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        # 计算注意力
        x, attention = self.scaled_dot_product_attention(Q, K, V, mask)
        
        # 重组输出
        x = x.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        
        return self.W_o(x), attention
```

## 3.4 前馈神经网络实现

```python
class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super().__init__()
        self.linear1 = nn.Linear(d_model, d_ff)
        self.linear2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x):
        x = self.dropout(F.relu(self.linear1(x)))
        x = self.linear2(x)
        return x
```

## 3.5 编码器层实现

```python
class EncoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        
        self.self_attention = MultiHeadAttention(d_model, num_heads)
        self.feed_forward = FeedForward(d_model, d_ff, dropout)
        
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x, mask=None):
        # 自注意力
        attn_output, _ = self.self_attention(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_output))
        
        # 前馈网络
        ff_output = self.feed_forward(x)
        x = self.norm2(x + self.dropout(ff_output))
        
        return x
```

## 3.6 完整的 Transformer 编码器

```python
class TransformerEncoder(nn.Module):
    def __init__(self, d_model, num_heads, num_layers, d_ff, max_seq_length, dropout=0.1):
        super().__init__()
        
        self.positional_encoding = PositionalEncoding(d_model, max_seq_length)
        self.layers = nn.ModuleList([
            EncoderLayer(d_model, num_heads, d_ff, dropout)
            for _ in range(num_layers)
        ])
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x, mask=None):
        x = self.positional_encoding(x)
        x = self.dropout(x)
        
        for layer in self.layers:
            x = layer(x, mask)
            
        return x
```

## 3.7 使用示例

```python
# 创建模型
model = TransformerEncoder(
    d_model=512,      # 模型维度
    num_heads=8,      # 注意力头数
    num_layers=6,     # 编码器层数
    d_ff=2048,        # 前馈网络维度
    max_seq_length=100,
    dropout=0.1
)

# 准备输入数据
batch_size = 32
seq_length = 50
d_model = 512

x = torch.randn(batch_size, seq_length, d_model)
mask = torch.ones(batch_size, seq_length, seq_length)

# 前向传播
output = model(x, mask)
print(f"输出形状: {output.shape}")  # [batch_size, seq_length, d_model]
```

## 3.8 训练技巧

### 3.8.1 学习率调度器

```python
class TransformerLRScheduler:
    def __init__(self, optimizer, d_model, warmup_steps):
        self.optimizer = optimizer
        self.d_model = d_model
        self.warmup_steps = warmup_steps
        self.step_num = 0
        
    def step(self):
        self.step_num += 1
        lr = self.d_model ** (-0.5) * min(
            self.step_num ** (-0.5),
            self.step_num * self.warmup_steps ** (-1.5)
        )
        
        for param_group in self.optimizer.param_groups:
            param_group['lr'] = lr
```

### 3.8.2 标签平滑

```python
class LabelSmoothing(nn.Module):
    def __init__(self, smoothing=0.1):
        super().__init__()
        self.smoothing = smoothing
        
    def forward(self, x, target):
        confidence = 1.0 - self.smoothing
        logprobs = F.log_softmax(x, dim=-1)
        nll_loss = -logprobs.gather(dim=-1, index=target.unsqueeze(1))
        smooth_loss = -logprobs.mean(dim=-1)
        loss = confidence * nll_loss + self.smoothing * smooth_loss
        return loss.mean()
```

## 练习与实践

1. 尝试实现解码器部分
2. 添加注意力可视化功能
3. 实现不同的位置编码方案
4. 尝试在实际任务上训练模型

## 下一章预告

在下一章中，我们将学习如何预训练 Transformer 模型，并将其应用于各种下游任务。

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/llm/chapter2">← 上一章：Transformer 架构</a>
    </div>
    <div class="next">
        <a href="/books/llm/chapter4">下一章：预训练和微调 →</a>
    </div>
</div>
