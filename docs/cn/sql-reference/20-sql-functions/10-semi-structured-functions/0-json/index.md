---
title: JSON 函数
---

本节提供 Databend 中 JSON 函数的参考信息。JSON 函数支持解析、验证、查询和操作 JSON 数据结构。

## JSON 解析与验证

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [PARSE_JSON](parse-json) | 将 JSON 字符串解析为 VARIANT 值 | `PARSE_JSON('{"name":"John","age":30}')` → `{"name":"John","age":30}` |
| [CHECK_JSON](check-json) | 验证字符串是否为有效 JSON | `CHECK_JSON('{"valid": true}')` → `true` |

## JSON 类型信息

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [JSON_TYPEOF](json-typeof) | 返回 JSON 值的类型 | `JSON_TYPEOF('{"key": "value"}')` → `'OBJECT'` |

## JSON 转换

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [JSON_TO_STRING](json-to-string) | 将 JSON 值转换为字符串 | `JSON_TO_STRING({"name":"John"})` → `'{"name":"John"}'` |

## JSON 路径操作

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [JSON_PATH_EXISTS](json-path-exists) | 检查 JSON 路径是否存在 | `JSON_PATH_EXISTS('{"a":1}', '$.a')` → `true` |
| [JSON_PATH_MATCH](json-path-match) | 按路径模式匹配 JSON 值 | `JSON_PATH_MATCH('{"items":[1,2,3]}', '$.items[*]')` → `[1,2,3]` |
| [JSON_PATH_QUERY](json-path-query) | 使用 JSONPath 查询 JSON 数据 | `JSON_PATH_QUERY('{"a":1,"b":2}', '$.a')` → `1` |
| [JSON_PATH_QUERY_ARRAY](json-path-query-array) | 查询 JSON 数据并以数组形式返回结果 | `JSON_PATH_QUERY_ARRAY('[1,2,3]', '$[*]')` → `[1,2,3]` |
| [JSON_PATH_QUERY_FIRST](json-path-query-first) | 返回 JSON 路径查询的第一个结果 | `JSON_PATH_QUERY_FIRST('[1,2,3]', '$[*]')` → `1` |

## JSON 数据提取

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [GET](get) | 按索引或字段名从 JSON 提取值 | `GET('{"name":"John"}', 'name')` → `"John"` |
| [GET_IGNORE_CASE](get-ignore-case) | 以不区分大小写的方式按字段名提取值 | `GET_IGNORE_CASE('{"Name":"John"}', 'name')` → `"John"` |
| [GET_BY_KEYPATH](get-by-keypath) | 使用 `{segment}` 键路径提取嵌套值 | `GET_BY_KEYPATH('{"user":{"name":"Ada"}}', '{user,name}')` → `"Ada"` |
| [GET_PATH](get-path) | 使用路径表示法提取值 | `GET_PATH('{"user":{"name":"John"}}', 'user.name')` → `"John"` |
| [JSON_EXTRACT_PATH_TEXT](json-extract-path-text) | 使用路径从 JSON 提取文本值 | `JSON_EXTRACT_PATH_TEXT('{"name":"John"}', 'name')` → `'John'` |
| [JSON_EACH](json-each) | 将 JSON 对象展开为键值对 | `JSON_EACH('{"a":1,"b":2}')` → `[("a",1),("b",2)]` |
| [JSON_ARRAY_ELEMENTS](json-array-elements) | 将 JSON 数组展开为单个元素 | `JSON_ARRAY_ELEMENTS('[1,2,3]')` → `1, 2, 3` |

## JSON 格式化与处理

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [JSON_PRETTY](json-pretty) | 以适当缩进格式化 JSON | `JSON_PRETTY('{"a":1}')` → 格式化后的 JSON 字符串 |
| [STRIP_NULL_VALUE](strip-null-value) | 从 JSON 中移除 null 值 | `STRIP_NULL_VALUE('{"a":1,"b":null}')` → `{"a":1}` |
| [JQ](jq) | 使用 jq 风格查询处理 JSON | `JQ('{"name":"John"}', '.name')` → `"John"` |

## JSON 包含与键检测

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [JSON_CONTAINS_IN_LEFT](json-contains) | 判断左侧 JSON 是否包含右侧 JSON | `JSON_CONTAINS_IN_LEFT('{"a":1,"b":2}', '{"b":2}')` → `true` |
| [JSON_EXISTS_KEY](json-exists-keys) | 检查单个键是否存在 | `JSON_EXISTS_KEY('{"a":1}', 'a')` → `true` |
| [JSON_EXISTS_ANY_KEYS](json-exists-keys) | 只要键列表中任意一个存在即返回 `true` | `JSON_EXISTS_ANY_KEYS('{"a":1}', ['x','a'])` → `true` |
| [JSON_EXISTS_ALL_KEYS](json-exists-keys) | 仅当所有键都存在时返回 `true` | `JSON_EXISTS_ALL_KEYS('{"a":1,"b":2}', ['a','b'])` → `true` |
