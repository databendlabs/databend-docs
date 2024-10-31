---
title: JSON_OBJECT_KEEP_NULL
title_includes: TRY_JSON_OBJECT_KEEP_NULL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.402"/>

创建一个包含键和值的 JSON 对象。

- 参数是零个或多个键值对（其中键是字符串，值可以是任何类型）。
- 如果键为 NULL，则该键值对将从结果对象中省略。但是，如果值为 NULL，则该键值对将被保留。
- 键必须是互不相同的，并且它们在结果 JSON 中的顺序可能与您指定的顺序不同。
- `TRY_JSON_OBJECT_KEEP_NULL` 在构建对象时发生错误时返回 NULL 值。

另请参阅: [JSON_OBJECT](json-object.md)

## 语法

```sql
JSON_OBJECT_KEEP_NULL(key1, value1[, key2, value2[, ...]])

TRY_JSON_OBJECT_KEEP_NULL(key1, value1[, key2, value2[, ...]])
```

## 返回类型

JSON 对象。

## 示例

```sql
SELECT JSON_OBJECT_KEEP_NULL();
┌─────────────────────────┐
│ json_object_keep_null() │
├─────────────────────────┤
│ {}                      │
└─────────────────────────┘

SELECT JSON_OBJECT_KEEP_NULL('a', 3.14, 'b', 'xx', 'c', NULL);
┌────────────────────────────────────────────────────────┐
│ json_object_keep_null('a', 3.14, 'b', 'xx', 'c', null) │
├────────────────────────────────────────────────────────┤
│ {"a":3.14,"b":"xx","c":null}                           │
└────────────────────────────────────────────────────────┘

SELECT JSON_OBJECT_KEEP_NULL('fruits', ['apple', 'banana', 'orange'], 'vegetables', ['carrot', 'celery']);
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ json_object_keep_null('fruits', ['apple', 'banana', 'orange'], 'vegetables', ['carrot', 'celery']) │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ {"fruits":["apple","banana","orange"],"vegetables":["carrot","celery"]}                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT JSON_OBJECT_KEEP_NULL('key');
  |
1 | SELECT JSON_OBJECT_KEEP_NULL('key')
  |        ^^^^^^^^^^^^^^^^^^ 在评估函数 `json_object_keep_null('key')` 时，键和值的数量必须相等


SELECT TRY_JSON_OBJECT_KEEP_NULL('key');
┌──────────────────────────────────┐
│ try_json_object_keep_null('key') │
├──────────────────────────────────┤
│ NULL                             │
└──────────────────────────────────┘
```