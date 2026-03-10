---
title: SHOW WAREHOUSES
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

列出当前租户下的所有计算集群。

## 语法

```sql
SHOW WAREHOUSES [ LIKE '<pattern>' ]
```

| 参数 | 说明 |
|------|------|
| `LIKE '<pattern>'` | 可选。按名称过滤，支持 `%`（匹配任意字符序列）和 `_`（匹配单个字符）。 |

## 输出列

| 列名 | 说明 |
|------|------|
| `name` | 计算集群名称 |
| `state` | 当前状态（如 Running、Suspended） |
| `size` | 规格大小 |
| `auto_suspend` | 自动暂停时间（秒） |
| `auto_resume` | 是否自动恢复 |
| `min_cluster_count` | 最小集群数 |
| `max_cluster_count` | 最大集群数 |
| `comment` | 备注 |
| `created_on` | 创建时间 |

## 示例

查看所有计算集群：

```sql
SHOW WAREHOUSES;
```

按名称过滤：

```sql
SHOW WAREHOUSES LIKE '%prod%';
```
