---
title: Query Profile
---

Query profile refers to the graphical representation or visual breakdown of how a specific SQL statement is executed. It is essentially a graphical version of the [EXPLAIN](/sql/sql-commands/explain-cmds/explain) command, providing insights into the execution plan and performance details of the query.

## Accessing Query Profiles

The query profile can be directly accessed in Databend Cloud. To view the query profile of a query, go to **Monitor** > **SQL History**. Select a SQL statement from the history list, then click on the **Query Profile** tab. If you are using a self-hosted Databend, you can use the [EXPLAIN](/sql/sql-commands/explain-cmds/explain) command as an alternative.

## What Query Profile Includes

Here is an example of a query profile, comprising a set of three operator nodes in a hierarchical structure. When executing the SQL statement, Databend Cloud processes the nodes in a bottom-to-top sequence. The quantity and types of operator nodes a query profile contains depend on the specifics of your SQL statement. For the common operators and their statistical fields, see [Common Operators & Fields](#common-operators--fields).

![alt text](/img/cloud/query-profile-1.png)

*Please note that the bracketed number in each node's title represents the node ID and does *not* indicate the execution step.*

A query profile comes with a set of information panes that offer more details. The example above includes two information panes:

| Pane                 | Description                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Most Expensive Nodes | Lists the nodes with the longest execution times.                                                                                                                                                      |
| Profile Overview     | Displays the percentage of time spent on CPU and I/O. Please note that if you select a node, this information pane shows the information specific to the node you select, rather than the whole query. |

If you click on the `TableScan [4]` node, you will notice that two additional information panes have been added to the right:

![alt text](/img/cloud/query-profile-2.png)

| Pane       | Description                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| Statistics | Includes information such as scan progress, bytes scanned, percentage scanned from cache, partitions scanned, etc. |
| Attributes | Displays details specific to the node. The shown fields vary based on the functionality of the node.               |

## Common Operators & Fields

Explained plans include a variety of operators, depending on the SQL statement you want Databend to EXPLAIN. The following is a list of common operators and their fields:

* **TableScan**: Reads data from the table.
    - table: The full name of the table. For example, `catalog1.database1.table1`.
    - read rows: The number of rows to read.
    - read bytes: The number of bytes of data to read.
    - partition total: The total number of partitions of the table.
    - partition scanned: The number of partitions to read.
    - push downs: The filters and limits to be pushed down to the storage layer for processing.
* **Filter**: Filters the read data.
    - filters: The predicate expression used to filter the data. Data that returns false for the expression evaluation will be filtered out.
* **EvalScalar**: Evaluates scalar expressions. For example, `a+1` in `SELECT a+1 AS b FROM t`.
    - expressions: The scalar expressions to evaluate.
* **AggregatePartial** & **AggregateFinal**: Aggregates by keys and returns the result of the aggregation functions.
    - group by: The keys used for aggregation.
    - aggregate functions: The functions used for aggregation.
* **Sort**: Sorts data by keys.
    - sort keys: The expressions used for sorting.
* **Limit**: Limits the number of rows returned.
    - limit: The number of rows to return.
    - offset: The number of rows to skip before returning any rows.
* **HashJoin**: Uses the Hash Join algorithm to perform Join operations for two tables. The Hash Join algorithm will select one of the two tables as the build side to build the Hash table. It will then use the other table as the probe side to read the matching data from the Hash table to form the result.
    - join type: The JOIN type (INNER, LEFT OUTER, RIGHT OUTER, FULL OUTER, CROSS, SINGLE, or MARK).
    - build keys: The expressions used by the build side to build the Hash table.
    - probe keys: The expressions used by the probe side to read data from the Hash table.
    - filters: The non-equivalence JOIN conditions, such as `t.a > t1.a`.
* **Exchange**: Exchanges data between Databend query nodes for distributed parallel computing.
    - exchange type: Data repartition type (Hash, Broadcast, or Merge).