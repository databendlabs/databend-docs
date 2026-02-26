---
title: 结构化与半结构化函数
---

Databend 中的结构化与半结构化函数能够高效处理数组（Array）、对象（Object）、映射（Map）、JSON 以及其他结构化数据格式。这些函数为创建、解析、查询、转换和操作结构化及半结构化数据提供了全面的能力。

## JSON 函数

### 解析与验证
| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [PARSE_JSON](semi-structured-functions/json/parse-json) | 将 JSON 字符串解析为 VARIANT 值 | `PARSE_JSON('[1,2,3]')` |
| [CHECK_JSON](semi-structured-functions/json/check-json) | 验证字符串是否为有效 JSON | `CHECK_JSON('{"a":1}')` |
| [JSON_TYPEOF](semi-structured-functions/json/json-typeof) | 返回 JSON 值的类型 | `JSON_TYPEOF(PARSE_JSON('[1,2,3]'))` |

### 基于路径的查询
| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_PATH_EXISTS](semi-structured-functions/json/json-path-exists) | 检查 JSON 路径是否存在 | `JSON_PATH_EXISTS(json_obj, '$.name')` |
| [JSON_PATH_QUERY](semi-structured-functions/json/json-path-query) | 使用 JSONPath 查询 JSON 数据 | `JSON_PATH_QUERY(json_obj, '$.items[*]')` |
| [JSON_PATH_QUERY_ARRAY](semi-structured-functions/json/json-path-query-array) | 查询 JSON 数据并以数组形式返回结果 | `JSON_PATH_QUERY_ARRAY(json_obj, '$.items')` |
| [JSON_PATH_QUERY_FIRST](semi-structured-functions/json/json-path-query-first) | 返回 JSON 路径查询的第一个结果 | `JSON_PATH_QUERY_FIRST(json_obj, '$.items[*]')` |
| [JSON_PATH_MATCH](semi-structured-functions/json/json-path-match) | 根据路径模式匹配 JSON 值 | `JSON_PATH_MATCH(json_obj, '$.age')` |
| [JQ](semi-structured-functions/json/jq) | 使用 jq 语法进行高级 JSON 处理 | `JQ('.name', json_obj)` |

### 值提取
| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [GET](semi-structured-functions/json/get) | 通过键从 JSON 对象或通过索引从数组中获取值 | `GET(PARSE_JSON('[1,2,3]'), 0)` |
| [GET_PATH](semi-structured-functions/json/get-path) | 使用路径表达式从 JSON 对象中获取值 | `GET_PATH(json_obj, 'user.name')` |
| [GET_IGNORE_CASE](semi-structured-functions/json/get-ignore-case) | 以不区分大小写的键匹配方式获取值 | `GET_IGNORE_CASE(json_obj, 'NAME')` |
| [JSON_EXTRACT_PATH_TEXT](semi-structured-functions/json/json-extract-path-text) | 使用路径从 JSON 中提取文本值 | `JSON_EXTRACT_PATH_TEXT(json_obj, 'name')` |

### 转换与输出
| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_TO_STRING](semi-structured-functions/json/json-to-string) | 将 JSON 值转换为字符串 | `JSON_TO_STRING(PARSE_JSON('{"a":1}'))` |
| [JSON_PRETTY](semi-structured-functions/json/json-pretty) | 使用适当缩进格式化 JSON | `JSON_PRETTY(PARSE_JSON('{"a":1}'))` |
| [STRIP_NULL_VALUE](semi-structured-functions/json/strip-null-value) | 从 JSON 中移除 null 值 | `STRIP_NULL_VALUE(PARSE_JSON('{"a":1,"b":null}'))` |

### 数组/对象展开
| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_EACH](semi-structured-functions/json/json-each) | 将 JSON 对象展开为键值对 | `JSON_EACH(PARSE_JSON('{"a":1,"b":2}'))` |
| [JSON_ARRAY_ELEMENTS](semi-structured-functions/json/json-array-elements) | 将 JSON 数组展开为单个元素 | `JSON_ARRAY_ELEMENTS(PARSE_JSON('[1,2,3]'))` |

