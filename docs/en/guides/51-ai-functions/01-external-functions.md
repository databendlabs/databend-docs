---
title: External Functions for Custom AI/ML
---

# External Functions for Custom AI/ML

For advanced AI/ML scenarios, Databend supports external functions that connect your data with custom AI/ML infrastructure written in languages like Python.

| Feature | Description | Benefits |
|---------|-------------|----------|
| **Model Flexibility** | Use open-source models or your internal AI/ML infrastructure | • Freedom to choose any model<br/>• Leverage existing ML investments<br/>• Stay up-to-date with latest AI advancements |
| **GPU Acceleration** | Deploy external function servers on GPU-equipped machines | • Faster inference for deep learning models<br/>• Handle larger batch sizes<br/>• Support compute-intensive workloads |
| **Custom ML Models** | Deploy and use your own machine learning models | • Proprietary algorithms<br/>• Domain-specific models<br/>• Fine-tuned for your data |
| **Advanced AI Pipelines** | Build complex AI workflows with specialized libraries | • Multi-step processing<br/>• Custom transformations<br/>• Integration with ML frameworks |
| **Scalability** | Handle resource-intensive AI operations outside Databend | • Independent scaling<br/>• Optimized resource allocation<br/>• High-throughput processing |

## Implementation Overview

1. Create an external server with your AI/ML code (Python with [databend-udf](https://pypi.org/project/databend-udf))
2. Register the server with Databend using `CREATE FUNCTION`
3. Call your AI/ML functions directly in SQL queries

## Example: Custom AI Model Integration

```python
# Simple embedding UDF server demo
from databend_udf import udf, UDFServer
from sentence_transformers import SentenceTransformer

# Load pre-trained model
model = SentenceTransformer('all-mpnet-base-v2')  # 768-dimensional vectors

@udf(
    input_types=["STRING"],
    result_type="ARRAY(FLOAT)",
)
def ai_embed_768(inputs: list[str], headers) -> list[list[float]]:
    """Generate 768-dimensional embeddings for input texts"""
    try:
        # Process inputs in a single batch
        embeddings = model.encode(inputs)
        # Convert to list format
        return [embedding.tolist() for embedding in embeddings]
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        # Return empty lists in case of error
        return [[] for _ in inputs]

if __name__ == '__main__':
    print("Starting embedding UDF server on port 8815...")
    server = UDFServer("0.0.0.0:8815")
    server.add_function(ai_embed_768)
    server.serve()
```

```sql
-- Register the external function in Databend
CREATE OR REPLACE FUNCTION ai_embed_768 (STRING)
    RETURNS ARRAY(FLOAT)
    LANGUAGE PYTHON
    HANDLER = 'ai_embed_768'
    ADDRESS = 'https://your-ml-server.example.com';

-- Use the custom embedding in queries
SELECT
    id,
    title,
    cosine_distance(
        ai_embed_768(content),
        ai_embed_768('machine learning techniques')
    ) AS similarity
FROM articles
ORDER BY similarity ASC
LIMIT 5;
```

## Next Steps

1. **[External Functions Guide](/guides/query/external-function)** - Detailed setup instructions
2. **[Databend Cloud](https://databend.com)** - Try AI functions with a free trial