---
title: 类型谓词函数 (Type Predicate Functions)
---

本节提供了 Databend 中类型谓词函数的参考信息。这些函数可以对 JSON (JavaScript Object Notation) 值进行类型检查、验证和转换。

## 类型检查 (Type Checking)

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [IS_ARRAY](is-array) | 检查 JSON 值是否为数组 (Array) | `IS_ARRAY('[1,2,3]')` → `true` |
| [IS_OBJECT](is-object) | 检查 JSON 值是否为对象 (Object) | `IS_OBJECT('{"key":"value"}')` → `true` |
| [IS_STRING](is-string) | 检查 JSON 值是否为字符串 (String) | `IS_STRING('"hello"')` → `true` |
| [IS_INTEGER](is-integer) | 检查 JSON 值是否为整数 (Integer) | `IS_INTEGER('42')` → `true` |
| [IS_FLOAT](is-float) | 检查 JSON 值是否为浮点数 (Float) | `IS_FLOAT('3.14')` → `true` |
| [IS_BOOLEAN](is-boolean) | 检查 JSON 值是否为布尔值 (Boolean) | `IS_BOOLEAN('true')` → `true` |
| [IS_NULL_VALUE](is-null-value) | 检查 JSON 值是否为 null (null) | `IS_NULL_VALUE('null')` → `true` |