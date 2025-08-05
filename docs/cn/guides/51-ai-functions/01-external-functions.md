---
title: 使用外部函数实现自定义 AI/ML
---

# 使用外部函数实现自定义 AI/ML

对于高级 AI/ML 场景，Databend 支持外部函数（External Function），可将您的数据与使用 Python 等语言编写的自定义 AI/ML 基础设施连接起来。

| 特性 | 描述 | 优势 |
|---------|-------------|----------|
| **模型灵活性** | 使用开源模型或您内部的 AI/ML 基础设施 | • 自由选择任何模型<br/>• 利用现有的 ML 投资<br/>• 紧跟最新的 AI 发展 |
| **GPU 加速** | 在配备 GPU 的机器上部署外部函数服务器 | • 加快深度学习模型的推理速度<br/>• 处理更大的批处理大小<br/>• 支持计算密集型工作负载 |
| **自定义 ML 模型** | 部署和使用您自己的机器学习模型 | • 专有算法<br/>• 领域特定模型<br/>• 针对您的数据进行微调 |
| **高级 AI Pipeline（流水线）** | 使用专业库构建复杂的 AI 工作流 | • 多步处理<br/>• 自定义转换<br/>• 与 ML 框架集成 |
| **可扩展性** | 在 Databend 外部处理资源密集型 AI 操作 | • 独立扩展<br/>• 优化资源分配<br/>• 高吞吐量处理 |

## 实现概述

1. 使用您的 AI/ML 代码（Python 配合 [databend-udf](https://pypi.org/project/databend-udf)）创建一个外部服务器
2. 使用 `CREATE FUNCTION` 在 Databend 中注册该服务器
3. 在 SQL 查询中直接调用您的 AI/ML 函数

## 示例：自定义 AI 模型集成

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
        print(f"生成嵌入时出错：{e}")
        # 如果出错，则返回空列表
        return [[] for _ in inputs]

if __name__ == '__main__':
    print("正在端口 8815 上启动嵌入 UDF 服务器...")
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

## 后续步骤

1. **[外部函数指南](/guides/query/external-function)** - 详细的设置说明
2. **[Databend Cloud](https://databend.cn)** - 免费试用 AI 函数