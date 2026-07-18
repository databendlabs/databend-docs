---
title: External AI Functions
---

# External AI Functions

Build powerful AI/ML capabilities by connecting Databend with your own infrastructure. External functions let you deploy custom models, leverage GPU acceleration, and integrate with any ML framework while keeping your data secure.

## Key Capabilities

| Feature | Benefits |
|---------|----------|
| **Custom Models** | Use any open-source or proprietary AI/ML models |
| **GPU Acceleration** | Deploy on GPU-equipped machines for faster inference |
| **Data Privacy** | Keep your data within your infrastructure |
| **Scalability** | Independent scaling and resource optimization |
| **Flexibility** | Support for any programming language and ML framework |

## How It Works

1. **Create AI Server**: Build your AI/ML server using Python and [databend-udf](https://pypi.org/project/databend-udf)
2. **Register Function**: Connect your server to Databend with `CREATE FUNCTION`
3. **Use in SQL**: Call your custom AI functions directly in SQL queries

## Databend Cloud Network Requirements

External functions use **Arrow Flight over gRPC/HTTP2**, not REST.

1. Expose the UDF server on HTTPS with a public TLS certificate and gRPC/HTTP2 support.
2. Open **Support → Create New Ticket** and add the hostname to the tenant **UDF server allowlist**.
3. If the firewall is locked down, allow Databend Cloud egress addresses on TCP 443.

`CREATE FUNCTION` fails with `Unallowed UDF server address` until the host is allowlisted, and it also verifies the remote schema, so the endpoint must be online.

Keep the local `UDFServer` gRPC listener private; terminate TLS at a gRPC load balancer:

```text
Databend Cloud → HTTPS/HTTP2 :443 → UDFServer gRPC :8815
```

## Example: Text Embedding Function

```python
# Simple embedding UDF server demo
from databend_udf import udf, UDFServer
from sentence_transformers import SentenceTransformer

# Load pre-trained model
model = SentenceTransformer('all-mpnet-base-v2')  # 768-dimensional vectors

@udf(
    input_types=["STRING"],
    result_type="VECTOR(768)",
)
def ai_embed_768(text: str) -> list[float]:
    """Generate a 768-dimensional embedding for the input text."""
    embedding = model.encode(
        text or "",
        normalize_embeddings=True,
        show_progress_bar=False,
    )
    return embedding.tolist()

if __name__ == '__main__':
    print("Starting embedding UDF server on port 8815...")
    server = UDFServer("0.0.0.0:8815")
    server.add_function(ai_embed_768)
    server.serve()
```

```sql
-- Register the external function in Databend
CREATE OR REPLACE FUNCTION ai_embed_768 AS (STRING)
    RETURNS VECTOR(768)
    LANGUAGE python
    HANDLER = 'ai_embed_768'
    ADDRESS = 'https://your-ml-server.example.com';

-- Registration connects to the Flight endpoint and validates its schema.
SELECT VECTOR_DIMS(ai_embed_768('health check'));
-- 768

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

## Learn More

- **[External Functions Guide](/guides/ai-functions/external-functions)** - Complete setup and deployment instructions
- **[Databend Cloud](https://databend.com)** - Try external functions with a free account
