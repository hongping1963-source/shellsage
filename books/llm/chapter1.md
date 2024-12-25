---
layout: book-chapter
title: 自然语言处理基础
description: 理解自然语言处理的基本概念和技术
chapter_number: 1
---

# 自然语言处理基础

## 1.1 什么是自然语言处理？

自然语言处理（Natural Language Processing，NLP）是人工智能和计算机科学的一个分支，致力于让计算机理解、解析和生成人类语言。它是连接人类语言和机器理解的桥梁。

### 1.1.1 NLP 的主要任务

1. **文本分类**
   - 情感分析
   - 主题分类
   - 垃圾邮件检测

2. **序列标注**
   - 命名实体识别（NER）
   - 词性标注（POS Tagging）
   - 分词

3. **文本生成**
   - 机器翻译
   - 文本摘要
   - 对话系统

## 1.2 语言模型基础

语言模型是 NLP 中的核心概念，它试图捕捉语言的统计规律。

### 1.2.1 概率语言模型

给定一个词序列 $w_1, w_2, ..., w_n$，语言模型计算这个序列出现的概率：

$P(w_1, w_2, ..., w_n) = \prod_{i=1}^n P(w_i|w_1, ..., w_{i-1})$

### 1.2.2 N-gram 模型

N-gram 模型是最简单的语言模型之一，它假设一个词只依赖于前面的 N-1 个词：

$P(w_i|w_1, ..., w_{i-1}) \approx P(w_i|w_{i-N+1}, ..., w_{i-1})$

例如，对于 trigram (N=3) 模型：

$P(w_i|w_1, ..., w_{i-1}) \approx P(w_i|w_{i-2}, w_{i-1})$

## 1.3 词向量表示

### 1.3.1 One-Hot 编码

最简单的词表示方法是 one-hot 编码，将每个词表示为一个只有一个位置为 1，其余位置为 0 的向量：

例如，对于词表 {"我", "喜欢", "机器学习"}：
- "我" = [1, 0, 0]
- "喜欢" = [0, 1, 0]
- "机器学习" = [0, 0, 1]

### 1.3.2 词嵌入

词嵌入是一种将词映射到低维稠密向量空间的技术。常见的词嵌入模型包括：

1. **Word2Vec**
   - CBOW（Continuous Bag of Words）
   - Skip-gram

2. **GloVe**（Global Vectors for Word Representation）

词嵌入可以捕捉词之间的语义关系，例如：

$\text{vec("国王")} - \text{vec("男人")} + \text{vec("女人")} \approx \text{vec("女王")}$

## 1.4 评估指标

### 1.4.1 困惑度（Perplexity）

困惑度是评估语言模型的标准指标：

$\text{PPL} = \exp(-\frac{1}{N}\sum_{i=1}^N \log P(w_i|w_1, ..., w_{i-1}))$

其中 N 是文本中的词数。困惑度越低，模型越好。

### 1.4.2 BLEU 分数

BLEU（Bilingual Evaluation Understudy）常用于评估机器翻译质量：

$\text{BLEU} = \text{BP} \cdot \exp(\sum_{n=1}^N w_n \log p_n)$

其中：
- $p_n$ 是 n-gram 精确度
- BP 是简短惩罚因子
- $w_n$ 通常设为 $\frac{1}{N}$

## 练习与思考

1. 为什么 one-hot 编码不能很好地表示词之间的关系？
2. Word2Vec 的 CBOW 和 Skip-gram 模型有什么区别？
3. 困惑度和交叉熵有什么关系？

## 下一步

在下一章中，我们将深入探讨 Transformer 架构，这是现代大型语言模型的基础。

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/llm/introduction">← 上一章：引言</a>
    </div>
    <div class="next">
        <a href="/books/llm/chapter2">下一章：Transformer 架构 →</a>
    </div>
</div>
