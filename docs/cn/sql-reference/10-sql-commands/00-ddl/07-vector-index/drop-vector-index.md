---
title: DROP VECTOR INDEX
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.777"/>

从表中删除 Vector Index。

## 语法

```sql
DROP VECTOR INDEX [IF EXISTS] <index_name> ON [<database>.]<table_name>
```

## 示例

```sql
-- 创建带 Vector Index 的表
CREATE TABLE articles (
    id INT,
    title VARCHAR,
    embedding VECTOR(768),
    VECTOR INDEX idx_embedding(embedding) distance = 'cosine'
);

-- 删除 Vector Index
DROP VECTOR INDEX idx_embedding ON articles;

-- 使用 IF EXISTS 避免索引不存在时报错
DROP VECTOR INDEX IF EXISTS idx_embedding ON articles;
```
