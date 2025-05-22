# 用于自定义 AI/ML 的外部函数

对于高级 AI/ML 场景，Databend 支持外部函数，可以将您的数据与使用 Python 等语言编写的自定义 AI/ML 基础设施连接起来。

| 功能 | 描述 | 优势 |
|---------|-------------|----------|
| **模型灵活性** | 使用开源模型或您内部的 AI/ML 基础设施 | • 自由选择任何模型<br/>• 利用现有的 ML 投资<br/>• 随时掌握最新的 AI 进展 |
| **GPU 加速** | 在配备 GPU 的机器上部署外部函数服务器 | • 更快地进行深度学习模型推理<br/>• 处理更大的批量大小<br/>• 支持计算密集型工作负载 |
| **自定义 ML 模型** | 部署和使用您自己的机器学习模型 | • 专有算法<br/>• 领域特定模型<br/>• 针对您的数据进行微调 |
| **高级 AI 管道** | 使用专用库构建复杂的 AI 工作流程 | • 多步骤处理<br/>• 自定义转换<br/>• 与 ML 框架集成 |
| **可扩展性** | 在 Databend 之外处理资源密集型 AI 操作 | • 独立扩展<br/>• 优化资源分配<br/>• 高吞吐量处理 |

## 实现概述

1. 使用您的 AI/ML 代码（带有 [databend-udf](https://pypi.org/project/databend-udf) 的 Python）创建一个外部服务器
2. 使用 `CREATE FUNCTION` 向 Databend 注册服务器
3. 直接在 SQL 查询中调用您的 AI/ML 函数

## 示例：自定义 AI 模型集成

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

有关设置外部函数的详细说明，请参阅 [外部函数](/guides/query/external-function)。

## 开始使用

在 [Databend Cloud](https://databend.com) 上通过免费试用体验这些 AI 功能。
