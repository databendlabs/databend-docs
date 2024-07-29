---
title: 'COSINE_DISTANCE'
description: '在Databend中使用cosine_distance函数测量相似度'
---

本文档概述了Databend中的cosine_distance函数，并演示如何使用该函数测量文档相似度。

:::info

cosine_distance函数在Databend内部执行向量计算，不依赖于（Azure）OpenAI API。

:::

Databend中的cosine_distance函数是一个内置函数，用于计算两个向量之间的余弦距离。它通常用于自然语言处理任务，如文档相似度和推荐系统。

余弦距离是基于两个向量之间夹角的余弦值来衡量相似度的一种度量。该函数接受两个输入向量，并返回一个介于0和1之间的值，其中0表示完全相同的向量，1表示正交（完全不相似）的向量。

## 示例

**创建表并插入示例数据**

让我们创建一个表来存储一些示例文本文档及其对应的嵌入向量：
```sql
CREATE TABLE articles (
    id INT,
    title VARCHAR,
    content VARCHAR,
    embedding ARRAY(FLOAT32)
);
```

现在，让我们向表中插入一些示例文档：
```sql
INSERT INTO articles (id, title, content, embedding)
VALUES
    (1, 'Python for Data Science', 'Python is a versatile programming language widely used in data science...', ai_embedding_vector('Python is a versatile programming language widely used in data science...')),
    (2, 'Introduction to R', 'R is a popular programming language for statistical computing and graphics...', ai_embedding_vector('R is a popular programming language for statistical computing and graphics...')),
    (3, 'Getting Started with SQL', 'Structured Query Language (SQL) is a domain-specific language used for managing relational databases...', ai_embedding_vector('Structured Query Language (SQL) is a domain-specific language used for managing relational databases...'));
```

**查询相似文档**

现在，让我们使用cosine_distance函数找到与给定查询最相似的文档：
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