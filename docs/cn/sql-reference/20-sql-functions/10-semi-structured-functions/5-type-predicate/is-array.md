---
title: IS_ARRAY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.368"/>

检查输入值是否为 JSON 数组 (JSON Array)。请注意，JSON 数组与 [ARRAY](../../../00-sql-reference/10-data-types/array.md) 数据类型不同。JSON 数组是 JSON 中常用的数据结构，表示一个由方括号 `[ ]` 包围的值的有序集合。它是一种灵活的格式，用于组织和交换各种数据类型，包括字符串、数字、布尔值、对象和空值。

```json title='JSON 数组示例：'
[
  "Apple",
  42,
  true,
  {"name": "John", "age": 30, "isStudent": false},
  [1, 2, 3],
  null
]
```

## 语法

```sql
IS_ARRAY( <expr> )
```

## 返回类型

如果输入值为 JSON 数组，则返回 `true`，否则返回 `false`。

## 示例

```sql
SELECT
  IS_ARRAY(PARSE_JSON('true')),
  IS_ARRAY(PARSE_JSON('[1,2,3]'));

┌────────────────────────────────────────────────────────────────┐
│ is_array(parse_json('true')) │ is_array(parse_json('[1,2,3]')) │
├──────────────────────────────┼─────────────────────────────────┤
│ false                        │ true                            │
└────────────────────────────────────────────────────────────────┘
```