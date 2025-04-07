---
title: 'COSINE_DISTANCE'
description: '在 Databend 中使用 cosine_distance 函数衡量相似度'
---

本文档概述了 Databend 中的 cosine_distance 函数，并演示了如何使用此函数来衡量文档相似度。

:::info

cosine_distance 函数在 Databend 中执行向量计算，不依赖于 (Azure) OpenAI API。

:::

Databend 中的 cosine_distance 函数是一个内置函数，用于计算两个向量之间的余弦距离。它通常用于自然语言处理任务，例如文档相似性和推荐系统。

余弦距离是衡量两个向量之间相似度的一种方法，基于它们之间夹角的余弦值。该函数接受两个输入向量，并返回一个介于 0 和 1 之间的值，其中 0 表示相同的向量，1 表示正交（完全不相似）的向量。

## 示例

**创建表并插入示例数据**

让我们创建一个表来存储一些示例文本文档及其对应的 embeddings：
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

**查询相似文档**

现在，让我们使用 cosine_distance 函数查找与给定查询最相似的文档：
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