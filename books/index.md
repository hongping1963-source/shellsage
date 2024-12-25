---
layout: default
title: 技术书籍
description: 精选技术书籍和教程
---

# 技术书籍

## 从零开始构建大型语言模型

<div class="book-card">
    <div class="book-cover">
        <img src="/assets/images/books/llm-cover.png" alt="从零开始构建大型语言模型">
    </div>
    <div class="book-info">
        <h3>从零开始构建大型语言模型</h3>
        <p class="book-description">
            本书将带领读者深入了解大型语言模型的内部工作原理，从基础概念到实际实现。通过循序渐进的方式，读者将学习如何构建自己的语言模型。
        </p>
        <div class="book-meta">
            <span class="book-author">作者：Zhang Hongping</span>
            <span class="book-date">更新时间：2024-12-25</span>
        </div>
        <div class="book-links">
            <a href="/books/llm/introduction" class="button">开始阅读</a>
            <a href="https://github.com/hongping1963-source/Build-a-Large-Language-Model-From-Scratch-" class="button" target="_blank">GitHub 仓库</a>
        </div>
    </div>
</div>

## 线性代数的艺术

<div class="book-card">
    <div class="book-cover">
        <img src="/assets/images/books/linear-algebra-cover.png" alt="线性代数的艺术">
    </div>
    <div class="book-info">
        <h3>线性代数的艺术</h3>
        <p class="book-description">
            这是一本独特的线性代数教程，通过优雅的可视化方式解释复杂的数学概念。本书将抽象的线性代数理论转化为直观的图形表示，帮助读者建立深刻的直觉理解。
        </p>
        <div class="book-meta">
            <span class="book-author">原作者：Kenji Hiranabe</span>
            <span class="book-date">中文版整理：Zhang Hongping</span>
        </div>
        <div class="book-links">
            <a href="/books/linear-algebra/introduction" class="button">开始阅读</a>
            <a href="https://github.com/kenjihiranabe/The-Art-of-Linear-Algebra" class="button" target="_blank">原版仓库</a>
        </div>
    </div>
</div>

<style>
.book-card {
    display: flex;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin: 20px 0;
    padding: 20px;
    transition: transform 0.2s ease;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.book-cover {
    flex: 0 0 200px;
    margin-right: 20px;
}

.book-cover img {
    width: 100%;
    height: auto;
    border-radius: 4px;
}

.book-info {
    flex: 1;
}

.book-info h3 {
    margin: 0 0 10px 0;
    color: #155799;
}

.book-description {
    color: #666;
    margin-bottom: 15px;
    line-height: 1.6;
}

.book-meta {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: #666;
    font-size: 0.9em;
    margin-bottom: 15px;
}

.book-links {
    display: flex;
    gap: 10px;
}

.button {
    display: inline-block;
    padding: 8px 16px;
    background: #159957;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.3s ease;
}

.button:hover {
    background: #147d4a;
    text-decoration: none;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .book-card {
        background: #2a2a2a;
    }
    
    .book-info h3 {
        color: #58a6ff;
    }
    
    .book-description {
        color: #e6e6e6;
    }
    
    .book-meta {
        color: #999;
    }
}
</style>
