---
title: 显示数据库
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.290"/>

显示实例上存在的数据库列表。

## 语法

```sql
SHOW [FULL] DATABASES 
    [LIKE '<pattern>' | WHERE <expr>]
```

| 参数      | 描述                                                                                                                 |
|-----------|----------------------------------------------------------------------------------------------------------------------|
| FULL      | 列出结果时附带额外信息。更多详情见[示例](#examples)。                                                               |
| LIKE      | 使用大小写敏感的模式匹配来过滤结果。                                                                                |
| WHERE     | 使用WHERE子句中的表达式来过滤结果。                                                                                 |

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