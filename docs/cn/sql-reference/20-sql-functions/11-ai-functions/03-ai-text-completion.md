---
title: "AI_TEXT_COMPLETION"
description: "在 Databend 中使用 ai_text_completion 函数生成文本补全"
---

本文档概述了 Databend 中的 `ai_text_completion` 函数，并演示如何使用该函数生成文本补全。

主要代码实现可在[此处](https://github.com/databendlabs/databend/blob/1e93c5b562bd159ecb0f336bb88fd1b7f9dc4a62/src/common/openai/src/completion.rs)查看。

:::info
自 Databend v1.1.47 起，支持 [Azure OpenAI 服务](https://azure.microsoft.com/en-au/products/cognitive-services/openai-service)。

该集成可提供更强的数据隐私保护。

使用 Azure OpenAI 需在 `[query]` 部分添加以下配置：

```sql
# Azure OpenAI
openai_api_chat_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_embedding_base_url = "https://<name>.openai.azure.com/openai/deployments/<name>/"
openai_api_version = "2023-03-15-preview"
```

:::

:::caution
Databend 依赖 (Azure) OpenAI 实现 `AI_TEXT_COMPLETION` 功能，并将补全提示数据发送至 (Azure) OpenAI。

仅当配置中包含 `openai_api_key` 时该功能生效，否则无法使用。

[Databend Cloud](https://databend.com) 默认启用此功能（使用我们的 Azure OpenAI 密钥）。使用即表示您同意我们将数据发送至 Azure OpenAI。
:::

## ai_text_completion 概述

`ai_text_completion` 是 Databend 的内置函数，可根据给定提示生成文本补全。该函数适用于自然语言处理任务，如问答系统、文本生成和自动补全。

函数接收文本提示作为输入，返回生成的补全结果。补全内容由大型文本语料库预训练模型生成，在连续空间中捕捉单词与短语的关联关系。

## 使用 ai_text_completion 生成文本补全

以下示例演示如何在 Databend 中使用 `ai_text_completion` 生成文本补全：

```sql
SELECT ai_text_completion('What is artificial intelligence?') AS completion;
```

执行结果：

```sql
+--------------------------------------------------------------------------------------------------------------------+
| completion                                                                                                          |
+--------------------------------------------------------------------------------------------------------------------+
| Artificial intelligence (AI) is the field of study focused on creating machines and software capable of thinking, learning, and solving problems in a way that mimics human intelligence. This includes areas such as machine learning, natural language processing, computer vision, and robotics. |
+--------------------------------------------------------------------------------------------------------------------+
```

本示例中，向 `ai_text_completion` 输入提示 "What is artificial intelligence?" 后，函数返回生成的人工智能定义文本。
