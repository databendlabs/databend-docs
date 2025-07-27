---
title: Vector
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.777"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VECTOR INDEX'/>

VECTOR 数据类型用于存储由 32 位浮点数组成的多维数组，专为机器学习、人工智能（AI）应用和相似性搜索操作而设计。每个向量在创建时都指定了固定的维度（dimension，即长度）。

## 语法

```sql
column_name VECTOR(<dimension>)
```

其中：
- `dimension`：向量的维度（dimension，即长度）。必须是正整数，最大值为 4096。
- 元素为 32 位浮点数。

## 向量索引

Databend 支持使用 HNSW（Hierarchical Navigable Small World）算法创建向量索引（Vector Index），以实现快速的近似最近邻搜索，可将查询（Query）性能提升 **23 倍**。

### 索引语法

```sql
VECTOR INDEX index_name(column_name) distance='cosine,l1,l2'
```

其中：
- `index_name`：向量索引（Vector Index）的名称。
- `column_name`：要索引的 VECTOR 列的名称。
- `distance`：要支持的距离函数。可以是 `'cosine'`、`'l1'`、`'l2'`，或组合形式如 `'cosine,l1,l2'`。


### 支持的距离函数

| 函数 | 描述 | 使用场景 |
|----------|-------------|----------|
| **[cosine_distance](/sql/sql-functions/vector-functions/vector-cosine-distance)** | 计算向量之间的余弦距离 | 语义相似性、文本嵌入 |
| **[l1_distance](/sql/sql-functions/vector-functions/vector-l1-distance)** | 计算 L1 距离（曼哈顿距离） | 特征比较、稀疏数据 |
| **[l2_distance](/sql/sql-functions/vector-functions/vector-l2-distance)** | 计算 L2 距离（欧几里得距离） | 几何相似性、图像特征 |

## 基本用法

### 步骤 1：创建带有向量的表

```sql
-- 创建带有向量索引的表，以实现高效的相似性搜索
CREATE OR REPLACE TABLE products (
    id INT,
    name VARCHAR,
    features VECTOR(3),
    VECTOR INDEX idx_features(features) distance='cosine'
);
```

**注意**：当数据插入表中时，向量索引（Vector Index）会自动构建。

### 步骤 2：插入向量数据

```sql
-- 插入产品特征向量
INSERT INTO products VALUES 
    (1, 'Product A', [1.0, 2.0, 3.0]::VECTOR(3)),
    (2, 'Product B', [2.0, 1.0, 4.0]::VECTOR(3)),
    (3, 'Product C', [1.5, 2.5, 2.0]::VECTOR(3)),
    (4, 'Product D', [3.0, 1.0, 1.0]::VECTOR(3));
```

### 步骤 3：执行相似性搜索

```sql
-- 查找与查询向量 [1.2, 2.1, 2.8] 相似的产品
SELECT 
    id,
    name,
    features,
    cosine_distance(features, [1.2, 2.1, 2.8]::VECTOR(3)) AS distance
FROM products
ORDER BY distance ASC
LIMIT 3;
```

结果：
```
┌─────┬───────────┬───────────────┬──────────────────┐
│ id  │ name      │ features      │ distance         │
├─────┼───────────┼───────────────┼──────────────────┤
│ 2   │ Product B │ [2.0,1.0,4.0] │ 0.5384207        │
│ 3   │ Product C │ [1.5,2.5,2.0] │ 0.5772848        │
│ 1   │ Product A │ [1.0,2.0,3.0] │ 0.60447836       │
└─────┴───────────┴───────────────┴──────────────────┘
```

**说明**：该查询（Query）找到了与搜索向量 `[1.2, 2.1, 2.8]` 最相似的 3 个产品。余弦距离值越小，表示相似度越高。

## 卸载和加载向量数据

### 卸载向量数据

```sql
-- 将向量数据导出到暂存区
COPY INTO @mystage/unload/
FROM (
    SELECT 
        id,
        name,
        features
    FROM products
)
FILE_FORMAT = (TYPE = 'PARQUET');
```

### 加载向量数据

```sql
-- 创建用于导入的目标表
CREATE OR REPLACE TABLE products_imported (
    id INT,
    name VARCHAR,
    features VECTOR(3),
    VECTOR INDEX idx_features(features) distance='cosine'
);

-- 导入向量数据
COPY INTO products_imported (id, name, features)
FROM (
    SELECT 
        id,
        name,
        features
    FROM @mystage/unload/
)
FILE_FORMAT = (TYPE = 'PARQUET');
```