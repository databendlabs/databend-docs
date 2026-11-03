---
title: CREATE VECTOR INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

为表的 [VECTOR](/sql/sql-reference/data-types/vector) 列创建 Vector Index，使用 HNSW（Hierarchical Navigable Small World）算法实现高效的相似度搜索。

## 语法

```sql
-- 在现有表上创建 Vector Index
CREATE [OR REPLACE] VECTOR INDEX [IF NOT EXISTS] <index_name>
ON [<database>.]<table_name>(<column>)
distance = '<metric>' [m = <number>] [ef_construct = <number>]
[refine = true | false]

-- 在创建表时创建 Vector Index
CREATE [OR REPLACE] TABLE <table_name> (
    <column_definitions>,
    VECTOR INDEX <index_name> (<column>)
        distance = '<metric>' [m = <number>] [ef_construct = <number>]
        [refine = true | false]
)...
```

### 参数说明

- **`distance`**（必需）- 指定用于相似度搜索的距离度量。支持多个度量，用逗号分隔：
  - `'cosine'` - 余弦距离（适用于语义相似度、文本 embedding）
  - `'l1'` - L1 距离 / 曼哈顿距离（适用于特征对比、稀疏数据）
  - `'l2'` - L2 距离 / 欧几里得距离（适用于几何相似度、图像特征）
  - 示例：`distance = 'cosine,l1,l2'` 同时支持三种度量

- **`m`**（可选，默认：16）- 控制 HNSW 图中每个节点的双向连接数：
  - 更高的值会增加内存使用，但可以提高搜索准确性
  - 必须大于 0
  - 典型取值范围：8-64

- **`ef_construct`**（可选，默认：100）- 控制索引构建过程中动态候选列表的大小：
  - 更高的值能提升索引质量，但会增加构建时间和内存消耗
  - 必须 >= 40
  - 典型取值范围：40-500

- **`refine`**（可选，默认：`false`）- 在索引中存储 FP16 向量，用于结果精排。此选项于 v1.2.957 引入，会增加存储和读取开销。查询设置控制 Databend 如何使用存储的 FP16 数据。

## FP16 精排 {/* #fp16-refinement */}

未启用精排时，向量索引查询使用 SQ8 量化分数。设置了 `refine = true` 的索引可以先使用 FP16 向量重新计算候选行的分数，再选取最终的 TopN 行。FP16 分数仍是近似值。精排不保证返回精确的最近邻，也不保证分数与原始全精度向量计算的分数相同。

| 设置 | 默认值 | 说明 |
|---------|---------|-------------|
| `vector_refine_factor` | `2` | 接受 `0` 到 `16` 的整数。对于符合条件的 TopN 搜索，使用 `LIMIT * factor` 作为 FP16 重新评分的候选预算。`0` 禁用精排。`1` 对原候选预算内的行重新评分。未设置 `refine = true` 的索引忽略此设置。 |
| `vector_search_ef` | `0` | 控制 HNSW 搜索候选列表的大小。`0` 表示使用候选数的四倍。非零值会提升到不小于候选数。 |

这两个设置均于 v1.2.957 引入。使用 `SET` 可以为会话设置，使用 `SETTINGS` 可以为单条查询设置。修改这些设置不需要重建索引。

```sql
SET vector_refine_factor = 4;
SET vector_search_ef = 400;
```

符合条件的 TopN 搜索仅读取包含候选行的 FP16 页。需要对每一行评分的查询，例如距离投影或包含普通列谓词的搜索，在启用精排时会对所有待评分行使用 FP16 分数。这些查询不会通过 TopN 候选预算限制评分行数。

如需为现有索引启用精排，请用 `refine = true` 替换索引定义，并保留所需的其他索引选项。然后运行 [REFRESH VECTOR INDEX](refresh-vector-index.md)，为已有数据构建新版本索引：

```sql
CREATE OR REPLACE VECTOR INDEX idx_product_embedding
ON products(embedding)
distance = 'cosine,l1,l2'
m = 20
ef_construct = 150
refine = true;

REFRESH VECTOR INDEX idx_product_embedding ON products;
```

新写入的数据自动使用当前索引定义。现有旧格式索引文件仍可读取。刷新会在缺少当前 bundle 格式索引时进行构建。`VACUUM TABLE` 回收保留快照不再引用的索引文件。

## Vector Index 工作原理

Databend 的 Vector Index 使用 HNSW 算法构建多层图结构：

1. **图结构**：每个向量是一个节点，与其最近邻节点相连
2. **搜索过程**：查询从粗粒度到细粒度遍历图的各层，快速找到近似最近邻
3. **量化处理**：SQ8 量化减少索引存储。可选的 FP16 数据用于精排。两者都可能影响搜索准确性。
4. **自动构建**：索引随数据写入自动构建。每次 INSERT、COPY 或数据加载操作都会自动为新行生成索引，无需手动维护

## 示例

### 创建带 Vector Index 的表

```sql
-- 为 embedding 创建简单的 Vector Index
CREATE TABLE documents (
    id INT,
    title VARCHAR,
    content TEXT,
    embedding VECTOR(1024),
    VECTOR INDEX idx_embedding(embedding) distance = 'cosine'
);
```

### 创建带自定义参数的 Vector Index

```sql
-- 支持多种距离度量并调整参数的 Vector Index
CREATE TABLE images (
    id INT,
    filename VARCHAR,
    feature_vector VECTOR(512),
    VECTOR INDEX idx_features(feature_vector)
        distance = 'cosine,l2'
        m = 32
        ef_construct = 200
);
```

