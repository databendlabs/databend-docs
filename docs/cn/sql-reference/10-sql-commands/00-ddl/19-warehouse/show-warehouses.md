---
title: SHOW WAREHOUSES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

返回所有现有计算集群的列表，以及它们的类型和状态。

## 语法

```sql
SHOW WAREHOUSES
```

## 示例

```sql
SHOW WAREHOUSES;

┌───────────────────────────────────────────┐
│    warehouse   │      type      │  status │
├────────────────┼────────────────┼─────────┤
│ test_warehouse │ System-Managed │ Running │
└───────────────────────────────────────────┘
```