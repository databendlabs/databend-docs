---
title: REPLACE WAREHOUSE
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

重建计算集群。语义与 [CREATE WAREHOUSE](create-warehouse.md) 相同，适用于覆盖已有配置的场景。

## 语法

```sql
REPLACE WAREHOUSE <warehouse_name>
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
| warehouse_name | 长度 3–63 个字符，仅支持 `A-Z`、`a-z`、`0-9` 和 `-`。 |

## 选项

参见 [CREATE WAREHOUSE](create-warehouse.md#选项)。

## 示例

使用新配置重建计算集群：

```sql
REPLACE WAREHOUSE etl_wh
    WITH warehouse_size = Large
    auto_suspend = 300
    auto_resume = TRUE
    comment = '更新后的 ETL 集群';
```