## 数组函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [ARRAY_CONSTRUCT](semi-structured-functions/array/array-construct) | 从单个值创建数组 | `ARRAY_CONSTRUCT(1, 2, 3)` |
| [RANGE](semi-structured-functions/array/range) | 生成连续数字的数组 | `RANGE(1, 5)` |
| [GET](semi-structured-functions/array/get) | 通过索引从数组中获取元素 | `GET(PARSE_JSON('[1,2,3]'), 0)` |
| [ARRAY_GET](semi-structured-functions/array/array-get) | GET 函数的别名 | `ARRAY_GET([1,2,3], 1)` |
| [CONTAINS](semi-structured-functions/array/contains) | 检查数组是否包含特定值 | `CONTAINS([1,2,3], 2)` |
| [ARRAY_CONTAINS](semi-structured-functions/array/array-contains) | 检查数组是否包含特定值 | `ARRAY_CONTAINS([1,2,3], 2)` |
| [ARRAY_APPEND](semi-structured-functions/array/array-append) | 将元素追加到数组末尾 | `ARRAY_APPEND([1,2], 3)` |
| [ARRAY_PREPEND](semi-structured-functions/array/array-prepend) | 将元素前插到数组开头 | `ARRAY_PREPEND([2,3], 1)` |
| [ARRAY_INSERT](semi-structured-functions/array/array-insert) | 在指定位置插入元素 | `ARRAY_INSERT([1,3], 1, 2)` |
| [ARRAY_REMOVE](semi-structured-functions/array/array-remove) | 移除所有出现的指定元素 | `ARRAY_REMOVE([1,2,2,3], 2)` |
| [ARRAY_REMOVE_FIRST](semi-structured-functions/array/array-remove-first) | 从数组中移除第一个元素 | `ARRAY_REMOVE_FIRST([1,2,3])` |
| [ARRAY_REMOVE_LAST](semi-structured-functions/array/array-remove-last) | 从数组中移除最后一个元素 | `ARRAY_REMOVE_LAST([1,2,3])` |
| [ARRAY_CONCAT](semi-structured-functions/array/array-concat) | 连接多个数组 | `ARRAY_CONCAT([1,2], [3,4])` |
| [ARRAY_SLICE](semi-structured-functions/array/array-slice) | 提取数组的一部分 | `ARRAY_SLICE([1,2,3,4], 1, 2)` |
| [SLICE](semi-structured-functions/array/slice) | ARRAY_SLICE 函数的别名 | `SLICE([1,2,3,4], 1, 2)` |
| [ARRAYS_ZIP](semi-structured-functions/array/arrays-zip) | 按元素方式组合多个数组 | `ARRAYS_ZIP([1,2], ['a','b'])` |
| [ARRAY_DISTINCT](semi-structured-functions/array/array-distinct) | 从数组中返回唯一元素 | `ARRAY_DISTINCT([1,2,2,3])` |
| [ARRAY_UNIQUE](semi-structured-functions/array/array-unique) | ARRAY_DISTINCT 函数的别名 | `ARRAY_UNIQUE([1,2,2,3])` |
| [ARRAY_INTERSECTION](semi-structured-functions/array/array-intersection) | 返回数组之间的共同元素 | `ARRAY_INTERSECTION([1,2,3], [2,3,4])` |
| [ARRAY_EXCEPT](semi-structured-functions/array/array-except) | 返回存在于第一个数组但不存在于第二个数组中的元素 | `ARRAY_EXCEPT([1,2,3], [2,3])` |
| [ARRAY_OVERLAP](semi-structured-functions/array/array-overlap) | 检查数组是否有共同元素 | `ARRAY_OVERLAP([1,2], [2,3])` |
| [ARRAY_TRANSFORM](semi-structured-functions/array/array-transform) | 对每个数组元素应用函数 | `ARRAY_TRANSFORM([1,2,3], x -> x * 2)` |
| [ARRAY_FILTER](semi-structured-functions/array/array-filter) | 根据条件筛选数组元素 | `ARRAY_FILTER([1,2,3,4], x -> x > 2)` |
| [ARRAY_REDUCE](semi-structured-functions/array/array-reduce) | 使用聚合将数组归约为单个值 | `ARRAY_REDUCE([1,2,3], 0, (acc, x) -> acc + x)` |
| [ARRAY_AGGREGATE](semi-structured-functions/array/array-aggregate) | 使用函数聚合数组元素 | `ARRAY_AGGREGATE([1,2,3], 'sum')` |
| [ARRAY_COMPACT](semi-structured-functions/array/array-compact) | 从数组中移除 null 值 | `ARRAY_COMPACT([1, NULL, 2, NULL, 3])` |
| [ARRAY_FLATTEN](semi-structured-functions/array/array-flatten) | 将嵌套数组展平为单个数组 | `ARRAY_FLATTEN([[1,2], [3,4]])` |
| [ARRAY_REVERSE](semi-structured-functions/array/array-reverse) | 反转数组元素的顺序 | `ARRAY_REVERSE([1,2,3])` |
| [ARRAY_INDEXOF](semi-structured-functions/array/array-indexof) | 返回元素首次出现的索引 | `ARRAY_INDEXOF([1,2,3,2], 2)` |
| [UNNEST](semi-structured-functions/array/unnest) | 将数组展开为单独的行 | `UNNEST([1,2,3])` |

