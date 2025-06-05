---
title: "AI_TEXT_COMPLETION"
description: "在 Databend 中使用 ai_text_completion 函数生成文本补全"
---

本文档概述了 Databend 中的 `ai_text_completion` 函数，并演示如何使用该函数生成文本补全。

主要代码实现可在[这里](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/common/openai/src/completion.rs)找到。

:::info
从 Databend v1.1.47 开始，Databend 支持 [Azure OpenAI 服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

此集成增强了数据隐私保护。

要使用 Azure OpenAI，请在 `[query]` 部分添加以下配置：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend 依赖 (Azure) OpenAI 实现 `AI_TEXT_COMPLETION` 功能，并将补全提示数据发送至 (Azure) OpenAI。

这些函数仅在 Databend 配置包含 `openai_api_key` 时生效，否则无法使用。

此函数在 [Databend Cloud](https://databend.com) 上默认启用，使用我们的 Azure OpenAI 密钥。若您使用这些函数，即表示您同意我们将数据发送至 Azure OpenAI。
:::

## ai_text_completion 概述

Databend 中的 `ai_text_completion` 函数是一个内置函数，可根据给定提示生成文本补全。它适用于自然语言处理任务，例如问答、文本生成和自动补全系统。

该函数接受文本提示作为输入，并返回生成的补全文本。补全内容通过大型文本语料库预训练的模型创建，这些模型捕获了连续空间中单词与短语的关系。

## 使用 ai_text_completion 生成文本补全

以下是在 Databend 中使用 `ai_text_completion` 函数生成文本补全的简单示例：

```sql
SELECT ai_text_completion('What is artificial intelligence?') AS completion;
```

结果：

```sql
+--------------------------------------------------------------------------------------------------------------------+
| completion                                                                                                          |
+--------------------------------------------------------------------------------------------------------------------+
| Artificial intelligence (AI) is the field of study focused on creating machines and software capable of thinking, learning, and solving problems in a way that mimics human intelligence. This includes areas such as machine learning, natural language processing, computer vision, and robotics. |
+--------------------------------------------------------------------------------------------------------------------+
```

在此示例中，我们向 `ai_text_completion` 函数提供提示 "What is artificial intelligence?"，函数返回一个简要描述人工智能的生成补全。