---
title: ALTER WAREHOUSE
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

暂停、恢复或修改计算集群配置。

## 语法

```sql
-- 暂停或恢复
ALTER WAREHOUSE <warehouse_name> { SUSPEND | RESUME }

-- 修改配置
ALTER WAREHOUSE <warehouse_name>
    SET [ WITH ] warehouse_size = <size>
    [ WITH ] auto_suspend = <nullable_unsigned_number>
    [ WITH ] auto_resume = <bool>
    [ WITH ] max_cluster_count = <nullable_unsigned_number>
    [ WITH ] min_cluster_count = <nullable_unsigned_number>
    [ WITH ] comment = '<string_literal>'
```

| 参数 | 说明 |
|------|------|
| `SUSPEND` | 立即暂停计算集群。 |
| `RESUME` | 立即恢复计算集群。 |
| `SET` | 修改一个或多个选项，未指定的选项保持不变。 |

## 选项

`SET` 子句支持与 [CREATE WAREHOUSE](create-warehouse.md) 相同的选项：

| 选项 | 类型 / 取值 | 说明 |
|------|-------------|------|
| `WAREHOUSE_SIZE` | `XSmall`、`Small`、`Medium`、`Large`、`XLarge`、`2XLarge`–`6XLarge` | 修改规格。 |
| `AUTO_SUSPEND` | `NULL`、`0` 或 ≥300 秒 | 空闲自动暂停时间。`NULL` 表示禁用。 |
| `AUTO_RESUME` | 布尔值 | 是否自动恢复。 |
| `MAX_CLUSTER_COUNT` | `NULL` 或非负整数 | 最大集群数。 |
| `MIN_CLUSTER_COUNT` | `NULL` 或非负整数 | 最小集群数。 |
| `COMMENT` | 字符串 | 备注信息。 |

- 数值选项设为 `NULL` 会重置为 `0`。
- `SET` 后不带任何选项会报错。

## 示例

暂停计算集群：

```sql
ALTER WAREHOUSE my_wh SUSPEND;
```

恢复计算集群：

```sql
ALTER WAREHOUSE my_wh RESUME;
```

修改配置：

```sql
ALTER WAREHOUSE my_wh
    SET warehouse_size = Large
    auto_resume = TRUE
    comment = '生产环境';
```

禁用自动暂停：

```sql
ALTER WAREHOUSE my_wh SET auto_suspend = NULL;
```
