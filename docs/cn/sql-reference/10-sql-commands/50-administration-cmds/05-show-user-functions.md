---
title: SHOW USER FUNCTIONS
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.315"/>

列出系统中已存在的用户自定义函数和外部函数。等效于 `SELECT name, is_aggregate, description, arguments, language FROM system.user_functions ...`。

另请参阅：[system.user_functions](../../00-sql-reference/31-system-tables/system-user-functions.md)

## 语法

```sql
SHOW USER FUNCTIONS [LIKE '<pattern>' | WHERE <expr>] | [LIMIT <limit>]
```

## 示例

```sql
SHOW USER FUNCTIONS;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      name      │    is_aggregate   │ description │                         arguments                         │ language │
├────────────────┼───────────────────┼─────────────┼───────────────────────────────────────────────────────────┼──────────┤
│ binary_reverse │ NULL              │             │ {"arg_types":["Binary NULL"],"return_type":"Binary NULL"} │ python   │
│ echo           │ NULL              │             │ {"arg_types":["String NULL"],"return_type":"String NULL"} │ python   │
│ isnotempty     │ NULL              │             │ {"parameters":["p"]}                                      │ SQL      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```