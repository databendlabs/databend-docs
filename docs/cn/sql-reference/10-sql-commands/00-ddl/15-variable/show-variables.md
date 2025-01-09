---
title: SHOW VARIABLES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.634"/>

显示所有会话变量及其详细信息，如名称、值和类型。

另请参阅：[SHOW_VARIABLES](/sql/sql-functions/table-functions/show-variables)

## 语法

```sql
SHOW VARIABLES [ LIKE '<pattern>' | WHERE <expr> ]
```

## 示例

以下示例列出了所有会话变量及其值和类型：

```sql
SHOW VARIABLES;

┌──────────────────────────┐
│  name  │  value │  type  │
├────────┼────────┼────────┤
│ a      │ 3      │ UInt8  │
│ b      │ 55     │ UInt8  │
│ x      │ 'xx'   │ String │
│ y      │ 'yy'   │ String │
└──────────────────────────┘
```

要过滤并仅返回名为 `a` 的变量，请使用以下查询之一：

```sql
SHOW VARIABLES LIKE 'a';

SHOW VARIABLES WHERE name = 'a';
```