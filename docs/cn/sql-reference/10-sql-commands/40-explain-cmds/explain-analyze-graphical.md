---
title: EXPLAIN ANALYZE GRAPHICAL
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.647"/>

`EXPLAIN ANALYZE GRAPHICAL` 是 BendSQL 客户端独有的命令。它允许您通过自动启动默认浏览器并呈现查询执行过程的交互式可视化表示来分析 SQL 查询的性能和执行计划。

此命令仅在 BendSQL v0.22.2 及更高版本中受支持。在使用它之前，请确保您的 BendSQL 已正确配置。有关设置说明，请参阅 [配置 BendSQL](#configuring-bendsql)。

## 语法

```sql
EXPLAIN ANALYZE GRAPHICAL <statement>
```

## 配置 BendSQL

要启用图形分析并自动打开默认浏览器，请将以下部分添加到 BendSQL 配置文件 `~/.config/bendsql/config.toml` 中：

```toml
[server]
bind_address = "127.0.0.1"        
auto_open_browser = true      
```

## 示例

您可以使用 `EXPLAIN ANALYZE GRAPHICAL` 来分析复杂查询（例如 TPC-H 基准查询）的性能，并了解查询的每个部分如何影响整体执行时间。

这是一个示例查询，用于计算 `lineitem` 表中的聚合：

```bash
eric@(eric-xsmall)/tpch_100> EXPLAIN ANALYZE GRAPHICAL select
    l_returnflag,
    l_linestatus,
    sum(l_quantity) as sum_qty,
    sum(l_extendedprice) as sum_base_price,
    sum(l_extendedprice * (1 - l_discount)) as sum_disc_price,
    sum(l_extendedprice * (1 - l_discount) * (1 + l_tax)) as sum_charge,
    avg(l_quantity) as avg_qty,
    avg(l_extendedprice) as avg_price,
    avg(l_discount) as avg_disc,
    count(*) as count_order
from
    lineitem
where
        l_shipdate <= add_days(to_date('1998-12-01'), -90)
group by
    l_returnflag,
    l_linestatus
order by
    l_returnflag,
    l_linestatus;
```

运行命令后，BendSQL 会输出一条消息，例如：

```bash
View graphical online: http://127.0.0.1:8080?perf_id=1

1095 rows graphical in 21.762 sec. Processed 0 rows, 0 B (0 row/s, 0 B/s)
```

这会自动打开您的默认浏览器，并显示查询执行计划的交互式图形视图，包括运算符运行时、行数以及各个 Stage 之间的数据流。

![alt text](@site/static/img/documents/sql/explain-graphical.png)