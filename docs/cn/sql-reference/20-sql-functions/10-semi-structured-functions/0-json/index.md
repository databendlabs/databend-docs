---
title: JSON 函数
---

本节提供了 Databend 中 JSON 函数的参考信息。JSON 函数支持解析、验证、查询和操作 JSON 数据结构。

## JSON 解析与验证

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [PARSE_JSON](parse-json) | 将 JSON 字符串解析为 VARIANT 值 | `PARSE_JSON('{"name":"John","age":30}')` → `{"name":"John","age":30}` |
| [CHECK_JSON](check-json) | 验证字符串是否为有效的 JSON | `CHECK_JSON('{"valid": true}')` → `true` |

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
| [JSON_PATH_MATCH](json-path-match) | 根据路径模式匹配 JSON 值 | `JSON_PATH_MATCH('{"items":[1,2,3]}', '$.items[*]')` → `[1,2,3]` |
| [JSON_PATH_QUERY](json-path-query) | 使用 JSONPath 查询 JSON 数据 | `JSON_PATH_QUERY('{"a":1,"b":2}', '$.a')` → `1` |
| [JSON_PATH_QUERY_ARRAY](json-path-query-array) | 查询 JSON 数据并以数组形式返回结果 | `JSON_PATH_QUERY_ARRAY('[1,2,3]', '$[*]')` → `[1,2,3]` |
| [JSON_PATH_QUERY_FIRST](json-path-query-first) | 返回 JSON 路径查询的第一个结果 | `JSON_PATH_QUERY_FIRST('[1,2,3]', '$[*]')` → `1` |

## JSON 数据提取

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [JSON_EXTRACT_PATH_TEXT](json-extract-path-text) | 使用路径从 JSON 中提取文本值 | `JSON_EXTRACT_PATH_TEXT('{"name":"John"}', 'name')` → `'John'` |
| [JSON_EACH](json-each) | 将 JSON 对象展开为键值对 | `JSON_EACH('{"a":1,"b":2}')` → `[("a",1),("b",2)]` |
| [JSON_ARRAY_ELEMENTS](json-array-elements) | 将 JSON 数组展开为单个元素 | `JSON_ARRAY_ELEMENTS('[1,2,3]')` → `1, 2, 3` |

## JSON 格式化与处理

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [JSON_PRETTY](json-pretty) | 使用适当的缩进格式化 JSON | `JSON_PRETTY('{"a":1}')` → 格式化后的 JSON 字符串 |
| [STRIP_NULL_VALUE](strip-null-value) | 从 JSON 中移除 null 值 | `STRIP_NULL_VALUE('{"a":1,"b":null}')` → `{"a":1}` |
| [JQ](jq) | 使用 jq 风格的查询处理 JSON | `JQ('{"name":"John"}', '.name')` → `"John"` |