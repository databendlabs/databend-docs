---
title: 全文搜索函数
---

Databend 的全文搜索函数为已建立倒排索引（inverted index）的半结构化 `VARIANT` 数据及纯文本列提供搜索引擎式的过滤能力，非常适合检索与资产一同存储的 AI 生成元数据，例如自动驾驶视频帧的感知结果。

:::info
Databend 的搜索函数借鉴自 [Elasticsearch 全文搜索函数](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html)。
:::

在表定义中为待搜索的列添加倒排索引：

```sql
CREATE OR REPLACE TABLE frames (
  id INT,
  meta VARIANT,
  INVERTED INDEX idx_meta (meta)
);
```

## 搜索函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [MATCH](match) | 对指定列执行相关性排序搜索。 | `MATCH('summary, tags', 'traffic light red')` |
| [QUERY](query) | 解析 Elasticsearch 风格查询表达式，支持嵌套 `VARIANT` 字段。 | `QUERY('meta.signals.traffic_light:red')` |
| [SCORE](score) | 与 `MATCH` 或 `QUERY` 配合使用时，返回当前行的相关性得分。 | `SELECT summary, SCORE() FROM frame_notes WHERE MATCH('summary, tags', 'traffic light red')` |

## 查询语法示例

### 示例：单个关键词

```sql
SELECT id, meta['frame']['timestamp'] AS ts
FROM frames
WHERE QUERY('meta.detections.label:pedestrian')
LIMIT 100;
```

### 示例：布尔 AND

```sql
SELECT id, meta['frame']['timestamp'] AS ts
FROM frames
WHERE QUERY('meta.signals.traffic_light:red AND meta.vehicle.lane:center')
LIMIT 100;
```

### 示例：布尔 OR

```sql
SELECT id, meta['frame']['timestamp'] AS ts
FROM frames
WHERE QUERY('meta.signals.traffic_light:red OR meta.detections.label:bike')
LIMIT 100;
```

### 示例：IN 列表

```sql
SELECT id, meta['frame']['timestamp'] AS ts
FROM frames
WHERE QUERY('meta.tags:IN [stop urban]')
LIMIT 100;
```

### 示例：包含范围

```sql
SELECT id, meta['frame']['timestamp'] AS ts
FROM frames
WHERE QUERY('meta.vehicle.speed_kmh:[0 TO 10]')
LIMIT 100;
```

### 示例：排除范围

```sql
SELECT id, meta['frame']['timestamp'] AS ts
FROM frames
WHERE QUERY('meta.vehicle.speed_kmh:{0 TO 10}')
LIMIT 100;
```

### 示例：加权字段

```sql
SELECT id, meta['frame']['timestamp'] AS ts, SCORE()
FROM frames
WHERE QUERY('meta.signals.traffic_light:red^1.0 AND meta.tags:urban^2.0')
LIMIT 100;
```
