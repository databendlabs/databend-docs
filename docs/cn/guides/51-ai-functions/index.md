---
title: 'Databend AI 功能'
sidebar_label: 'AI 功能'
---

本指南邀请您探索 Databend 的内置函数与机器学习融合的领域。通过 SQL 查询轻松转换您的数据分析，揭示一系列自然语言任务 - 从理解文档到完成文本等等。

## 数据、隐私和安全

Databend 依赖 [Azure OpenAI Service](https://azure.microsoft.com/en-us/products/ai-services/openai-service) 进行嵌入和文本补全，这意味着您的数据将被发送到 Azure OpenAI Service。使用这些功能时请务必谨慎。

这些功能在 [Databend Cloud](https://databend.com) 上默认可用，使用我们的 Azure OpenAI 密钥。**如果您使用它们，您承认您的数据将被发送到 Azure OpenAI Service**，并且您同意 [Azure OpenAI 数据隐私](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy)。

## 什么是嵌入 (Embeddings)？

嵌入是文本数据的向量表示，它捕获原始文本的语义和上下文含义。它们可用于比较和分析各种自然语言处理任务中的文本，例如文档相似性、聚类和推荐系统。

为了说明嵌入的工作原理，让我们考虑一个简单的例子。假设我们有以下句子：
1. `"The cat sat on the mat."`
2. `"The dog sat on the rug."`
3. `"The quick brown fox jumped over the lazy dog."`

当为这些句子创建嵌入时，模型会将文本转换为高维向量，使得相似的句子在向量空间中更接近。

例如，句子 1 和句子 2 的嵌入将彼此更接近，因为它们共享相似的结构和含义（都涉及动物坐在某物上）。另一方面，句子 3 的嵌入将与句子 1 和句子 2 的嵌入相距更远，因为它具有不同的结构和含义。

嵌入可能如下所示（为说明目的而简化）：

1. `[0.2, 0.3, 0.1, 0.7, 0.4]`
2. `[0.25, 0.29, 0.11, 0.71, 0.38]`
3. `[-0.1, 0.5, 0.6, -0.3, 0.8]`

在这个简化的例子中，您可以看到句子 1 和句子 2 的嵌入在向量空间中彼此更接近，而句子 3 的嵌入则更远。这说明了嵌入如何捕获语义关系，并可用于比较和分析文本数据。

## 什么是向量数据库？

通常，嵌入向量存储在专门的向量数据库中，如 milvus、pinecone、qdrant 或 weaviate。Databend 还可以使用 ARRAY(FLOAT32) 数据类型存储嵌入向量，并使用 SQL 中的 cosine_distance 函数执行相似性计算。要使用 Databend 为文本文档创建嵌入，您可以直接在 SQL 查询中使用内置的 `ai_embedding_vector` 函数。

## Databend AI 函数

Databend 提供了内置的 AI 函数，用于各种自然语言处理任务。本文档中涵盖的主要函数包括：

- [ai_embedding_vector](/sql/sql-functions/ai-functions/ai-embedding-vector): 为文本文档生成嵌入。
- [ai_text_completion](/sql/sql-functions/ai-functions/ai-text-completion): 根据给定的提示生成文本补全。
- [cosine_distance](/sql/sql-functions/vector-distance-functions/vector-cosine-distance): 计算两个嵌入之间的余弦距离。

## 生成嵌入

让我们创建一个表来存储一些示例文本文档及其相应的嵌入：
```sql
CREATE TABLE articles (
    id INT,
    title VARCHAR,
    content VARCHAR,
    embedding ARRAY(FLOAT32)
);
```

现在，让我们将一些示例文档插入到表中：
```sql
INSERT INTO articles (id, title, content, embedding)
VALUES
    (1, 'Python for Data Science', 'Python is a versatile programming language widely used in data science...', ai_embedding_vector('Python is a versatile programming language widely used in data science...')),
    (2, 'Introduction to R', 'R is a popular programming language for statistical computing and graphics...', ai_embedding_vector('R is a popular programming language for statistical computing and graphics...')),
    (3, 'Getting Started with SQL', 'Structured Query Language (SQL) is a domain-specific language used for managing relational databases...', ai_embedding_vector('Structured Query Language (SQL) is a domain-specific language used for managing relational databases...'));
```

## 计算余弦距离

现在，让我们使用 [cosine_distance](/sql/sql-functions/vector-distance-functions/vector-cosine-distance) 函数找到与给定查询最相似的文档：
```sql
SELECT
    id,
    title,
    content,
    cosine_distance(embedding, ai_embedding_vector('How to use Python in data analysis?')) AS similarity
FROM
    articles
ORDER BY
    similarity ASC
    LIMIT 3;
```

结果：
```sql
+------+--------------------------+---------------------------------------------------------------------------------------------------------+------------+
| id   | title                    | content                                                                                                 | similarity |
+------+--------------------------+---------------------------------------------------------------------------------------------------------+------------+
|    1 | Python for Data Science  | Python is a versatile programming language widely used in data science...                               |  0.1142081 |
|    2 | Introduction to R        | R is a popular programming language for statistical computing and graphics...                           | 0.18741018 |
|    3 | Getting Started with SQL | Structured Query Language (SQL) is a domain-specific language used for managing relational databases... | 0.25137568 |
+------+--------------------------+---------------------------------------------------------------------------------------------------------+------------+
```

## 生成文本补全

Databend 还支持文本补全函数 [ai_text_completion](/sql/sql-functions/ai-functions/ai-text-completion)。

例如，从上面的输出中，我们选择余弦距离最小的文档：“Python is a versatile programming language widely used in data science...”。

我们可以将其用作上下文，并将原始问题提供给 [ai_text_completion](/sql/sql-functions/ai-functions/ai-text-completion) 函数以生成补全：

```sql
SELECT ai_text_completion('Python is a versatile programming language widely used in data science...') AS completion;
```

结果：
```sql

completion: and machine learning. It is known for its simplicity, readability, and ease of use. Python has a vast collection of libraries and frameworks that make it easy to perform complex tasks such as data analysis, visualization, and machine learning. Some of the popular libraries used in data science include NumPy, Pandas, Matplotlib, and Scikit-learn. Python is also used in web development, game development, and automation. Its popularity and versatility make it a valuable skill for programmers and data scientists.
```

您可以在我们的 [Databend Cloud](https://databend.com) 上体验这些功能，您可以在这里注册免费试用版并立即开始使用这些 AI 功能。

Databend 的 AI 功能旨在易于使用，即使对于不熟悉机器学习或自然语言处理的用户也是如此。借助 Databend，您可以快速轻松地将强大的 AI 功能添加到您的 SQL 查询中，并将您的数据分析提升到一个新的水平。

## 使用 Databend 构建 AI 问答系统

我们利用 [Databend Cloud](https://databend.com) 和 AI 函数为我们的文档构建了一个 AI 问答系统。

以下是构建它的分步指南：

### 步骤 1：创建表

首先，创建一个具有以下结构的表来存储文档信息和嵌入：
```sql
CREATE TABLE doc (
                     path VARCHAR,
                     content VARCHAR,
                     embedding ARRAY(FLOAT32 NOT NULL)
);
```

### 步骤 2：插入原始数据

将示例数据插入到表中，包括每个文档的路径和内容：
```sql
INSERT INTO doc (path, content) VALUES
    ('ai-function', 'ai_embedding_vector, ai_text_completion, cosine_distance'),
    ('string-function', 'ASCII, BIN, CHAR_LENGTH');
```

### 步骤 3：生成嵌入

更新表以使用 [ai_embedding_vector](/sql/sql-functions/ai-functions/ai-embedding-vector) 函数为内容生成嵌入：
```sql
UPDATE doc SET embedding = ai_embedding_vector(content)
WHERE LENGTH(embedding) = 0;
```

### 步骤 4：提问并检索相关答案

```sql
-- 将问题定义为 CTE（公共表表达式）
WITH question AS (
    SELECT 'Tell me the ai functions' AS q
),
-- 计算问题的嵌入向量
question_embedding AS (
    SELECT ai_embedding_vector((SELECT q FROM question)) AS q_vector
),
-- 检索前 3 个最相关的文档
top_3_docs AS (
    SELECT content,
           cosine_distance((SELECT q_vector FROM question_embedding), embedding) AS dist
    FROM doc
    ORDER BY dist ASC
    LIMIT 3
),
-- 合并前 3 个文档的内容
combined_content AS (
    SELECT string_agg(content, ' ') AS aggregated_content
    FROM top_3_docs
),
-- 连接自定义提示、合并的内容和原始问题
prompt AS (
    SELECT CONCAT(
               'Utilizing the sections provided from the Databend documentation, answer the questions to the best of your ability. ',
               'Documentation sections: ',
               (SELECT aggregated_content FROM combined_content),
               ' Question: ',
               (SELECT q FROM question)
           ) as p
)
-- 将连接的文本传递给 ai_text_completion 函数以生成连贯且相关的响应
SELECT ai_text_completion((SELECT p FROM prompt)) AS answer;
```

结果：
```sql
+------------------------------------------------------------------------------------------------------------------+
| answer                                                                                                           |
+------------------------------------------------------------------------------------------------------------------+
| Answer: The ai functions mentioned in the Databend documentation are ai_embedding_vector and ai_text_completion. |
+------------------------------------------------------------------------------------------------------------------+
```