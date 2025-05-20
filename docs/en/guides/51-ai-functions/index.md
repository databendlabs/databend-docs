# Databend AI Capabilities

This guide introduces Databend's built-in AI functions that enable natural language processing tasks through SQL queries, including text understanding, generation, and more.

:::warning
Data Privacy and Security

Databend uses Azure OpenAI Service for embeddings and text completions. Your data will be sent to Azure OpenAI when using these functions. These features are available by default on Databend Cloud. 

**By using these functions, you acknowledge that your data will be sent to Azure OpenAI Service** and agree to the [Azure OpenAI Data Privacy](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy) terms.
:::

## Key AI Functions

| Function | Description | When to Use |
|----------|-------------|------------|
| [ai_text_completion](/sql/sql-functions/ai-functions/ai-text-completion) | Generates text based on a prompt | • Content generation<br/>• Question answering<br/>• Summarization<br/>• Text expansion |
| [ai_embedding_vector](/sql/sql-functions/ai-functions/ai-embedding-vector) | Converts text into vector representations | • Semantic search<br/>• Document similarity<br/>• Content recommendation<br/>• Text classification |
| [cosine_distance](/sql/sql-functions/vector-distance-functions/vector-cosine-distance) | Calculates similarity between vectors | • Finding similar documents<br/>• Ranking search results<br/>• Measuring text similarity |



## What are Embeddings?

Embeddings are vector representations of text that capture semantic meaning. Similar texts have closer vectors in the embedding space, enabling comparison and analysis for tasks like document similarity and clustering.

## Vector Storage in Databend

Databend can store embedding vectors using the `ARRAY(FLOAT32 NOT NULL)` data type and perform similarity calculations with the cosine_distance function directly in SQL.

## Example: Document Similarity Search

```sql
-- Create a table for documents
CREATE TABLE articles (
    id INT,
    title VARCHAR,
    content VARCHAR,
    embedding ARRAY(FLOAT32 NOT NULL)
);

-- Insert documents with embeddings
INSERT INTO articles (id, title, content, embedding)
VALUES
    (1, 'Python for Data Science', 'Python is a versatile programming language...', 
       ai_embedding_vector('Python is a versatile programming language...')),
    (2, 'Introduction to R', 'R is a popular programming language for statistics...', 
       ai_embedding_vector('R is a popular programming language for statistics...'));

-- Find similar documents to a query
SELECT
    id, title, content,
    cosine_distance(embedding, ai_embedding_vector('How to use Python in data analysis?')) AS similarity
FROM articles
ORDER BY similarity ASC
LIMIT 3;
```

## Example: Text Completion

```sql
-- Generate a completion for a prompt
SELECT ai_text_completion('Explain the benefits of cloud data warehouses in three points:') AS completion;

-- Result might be:
-- 1. Scalability: Cloud data warehouses can easily scale up or down based on demand, 
--    eliminating the need for upfront capacity planning.
-- 2. Cost-efficiency: Pay-as-you-go pricing models reduce capital expenditure and 
--    allow businesses to pay only for the resources they use.
-- 3. Accessibility: Cloud data warehouses enable teams to access data from anywhere, 
--    facilitating remote work and global collaboration.
```

## Building an AI Q&A System

You can create a simple Q&A system with Databend by:
1. Storing documents with embeddings
2. Finding relevant documents for a question
3. Using text completion to generate answers

Try these AI capabilities on [Databend Cloud](https://databend.com) with a free trial.
