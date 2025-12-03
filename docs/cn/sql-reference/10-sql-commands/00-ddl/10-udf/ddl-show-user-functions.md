---
title: SHOW USER FUNCTIONS
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.558"/>

列出所有用户定义函数（User-Defined Function，UDF），包括标量函数（Scalar Function）、表函数（Table Function）、嵌入式函数（Embedded Function）和外部函数（External Function）。

## 语法

```sql
SHOW USER FUNCTIONS
```

## 输出列

| 列 | 描述 |
|--------|-------------|
| `name` | 函数名称 |
| `is_aggregate` | 是否为聚合函数（对于 UDF 为 NULL） |
| `description` | 函数描述（如果提供） |
| `arguments` | 函数参数，以 JSON 格式表示 |
| `language` | 编程语言：SQL、python、javascript、wasm 或 external |
| `created_on` | 函数创建时间戳 |

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