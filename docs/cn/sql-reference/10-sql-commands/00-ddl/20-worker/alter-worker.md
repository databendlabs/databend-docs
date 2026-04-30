---
title: ALTER WORKER
sidebar_position: 2
---

修改 worker 的标签、选项或运行状态。

:::note
此命令需要启用 cloud control。
:::

## 语法

```sql
ALTER WORKER <worker_name> SET TAG <tag_name> = '<tag_value>' [ , <tag_name> = '<tag_value>' , ... ]

ALTER WORKER <worker_name> UNSET TAG <tag_name> [ , <tag_name> , ... ]

ALTER WORKER <worker_name> SET <option_name> = '<option_value>' [ , <option_name> = '<option_value>' , ... ]

ALTER WORKER <worker_name> UNSET <option_name> [ , <option_name> , ... ]

ALTER WORKER <worker_name> SUSPEND

ALTER WORKER <worker_name> RESUME
```

## 参数

| 形式 | 说明 |
|------|-------------|
| `SET TAG` | 添加或更新 worker 标签。 |
| `UNSET TAG` | 删除一个或多个 worker 标签。 |
| `SET` | 添加或更新 worker 选项。选项名会被规范化为小写。 |
| `UNSET` | 删除一个或多个 worker 选项。 |
| `SUSPEND` | 挂起 worker。 |
| `RESUME` | 恢复 worker。 |

## 示例

为 worker 设置标签：

```sql
ALTER WORKER ingest_worker
SET TAG environment = 'prod', team = 'data-platform';
```

更新 worker 选项：

```sql
ALTER WORKER ingest_worker
SET region = 'us-west-2', pool = 'streaming';
```

删除标签和选项：

```sql
ALTER WORKER ingest_worker UNSET TAG team;
ALTER WORKER ingest_worker UNSET pool;
```

修改 worker 状态：

```sql
ALTER WORKER ingest_worker SUSPEND;
ALTER WORKER ingest_worker RESUME;
```
