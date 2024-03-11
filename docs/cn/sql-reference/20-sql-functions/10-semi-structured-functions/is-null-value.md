---
title: IS_NULL_VALUE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.368"/>

检查输入值是否为JSON `null`。请注意，此函数检查的是JSON `null`，而不是SQL NULL。要检查一个值是否为SQL NULL，请使用[IS_NULL](../03-conditional-functions/is-null.md)。

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

如果输入值是JSON `null`，则返回`true`，否则返回`false`。

## 示例

```sql
SELECT
  IS_NULL_VALUE(PARSE_JSON('{"name":"John", "age":null}') :age), --JSON null
  IS_NULL(NULL); --SQL NULL

┌──────────────────────────────────────────────────────────────────────────────┐
│ is_null_value(parse_json('{"name":"john", "age":null}'):age) │ is_null(null) │
├──────────────────────────────────────────────────────────────┼───────────────┤
│ true                                                         │ true          │
└──────────────────────────────────────────────────────────────────────────────┘
```