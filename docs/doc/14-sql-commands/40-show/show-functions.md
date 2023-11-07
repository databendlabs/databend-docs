---
title: SHOW FUNCTIONS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.190"/>

Shows the list of supported functions currently, including builtin scalar/aggregate functions and user-defined functions.

## Syntax

```sql
SHOW FUNCTIONS [LIKE '<pattern>' | WHERE <expr> | LIMIT <limit>]
```

## Example

```sql
SHOW FUNCTIONS;
+-------------------------+------------+--------------+-------------------+---------------------------+
| name                    | is_builtin | is_aggregate | definition        | description               |
+-------------------------+------------+--------------+-------------------+---------------------------+
| !=                      |          1 |            0 |                   |                           |
| %                       |          1 |            0 |                   |                           |
| *                       |          1 |            0 |                   |                           |
| +                       |          1 |            0 |                   |                           |
| -                       |          1 |            0 |                   |                           |
| /                       |          1 |            0 |                   |                           |
| <                       |          1 |            0 |                   |                           |
| <=                      |          1 |            0 |                   |                           |
| <>                      |          1 |            0 |                   |                           |
| =                       |          1 |            0 |                   |                           |
+-------------------------+------------+--------------+-------------------+---------------------------+
```

Showing the functions begin with `"today"`:
```sql
SHOW FUNCTIONS LIKE 'today%';
+--------------+------------+--------------+------------+-------------+
| name         | is_builtin | is_aggregate | definition | description |
+--------------+------------+--------------+------------+-------------+
| today        |          1 |            0 |            |             |
| todayofmonth |          1 |            0 |            |             |
| todayofweek  |          1 |            0 |            |             |
| todayofyear  |          1 |            0 |            |             |
+--------------+------------+--------------+------------+-------------+
```

Showing the functions begin with `"today"` with `WHERE`:
```sql
SHOW FUNCTIONS WHERE name LIKE 'today%';
+--------------+------------+--------------+------------+-------------+
| name         | is_builtin | is_aggregate | definition | description |
+--------------+------------+--------------+------------+-------------+
| today        |          1 |            0 |            |             |
| todayofmonth |          1 |            0 |            |             |
| todayofweek  |          1 |            0 |            |             |
| todayofyear  |          1 |            0 |            |             |
+--------------+------------+--------------+------------+-------------+
```
