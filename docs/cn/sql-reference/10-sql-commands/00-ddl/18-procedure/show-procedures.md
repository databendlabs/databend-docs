---
title: SHOW PROCEDURES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.637"/>

返回系统中所有存储过程的列表。

## 语法

```sql
SHOW PROCEDURES
```

## 示例

```sql
SHOW PROCEDURES;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       name       │ procedure_id │                        arguments                        │            comment           │       description      │         created_on         │
├──────────────────┼──────────────┼─────────────────────────────────────────────────────────┼──────────────────────────────┼────────────────────────┼────────────────────────────┤
│ convert_kg_to_lb │         2104 │ convert_kg_to_lb(Decimal(4, 2)) RETURN (Decimal(10, 2)) │ Converts kilograms to pounds │ user-defined procedure │ 2024-11-07 04:12:25.243143 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```