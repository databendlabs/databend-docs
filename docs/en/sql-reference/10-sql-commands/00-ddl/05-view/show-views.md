---
title: SHOW VIEWS
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.383"/>

Returns a list of view names within the specified database, or within the current database if no database name is provided.

## Syntax

```sql
SHOW VIEWS 
    [ { FROM | IN } <database_name> ] 
    [ LIKE '<pattern>' | WHERE <expr> ]
```

| Parameter | Description                                                                                  |
|-----------|----------------------------------------------------------------------------------------------|
| FROM / IN | Specifies a database. If omitted, the command returns the results from the current database. |
| LIKE      | Filters the view names using case-sensitive pattern matching with the `%` wildcard.          |
| WHERE     | Filters the view names using an expression in the WHERE clause.                              |

## Examples

The following examples demonstrate how to filter out a view named "employee_info" using the `LIKE` and `WHERE` parameters:

```sql
-- List views starting with 'employee_' in the current database
SHOW VIEWS LIKE 'employee_%';

┌──────────────────┐
│ Views_in_default │
├──────────────────┤
│ employee_info    │
└──────────────────┘

SHOW VIEWS WHERE name LIKE 'employee_%';

┌──────────────────┐
│ Views_in_default │
├──────────────────┤
│ employee_info    │
└──────────────────┘

-- Show the view named 'employee_info' in the current database
SHOW VIEWS WHERE name = 'employee_info';

┌──────────────────┐
│ Views_in_default │
├──────────────────┤
│ employee_info    │
└──────────────────┘
```