## 对象函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [OBJECT_CONSTRUCT](semi-structured-functions/object/object-construct) | 从键值对创建 JSON 对象 | `OBJECT_CONSTRUCT('name', 'John', 'age', 30)` |
| [OBJECT_CONSTRUCT_KEEP_NULL](semi-structured-functions/object/object-construct-keep-null) | 创建 JSON 对象并保留 null 值 | `OBJECT_CONSTRUCT_KEEP_NULL('a', 1, 'b', NULL)` |
| [OBJECT_KEYS](semi-structured-functions/object/object-keys) | 以数组形式返回 JSON 对象的所有键 | `OBJECT_KEYS(PARSE_JSON('{"a":1,"b":2}'))` |
| [OBJECT_INSERT](semi-structured-functions/object/object-insert) | 在 JSON 对象中插入或更新键值对 | `OBJECT_INSERT(json_obj, 'new_key', 'value')` |
| [OBJECT_DELETE](semi-structured-functions/object/object-delete) | 从 JSON 对象中移除键值对 | `OBJECT_DELETE(json_obj, 'key_to_remove')` |
| [OBJECT_PICK](semi-structured-functions/object/object-pick) | 使用指定键创建新对象 | `OBJECT_PICK(json_obj, 'name', 'age')` |

## 映射函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_CAT](semi-structured-functions/map/map-cat) | 将多个映射合并为单个映射 | `MAP_CAT({'a':1}, {'b':2})` |
| [MAP_KEYS](semi-structured-functions/map/map-keys) | 以数组形式返回映射的所有键 | `MAP_KEYS({'a':1, 'b':2})` |
| [MAP_VALUES](semi-structured-functions/map/map-values) | 以数组形式返回映射的所有值 | `MAP_VALUES({'a':1, 'b':2})` |
| [MAP_SIZE](semi-structured-functions/map/map-size) | 返回映射中键值对的数量 | `MAP_SIZE({'a':1, 'b':2})` |
| [MAP_CONTAINS_KEY](semi-structured-functions/map/map-contains-key) | 检查映射是否包含特定键 | `MAP_CONTAINS_KEY({'a':1}, 'a')` |
| [MAP_INSERT](semi-structured-functions/map/map-insert) | 向映射中插入键值对 | `MAP_INSERT({'a':1}, 'b', 2)` |
| [MAP_DELETE](semi-structured-functions/map/map-delete) | 从映射中移除键值对 | `MAP_DELETE({'a':1, 'b':2}, 'b')` |
| [MAP_TRANSFORM_KEYS](semi-structured-functions/map/map-transform-keys) | 对映射中的每个键应用函数 | `MAP_TRANSFORM_KEYS(map, k -> UPPER(k))` |
| [MAP_TRANSFORM_VALUES](semi-structured-functions/map/map-transform-values) | 对映射中的每个值应用函数 | `MAP_TRANSFORM_VALUES(map, v -> v * 2)` |
| [MAP_FILTER](semi-structured-functions/map/map-filter) | 根据谓词筛选键值对 | `MAP_FILTER(map, (k, v) -> v > 10)` |
| [MAP_PICK](semi-structured-functions/map/map-pick) | 使用指定键创建新映射 | `MAP_PICK({'a':1, 'b':2, 'c':3}, 'a', 'c')` |

