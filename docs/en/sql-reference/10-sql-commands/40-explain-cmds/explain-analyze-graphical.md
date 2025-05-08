---
title: EXPLAIN ANALYZE GRAPHICAL
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.647"/>

`EXPLAIN ANALYZE GRAPHICAL` is a command available exclusively in the BendSQL client. It allows you to analyze the performance and execution plan of a SQL query by automatically launching your default browser and presenting an interactive visual representation of the query execution process.

This command is supported only in BendSQL v0.22.2 and above. Before using it, ensure that your BendSQL is properly configured. For setup instructions, see [Configuring BendSQL](#configuring-bendsql).

## Syntax

```sql
EXPLAIN ANALYZE GRAPHICAL <statement>
```

## Configuring BendSQL

To enable graphical analysis and automatically open your default browser, add the following section to your BendSQL configuration file `~/.config/bendsql/config.toml`:

```toml
[server]
bind_address = "127.0.0.1"        
auto_open_browser = true      
```

## Examples

You can use `EXPLAIN ANALYZE GRAPHICAL` to analyze the performance of complex queries, such as TPC-H benchmark queries, and understand how each part of the query contributes to overall execution time.

Here is an example query that calculates aggregates from the `lineitem` table:

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

After running the command, BendSQL outputs a message like:

```bash
View graphical online: http://127.0.0.1:8080?perf_id=1

1095 rows graphical in 21.762 sec. Processed 0 rows, 0 B (0 row/s, 0 B/s)
```

This automatically opens your default browser and shows an interactive graphical view of the query execution plan, including operator runtimes, row counts, and data flow between stages.

![alt text](@site/static/img/documents/sql/explain-graphical.png)