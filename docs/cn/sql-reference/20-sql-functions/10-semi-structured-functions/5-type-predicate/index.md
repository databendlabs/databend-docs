---
title: 类型谓词函数 (Type Predicate Functions)
---

本节提供了 Databend 中类型谓词函数的参考信息。这些函数可以对 JSON 值进行类型检查 (Type Checking)、验证和转换。

## 类型检查

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [IS_ARRAY](type-predicate/is-array) | 检查 JSON 值是否为数组 | `IS_ARRAY('[1,2,3]')` → `true` |
| [IS_OBJECT](type-predicate/is-object) | 检查 JSON 值是否为对象 | `IS_OBJECT('{"key":"value"}')` → `true` |
| [IS_STRING](type-predicate/is-string) | 检查 JSON 值是否为字符串 | `IS_STRING('"hello"')` → `true` |
| [IS_INTEGER](type-predicate/is-integer) | 检查 JSON 值是否为整数 | `IS_INTEGER('42')` → `true` |
| [IS_FLOAT](type-predicate/is-float) | 检查 JSON 值是否为浮点数 | `IS_FLOAT('3.14')` → `true` |
| [IS_BOOLEAN](type-predicate/is-boolean) | 检查 JSON 值是否为布尔值 | `IS_BOOLEAN('true')` → `true` |
| [IS_NULL_VALUE](type-predicate/is-null-value) | 检查 JSON 值是否为 null | `IS_NULL_VALUE('null')` → `true` |