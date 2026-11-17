---
title: REFRESH VECTOR INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

使用当前索引定义和格式，为已有数据构建缺少的向量索引文件。

## 语法

```sql
REFRESH VECTOR INDEX <index_name> ON [<database>.]<table_name>
```

## 何时使用 REFRESH

以下场景需要运行 `REFRESH VECTOR INDEX`：

- 在已包含数据的表上创建向量索引。
- 替换索引定义（例如启用 [`refine = true`](create-vector-index.md#fp16-refinement)）后，需要使用新定义为已有数据块建立索引。
- 需要为仅有旧格式索引文件的数据块构建当前格式的索引 bundle。此行为于 v1.2.957 引入。

新写入的数据自动使用当前定义构建索引。刷新会跳过已有匹配的当前版本 bundle 的数据块。旧格式索引文件仍可读取。仅当其他活动索引均不再需要某个旧格式文件时，刷新才会从当前数据块元数据中移除对该文件的引用。保留快照不再引用该文件后，`VACUUM TABLE` 才会回收文件。

## HNSW 评分修复后的索引重建

<FunctionDescription description="Introduced or updated: Unreleased"/>

已有索引不会自动应用 HNSW 图构建和 SQ8 评分修复。特别是，修复前构建的 L2 索引可能保留错误的距离分数。仅运行 `REFRESH VECTOR INDEX` 不会重建已有的匹配索引文件。

如需将修复应用于已有数据：

1. 保存索引定义和选项。
2. [删除向量索引](drop-vector-index.md)。
3. 使用所需选项重新[创建向量索引](create-vector-index.md)。
4. 运行 `REFRESH VECTOR INDEX`，为已有数据构建索引文件。

重建完成前，不要依赖旧 L2 索引进行距离阈值筛选。

## 示例

### 示例：为已有数据建立索引

```sql
-- 步骤 1：创建不带索引的表
CREATE TABLE products (
    id INT,
    name VARCHAR,
    embedding VECTOR(4)
) ENGINE = FUSE;

-- 步骤 2：插入数据（此时无索引）
INSERT INTO products VALUES
    (1, 'Product A', [0.1, 0.2, 0.3, 0.4]),
    (2, 'Product B', [0.5, 0.6, 0.7, 0.8]),
    (3, 'Product C', [0.9, 1.0, 1.1, 1.2]);

-- 步骤 3：在已有数据上创建 Vector Index
CREATE VECTOR INDEX idx_embedding ON products(embedding) distance='cosine';

-- 步骤 4：刷新以为现有的 3 行数据构建索引
REFRESH VECTOR INDEX idx_embedding ON products;

-- 步骤 5：新插入的数据会自动建立索引（无需刷新）
INSERT INTO products VALUES (4, 'Product D', [1.3, 1.4, 1.5, 1.6]);
```
