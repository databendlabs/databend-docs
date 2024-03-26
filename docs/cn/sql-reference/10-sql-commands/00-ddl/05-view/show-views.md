---
title: SHOW VIEWS
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.383"/>

返回指定数据库中的视图名称列表，如果没有提供数据库名称，则返回当前数据库中的视图名称列表。

## 语法

```sql
SHOW VIEWS 
    [ { FROM | IN } <database_name> ] 
    [ LIKE '<pattern>' | WHERE <expr> ]
```

| 参数       | 描述                                                                                   |
|------------|----------------------------------------------------------------------------------------|
| FROM / IN  | 指定一个数据库。如果省略，命令将从当前数据库返回结果。                                   |
| LIKE       | 使用大小写敏感的模式匹配和 `%` 通配符过滤视图名称。                                      |
| WHERE      | 使用 WHERE 子句中的表达式过滤视图名称。                                                 |

## 示例

以下示例演示如何使用 `LIKE` 和 `WHERE` 参数过滤出名为 "employee_info" 的视图：

```sql
-- 在当前数据库中列出以 'employee_' 开头的视图
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

-- 在当前数据库中显示名为 'employee_info' 的视图
SHOW VIEWS WHERE name = 'employee_info';

┌──────────────────┐
│ Views_in_default │
├──────────────────┤
│ employee_info    │
└──────────────────┘
```