---
title: SHOW WORKERS
sidebar_position: 4
---

列出当前 tenant 下的 worker。

:::note
此命令需要启用 cloud control。
:::

## 语法

```sql
SHOW WORKERS
```

## 输出

`SHOW WORKERS` 返回以下列：

| 列名 | 说明 |
|--------|-------------|
| `name` | worker 名称 |
| `tags` | JSON 格式的 worker 标签 |
| `options` | JSON 格式的 worker 选项 |
| `created_at` | worker 创建时间 |
| `updated_at` | worker 更新时间 |

## 示例

```sql
SHOW WORKERS;
```
