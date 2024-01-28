---
title: 显示函数
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.315"/>

列出当前支持的内置标量和聚合函数。

另见：[system.functions](../../00-sql-reference/20-system-tables/system-functions.md)

## 语法

```sql
SHOW FUNCTIONS [LIKE '<pattern>' | WHERE <expr>] | [LIMIT <limit>]
```

## 示例

```sql
SHOW FUNCTIONS;

+-------------------------+--------------+---------------------------+
| name                    | is_aggregate | description               |
+-------------------------+--------------+---------------------------+
| !=                      |            0 |                           |
| %                       |            0 |                           |
| *                       |            0 |                           |
| +                       |            0 |                           |
| -                       |            0 |                           |
| /                       |            0 |                           |
| <                       |            0 |                           |
| <=                      |            0 |                           |
| <>                      |            0 |                           |
| =                       |            0 |                           |
+-------------------------+--------------+---------------------------+
```

显示以`"today"`开头的函数：

```sql
SHOW FUNCTIONS LIKE 'today%';

+--------------+--------------+-------------+
| name         | is_aggregate | description |
+--------------+--------------+-------------+
| today        |            0 |             |
| todayofmonth |            0 |             |
| todayofweek  |            0 |             |
| todayofyear  |            0 |             |
+--------------+--------------+-------------+
```

使用`WHERE`显示以`"today"`开头的函数：

```sql
SHOW FUNCTIONS WHERE name LIKE 'today%';

+--------------+--------------+-------------+
| name         | is_aggregate | description |
+--------------+--------------+-------------+
| today        |            0 |             |
| todayofmonth |            0 |             |
| todayofweek  |            0 |             |
| todayofyear  |            0 |             |
+--------------+--------------+-------------+
```