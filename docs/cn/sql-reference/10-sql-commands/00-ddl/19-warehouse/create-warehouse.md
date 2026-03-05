---
title: CREATE WAREHOUSE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

创建计算集群。

## 语法

```sql
CREATE WAREHOUSE [ IF NOT EXISTS ] <warehouse_name>
    [ WITH ] warehouse_size = <size>
    [ WITH ] auto_suspend = <nullable_unsigned_number>
    [ WITH ] initially_suspended = <bool>
    [ WITH ] auto_resume = <bool>
    [ WITH ] max_cluster_count = <nullable_unsigned_number>
    [ WITH ] min_cluster_count = <nullable_unsigned_number>
    [ WITH ] comment = '<string_literal>'
```

| 参数 | 说明 |
|------|------|
| `IF NOT EXISTS` | 可选。若计算集群已存在则不执行任何操作。 |
| warehouse_name | 长度 3–63 个字符，仅支持 `A-Z`、`a-z`、`0-9` 和 `-`。 |

## 选项

| 选项 | 类型 / 取值 | 默认值 | 说明 |
|------|-------------|--------|------|
| `WAREHOUSE_SIZE` | `XSmall`、`Small`、`Medium`、`Large`、`XLarge`、`2XLarge`–`6XLarge`（不区分大小写） | `Small` | 计算集群规格。 |
| `AUTO_SUSPEND` | `NULL`、`0` 或 ≥300 秒 | `600` 秒 | 空闲自动暂停时间。`0` 或 `NULL` 表示不自动暂停；小于 300 秒会报错。 |
| `INITIALLY_SUSPENDED` | 布尔值 | `FALSE` | 设为 `TRUE` 时，创建后保持暂停状态，需手动恢复。 |
| `AUTO_RESUME` | 布尔值 | `TRUE` | 是否在收到查询时自动恢复。 |
| `MAX_CLUSTER_COUNT` | `NULL` 或非负整数 | `0` | 自动扩缩容的最大集群数。`0` 表示禁用。 |
| `MIN_CLUSTER_COUNT` | `NULL` 或非负整数 | `0` | 自动扩缩容的最小集群数，应 ≤ `MAX_CLUSTER_COUNT`。 |
| `COMMENT` | 字符串 | 空 | 备注信息，可通过 `SHOW WAREHOUSES` 查看。 |

- 选项可任意顺序，重复时以最后一个为准。
- `AUTO_SUSPEND`、`MAX_CLUSTER_COUNT`、`MIN_CLUSTER_COUNT` 设为 `NULL` 会重置为 `0`。

## 示例

创建带自动扩缩容的 XLarge 计算集群：

```sql
CREATE WAREHOUSE IF NOT EXISTS etl_wh
    WITH warehouse_size = XLarge
    auto_suspend = 600
    initially_suspended = TRUE
    auto_resume = FALSE
    max_cluster_count = 4
    min_cluster_count = 2
    comment = 'ETL 专用集群';
```

创建 Small 规格的计算集群：

```sql
CREATE WAREHOUSE my_warehouse
    WITH warehouse_size = Small;
```
