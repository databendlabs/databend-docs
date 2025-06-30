---
title: 结构化与半结构化函数
---

Databend 中的结构化和半结构化函数能够高效处理数组（Array）、对象（Object）、映射（Map）、JSON 以及其他结构化数据格式。这些函数为创建、解析、查询、转换和操作结构化及半结构化数据提供全面的功能。

## JSON 函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [PARSE_JSON](json/parse-json) | 将 JSON 字符串解析为 VARIANT 值 | `PARSE_JSON('[1,2,3]')` |
| [CHECK_JSON](json/check-json) | 验证字符串是否为有效 JSON | `CHECK_JSON('{"a":1}')` |
| [JSON_TYPEOF](json/json-typeof) | 返回 JSON 值的类型 | `JSON_TYPEOF(PARSE_JSON('[1,2,3]'))` |
| [JSON_TO_STRING](json/json-to-string) | 将 JSON 值转换为字符串 | `JSON_TO_STRING(PARSE_JSON('{"a":1}'))` |
| [JSON_PATH_EXISTS](json/json-path-exists) | 检查 JSON 路径是否存在 | `JSON_PATH_EXISTS(json_obj, '$.name')` |
| [JSON_PATH_MATCH](json/json-path-match) | 根据路径模式匹配 JSON 值 | `JSON_PATH_MATCH(json_obj, '$.age')` |
| [JSON_PATH_QUERY](json/json-path-query) | 使用 JSONPath 查询 JSON 数据 | `JSON_PATH_QUERY(json_obj, '$.items[*]')` |
| [JSON_PATH_QUERY_ARRAY](json/json-path-query-array) | 查询 JSON 数据并以数组形式返回结果 | `JSON_PATH_QUERY_ARRAY(json_obj, '$.items')` |
| [JSON_PATH_QUERY_FIRST](json/json-path-query-first) | 返回 JSON 路径查询的首个结果 | `JSON_PATH_QUERY_FIRST(json_obj, '$.items[*]')` |
| [JSON_EXTRACT_PATH_TEXT](json/json-extract-path-text) | 使用路径从 JSON 中提取文本值 | `JSON_EXTRACT_PATH_TEXT(json_obj, 'name')` |
| [GET](json/get) | 通过键从 JSON 对象或索引从数组获取值 | `GET(PARSE_JSON('[1,2,3]'), 0)` |
| [GET_PATH](json/get-path) | 使用路径表达式从 JSON 对象获取值 | `GET_PATH(json_obj, 'user.name')` |
| [GET_IGNORE_CASE](json/get-ignore-case) | 通过不区分大小写的键匹配获取值 | `GET_IGNORE_CASE(json_obj, 'NAME')` |
| [JSON_EACH](json/json-each) | 将 JSON 对象展开为键值对 | `JSON_EACH(PARSE_JSON('{"a":1,"b":2}'))` |
| [JSON_ARRAY_ELEMENTS](json/json-array-elements) | 将 JSON 数组展开为独立元素 | `JSON_ARRAY_ELEMENTS(PARSE_JSON('[1,2,3]'))` |
| [JSON_PRETTY](json/json-pretty) | 格式化 JSON 并添加缩进 | `JSON_PRETTY(PARSE_JSON('{"a":1}'))` |
| [STRIP_NULL_VALUE](json/strip-null-value) | 从 JSON 中移除 NULL 值 | `STRIP_NULL_VALUE(PARSE_JSON('{"a":1,"b":null}'))` |

