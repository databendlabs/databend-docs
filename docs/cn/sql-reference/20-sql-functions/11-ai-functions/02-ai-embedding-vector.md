---
title: "AI_EMBEDDING_VECTOR"
description: "在 Databend 中使用 ai_embedding_vector 函数创建 embeddings"
---

本文档概述了 Databend 中的 ai_embedding_vector 函数，并演示了如何使用此函数创建文档 embeddings。

主要代码实现在[这里](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/common/openai/src/embedding.rs)。

默认情况下，Databend 利用 [text-embedding-ada](https://platform.openai.com/docs/models/embeddings) 模型来生成 embeddings。

:::info
从 Databend v1.1.47 开始，Databend 支持 [Azure OpenAI service](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

这种集成提供了改进的数据隐私。

要使用 Azure OpenAI，请将以下配置添加到 `[query]` 部分：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend 依赖于 (Azure) OpenAI 来实现 `AI_EMBEDDING_VECTOR`，并将 embedding 列数据发送到 (Azure) OpenAI。

只有当 Databend 配置包含 `openai_api_key` 时，它们才会工作，否则它们将处于非活动状态。

此函数在 [Databend Cloud](https://databend.com) 上默认可用，使用我们的 Azure OpenAI 密钥。如果您使用它们，您承认您的数据将由我们发送到 Azure OpenAI。
:::

## ai_embedding_vector 概述

Databend 中的 `ai_embedding_vector` 函数是一个内置函数，用于为文本数据生成向量 embeddings。它对于自然语言处理任务非常有用，例如文档相似性、聚类和推荐系统。

该函数接受文本输入，并返回一个高维向量，该向量表示输入文本的语义含义和上下文。embeddings 是使用大型文本语料库上的预训练模型创建的，从而捕获连续空间中单词和短语之间的关系。

## 使用 ai_embedding_vector 创建 embeddings

要使用 `ai_embedding_vector` 函数为文本文档创建 embeddings，请按照以下示例操作。

1. 创建一个表来存储文档：

```sql
CREATE TABLE documents (
                           id INT,
                           title VARCHAR,
                           content VARCHAR,
                           embedding ARRAY(FLOAT NOT NULL)
);
```

2. 将示例文档插入到表中：

```sql
INSERT INTO documents(id, title, content)
VALUES
    (1, 'A Brief History of AI', 'Artificial intelligence (AI) has been a fascinating concept of science fiction for decades...'),
    (2, 'Machine Learning vs. Deep Learning', 'Machine learning and deep learning are two subsets of artificial intelligence...'),
    (3, 'Neural Networks Explained', 'A neural network is a series of algorithms that endeavors to recognize underlying relationships...'),
```

3. 生成 embeddings：

```sql
UPDATE documents SET embedding = ai_embedding_vector(content) WHERE embedding IS NULL;
```

运行查询后，表中的 embedding 列将包含生成的 embeddings。

embeddings 作为 `FLOAT` 值的数组存储在 embedding 列中，该列具有 `ARRAY(FLOAT NOT NULL)` 列类型。

现在，您可以将这些 embeddings 用于各种自然语言处理任务，例如查找相似文档或根据文档内容对文档进行聚类。

4. 检查 embeddings：

```sql
SELECT length(embedding) FROM documents;
+-------------------+
| length(embedding) |
+-------------------+
|              1536 |
|              1536 |
|              1536 |
+-------------------+
```

上面的查询显示，为每个文档生成的 embeddings 的长度为 1536（维度）。