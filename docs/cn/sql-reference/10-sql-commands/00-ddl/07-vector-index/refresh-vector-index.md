---
title: REFRESH VECTOR INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.777"/>

为创建索引前已存在的数据构建 Vector Index。

## 语法

```sql
REFRESH VECTOR INDEX <index_name> ON [<database>.]<table_name>
```

## 何时使用 REFRESH

`REFRESH VECTOR INDEX` **仅在一种特定场景下使用**：在已包含数据的表上创建 Vector Index。

对于创建索引前写入的数据，不会自动建立索引。你必须运行 `REFRESH VECTOR INDEX` 为这些已有数据构建索引。刷新完成后，所有后续的数据写入都会自动生成索引。

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