## 数组（Array）函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [ARRAY_CONSTRUCT](array/array-construct) | 从独立值创建数组 | `ARRAY_CONSTRUCT(1, 2, 3)` |
| [RANGE](array/range) | 生成连续数字数组 | `RANGE(1, 5)` |
| [GET](array/get) | 通过索引从数组获取元素 | `GET(PARSE_JSON('[1,2,3]'), 0)` |
| [ARRAY_GET](array/array-get) | GET 函数的别名 | `ARRAY_GET([1,2,3], 1)` |
| [CONTAINS](array/contains) | 检查数组是否包含特定值 | `CONTAINS([1,2,3], 2)` |
| [ARRAY_CONTAINS](array/array-contains) | 检查数组是否包含特定值 | `ARRAY_CONTAINS([1,2,3], 2)` |
| [ARRAY_APPEND](array/array-append) | 向数组末尾追加元素 | `ARRAY_APPEND([1,2], 3)` |
| [ARRAY_PREPEND](array/array-prepend) | 向数组开头前置元素 | `ARRAY_PREPEND([2,3], 1)` |
| [ARRAY_INSERT](array/array-insert) | 在指定位置插入元素 | `ARRAY_INSERT([1,3], 1, 2)` |
| [ARRAY_REMOVE](array/array-remove) | 移除所有指定元素 | `ARRAY_REMOVE([1,2,2,3], 2)` |
| [ARRAY_REMOVE_FIRST](array/array-remove-first) | 移除数组首个元素 | `ARRAY_REMOVE_FIRST([1,2,3])` |
| [ARRAY_REMOVE_LAST](array/array-remove-last) | 移除数组末尾元素 | `ARRAY_REMOVE_LAST([1,2,3])` |
| [ARRAY_CONCAT](array/array-concat) | 连接多个数组 | `ARRAY_CONCAT([1,2], [3,4])` |
| [ARRAY_SLICE](array/array-slice) | 提取数组子集 | `ARRAY_SLICE([1,2,3,4], 1, 2)` |
| [SLICE](array/slice) | ARRAY_SLICE 函数的别名 | `SLICE([1,2,3,4], 1, 2)` |
| [ARRAYS_ZIP](array/arrays-zip) | 按元素合并多个数组 | `ARRAYS_ZIP([1,2], ['a','b'])` |
| [ARRAY_DISTINCT](array/array-distinct) | 返回数组唯一元素 | `ARRAY_DISTINCT([1,2,2,3])` |
| [ARRAY_UNIQUE](array/array-unique) | ARRAY_DISTINCT 函数的别名 | `ARRAY_UNIQUE([1,2,2,3])` |
| [ARRAY_INTERSECTION](array/array-intersection) | 返回数组交集元素 | `ARRAY_INTERSECTION([1,2,3], [2,3,4])` |
| [ARRAY_EXCEPT](array/array-except) | 返回首个数组独有的元素 | `ARRAY_EXCEPT([1,2,3], [2,3])` |
| [ARRAY_OVERLAP](array/array-overlap) | 检查数组是否存在共同元素 | `ARRAY_OVERLAP([1,2], [2,3])` |
| [ARRAY_TRANSFORM](array/array-transform) | 对数组元素应用函数 | `ARRAY_TRANSFORM([1,2,3], x -> x * 2)` |
| [ARRAY_FILTER](array/array-filter) | 按条件筛选数组元素 | `ARRAY_FILTER([1,2,3,4], x -> x > 2)` |
| [ARRAY_REDUCE](array/array-reduce) | 使用聚合函数归约数组 | `ARRAY_REDUCE([1,2,3], 0, (acc, x) -> acc + x)` |
| [ARRAY_AGGREGATE](array/array-aggregate) | 使用函数聚合数组元素 | `ARRAY_AGGREGATE([1,2,3], 'sum')` |
| [ARRAY_COMPACT](array/array-compact) | 移除数组中的 NULL 值 | `ARRAY_COMPACT([1, NULL, 2, NULL, 3])` |
| [ARRAY_FLATTEN](array/array-flatten) | 展平嵌套数组 | `ARRAY_FLATTEN([[1,2], [3,4]])` |
| [ARRAY_REVERSE](array/array-reverse) | 反转数组元素顺序 | `ARRAY_REVERSE([1,2,3])` |
| [ARRAY_INDEXOF](array/array-indexof) | 返回元素首次出现的索引 | `ARRAY_INDEXOF([1,2,3,2], 2)` |
| [UNNEST](array/unnest) | 将数组展开为独立行 | `UNNEST([1,2,3])` |

## 对象（Object）函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [OBJECT_CONSTRUCT](object/object-construct) | 从键值对创建 JSON 对象 | `OBJECT_CONSTRUCT('name', 'John', 'age', 30)` |
| [OBJECT_CONSTRUCT_KEEP_NULL](object/object-construct-keep-null) | 创建保留 NULL 值的 JSON 对象 | `OBJECT_CONSTRUCT_KEEP_NULL('a', 1, 'b', NULL)` |
| [OBJECT_KEYS](object/object-keys) | 返回 JSON 对象所有键的数组 | `OBJECT_KEYS(PARSE_JSON('{"a":1,"b":2}'))` |
| [OBJECT_INSERT](object/object-insert) | 插入或更新 JSON 对象的键值对 | `OBJECT_INSERT(json_obj, 'new_key', 'value')` |
| [OBJECT_DELETE](object/object-delete) | 移除 JSON 对象的键值对 | `OBJECT_DELETE(json_obj, 'key_to_remove')` |
| [OBJECT_PICK](object/object-pick) | 创建仅含指定键的新对象 | `OBJECT_PICK(json_obj, 'name', 'age')` |

