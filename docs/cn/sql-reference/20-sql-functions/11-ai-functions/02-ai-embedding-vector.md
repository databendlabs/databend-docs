---
title: "AI_EMBEDDING_VECTOR"
description: "在 Databend 中使用 ai_embedding_vector 函数创建嵌入向量"
---

本文档概述了 Databend 中的 ai_embedding_vector 函数，并演示如何使用该函数创建文档嵌入向量。

主要代码实现可在[这里](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/common/openai/src/embedding.rs)找到。

默认情况下，Databend 使用 [text-embedding-ada](https://platform.openai.com/docs/models/embeddings) 模型生成嵌入向量。

:::info
从 Databend v1.1.47 开始，Databend 支持 [Azure OpenAI 服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

此集成提供了更好的数据隐私。

要使用 Azure OpenAI，请在 `[query]` 部分添加以下配置：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend 依赖 (Azure) OpenAI 实现 `AI_EMBEDDING_VECTOR`，并将嵌入列数据发送至 (Azure) OpenAI。

仅当 Databend 配置包含 `openai_api_key` 时该函数才能工作，否则将处于非活动状态。

此函数在 [Databend Cloud](https://databend.com) 上默认可用，使用我们的 Azure OpenAI 密钥。如果您使用该函数，即表示您确认您的数据将由我们发送至 Azure OpenAI。
:::

## ai_embedding_vector 概述

Databend 中的 `ai_embedding_vector` 函数是一个内置函数，用于为文本数据生成嵌入向量。它适用于自然语言处理任务，例如文档相似性、聚类和推荐系统。

该函数接受文本输入并返回一个高维向量，表示输入文本的语义含义和上下文。嵌入向量通过大型文本语料库上预训练的模型创建，在连续空间中捕获单词和短语间的关系。

## 使用 ai_embedding_vector 创建嵌入向量

要使用 `ai_embedding_vector` 函数为文本文档创建嵌入向量，请按以下示例操作。

1. 创建表存储文档：

```sql
CREATE TABLE documents (
                           id INT,
                           title VARCHAR,
                           content VARCHAR,
                           embedding ARRAY(FLOAT NOT NULL)
);
```

2. 插入示例文档到表中：

```sql
INSERT INTO documents(id, title, content)
VALUES
    (1, 'A Brief History of AI', 'Artificial intelligence (AI) has been a fascinating concept of science fiction for decades...'),
    (2, 'Machine Learning vs. Deep Learning', 'Machine learning and deep learning are two subsets of artificial intelligence...'),
    (3, 'Neural Networks Explained', 'A neural network is a series of algorithms that endeavors to recognize underlying relationships...'),
```

3. 生成嵌入向量：

```sql
UPDATE documents SET embedding = ai_embedding_vector(content) WHERE embedding IS NULL;
```

运行查询后，表中的 embedding 列将包含生成的嵌入向量。

嵌入向量以 `FLOAT` 值数组形式存储在 embedding 列中，该列类型为 `ARRAY(FLOAT NOT NULL)`。

您可将这些嵌入向量用于自然语言处理任务，例如查找相似文档或基于内容聚类文档。

4. 检查嵌入向量：

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

上述查询显示，每个文档的嵌入向量长度为 1536（维度）。