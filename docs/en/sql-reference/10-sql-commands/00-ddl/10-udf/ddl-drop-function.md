---
title: DROP FUNCTION
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.116"/>

Drops a user-defined function or Tabular SQL UDF (UDTF).

## Syntax

```sql
DROP FUNCTION [ IF EXISTS ] <function_name>
```

## Examples

### Dropping Lambda UDF
```sql
DROP FUNCTION a_plus_3;

SELECT a_plus_3(2);
ERROR 1105 (HY000): Code: 2602, Text = Unknown Function a_plus_3 (while in analyze select projection).
```

### Dropping Tabular SQL UDF
```sql
DROP FUNCTION get_employees;

SELECT * FROM get_employees();
ERROR 1105 (HY000): Code: 2602, Text = Unknown Function get_employees (while in analyze select projection).
```