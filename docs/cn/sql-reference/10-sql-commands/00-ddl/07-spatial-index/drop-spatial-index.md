---
title: DROP SPATIAL INDEX
sidebar_position: 3
---

在 Databend 中删除空间索引。

## 语法

```sql
DROP SPATIAL INDEX [IF EXISTS] <index> ON [<database>.]<table>
```

## 示例

```sql
CREATE TABLE stores (
    store_id INT,
    store_name STRING,
    location GEOMETRY,
    SPATIAL INDEX location_idx (location)
) ENGINE = FUSE;

DROP SPATIAL INDEX location_idx ON stores;
```
