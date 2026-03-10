---
title: SHOW WORKLOAD GROUPS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.743"/>

返回所有现有工作负载组及其配额的列表。

## 语法

```sql
SHOW WORKLOAD GROUPS
```

## 示例

```sql
SHOW WORKLOAD GROUPS

┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  name  │ cpu_quota │ memory_quota │ query_timeout │ max_concurrency │ query_queued_timeout │
│ String │   String  │    String    │     String    │      String     │        String        │
├────────┼───────────┼──────────────┼───────────────┼─────────────────┼──────────────────────┤
│ test   │ 30%       │              │ 15s           │                 │                      │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```