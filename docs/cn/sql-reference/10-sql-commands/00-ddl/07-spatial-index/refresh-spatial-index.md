---
title: REFRESH SPATIAL INDEX
sidebar_position: 2
---

Databend 会在 `SYNC` 模式下对新写入的数据自动维护空间索引。`REFRESH SPATIAL INDEX` 主要用于在索引创建之前表中已经存在数据时，对这些历史数据进行回填。

## 语法

```sql
REFRESH SPATIAL INDEX <index> ON [<database>.]<table> [LIMIT <limit>]
```

| 参数 | 描述 |
|-----------|-------------|
| `<limit>` | 指定本次刷新最多处理的行数。如果不指定，则处理表中的全部数据。 |

## 示例

```sql
-- 先创建已经有数据的表
CREATE TABLE IF NOT EXISTS stores (
  store_id INT,
  location GEOMETRY
) ENGINE = FUSE;

INSERT INTO stores VALUES
  (1, TO_GEOMETRY('POINT(10 10)')),
  (2, TO_GEOMETRY('POINT(20 20)'));

-- 在表创建之后再添加空间索引
CREATE SPATIAL INDEX stores_location_idx ON stores(location);

-- 回填历史数据，让索引覆盖已有行
REFRESH SPATIAL INDEX stores_location_idx ON stores;

-- 之后的新写入会在 SYNC 模式下自动维护索引
```
