---
title: Tuple
description: 元组是有序的、不可变类型的集合。
sidebar_position: 9
---

## 概览

`TUPLE(T1, T2, …)` 存储具有声明元素类型的固定有序值列表。每个元组值可以包含异构数据（例如 `TUPLE(DATETIME, STRING)`），其行为类似于紧凑的结构体。由于元组是不可变的，因此每当需要更改其内容时，都必须插入整个元组值。

## 示例

### 创建和插入

```sql
CREATE TABLE events_tuple (
  event_info TUPLE(DATETIME, STRING)
);

INSERT INTO events_tuple VALUES
  (('2023-02-14 08:00:00', 'Valentine''s Day')),
  (('2023-03-17 19:30:00', 'Game Night'));

SELECT event_info FROM events_tuple;
```

结果：
```
┌──────────────────────────────────────────────────────┐
│ event_info                                           │
├──────────────────────────────────────────────────────┤
│ ["2023-02-14T08:00:00","Valentine's Day"]            │
│ ["2023-03-17T19:30:00","Game Night"]                 │
└──────────────────────────────────────────────────────┘
```

### 访问元素

元组字段使用基于 1 的序数访问（`tuple_column.1`），或者在命名元素时使用别名。

```sql
-- 序数访问
SELECT
  event_info.1 AS event_time,
  event_info.2 AS description
FROM events_tuple;
```

结果：
```
┌──────────────────────────┬──────────────────┐
│ event_time               │ description      │
├──────────────────────────┼──────────────────┤
│ 2023-02-14T08:00:00      │ Valentine's Day  │
│ 2023-03-17T19:30:00      │ Game Night       │
└──────────────────────────┴──────────────────┘
```

当需要在 SQL 表达式中传递分组值而不引入额外的表列时，元组非常方便。
