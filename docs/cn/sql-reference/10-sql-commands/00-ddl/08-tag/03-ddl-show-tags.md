---
title: SHOW TAGS
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.863"/>

列出当前租户中的 Tag 定义。也可以通过 `system.tags` 表查询 Tag 定义。

另请参阅：[CREATE TAG](01-ddl-create-tag.md)、[DROP TAG](02-ddl-drop-tag.md)

## 语法

```sql
SHOW TAGS [ LIKE '<pattern>' | WHERE <expr> ] [ LIMIT <n> ]
```

## 输出列

| 列                | 描述                                          |
|------------------|----------------------------------------------|
| `name`           | Tag 名称                                       |
| `allowed_values` | 允许值列表，如果接受任意值则为 NULL                |
| `comment`        | Tag 描述                                       |
| `created_on`     | 创建时间戳                                     |

## 示例

显示所有 Tag：

```sql
SHOW TAGS;
```

按名称模式过滤 Tag：

```sql
SHOW TAGS LIKE 'env%';
```

使用 WHERE 条件过滤：

```sql
SHOW TAGS WHERE comment IS NOT NULL;
```

限制结果数量：

```sql
SHOW TAGS LIMIT 5;
```

使用系统表的等效查询：

```sql
SELECT * FROM system.tags;
```
