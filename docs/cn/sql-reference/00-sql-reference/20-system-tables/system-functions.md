---
title: system.functions
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.315"/>

包含关于支持的内置标量和聚合函数的信息。

另见：[SHOW FUNCTIONS](/sql/sql-commands/administration-cmds/show-functions)。

## 示例

```sql
SELECT * FROM system.functions LIMIT 10;

┌──────────────────────────────────────────────────────────────┐
│     name     │ is_aggregate │ description │ syntax │ example │
├──────────────┼──────────────┼─────────────┼────────┼─────────┤
│ abs          │ false        │             │        │         │
│ acos         │ false        │             │        │         │
│ add          │ false        │             │        │         │
│ add_days     │ false        │             │        │         │
│ add_hours    │ false        │             │        │         │
│ add_minutes  │ false        │             │        │         │
│ add_months   │ false        │             │        │         │
│ add_quarters │ false        │             │        │         │
│ add_seconds  │ false        │             │        │         │
│ add_years    │ false        │             │        │         │
└──────────────────────────────────────────────────────────────┘
```