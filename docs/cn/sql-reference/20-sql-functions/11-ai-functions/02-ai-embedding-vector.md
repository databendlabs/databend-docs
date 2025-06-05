---
title: "AI_EMBEDDING_VECTOR"
description: "在 Databend 中使用 ai_embedding_vector 函数创建嵌入向量"
---

本文档概述了 Databend 中的 ai_embedding_vector 函数，并演示如何使用此函数创建文档嵌入向量 (Embedding)。

主要代码实现可在[此处](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/common/openai/src/embedding.rs)查看。

默认情况下，Databend 使用 [text-embedding-ada](https://platform.openai.com/docs/models/embeddings) 模型生成嵌入向量。

:::info
自 Databend v1.1.47 起，支持 [Azure OpenAI 服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

此集成提供更优的数据隐私保护。

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

仅当 Databend 配置包含 `openai_api_key` 时功能生效，否则无法使用。

此函数在 [Databend Cloud](https://databend.com) 默认启用（使用我们的 Azure OpenAI 密钥）。使用即表示您同意数据由我们发送至 Azure OpenAI。
:::

## ai_embedding_vector 概述

`ai_embedding_vector` 是 Databend 的内置函数，用于为文本数据生成向量嵌入。适用于自然语言处理任务，如文档相似度计算、聚类和推荐系统。

该函数接收文本输入，返回表示语义和上下文的高维向量。嵌入通过预训练模型在大型语料库上生成，在连续空间中捕获词句间关系。

## 使用 ai_embedding_vector 创建嵌入

按以下示例操作，为文本文档生成嵌入：

1. 创建存储文档的表：

```sql
CREATE TABLE documents (
                           id INT,
                           title VARCHAR,
                           content VARCHAR,
                           embedding ARRAY(FLOAT NOT NULL)
);
```

2. 插入示例文档：

```sql
INSERT INTO documents(id, title, content)
VALUES
    (1, 'A Brief History of AI', 'Artificial intelligence (AI) has been a fascinating concept of science fiction for decades...'),
    (2, 'Machine Learning vs. Deep Learning', 'Machine learning and deep learning are two subsets of artificial intelligence...'),
    (3, 'Neural Networks Explained', 'A neural network is a series of algorithms that endeavors to recognize underlying relationships...'),
```

3. 生成嵌入：

```sql
UPDATE documents SET embedding = ai_embedding_vector(content) WHERE embedding IS NULL;
```

运行查询后，表中 embedding 列将包含生成的嵌入。

嵌入以 `FLOAT` 值数组形式存储，列类型为 `ARRAY(FLOAT NOT NULL)`。

这些嵌入可用于多种自然语言处理任务，例如查找相似文档或基于内容聚类。

4. 检查嵌入：

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

该查询显示每个文档的嵌入长度为 1536（维度）。