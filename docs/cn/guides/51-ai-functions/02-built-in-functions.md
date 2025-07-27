---
title: 内置 AI 函数
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.777"/>

# 内置 AI 函数

Databend 提供由 Azure OpenAI Service 支持的内置 AI 函数，可将 AI 能力无缝集成到 SQL 工作流中。

:::warning
**数据隐私声明**：使用内置 AI 函数时，您的数据将被发送到 Azure OpenAI Service。使用这些函数即表示您知晓此数据传输，并同意 [Azure OpenAI 数据隐私](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy) 条款。
:::

| 函数 | 描述 | 使用场景 |
|----------|-------------|-----------|
| [ai_text_completion](/sql/sql-functions/ai-functions/ai-text-completion) | 根据提示生成文本 | • 内容生成<br/>• 问题解答<br/>• 文本摘要 |
| [ai_embedding_vector](/sql/sql-functions/ai-functions/ai-embedding-vector) | 将文本转换为向量表示 | • 语义搜索<br/>• 文档相似度<br/>• 内容推荐 |
| [cosine_distance](/sql/sql-functions/vector-functions/vector-cosine-distance) | 计算向量间相似度 | • 查找相似文档<br/>• 搜索结果排序 |

## Databend 中的向量存储

Databend 使用 `VECTOR(1536)` 数据类型存储嵌入向量，支持在 SQL 中直接通过 `cosine_distance` 函数进行相似度计算。

## 示例：使用嵌入向量进行语义搜索

```sql
-- 创建带嵌入向量的文档表
CREATE TABLE articles (
    id INT,
    title VARCHAR,
    content VARCHAR,
    embedding VECTOR(1536),
    VECTOR INDEX idx_embedding(embedding) distance='cosine'
);

-- 存储文档及其向量嵌入
INSERT INTO articles (id, title, content, embedding)
VALUES
    (1, 'Python for Data Science', 'Python is a versatile programming language...', 
       ai_embedding_vector('Python is a versatile programming language...')),
    (2, 'Introduction to R', 'R is a popular programming language for statistics...', 
       ai_embedding_vector('R is a popular programming language for statistics...'));

-- 查找语义相似的文档
SELECT
    id, title,
    cosine_distance(embedding, ai_embedding_vector('How to use Python in data analysis?')) AS similarity
FROM articles
ORDER BY similarity ASC
LIMIT 3;
```

## 示例：文本生成

```sql
-- 根据提示生成文本
SELECT ai_text_completion('Explain the benefits of cloud data warehouses in three points:') AS completion;
```

## 快速入门

在 [Databend Cloud](https://databend.cn) 免费试用这些 AI 功能。