# 内置 AI 函数

Databend 提供了由 Azure OpenAI Service 驱动的内置 AI 函数，可将 AI 功能无缝集成到您的 SQL 工作流程中。

:::warning
**数据隐私声明**：使用内置 AI 函数时，您的数据将被发送到 Azure OpenAI Service。 通过使用这些函数，您确认此数据传输并同意 [Azure OpenAI 数据隐私](https://learn.microsoft.com/zh-cn/legal/cognitive-services/openai/data-privacy) 条款。
:::

| 函数 | 描述 | 使用场景 |
|----------|-------------|-----------|
| [ai_text_completion](/sql/sql-functions/ai-functions/ai-text-completion) | 根据提示生成文本 | • 内容生成<br/>• 问题解答<br/>• 摘要 |
| [ai_embedding_vector](/sql/sql-functions/ai-functions/ai-embedding-vector) | 将文本转换为向量表示 | • 语义搜索<br/>• 文档相似度<br/>• 内容推荐 |
| [cosine_distance](/sql/sql-functions/vector-distance-functions/vector-cosine-distance) | 计算向量之间的相似度 | • 查找相似文档<br/>• 对搜索结果进行排序 |

## Databend 中的 Vector 存储

Databend 使用 `ARRAY(FLOAT NOT NULL)` 数据类型存储 embedding vector，从而可以使用 SQL 中的 `cosine_distance` 函数直接进行相似度计算。

## 示例：使用 Embeddings 进行语义搜索

```sql
-- 创建一个包含 embeddings 的文档表
CREATE TABLE articles (
    id INT,
    title VARCHAR,
    content VARCHAR,
    embedding ARRAY(FLOAT NOT NULL)
);

-- 存储包含 vector embeddings 的文档
INSERT INTO articles (id, title, content, embedding)
VALUES
    (1, 'Python for Data Science', 'Python 是一种通用的编程语言...', 
       ai_embedding_vector('Python 是一种通用的编程语言...')),
    (2, 'Introduction to R', 'R 是一种流行的统计编程语言...', 
       ai_embedding_vector('R 是一种流行的统计编程语言...'));

-- 查找语义相似的文档
SELECT
    id, title,
    cosine_distance(embedding, ai_embedding_vector('如何在数据分析中使用 Python？')) AS similarity
FROM articles
ORDER BY similarity ASC
LIMIT 3;
```

## 示例：文本生成

```sql
-- 根据提示生成文本
SELECT ai_text_completion('用三点解释云数仓的优势：') AS completion;
```

## 开始使用

在 [Databend Cloud](https://databend.com) 上通过免费试用体验这些 AI 功能。
