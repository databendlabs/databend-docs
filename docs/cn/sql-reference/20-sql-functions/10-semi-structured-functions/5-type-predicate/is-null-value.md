---
title: IS_NULL_VALUE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.368"/>

检查输入值是否为 JSON `null`。请注意，此函数用于检查 JSON `null` 而非 SQL NULL。要检查值是否为 SQL NULL，请使用 [IS_NULL](../../03-conditional-functions/is-null.md)。

```json title='JSON null 示例：'
{
  "name": "John",
  "age": null
}   
```

## 语法

```sql
IS_NULL_VALUE( <expr> )
```

## 返回类型

若输入值为 JSON `null` 则返回 `true`，否则返回 `false`。

## 示例

```sql
SELECT
  IS_NULL_VALUE(PARSE_JSON('{"name":"John", "age":null}') :age), --JSON null 值
  IS_NULL(NULL); --SQL NULL 值

┌──────────────────────────────────────────────────────────────────────────────┐
│ is_null_value(parse_json('{"name":"john", "age":null}'):age) │ is_null(null) │
├──────────────────────────────────────────────────────────────┼───────────────┤
│ true                                                         │ true          │
└──────────────────────────────────────────────────────────────────────────────┘
```