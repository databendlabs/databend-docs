---
title: Built-in AI Functions
---

# Built-in AI Functions

Databend provides built-in AI functions powered by Azure OpenAI Service for seamless integration of AI capabilities into your SQL workflows.

:::warning
**Data Privacy Notice**: When using built-in AI functions, your data is sent to Azure OpenAI Service. By using these functions, you acknowledge this data transfer and agree to the [Azure OpenAI Data Privacy](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy) terms.
:::

| Function | Description | Use Cases |
|----------|-------------|-----------|
| [ai_text_completion](/sql/sql-functions/ai-functions/ai-text-completion) | Generates text based on prompts | • Content generation<br/>• Question answering<br/>• Summarization |
| [ai_embedding_vector](/sql/sql-functions/ai-functions/ai-embedding-vector) | Converts text to vector representations | • Semantic search<br/>• Document similarity<br/>• Content recommendation |
| [cosine_distance](/sql/sql-functions/vector-distance-functions/vector-cosine-distance) | Calculates similarity between vectors | • Finding similar documents<br/>• Ranking search results |

## Vector Storage in Databend

Databend stores embedding vectors using the `ARRAY(FLOAT NOT NULL)` data type, enabling direct similarity calculations with the `cosine_distance` function in SQL.

## Example: Semantic Search with Embeddings

```sql
-- Create a table for documents with embeddings
CREATE TABLE articles (
    id INT,
    title VARCHAR,
    content VARCHAR,
    embedding ARRAY(FLOAT NOT NULL)
);

-- Store documents with their vector embeddings
INSERT INTO articles (id, title, content, embedding)
VALUES
    (1, 'Python for Data Science', 'Python is a versatile programming language...', 
       ai_embedding_vector('Python is a versatile programming language...')),
    (2, 'Introduction to R', 'R is a popular programming language for statistics...', 
       ai_embedding_vector('R is a popular programming language for statistics...'));

-- Find semantically similar documents
SELECT
    id, title,
    cosine_distance(embedding, ai_embedding_vector('How to use Python in data analysis?')) AS similarity
FROM articles
ORDER BY similarity ASC
LIMIT 3;
```

## Example: Text Generation

```sql
-- Generate text based on a prompt
SELECT ai_text_completion('Explain the benefits of cloud data warehouses in three points:') AS completion;
```

## Getting Started

Try these AI capabilities on [Databend Cloud](https://databend.com) with a free trial.