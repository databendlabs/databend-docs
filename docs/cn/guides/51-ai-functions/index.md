# Databend AI 功能

本指南介绍了 Databend 的内置 AI 函数，这些函数通过 SQL 查询实现自然语言处理任务，包括文本理解、生成等。

:::warning
数据隐私和安全

Databend 使用 Azure OpenAI Service 进行嵌入和文本补全。当您使用这些函数时，您的数据将被发送到 Azure OpenAI。这些功能在 Databend Cloud 上默认可用。

**通过使用这些函数，您承认您的数据将被发送到 Azure OpenAI Service** 并同意 [Azure OpenAI 数据隐私](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy) 条款。
:::

## 关键 AI 函数

| 函数 | 描述 | 何时使用 |
|----------|-------------|------------|
| [ai_text_completion](/sql/sql-functions/ai-functions/ai-text-completion) | 根据提示生成文本 | • 内容生成<br/>• 问题解答<br/>• 摘要<br/>• 文本扩展 |
| [ai_embedding_vector](/sql/sql-functions/ai-functions/ai-embedding-vector) | 将文本转换为向量表示 | • 语义搜索<br/>• 文档相似度<br/>• 内容推荐<br/>• 文本分类 |
| [cosine_distance](/sql/sql-functions/vector-distance-functions/vector-cosine-distance) | 计算向量之间的相似度 | • 查找相似文档<br/>• 对搜索结果进行排序<br/>• 衡量文本相似度 |

## 什么是嵌入 (Embeddings)？

嵌入是文本的向量表示，可以捕获语义。相似的文本在嵌入空间中具有更接近的向量，从而可以进行比较和分析，以执行诸如文档相似性和聚类之类的任务。

## Databend 中的向量存储

Databend 可以使用 `ARRAY(FLOAT32 NOT NULL)` 数据类型存储嵌入向量，并直接在 SQL 中使用 cosine_distance 函数执行相似度计算。

## 示例：文档相似度搜索

```sql
-- 创建一个用于存储文章的表
CREATE TABLE articles (
    id INT,
    title VARCHAR,
    content VARCHAR,
    embedding ARRAY(FLOAT32 NOT NULL)
);

-- 插入带有嵌入的文章
INSERT INTO articles (id, title, content, embedding)
VALUES
    (1, 'Python for Data Science', 'Python is a versatile programming language...', 
       ai_embedding_vector('Python is a versatile programming language...')),
    (2, 'Introduction to R', 'R is a popular programming language for statistics...', 
       ai_embedding_vector('R is a popular programming language for statistics...'));

-- 查找与查询相似的文章
SELECT
    id, title, content,
    cosine_distance(embedding, ai_embedding_vector('How to use Python in data analysis?')) AS similarity
FROM articles
ORDER BY similarity ASC
LIMIT 3;
```

## 示例：文本补全

```sql
-- 为提示生成补全
SELECT ai_text_completion('Explain the benefits of cloud data warehouses in three points:') AS completion;

-- 结果可能是：
-- 1. 可扩展性：云数仓可以根据需求轻松地向上或向下扩展，
--    无需预先进行容量规划。
-- 2. 成本效益：按需付费的定价模式可减少资本支出，
--    并允许企业仅为其使用的资源付费。
-- 3. 可访问性：云数仓使团队可以从任何地方访问数据，
--    从而促进远程工作和全球协作。
```

## 构建 AI 问答系统

您可以使用 Databend 创建一个简单的问答系统，方法是：
1. 存储带有嵌入的文档
2. 查找与问题相关的文档
3. 使用文本补全生成答案

在 [Databend Cloud](https://databend.com) 上通过免费试用体验这些 AI 功能。
