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

Databend external functions use **Apache Arrow Flight over gRPC/HTTP2**, not a REST API. The example below uses `databend-udf==0.2.20`. For Databend Cloud:

1. Deploy the UDF server behind an HTTPS endpoint with a publicly trusted TLS certificate and gRPC/HTTP2 support.
2. In the Cloud console, select **Support → Create New Ticket** and ask for the endpoint hostname to be added to your tenant's **UDF server allowlist**.
3. If your firewall restricts inbound traffic, ask Support for your region's Databend Cloud egress addresses and allow them on TCP port 443.

The allowlist matches the URL hostname. A missing entry causes `CREATE FUNCTION` to fail with `Unallowed UDF server address`. `CREATE FUNCTION` also connects to the endpoint immediately and verifies the remote Arrow schema, so the endpoint must be online before registration.

The Python `UDFServer` listens for unencrypted gRPC by default. Keep that listener private and terminate TLS at a gRPC-capable load balancer or reverse proxy:

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
