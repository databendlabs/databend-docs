---
title: AI 自定义函数
---

# AI 自定义函数

通过将 Databend 与您自己的基础设施连接，构建强大的 AI/ML 能力。外部函数（External Functions）允许您部署自定义模型、利用 GPU 加速，并与任何 ML 框架集成，同时确保数据安全。

## 核心能力

| 特性 | 优势 |
|---------|----------|
| **自定义模型** | 使用任何开源或专有 AI/ML 模型 |
| **GPU 加速** | 部署在配备 GPU 的机器上，实现更快推理 |
| **数据隐私** | 数据始终保留在您的基础设施内 |
| **可扩展性** | 独立扩展与资源优化 |
| **灵活性** | 支持任意编程语言与 ML 框架 |

## 工作原理

1. **创建 AI 服务器**：使用 Python 和 [databend-udf](https://pypi.org/project/databend-udf) 构建 AI/ML 服务器
2. **注册函数**：通过 `CREATE FUNCTION` 将服务器接入 Databend
3. **在 SQL 中使用**：直接在 SQL 查询中调用自定义 AI 函数

## 示例：文本嵌入函数

```python
# 简单的嵌入 UDF 服务器演示
from databend_udf import udf, UDFServer
from sentence_transformers import SentenceTransformer

# 加载预训练模型
model = SentenceTransformer('all-mpnet-base-v2')  # 768 维向量

@udf(
    input_types=["STRING"],
    result_type="ARRAY(FLOAT)",
)
def ai_embed_768(inputs: list[str], headers) -> list[list[float]]:
    """为输入文本生成 768 维嵌入"""
    try:
        # 在单个批次中处理输入
        embeddings = model.encode(inputs)
        # 转换为列表格式
        return [embedding.tolist() for embedding in embeddings]
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        # 发生错误时返回空列表
        return [[] for _ in inputs]

if __name__ == '__main__':
    print("Starting embedding UDF server on port 8815...")
    server = UDFServer("0.0.0.0:8815")
    server.add_function(ai_embed_768)
    server.serve()
```

```sql
-- 在 Databend 中注册外部函数
CREATE OR REPLACE FUNCTION ai_embed_768 (STRING)
    RETURNS ARRAY(FLOAT)
    LANGUAGE PYTHON
    HANDLER = 'ai_embed_768'
    ADDRESS = 'https://your-ml-server.example.com';

-- 在查询中使用自定义嵌入
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

## 了解更多

- **[外部函数指南](/guides/ai-functions/external-functions)** - 完整的设置与部署说明
- **[Databend Cloud](https://databend.cn)** - 免费账户体验外部函数