## 映射（Map）函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [MAP_CAT](map/map-cat) | 合并多个映射 | `MAP_CAT({'a':1}, {'b':2})` |
| [MAP_KEYS](map/map-keys) | 返回映射所有键的数组 | `MAP_KEYS({'a':1, 'b':2})` |
| [MAP_VALUES](map/map-values) | 返回映射所有值的数组 | `MAP_VALUES({'a':1, 'b':2})` |
| [MAP_SIZE](map/map-size) | 返回映射键值对数量 | `MAP_SIZE({'a':1, 'b':2})` |
| [MAP_CONTAINS_KEY](map/map-contains-key) | 检查映射是否包含特定键 | `MAP_CONTAINS_KEY({'a':1}, 'a')` |
| [MAP_INSERT](map/map-insert) | 向映射插入键值对 | `MAP_INSERT({'a':1}, 'b', 2)` |
| [MAP_DELETE](map/map-delete) | 从映射移除键值对 | `MAP_DELETE({'a':1, 'b':2}, 'b')` |
| [MAP_TRANSFORM_KEYS](map/map-transform-keys) | 对映射键应用函数 | `MAP_TRANSFORM_KEYS(map, k -> UPPER(k))` |
| [MAP_TRANSFORM_VALUES](map/map-transform-values) | 对映射值应用函数 | `MAP_TRANSFORM_VALUES(map, v -> v * 2)` |
| [MAP_FILTER](map/map-filter) | 按谓词筛选键值对 | `MAP_FILTER(map, (k, v) -> v > 10)` |
| [MAP_PICK](map/map-pick) | 创建仅含指定键的新映射 | `MAP_PICK({'a':1, 'b':2, 'c':3}, 'a', 'c')` |

## 类型转换函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [AS_BOOLEAN](conversion/as-boolean) | 将 VARIANT 值转换为布尔值（BOOLEAN） | `AS_BOOLEAN(PARSE_JSON('true'))` |
| [AS_INTEGER](conversion/as-integer) | 将 VARIANT 值转换为 BIGINT | `AS_INTEGER(PARSE_JSON('42'))` |
| [AS_FLOAT](conversion/as-float) | 将 VARIANT 值转换为 DOUBLE | `AS_FLOAT(PARSE_JSON('3.14'))` |
| [AS_DECIMAL](conversion/as-decimal) | 将 VARIANT 值转换为 DECIMAL | `AS_DECIMAL(PARSE_JSON('12.34'))` |
| [AS_STRING](conversion/as-string) | 将 VARIANT 值转换为字符串（STRING） | `AS_STRING(PARSE_JSON('"hello"'))` |
| [AS_BINARY](conversion/as-binary) | 将 VARIANT 值转换为 BINARY | `AS_BINARY(TO_BINARY('abcd')::VARIANT)` |
| [AS_DATE](conversion/as-date) | 将 VARIANT 值转换为 DATE | `AS_DATE(TO_DATE('2025-10-11')::VARIANT)` |
| [AS_ARRAY](conversion/as-array) | 将 VARIANT 值转换为数组（ARRAY） | `AS_ARRAY(PARSE_JSON('[1,2,3]'))` |
| [AS_OBJECT](conversion/as-object) | 将 VARIANT 值转换为对象（OBJECT） | `AS_OBJECT(PARSE_JSON('{"a":1}'))` |

## 类型谓词函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [IS_ARRAY](type-predicate/is-array) | 检查 JSON 值是否为数组 | `IS_ARRAY(PARSE_JSON('[1,2,3]'))` |
| [IS_OBJECT](type-predicate/is-object) | 检查 JSON 值是否为对象 | `IS_OBJECT(PARSE_JSON('{"a":1}'))` |
| [IS_STRING](type-predicate/is-string) | 检查 JSON 值是否为字符串 | `IS_STRING(PARSE_JSON('"hello"'))` |
| [IS_INTEGER](type-predicate/is-integer) | 检查 JSON 值是否为整数 | `IS_INTEGER(PARSE_JSON('42'))` |
| [IS_FLOAT](type-predicate/is-float) | 检查 JSON 值是否为浮点数 | `IS_FLOAT(PARSE_JSON('3.14'))` |
| [IS_BOOLEAN](type-predicate/is-boolean) | 检查 JSON 值是否为布尔值 | `IS_BOOLEAN(PARSE_JSON('true'))` |
| [IS_NULL_VALUE](type-predicate/is-null-value) | 检查 JSON 值是否为 NULL | `IS_NULL_VALUE(PARSE_JSON('null'))` |