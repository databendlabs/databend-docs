---
title: STRIP_NULL_VALUE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

将 JSON 的 null 值转换为 SQL 的 NULL 值。所有其它 Variant 值均保持不变。

## 语法

```sql
STRIP_NULL_VALUE(<variant_expr>)
```

## 参数

VARIANT 类型的表达式。

## 返回类型

- 如果表达式为 JSON 的 null 值，则该函数返回 SQL NULL。
- 如果表达式不是 JSON 的 null 值，则该函数返回输入值。

## 示例

```sql
SELECT STRIP_NULL_VALUE(PARSE_JSON('null')) AS value;

╭───────╮
│ value │
├───────┤
│ NULL  │
╰───────╯

SELECT STRIP_NULL_VALUE(PARSE_JSON('{"name": "Alice", "age": 30, "city": null}')) AS value;

╭───────────────────────────────────────╮
│                 value                 │
├───────────────────────────────────────┤
│ {"age":30,"city":null,"name":"Alice"} │
╰───────────────────────────────────────╯
```
