---
title: "AI_EMBEDDING_VECTOR"
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="新增或更新于：v1.2.777"/>

本文档概述了 Databend 中的 `ai_embedding_vector` 函数，并演示了如何使用此函数创建文档嵌入向量（Embeddings）。

主要的代码实现可以在[这里](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/common/openai/src/embedding.rs)找到。

默认情况下，Databend 利用 [text-embedding-ada](https://platform.openai.com/docs/models/embeddings) 模型来生成嵌入向量（Embeddings）。

:::info
从 Databend v1.1.47 开始，Databend 支持 [Azure OpenAI 服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

此集成提供了更好的数据隐私保护。

要使用 Azure OpenAI，请在 `[query]` 部分添加以下配置：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend 依赖 (Azure) OpenAI 来实现 `AI_EMBEDDING_VECTOR` 函数，并将嵌入向量（Embedding）列的数据发送给 (Azure) OpenAI。

只有当 Databend 配置中包含 `openai_api_key` 时，这些功能才会生效，否则它们将处于非活动状态。

此函数在 [Databend Cloud](https://databend.cn) 上默认可用，使用的是我们的 Azure OpenAI 密钥。如果您使用这些功能，即表示您承认您的数据将由我们发送至 Azure OpenAI。
:::

## ai_embedding_vector 概述

Databend 中的 `ai_embedding_vector` 是一个内置函数，用于为文本数据生成向量嵌入（Vector Embedding）。它对于自然语言处理（Natural Language Processing）任务非常有用，例如文档相似度（Document Similarity）、聚类（Clustering）和推荐系统（Recommendation System）。

该函数接收一个文本输入，并返回一个高维向量，该向量表示输入文本的语义和上下文。这些嵌入向量（Embedding）是使用在大型文本语料库上预训练的模型创建的，能够在一个连续空间中捕捉单词和短语之间的关系。

## 使用 ai_embedding_vector 创建嵌入向量

要使用 `ai_embedding_vector` 函数为文本文档创建嵌入向量（Embedding），请遵循以下示例。

1. 创建一个表来存储文档：

```sql
CREATE TABLE documents (
                           id INT,
                           title VARCHAR,
                           content VARCHAR,
                           embedding VECTOR(1536),
                           VECTOR INDEX idx_embedding(embedding) distance='cosine'
);
```

2. 向表中插入示例文档：

```sql
INSERT INTO documents(id, title, content)
VALUES
    (1, 'A Brief History of AI', 'Artificial intelligence (AI) has been a fascinating concept of science fiction for decades...'),
    (2, 'Machine Learning vs. Deep Learning', 'Machine learning and deep learning are two subsets of artificial intelligence...'),
    (3, 'Neural Networks Explained', 'A neural network is a series of algorithms that endeavors to recognize underlying relationships...'),
```

3. 生成嵌入向量（Embedding）：

```sql
UPDATE documents SET embedding = ai_embedding_vector(content) WHERE embedding IS NULL;
```

运行查询后，表中的 `embedding` 列将包含生成的嵌入向量（Embedding）。

嵌入向量（Embedding）以 `FLOAT` 值数组的形式存储在 `embedding` 列中，该列的类型为 `ARRAY(FLOAT NOT NULL)`。

现在，您可以将这些嵌入向量（Embedding）用于各种自然语言处理（Natural Language Processing）任务，例如查找相似文档或根据内容对文档进行聚类（Clustering）。

4. 检查嵌入向量（Embedding）：

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

上述查询显示，为每个文档生成的嵌入向量（Embedding）的长度（维度）为 1536。