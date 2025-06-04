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
| [AI_TO_SQL](01-ai-to-sql) | Converts natural language instructions into SQL queries | `SELECT * FROM ai_to_sql('Get all products with price less than 100')` |
| [AI_EMBEDDING_VECTOR](02-ai-embedding-vector) | Generates vector embeddings for text data | `SELECT ai_embedding_vector('How to use Databend')` |
| [AI_TEXT_COMPLETION](03-ai-text-completion) | Generates text completions based on a given prompt | `SELECT ai_text_completion('What is a data warehouse?')` |

## Usage Examples

### Natural Language to SQL Conversion

```sql
-- Convert natural language to SQL query
USE my_database;
SELECT * FROM ai_to_sql('Find all customers who made purchases in the last 30 days');
```

### Creating Document Embeddings

```sql
-- Create a table with document embeddings
CREATE TABLE documents (
  id INT,
  title VARCHAR,
  content VARCHAR,
  embedding ARRAY(FLOAT)
);

-- Insert documents with embeddings
INSERT INTO documents
SELECT 
  1 AS id,
  'Databend Introduction' AS title,
  'Databend is a modern cloud data warehouse' AS content,
  ai_embedding_vector('Databend is a modern cloud data warehouse') AS embedding;
```

### Text Completion

```sql
-- Generate text completion
SELECT ai_text_completion('Explain the benefits of cloud computing') AS explanation;
```
