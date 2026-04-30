---
title: CREATE SPATIAL INDEX
sidebar_position: 1
---

在 Databend 中创建新的空间索引。

## 语法

```sql
CREATE [ OR REPLACE ] SPATIAL INDEX [IF NOT EXISTS] <index>
    ON [<database>.]<table>( <geometry_column>[, <geometry_column> ...] )
```

| 参数 | 描述 |
|-----------|-------------|
| `[ OR REPLACE ]` | 如果索引已存在，则替换已有索引。 |
| `[ IF NOT EXISTS ]` | 仅在同名索引不存在时创建索引。 |
| `<index>` | 空间索引的名称。 |
| `[<database>.]<table>` | 包含被索引列的表。 |
| `<geometry_column>` | 要加入索引的 `GEOMETRY` 列。语句中列名不能重复。 |

## 使用说明

- 空间索引仅支持 Fuse 表。
- 空间索引仅支持 `GEOMETRY` 列，不支持 `GEOGRAPHY` 列。
- 一个空间索引定义中可以包含多个列，这些列都必须是 `GEOMETRY` 类型。
- 为了获得更好的 pruning 效果，建议结合 `CLUSTER BY` 和 `ST_HILBERT` 对地理空间数据做物理聚簇，让空间上接近的对象更有机会被写入同一个 block。

## 示例

创建包含空间列的表：

```sql
CREATE TABLE stores (
    store_id INT,
    store_name STRING,
    location GEOMETRY
) CLUSTER BY (
    ST_HILBERT(location, [-180, -90, 180, 90])
);
```

在 `location` 列上创建空间索引：

```sql
CREATE SPATIAL INDEX stores_location_idx ON stores(location);
```

查看表定义：

```sql
SHOW CREATE TABLE stores;

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Table  │ Create Table                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ stores │ CREATE TABLE stores (                                                             │
│        │   store_id INT NULL,                                                              │
│        │   store_name VARCHAR NULL,                                                        │
│        │   location GEOMETRY NULL,                                                         │
│        │   SYNC SPATIAL INDEX stores_location_idx (location)                               │
│        │ ) ENGINE=FUSE CLUSTER BY linear(st_hilbert(location, [-180, -90, 180, 90]))       │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

插入一些用于空间过滤的示例数据，并执行 RECLUSTER 命令：

```sql
INSERT INTO stores VALUES
  (1, 'Starbucks', TO_GEOMETRY('POINT(10 10)')),
  (2, 'Costa', TO_GEOMETRY('POINT(11 11)')),
  (3, 'Gong Cha', TO_GEOMETRY('POINT(20 20)')),
  (4, 'Dunkin', TO_GEOMETRY('POINT(-10 -10)'));

ALTER TABLE stores RECLUSTER FINAL;
```

### 使用 `ST_WITHIN`、`ST_INTERSECTS` 和 `ST_CONTAINS` 过滤

这些谓词是常见的 geofence 场景过滤条件，通常都可以从空间索引中受益。

```sql
-- 查询位于多边形内部的位置
SELECT store_id, store_name
FROM stores
WHERE ST_WITHIN(
    location,
    TO_GEOMETRY('POLYGON((9 9, 9 12, 12 12, 12 9, 9 9))')
)
ORDER BY store_id;
```

```sql
-- 查询与多边形相交的位置
SELECT store_id, store_name
FROM stores
WHERE ST_INTERSECTS(
    location,
    TO_GEOMETRY('POLYGON((9 9, 9 12, 12 12, 12 9, 9 9))')
)
ORDER BY store_id;
```

```sql
-- 查询被多边形包含的点
SELECT store_id, store_name
FROM stores
WHERE ST_CONTAINS(
    TO_GEOMETRY('POLYGON((9 9, 9 12, 12 12, 12 9, 9 9))'),
    location
)
ORDER BY store_id;
```

### 使用 `ST_DWITHIN` 按距离过滤

`ST_DWITHIN` 适合做半径范围查询，例如“查找附近位置”。

```sql
SELECT store_id, store_name
FROM stores
WHERE ST_DWITHIN(
    location,
    TO_GEOMETRY('POINT(10 10)'),
    1.5
)
ORDER BY store_id;
```

### 在空间 Join 中过滤

当 Join 条件是受支持的空间谓词时，空间索引同样有帮助。

```sql
CREATE TABLE districts (
    district_id INT,
    district_name STRING,
    geom GEOMETRY
) CLUSTER BY (
    ST_HILBERT(geom, [-180, -90, 180, 90])
);

INSERT INTO districts VALUES
  (1, 'Central', TO_GEOMETRY('POLYGON((8 8, 8 13, 13 13, 13 8, 8 8))')),
  (2, 'West', TO_GEOMETRY('POLYGON((-2 -2, -2 2, 2 2, 2 -2, -2 -2))'));
```

```sql
SELECT d.district_name, s.store_name
FROM districts AS d
JOIN stores AS s
  ON ST_WITHIN(s.location, d.geom)
ORDER BY d.district_name, s.store_name;
```
