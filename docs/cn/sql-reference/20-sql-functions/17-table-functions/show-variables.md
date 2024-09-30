---
title: SHOW_VARIABLES
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本: v1.2.634"/>

显示所有会话变量及其详细信息，例如名称、值和类型。

另请参见：[SHOW VARIABLES](/sql/sql-commands/ddl/variable/show-variables)

## 语法

```sql
SHOW_VARIABLES()
```

## 示例

```sql
SELECT name, value, type FROM SHOW_VARIABLES();

┌──────────────────────────┐
│  name  │  value │  type  │
├────────┼────────┼────────┤
│ y      │ 'yy'   │ String │
│ b      │ 55     │ UInt8  │
│ x      │ 'xx'   │ String │
│ a      │ 3      │ UInt8  │
└──────────────────────────┘
```
