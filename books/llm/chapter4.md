---
layout: book-chapter
title: 预训练和微调
description: 理解大型语言模型的预训练过程和微调技术
chapter_number: 4
---

# 预训练和微调

## 4.1 预训练概述

预训练是构建大型语言模型的关键步骤，它允许模型从大量无标注数据中学习语言的一般特征。

### 4.1.1 预训练目标

1. **掩码语言模型（MLM）**
   - 随机掩盖输入中的一些词
   - 训练模型预测被掩盖的词
   - 例如：BERT 使用 15% 的掩码率

2. **下一句预测（NSP）**
   - 预测两个句子是否相邻
   - 帮助模型理解句子间关系

3. **因果语言模型（CLM）**
   - 预测序列中的下一个词
   - GPT 系列模型使用此方法

## 4.2 预训练数据准备

### 4.2.1 数据清洗

```python
def clean_text(text):
    # 移除 HTML 标签
    text = re.sub(r'<[^>]+>', '', text)
    
    # 标准化空白字符
    text = ' '.join(text.split())
    
    # 移除特殊字符
    text = re.sub(r'[^\w\s]', '', text)
    
    return text.strip()
```

### 4.2.2 分词器训练

```python
from tokenizers import ByteLevelBPETokenizer

def train_tokenizer(files, vocab_size=50000):
    tokenizer = ByteLevelBPETokenizer()
    
    # 训练分词器
    tokenizer.train(
        files=files,
        vocab_size=vocab_size,
        min_frequency=2,
        special_tokens=["[PAD]", "[UNK]", "[CLS]", "[SEP]", "[MASK]"]
    )
    
    return tokenizer
```

## 4.3 预训练实现

### 4.3.1 MLM 数据准备

```python
def create_mlm_data(text, tokenizer, mask_prob=0.15):
    tokens = tokenizer.encode(text).ids
    masked_tokens = tokens.copy()
    labels = [-100] * len(tokens)  # -100 表示不计算损失
    
    for i in range(len(tokens)):
        if random.random() < mask_prob:
            labels[i] = tokens[i]
            rand = random.random()
            
            if rand < 0.8:  # 80% 概率替换为 [MASK]
                masked_tokens[i] = tokenizer.token_to_id("[MASK]")
            elif rand < 0.9:  # 10% 概率替换为随机词
                masked_tokens[i] = random.randint(0, tokenizer.get_vocab_size() - 1)
            # 10% 概率保持不变
    
    return masked_tokens, labels
```

### 4.3.2 预训练损失函数

```python
class PreTrainingLoss(nn.Module):
    def __init__(self, vocab_size):
        super().__init__()
        self.mlm_loss = nn.CrossEntropyLoss(ignore_index=-100)
        
    def forward(self, predictions, labels):
        # predictions: [batch_size, seq_len, vocab_size]
        # labels: [batch_size, seq_len]
        
        return self.mlm_loss(
            predictions.view(-1, predictions.size(-1)),
            labels.view(-1)
        )
```

### 4.3.3 预训练循环

```python
def pretrain(model, train_dataloader, optimizer, scheduler, num_epochs):
    model.train()
    
    for epoch in range(num_epochs):
        total_loss = 0
        
        for batch in train_dataloader:
            optimizer.zero_grad()
            
            inputs = batch['input_ids'].to(device)
            labels = batch['labels'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            
            outputs = model(
                input_ids=inputs,
                attention_mask=attention_mask,
                labels=labels
            )
            
            loss = outputs.loss
            total_loss += loss.item()
            
            loss.backward()
            optimizer.step()
            scheduler.step()
            
        avg_loss = total_loss / len(train_dataloader)
        print(f"Epoch {epoch+1}, Average Loss: {avg_loss:.4f}")
```

## 4.4 微调技术

### 4.4.1 任务适配层

```python
class TaskHead(nn.Module):
    def __init__(self, hidden_size, num_labels, dropout=0.1):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Linear(hidden_size, num_labels)
        
    def forward(self, features):
        x = self.dropout(features)
        return self.classifier(x)
```

### 4.4.2 微调策略

1. **完全微调**
```python
def full_finetuning(model, train_dataloader, optimizer, num_epochs):
    for param in model.parameters():
        param.requires_grad = True
    
    for epoch in range(num_epochs):
        model.train()
        for batch in train_dataloader:
            # 训练步骤
            pass
```

2. **参数高效微调（PEFT）**
```python
class LoRALayer(nn.Module):
    def __init__(self, in_features, out_features, rank=4):
        super().__init__()
        self.lora_a = nn.Parameter(torch.randn(in_features, rank))
        self.lora_b = nn.Parameter(torch.zeros(rank, out_features))
        self.scaling = rank ** -0.5
        
    def forward(self, x):
        return x + (x @ self.lora_a @ self.lora_b) * self.scaling
```

### 4.4.3 提示工程

1. **零样本提示**
```python
def zero_shot_classification(model, text, labels):
    prompt = f"文本：{text}\n任务：将上述文本分类为以下类别之一：{', '.join(labels)}\n答案："
    return model.generate(prompt)
```

2. **少样本提示**
```python
def few_shot_prompt(examples, query):
    prompt = "以下是一些例子：\n\n"
    for x, y in examples:
        prompt += f"输入：{x}\n输出：{y}\n\n"
    prompt += f"输入：{query}\n输出："
    return prompt
```

## 4.5 评估指标

### 4.5.1 困惑度计算

```python
def calculate_perplexity(model, dataloader):
    model.eval()
    total_loss = 0
    total_tokens = 0
    
    with torch.no_grad():
        for batch in dataloader:
            outputs = model(batch['input_ids'], labels=batch['input_ids'])
            total_loss += outputs.loss.item() * batch['input_ids'].size(1)
            total_tokens += batch['input_ids'].size(1)
    
    return math.exp(total_loss / total_tokens)
```

### 4.5.2 下游任务评估

```python
def evaluate_classification(model, eval_dataloader):
    model.eval()
    predictions = []
    true_labels = []
    
    with torch.no_grad():
        for batch in eval_dataloader:
            outputs = model(**batch)
            predictions.extend(outputs.logits.argmax(-1).cpu().numpy())
            true_labels.extend(batch['labels'].cpu().numpy())
    
    return {
        'accuracy': accuracy_score(true_labels, predictions),
        'f1': f1_score(true_labels, predictions, average='weighted')
    }
```

## 练习与实践

1. 实现一个简单的掩码语言模型预训练
2. 尝试不同的微调策略
3. 比较零样本和少样本学习的效果
4. 实现 LoRA 微调方法

## 下一章预告

在下一章中，我们将探讨高级优化技术，包括混合精度训练、模型并行和流水线并行等。

---

<div class="chapter-navigation">
    <div class="prev">
        <a href="/books/llm/chapter3">← 上一章：PyTorch 实现</a>
    </div>
    <div class="next">
        <a href="/books/llm/chapter5">下一章：高级优化技术 →</a>
    </div>
</div>
