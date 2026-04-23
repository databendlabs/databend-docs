---
title: JSON_STRIP_NULLS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

从 JSON 对象中移除所有值为 null 的属性。

## 语法

```sql
JSON_STRIP_NULLS(<variant_expr>)
```

## 参数

VARIANT 类型的表达式。

## 返回类型

VARIANT 类型。

## 示例

```sql
SELECT JSON_STRIP_NULLS(PARSE_JSON('{"name": "Alice", "age": 30, "city": null}')) AS value;

╭───────────────────────────╮
│           value           │
├───────────────────────────┤
│ {"age":30,"name":"Alice"} │
╰───────────────────────────╯
```
