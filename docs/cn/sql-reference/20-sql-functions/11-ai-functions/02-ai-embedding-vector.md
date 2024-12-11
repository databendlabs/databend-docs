---
title: "AI_EMBEDDING_VECTOR"
description: "使用 Databend 中的 ai_embedding_vector 函数创建嵌入向量"
---

本文档概述了 Databend 中的 ai_embedding_vector 函数，并演示了如何使用此函数创建文档嵌入向量。

主要代码实现可以在[这里](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/common/openai/src/embedding.rs)找到。

默认情况下，Databend 使用 [text-embedding-ada](https://platform.openai.com/docs/models/embeddings) 模型来生成嵌入向量。

:::info
从 Databend v1.1.47 开始，Databend 支持 [Azure OpenAI 服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

这一集成提供了更好的数据隐私保护。

要使用 Azure OpenAI，请在 `[query]` 部分添加以下配置：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend 依赖 (Azure) OpenAI 进行 `AI_EMBEDDING_VECTOR` 处理，并将嵌入列数据发送到 (Azure) OpenAI。

它们仅在 Databend 配置包含 `openai_api_key` 时有效，否则将处于非活动状态。

此功能默认在 [Databend Cloud](https://databend.com) 上使用我们的 Azure OpenAI 密钥提供。如果您使用它们，即表示您确认您的数据将由我们发送至 Azure OpenAI。
:::

## ai_embedding_vector 概述

Databend 中的 `ai_embedding_vector` 函数是一个内置函数，用于生成文本数据的向量嵌入。它在自然语言处理任务中非常有用，例如文档相似性、聚类和推荐系统。

该函数接受文本输入并返回一个高维向量，该向量表示输入文本的语义意义和上下文。嵌入向量是使用在大规模文本语料库上预训练的模型创建的，捕捉了单词和短语在连续空间中的关系。

## 使用 ai_embedding_vector 创建嵌入向量

要使用 `ai_embedding_vector` 函数为文本文档创建嵌入向量，请按照以下示例操作。

1. 创建一个表来存储文档：

```sql
CREATE TABLE documents (
                           id INT,
                           title VARCHAR,
                           content VARCHAR,
                           embedding ARRAY(FLOAT32 NOT NULL)
);
```

2. 向表中插入示例文档：

```sql
INSERT INTO documents(id, title, content)
VALUES
    (1, '人工智能简史', '人工智能（AI）一直是科幻小说中一个引人入胜的概念，已有数十年的历史...'),
    (2, '机器学习与深度学习', '机器学习和深度学习是人工智能的两个子集...'),
    (3, '神经网络解析', '神经网络是一系列算法，旨在识别潜在的关系...'),
```

3. 生成嵌入向量：

```sql
UPDATE documents SET embedding = ai_embedding_vector(content) WHERE embedding IS NULL;
```

运行查询后，表中的 embedding 列将包含生成的嵌入向量。

嵌入向量以 `FLOAT32` 值的数组形式存储在 embedding 列中，该列具有 `ARRAY(FLOAT32 NOT NULL)` 列类型。

现在，您可以使用这些嵌入向量进行各种自然语言处理任务，例如查找相似文档或根据内容对文档进行聚类。

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

上述查询显示，每个文档生成的嵌入向量长度为 1536（维度）。
