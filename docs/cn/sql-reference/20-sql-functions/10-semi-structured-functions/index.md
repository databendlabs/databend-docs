---
title: 半结构化函数（Semi-Structured Functions）
---

本节提供 Databend 中半结构化数据函数的参考信息。这些函数可帮助您高效处理 JSON 及其他半结构化数据格式。

## 解析和验证

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [PARSE_JSON](parse-json) | 将 JSON 字符串解析为 Variant 类型值 | `PARSE_JSON('{"name":"Databend"}')` |
| [CHECK_JSON](check-json) | 验证字符串是否为有效 JSON | `CHECK_JSON('{"name":"Databend"}')` → `true` |

## 对象访问和提取

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [GET](get) | 通过键名从 JSON 对象获取值 | `GET(parse_json('{"name":"Databend"}'), 'name')` → `'Databend'` |
| [GET_PATH](get-path) | 通过路径从 JSON 对象获取值 | `GET_PATH(parse_json('{"user":{"name":"Databend"}}'), 'user.name')` → `'Databend'` |
| [GET_IGNORE_CASE](get-ignore-case) | 通过不区分大小写的键名获取值 | `GET_IGNORE_CASE(parse_json('{"Name":"Databend"}'), 'name')` → `'Databend'` |
| [OBJECT_KEYS](object-keys) | 返回 JSON 对象的键名集合 | `OBJECT_KEYS(parse_json('{"a":1,"b":2}'))` → `['a', 'b']` |
| [JSON_OBJECT_KEYS](json-object-keys) | 以数组形式返回 JSON 对象的键名 | `JSON_OBJECT_KEYS(parse_json('{"a":1,"b":2}'))` → `['a', 'b']` |

## 类型检查和转换

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_TYPEOF](json-typeof) | 返回 JSON 值的类型 | `JSON_TYPEOF(parse_json('123'))` → `'number'` |
| [AS_TYPE](as-type) | 将 JSON 值转换为指定 SQL 类型 | `AS_TYPE(parse_json('123'), 'INT')` → `123` |
| [JSON_TO_STRING](json-to-string) | 将 JSON 值转换为字符串 | `JSON_TO_STRING(parse_json('{"a":1}'))` → `'{"a":1}'` |
| [IS_OBJECT](is-object) | 检查 JSON 值是否为对象 | `IS_OBJECT(parse_json('{"a":1}'))` → `true` |
| [IS_ARRAY](is-array) | 检查 JSON 值是否为数组 | `IS_ARRAY(parse_json('[1,2,3]'))` → `true` |
| [IS_STRING](is-string) | 检查 JSON 值是否为字符串 | `IS_STRING(parse_json('"hello"'))` → `true` |
| [IS_INTEGER](is-integer) | 检查 JSON 值是否为整数 | `IS_INTEGER(parse_json('123'))` → `true` |
| [IS_FLOAT](is-float) | 检查 JSON 值是否为浮点数 | `IS_FLOAT(parse_json('123.45'))` → `true` |
| [IS_BOOLEAN](is-boolean) | 检查 JSON 值是否为布尔值 | `IS_BOOLEAN(parse_json('true'))` → `true` |
| [IS_NULL_VALUE](is-null-value) | 检查 JSON 值是否为 null | `IS_NULL_VALUE(parse_json('null'))` → `true` |

## JSON 对象操作

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_OBJECT](json-object) | 根据键值对创建 JSON 对象 | `JSON_OBJECT('name', 'Databend', 'version', '1.0')` → `'{"name":"Databend","version":"1.0"}'` |
| [JSON_OBJECT_INSERT](json-object-insert) | 向 JSON 对象插入键值对 | `JSON_OBJECT_INSERT(parse_json('{"a":1}'), 'b', 2)` → `'{"a":1,"b":2}'` |
| [JSON_OBJECT_DELETE](json-object-delete) | 从 JSON 对象删除指定键 | `JSON_OBJECT_DELETE(parse_json('{"a":1,"b":2}'), 'b')` → `'{"a":1}'` |
| [JSON_OBJECT_PICK](json-object-pick) | 选取指定键创建新 JSON 对象 | `JSON_OBJECT_PICK(parse_json('{"a":1,"b":2,"c":3}'), 'a', 'c')` → `'{"a":1,"c":3}'` |
| [JSON_STRIP_NULLS](json-strip-nulls) | 移除 JSON 对象中的 null 值 | `JSON_STRIP_NULLS(parse_json('{"a":1,"b":null}'))` → `'{"a":1}'` |
| [JSON_OBJECT_KEEP_NULL](json-object-keep-null) | 创建保留 null 值的 JSON 对象 | `JSON_OBJECT_KEEP_NULL('a', 1, 'b', NULL)` → `'{"a":1,"b":null}'` |

## JSON 数组操作

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_ARRAY](json-array) | 根据输入值创建 JSON 数组 | `JSON_ARRAY(1, 'text', true)` → `'[1,"text",true]'` |
| [JSON_ARRAY_INSERT](json-array-insert) | 向 JSON 数组指定位置插入值 | `JSON_ARRAY_INSERT(parse_json('[1,3]'), 1, 2)` → `'[1,2,3]'` |
| [JSON_ARRAY_DISTINCT](json-array-distinct) | 返回去重后的数组 | `JSON_ARRAY_DISTINCT(parse_json('[1,2,1,3,2]'))` → `'[1,2,3]'` |
| [FLATTEN](flatten) | 将嵌套数组展平为一维数组 | `FLATTEN(parse_json('[[1,2],[3,4]]'))` → `'[1,2,3,4]'` |

