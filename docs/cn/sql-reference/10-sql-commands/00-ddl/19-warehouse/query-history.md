---
title: QUERY_HISTORY
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

查询执行历史记录，用于分析和监控。

## 语法

```sql
QUERY_HISTORY
    [ BY WAREHOUSE <warehouse_name> ]
    [ FROM '<timestamp>' ]
    [ TO '<timestamp>' ]
    [ LIMIT <unsigned_integer> ]
```

| 参数 | 说明 |
|------|------|
| `BY WAREHOUSE` | 可选。按计算集群过滤，名称不能为空。 |
| `FROM` | 可选。起始时间，格式 `YYYY-MM-DD HH:MM:SS`。默认为 `TO` 前 1 小时。 |
| `TO` | 可选。结束时间，格式 `YYYY-MM-DD HH:MM:SS`。默认为当前时间。 |
| `LIMIT` | 可选。返回记录数上限，默认 `10`，必须为正整数。 |

## 输出列

返回结果包含以下列：

| 列名 | 说明 |
|------|------|
| `query_id` | 查询唯一标识 |
| `query_text` | SQL 语句 |
| `scan_bytes` | 扫描数据量 |
| ... | 其他查询指标 |

## 示例

查询指定集群的历史记录：

```sql
QUERY_HISTORY
    BY WAREHOUSE etl_wh
    FROM '2023-08-20 00:00:00'
    TO '2023-08-20 06:00:00'
    LIMIT 200;
```

查询最近 10 条记录：

```sql
QUERY_HISTORY;
```

指定返回数量：

```sql
QUERY_HISTORY LIMIT 50;
```
