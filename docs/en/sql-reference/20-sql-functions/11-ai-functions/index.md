---
title: 'AI Functions'
description: 'Using SQL-based AI Functions for Knowledge Base Search and Text Completion'
---

This section provides reference information for Databend's built-in AI functions, which enable natural language processing, vector embeddings, and text generation capabilities directly through SQL.

:::info
Databend's AI functions leverage OpenAI models and also support Azure OpenAI service for improved data privacy. These functions require an OpenAI API key configured in Databend and are available by default on Databend Cloud.
:::

## Available AI Functions

| Function | Description | Example |
|----------|-------------|--------|
| [AI_TO_SQL](./01-ai-to-sql.md) | Converts natural language instructions into SQL queries | `SELECT * FROM ai_to_sql('Get all products with price less than 100')` |
| [AI_EMBEDDING_VECTOR](./02-ai-embedding-vector.md) | Generates vector embeddings for text data | `SELECT ai_embedding_vector('How to use Databend')` |
| [AI_TEXT_COMPLETION](./03-ai-text-completion.md) | Generates text completions based on a given prompt | `SELECT ai_text_completion('What is a data warehouse?')` |
