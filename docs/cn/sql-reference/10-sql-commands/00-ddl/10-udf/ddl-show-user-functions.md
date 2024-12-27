---
title: SHOW USER FUNCTIONS
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.558"/>

列出所有用户自定义函数（UDFs），包括它们的名称、类型、描述、参数、语言和创建时间戳。

## 语法

```sql
SHOW USER FUNCTIONS
```

## 示例

```sql
SHOW USER FUNCTIONS;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  name  │    is_aggregate   │ description │           arguments           │ language │         created_on         │
│ String │ Nullable(Boolean) │    String   │            Variant            │  String  │          Timestamp         │
├────────┼───────────────────┼─────────────┼───────────────────────────────┼──────────┼────────────────────────────┤
│ get_v1 │ NULL              │             │ {"parameters":["input_json"]} │ SQL      │ 2024-11-18 23:20:28.432842 │
│ get_v2 │ NULL              │             │ {"parameters":["input_json"]} │ SQL      │ 2024-11-18 23:21:46.838744 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```