---
title: 'AI 函数（AI Functions）'
description: '使用基于 SQL 的 AI 函数进行知识库搜索和文本补全'
---

本节提供 Databend 内置 AI 函数的参考信息，这些函数可直接通过 SQL 实现自然语言处理、向量嵌入和文本生成功能。

:::info
Databend 的 AI 函数利用 OpenAI 模型，同时支持 Azure OpenAI 服务以增强数据隐私。这些函数需要在 Databend 中配置 OpenAI API 密钥，在 Databend Cloud 上默认可用。
:::

## 可用的 AI 函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [AI_TO_SQL](./01-ai-to-sql.md) | 将自然语言指令转换为 SQL 查询 | `SELECT * FROM ai_to_sql('Get all products with price less than 100')` |
| [AI_EMBEDDING_VECTOR](./02-ai-embedding-vector.md) | 为文本数据生成向量嵌入 | `SELECT ai_embedding_vector('How to use Databend')` |
| [AI_TEXT_COMPLETION](./03-ai-text-completion.md) | 基于给定提示生成文本补全 | `SELECT ai_text_completion('What is a data warehouse?')` |