## 类型转换函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [AS_BOOLEAN](semi-structured-functions/conversion/as-boolean) | 将 VARIANT 值转换为 BOOLEAN | `AS_BOOLEAN(PARSE_JSON('true'))` |
| [AS_INTEGER](semi-structured-functions/conversion/as-integer) | 将 VARIANT 值转换为 BIGINT | `AS_INTEGER(PARSE_JSON('42'))` |
| [AS_FLOAT](semi-structured-functions/conversion/as-float) | 将 VARIANT 值转换为 DOUBLE | `AS_FLOAT(PARSE_JSON('3.14'))` |
| [AS_DECIMAL](semi-structured-functions/conversion/as-decimal) | 将 VARIANT 值转换为 DECIMAL | `AS_DECIMAL(PARSE_JSON('12.34'))` |
| [AS_STRING](semi-structured-functions/conversion/as-string) | 将 VARIANT 值转换为 STRING | `AS_STRING(PARSE_JSON('"hello"'))` |
| [AS_BINARY](semi-structured-functions/conversion/as-binary) | 将 VARIANT 值转换为 BINARY | `AS_BINARY(TO_BINARY('abcd')::VARIANT)` |
| [AS_DATE](semi-structured-functions/conversion/as-date) | 将 VARIANT 值转换为 DATE | `AS_DATE(TO_DATE('2025-10-11')::VARIANT)` |
| [AS_ARRAY](semi-structured-functions/conversion/as-array) | 将 VARIANT 值转换为 ARRAY | `AS_ARRAY(PARSE_JSON('[1,2,3]'))` |
| [AS_OBJECT](semi-structured-functions/conversion/as-object) | 将 VARIANT 值转换为 OBJECT | `AS_OBJECT(PARSE_JSON('{"a":1}'))` |

## 类型谓词函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [IS_ARRAY](semi-structured-functions/type-predicate/is-array) | 检查 JSON 值是否为 ARRAY | `IS_ARRAY(PARSE_JSON('[1,2,3]'))` |
| [IS_OBJECT](semi-structured-functions/type-predicate/is-object) | 检查 JSON 值是否为 OBJECT | `IS_OBJECT(PARSE_JSON('{"a":1}'))` |
| [IS_STRING](semi-structured-functions/type-predicate/is-string) | 检查 JSON 值是否为 STRING | `IS_STRING(PARSE_JSON('"hello"'))` |
| [IS_INTEGER](semi-structured-functions/type-predicate/is-integer) | 检查 JSON 值是否为整数 | `IS_INTEGER(PARSE_JSON('42'))` |
| [IS_FLOAT](semi-structured-functions/type-predicate/is-float) | 检查 JSON 值是否为浮点数 | `IS_FLOAT(PARSE_JSON('3.14'))` |
| [IS_BOOLEAN](semi-structured-functions/type-predicate/is-boolean) | 检查 JSON 值是否为 BOOLEAN | `IS_BOOLEAN(PARSE_JSON('true'))` |
| [IS_NULL_VALUE](semi-structured-functions/type-predicate/is-null-value) | 检查 JSON 值是否为 null | `IS_NULL_VALUE(PARSE_JSON('null'))` |