### 在已有表上创建 Vector Index

```sql
CREATE TABLE products (
    id INT,
    name VARCHAR,
    description TEXT,
    embedding VECTOR(768)
);

-- 表创建后添加 Vector Index
CREATE VECTOR INDEX idx_product_embedding
ON products(embedding)
distance = 'cosine,l1,l2'
m = 20
ef_construct = 150;
```

### 在不同列上创建多个 Vector Index

```sql
CREATE TABLE multimodal_data (
    id INT,
    text_embedding VECTOR(384),
    image_embedding VECTOR(512),
    VECTOR INDEX idx_text(text_embedding) distance = 'cosine',
    VECTOR INDEX idx_image(image_embedding) distance = 'l2'
);
```

### 查看索引

使用 [SHOW INDEXES](/sql/sql-commands/administration-cmds/show-indexes) 查看所有索引：

```sql
SHOW INDEXES;
```

结果：
```
┌──────────────────────┬────────┬──────────┬────────────────────────────┬──────────────────────────┐
│ name                 │ type   │ original │ definition                 │ created_on               │
├──────────────────────┼────────┼──────────┼────────────────────────────┼──────────────────────────┤
│ idx_embedding        │ VECTOR │          │ documents(embedding)       │ 2025-05-13 01:22:34.123  │
│ idx_product_embedding│ VECTOR │          │ products(embedding)        │ 2025-05-13 01:23:45.678  │
└──────────────────────┴────────┴──────────┴────────────────────────────┴──────────────────────────┘
```

### 使用 Vector Index 进行相似度搜索

```sql
-- 创建带 Vector Index 的表
CREATE TABLE wiki_articles (
    id INT,
    title VARCHAR,
    embedding VECTOR(8),
    VECTOR INDEX idx_embedding(embedding) distance = 'cosine'
);

-- 插入示例数据（为演示使用 8 维向量）
INSERT INTO wiki_articles VALUES
(1, 'Machine Learning', [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]),
(2, 'Deep Learning', [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85]),
(3, 'Natural Language Processing', [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]),
(4, 'Computer Vision', [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]);

-- 使用余弦距离查找与查询向量最相似的 2 篇文章
SELECT id, title, cosine_distance(embedding, [0.12, 0.22, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82]) AS distance
FROM wiki_articles
ORDER BY distance ASC
LIMIT 2;
```

结果：
```
┌────┬─────────────────┬──────────────┐
│ id │ title           │ distance     │
├────┼─────────────────┼──────────────┤
│  1 │ Machine Learning│ 0.00012345   │
│  2 │ Deep Learning   │ 0.00023456   │
└────┴─────────────────┴──────────────┘
```

### 使用 FP16 精排查询

```sql
CREATE TABLE vector_refine_demo (
    id INT NOT NULL,
    embedding VECTOR(4) NOT NULL,
    VECTOR INDEX idx(embedding) distance = 'l1' refine = true
);

INSERT INTO vector_refine_demo VALUES
    (1, [1,0,0,0]), (2, [1,1,0,0]), (3, [0,1,0,0]);
INSERT INTO vector_refine_demo VALUES
    (4, [-1,0,0,0]), (5, [1,0.5,0,0]), (6, [1,0.25,0,0]);

SETTINGS (vector_refine_factor = 4, vector_search_ef = 16)
SELECT id, l1_distance(embedding, [1,0,0,0]::VECTOR(4)) AS d
FROM vector_refine_demo
ORDER BY d
LIMIT 3;
```

对于这些数据，返回的三行 ID 依次为 `1`、`6` 和 `5`，距离分别为 `0`、`0.25` 和 `0.5`。

使用 `SETTINGS (vector_refine_factor = 0)` 可以为单条查询禁用 FP16 精排。这不会修改已存储的 FP16 数据。

## 性能调优

### 选择距离度量

根据你的使用场景选择合适的距离度量。查询时使用距离函数，参见 [Vector 函数](/sql/sql-functions/vector-functions)。

- **余弦距离（Cosine）**：适用于 BERT、GPT 等模型生成的文本 embedding，向量长度不重要的场景
- **L2 距离（欧几里得）**：适用于图像特征、空间数据等关注绝对差异的场景
- **L1 距离（曼哈顿）**：适用于稀疏向量，以及希望强调单个维度差异的场景

### 调整 HNSW 参数

| 参数           | 较低值                               | 较高值                               |
|----------------|--------------------------------------|--------------------------------------|
| `m`            | 内存占用少，构建快                   | 准确性高，内存占用多                 |
| `ef_construct` | 构建快，质量低                       | 质量高，构建慢                       |

**推荐配置：**

- **小数据集（< 10万向量）**：使用默认设置（`m=16`, `ef_construct=100`）
- **中等数据集（10万 - 100万向量）**：`m=24`, `ef_construct=150`
- **大数据集（> 100万向量）**：`m=32`, `ef_construct=200`
- **高精度需求**：`m=48`, `ef_construct=300`

## 限制

- Vector Index 仅支持 [VECTOR](/sql/sql-reference/data-types/vector) 数据类型的列
- `distance` 参数为必需，未指定的索引将被忽略
- HNSW 搜索和量化分数均为近似结果。准确性取决于数据和索引/搜索设置。请使用有代表性的查询测试召回率。
- 索引大小随 `m` 值增加而增长（约为每个向量 `m * 向量维度 * 4 字节`）
