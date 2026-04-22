---
title: CREATE WORKER
sidebar_position: 1
---

创建一个 worker。

:::note
此命令需要启用 cloud control。
:::

## 语法

```sql
CREATE WORKER [ IF NOT EXISTS ] <worker_name>
    [ WITH <option_name> = '<option_value>' [ , <option_name> = '<option_value>' , ... ] ]
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `IF NOT EXISTS` | 可选。如果 worker 已存在，则成功返回但不做修改。 |
| `<worker_name>` | worker 名称。 |
| `WITH ...` | 可选的逗号分隔键值选项列表。选项名会被规范化为小写。 |

## 示例

创建一个不带选项的 worker：

```sql
CREATE WORKER ingest_worker;
```

创建一个带自定义选项的 worker：

```sql
CREATE WORKER IF NOT EXISTS ingest_worker
WITH region = 'us-east-1', pool = 'etl';
```
