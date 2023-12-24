---
title: CREATE VIEW
sidebar_position: 1
---

Creates a new view based on a query, the Logical View does not store any physical data, when we access a logical view, it will convert the sql into the subquery format to finish it.

For example, if you create a Logical View like:

```sql
CREATE VIEW view_t1 AS SELECT a, b FROM t1;
```
And do a query like:
```sql
SELECT a FROM view_t1;
```
the result equals the below query
```sql
SELECT a FROM (SELECT a, b FROM t1);
```

So, if you delete the table which the view depends on, it occurs an error that the original table does not exist. And you may need to drop the old view and recreate the new view you need.

## Syntax

```sql
CREATE VIEW [IF NOT EXISTS] [db.]view_name [(<column>, ...)] AS SELECT query
```

## Examples

```sql
CREATE VIEW tmp_view(c1, c2) AS SELECT number % 3 AS a, avg(number) FROM numbers(1000) GROUP BY a ORDER BY a;

SELECT * FROM tmp_view;
+------+-------+
| c1   | c2    |
+------+-------+
|    0 | 499.5 |
|    1 | 499.0 |
|    2 | 500.0 |
+------+-------+
```
