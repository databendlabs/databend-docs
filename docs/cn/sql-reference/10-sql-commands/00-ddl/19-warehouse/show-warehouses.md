---
title: SHOW WAREHOUSES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

返回一个包含所有已存在的计算集群及其类型和状态的列表。

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