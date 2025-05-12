---
title: SHOW DATABASES
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.290"/>

显示实例上存在的数据库列表。

另请参阅：[system.databases](../../../00-sql-reference/31-system-tables/system-databases.md)

## 语法

```sql
SHOW [ FULL ] DATABASES 
    [ LIKE '<pattern>' | WHERE <expr> ]
```

| 参数    | 描述                                                                                                                     |
|-----------|-----------------------------------------------------------------------------------------------------------------------------|
| FULL      | 列出包含附加信息的结果。 有关更多详细信息，请参见 [示例](#examples)。                                                                 |
| LIKE      | 使用区分大小写的模式匹配按名称过滤结果。                                                                                        |
| WHERE     | 使用 WHERE 子句中的表达式过滤结果。                                                                                             |

## 示例

```sql
SHOW DATABASES;

┌──────────────────────┐
│ databases_in_default │
├──────────────────────┤
│ canada               │
│ china                │
│ default              │
│ information_schema   │
│ system               │
│ test                 │
└──────────────────────┘

SHOW FULL DATABASES;

┌───────────────────────────────────────────────────┐
│ catalog │       owner      │ databases_in_default │
├─────────┼──────────────────┼──────────────────────┤
│ default │ account_admin    │ canada               │
│ default │ account_admin    │ china                │
│ default │ NULL             │ default              │
│ default │ NULL             │ information_schema   │
│ default │ NULL             │ system               │
│ default │ account_admin    │ test                 │
└───────────────────────────────────────────────────┘
```