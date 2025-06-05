---
title: "AI_EMBEDDING_VECTOR"
description: "在 Databend 中使用 ai_embedding_vector 函数创建嵌入向量"
---

本文档概述了 Databend 中的 ai_embedding_vector 函数，并演示了如何使用该函数创建文档嵌入向量。

主要代码实现可在[此处](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/common/openai/src/embedding.rs)查看。

默认情况下，Databend 使用 [text-embedding-ada](https://platform.openai.com/docs/models/embeddings) 模型生成嵌入向量。

:::info
自 Databend v1.1.47 起，支持 [Azure OpenAI 服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

该集成提供了更强的数据隐私保护。

如需使用 Azure OpenAI，请在 `[query]` 部分添加以下配置：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend 依赖 (Azure) OpenAI 实现 `AI_EMBEDDING_VECTOR` 功能，并将嵌入列数据发送至 (Azure) OpenAI。

仅当 Databend 配置中包含 `openai_api_key` 时该功能才会生效，否则将处于非活动状态。

此功能在 [Databend Cloud](https://databend.com) 默认启用，使用我们的 Azure OpenAI 密钥。使用即表示您确认数据将由我们发送至 Azure OpenAI。
:::

## ai_embedding_vector 概述

`ai_embedding_vector` 是 Databend 的内置函数，用于为文本数据生成向量嵌入。该函数适用于自然语言处理任务，如文档相似度计算、聚类分析和推荐系统。

函数接收文本输入后，返回表示文本语义和上下文的高维向量。嵌入向量通过预训练模型在大型语料库上生成，能在连续空间中捕捉词汇与短语间的关联性。

## 使用 ai_embedding_vector 创建嵌入向量

以下示例演示如何为文本文档创建嵌入向量：

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

3. 生成嵌入向量：

```sql
UPDATE documents SET embedding = ai_embedding_vector(content) WHERE embedding IS NULL;
```

执行查询后，embedding 列将包含生成的嵌入向量。

嵌入向量以 `FLOAT` 值数组形式存储于 embedding 列，该列类型为 `ARRAY(FLOAT NOT NULL)`。

这些嵌入向量可用于各类自然语言处理任务，例如查找相似文档或基于内容进行文档聚类。

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

上述查询结果显示，每个文档生成的嵌入向量维度长度均为 1536。