---
title: 半结构化函数
---

本节提供了 Databend 中半结构化数据函数的参考信息。

## 基本操作

### 解析和验证
- [PARSE_JSON](parse-json.md): 将 JSON 字符串解析为 variant 值
- [CHECK_JSON](check-json.md): 验证字符串是否为有效的 JSON

### 对象访问和提取
- [GET](get.md): 通过键从 JSON 对象中获取值
- [GET_PATH](get-path.md): 通过路径从 JSON 对象中获取值
- [GET_IGNORE_CASE](get-ignore-case.md): 获取不区分大小写的键的值
- [OBJECT_KEYS](object-keys.md): 返回 JSON 对象的键
- [JSON_OBJECT_KEYS](json-object-keys.md): 将 JSON 对象的键作为数组返回

### 类型检查和转换
- [JSON_TYPEOF](json-typeof.md): 返回 JSON 值的类型
- [AS_TYPE](as-type.md): 将 JSON 值转换为指定的 SQL 类型
- [JSON_TO_STRING](json-to-string.md): 将 JSON 值转换为字符串
- [IS_OBJECT](is-object.md): 检查 JSON 值是否为对象
- [IS_ARRAY](is-array.md): 检查 JSON 值是否为数组
- [IS_STRING](is-string.md): 检查 JSON 值是否为字符串
- [IS_INTEGER](is-integer.md): 检查 JSON 值是否为整数
- [IS_FLOAT](is-float.md): 检查 JSON 值是否为浮点数
- [IS_BOOLEAN](is-boolean.md): 检查 JSON 值是否为布尔值
- [IS_NULL_VALUE](is-null-value.md): 检查 JSON 值是否为 null

## 构建和修改

### JSON 对象操作
- [JSON_OBJECT](json-object.md): 从键值对创建 JSON 对象
- [JSON_OBJECT_INSERT](json-object-insert.md): 将值插入 JSON 对象
- [JSON_OBJECT_DELETE](json-object-delete.md): 从 JSON 对象中删除键
- [JSON_OBJECT_PICK](json-object-pick.md): 使用选定的键创建一个新对象
- [JSON_STRIP_NULLS](json-strip-nulls.md): 从 JSON 对象中删除 null 值
- [JSON_OBJECT_KEEP_NULL](json-object-keep-null.md): 创建一个保留 null 值的 JSON 对象

### JSON 数组操作
- [JSON_ARRAY](json-array.md): 从输入值创建 JSON 数组
- [JSON_ARRAY_INSERT](json-array-insert.md): 将值插入 JSON 数组
- [JSON_ARRAY_DISTINCT](json-array-distinct.md): 返回具有不同元素的数组
- [FLATTEN](flatten.md): 将嵌套数组展平为单个数组

## 高级查询和转换

### 路径查询
- [JSON_PATH_EXISTS](json-path-exists.md): 检查 JSON 路径是否存在
- [JSON_PATH_QUERY](json-path-query.md): 使用路径表达式查询 JSON 数据
- [JSON_PATH_QUERY_FIRST](json-path-query-first.md): 从路径查询返回第一个匹配项
- [JSON_PATH_QUERY_ARRAY](json-path-query-array.md): 将查询结果作为 JSON 数组返回
- [JSON_EXTRACT_PATH_TEXT](json-extract-path-text.md): 从 JSON 路径提取文本
- [JSON_PATH_MATCH](json-path-match.md): 将 JSON 数据与路径表达式进行匹配
- [JQ](jq.md): 提供类似 jq 的 JSON 处理功能

### 数组转换
- [JSON_ARRAY_MAP](json-array-map.md): 将函数映射到数组元素
- [JSON_ARRAY_FILTER](json-array-filter.md): 使用条件过滤数组元素
- [JSON_ARRAY_TRANSFORM](json-array-transform.md): 使用表达式转换数组元素
- [JSON_ARRAY_APPLY](json-array-apply.md): 将函数应用于每个数组元素
- [JSON_ARRAY_REDUCE](json-array-reduce.md): 将数组缩减为单个值

### 集合操作
- [JSON_ARRAY_INTERSECTION](json-array-intersection.md): 返回数组之间的公共元素
- [JSON_ARRAY_EXCEPT](json-array-except.md): 返回第一个数组中但不在第二个数组中的元素
- [JSON_ARRAY_OVERLAP](json-array-overlap.md): 检查数组是否具有公共元素

### 对象转换
- [JSON_MAP_FILTER](json-map-filter.md): 过滤 JSON 对象中的键值对
- [JSON_MAP_TRANSFORM_KEYS](json-map-transform-keys.md): 转换 JSON 对象中的键
- [JSON_MAP_TRANSFORM_VALUES](json-map-transform-values.md): 转换 JSON 对象中的值

### 扩展和格式化
- [JSON_ARRAY_ELEMENTS](json-array-elements.md): 将 JSON 数组扩展为一组行
- [JSON_EACH](json-each.md): 将最外层的 JSON 对象扩展为键值对
- [JSON_PRETTY](json-pretty.md): 使用缩进格式化 JSON 以提高可读性
