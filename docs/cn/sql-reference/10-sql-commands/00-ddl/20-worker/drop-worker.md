---
title: DROP WORKER
sidebar_position: 3
---

删除一个 worker。

:::note
此命令需要启用 cloud control。
:::

## 语法

```sql
DROP WORKER [ IF EXISTS ] <worker_name>
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `IF EXISTS` | 可选。如果 worker 不存在，则忽略错误。 |
| `<worker_name>` | worker 名称。 |

## 示例

```sql
DROP WORKER ingest_worker;
```

```sql
DROP WORKER IF EXISTS ingest_worker;
```
