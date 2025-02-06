---
title: SHOW WAREHOUSES
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.687"/>

返回所有现有集群的列表以及它们的类型和状态。

## 语法

```sql
SHOW WAREHOUSES
```

## 例子

```sql
SHOW WAREHOUSES;

┌───────────────────────────────────────────┐
│    warehouse   │      type      │  status │
├────────────────┼────────────────┼─────────┤
│ test_warehouse │ System-Managed │ Running │
└───────────────────────────────────────────┘
```