## 路径查询

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_PATH_EXISTS](json-path-exists) | 检查 JSON 路径是否存在 | `JSON_PATH_EXISTS(parse_json('{"a":{"b":1}}'), '$.a.b')` → `true` |
| [JSON_PATH_QUERY](json-path-query) | 使用路径表达式查询 JSON 数据 | `JSON_PATH_QUERY(parse_json('{"a":[1,2,3]}'), '$.a[*]')` → `[1,2,3]` |
| [JSON_PATH_QUERY_FIRST](json-path-query-first) | 返回路径查询的首个匹配结果 | `JSON_PATH_QUERY_FIRST(parse_json('{"a":[1,2,3]}'), '$.a[*]')` → `1` |
| [JSON_PATH_QUERY_ARRAY](json-path-query-array) | 以 JSON 数组返回路径查询结果 | `JSON_PATH_QUERY_ARRAY(parse_json('{"a":[1,2,3]}'), '$.a[*]')` → `'[1,2,3]'` |
| [JSON_EXTRACT_PATH_TEXT](json-extract-path-text) | 提取 JSON 路径对应的文本值 | `JSON_EXTRACT_PATH_TEXT(parse_json('{"a":{"b":"text"}}'), 'a', 'b')` → `'text'` |
| [JSON_PATH_MATCH](json-path-match) | 检查 JSON 数据是否匹配路径表达式 | `JSON_PATH_MATCH(parse_json('{"a":1}'), '$.a == 1')` → `true` |
| [JQ](jq) | 提供类 jq 的 JSON 处理能力 | `JQ(parse_json('{"a":{"b":1}}'), '.a.b')` → `1` |

## 数组转换

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_ARRAY_MAP](json-array-map) | 对数组元素执行映射操作 | `JSON_ARRAY_MAP(parse_json('[1,2,3]'), x -> x * 2)` → `'[2,4,6]'` |
| [JSON_ARRAY_FILTER](json-array-filter) | 按条件过滤数组元素 | `JSON_ARRAY_FILTER(parse_json('[1,2,3,4]'), x -> x > 2)` → `'[3,4]'` |
| [JSON_ARRAY_TRANSFORM](json-array-transform) | 使用表达式转换数组元素 | `JSON_ARRAY_TRANSFORM(parse_json('[{"a":1},{"a":2}]'), x -> x.a)` → `'[1,2]'` |
| [JSON_ARRAY_APPLY](json-array-apply) | 对数组元素应用函数 | `JSON_ARRAY_APPLY(parse_json('[1,2,3]'), x -> x * x)` → `'[1,4,9]'` |
| [JSON_ARRAY_REDUCE](json-array-reduce) | 将数组归约为单个值 | `JSON_ARRAY_REDUCE(parse_json('[1,2,3]'), 0, (acc, x) -> acc + x)` → `6` |

## 集合操作

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_ARRAY_INTERSECTION](json-array-intersection) | 返回数组之间的交集元素 | `JSON_ARRAY_INTERSECTION(parse_json('[1,2,3]'), parse_json('[2,3,4]'))` → `'[2,3]'` |
| [JSON_ARRAY_EXCEPT](json-array-except) | 返回仅存在于第一个数组的元素 | `JSON_ARRAY_EXCEPT(parse_json('[1,2,3]'), parse_json('[2,3,4]'))` → `'[1]'` |
| [JSON_ARRAY_OVERLAP](json-array-overlap) | 检查数组是否存在交集元素 | `JSON_ARRAY_OVERLAP(parse_json('[1,2,3]'), parse_json('[3,4,5]'))` → `true` |

## 对象转换

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_MAP_FILTER](json-map-filter) | 按条件过滤 JSON 对象的键值对 | `JSON_MAP_FILTER(parse_json('{"a":1,"b":2}'), (k,v) -> v > 1)` → `'{"b":2}'` |
| [JSON_MAP_TRANSFORM_KEYS](json-map-transform-keys) | 转换 JSON 对象的键名 | `JSON_MAP_TRANSFORM_KEYS(parse_json('{"a":1,"b":2}'), k -> UPPER(k))` → `'{"A":1,"B":2}'` |
| [JSON_MAP_TRANSFORM_VALUES](json-map-transform-values) | 转换 JSON 对象的值 | `JSON_MAP_TRANSFORM_VALUES(parse_json('{"a":1,"b":2}'), v -> v * 10)` → `'{"a":10,"b":20}'` |

## 展开和格式化

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [JSON_ARRAY_ELEMENTS](json-array-elements) | 将 JSON 数组展开为多行记录 | `SELECT * FROM JSON_ARRAY_ELEMENTS(parse_json('[1,2,3]'))` → `3 行记录，值分别为 1, 2, 3` |
| [JSON_EACH](json-each) | 将 JSON 对象展开为键值对记录 | `SELECT * FROM JSON_EACH(parse_json('{"a":1,"b":2}'))` → `2 行键值对记录` |
| [JSON_PRETTY](json-pretty) | 格式化 JSON 输出（含缩进） | `JSON_PRETTY(parse_json('{"a":1,"b":2}'))` → `'{\n  "a": 1,\n  "b": 2\n}'` |