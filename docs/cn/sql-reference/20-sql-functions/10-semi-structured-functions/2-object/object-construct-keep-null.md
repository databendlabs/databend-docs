---
title: OBJECT_CONSTRUCT_KEEP_NULL
title_includes: TRY_OBJECT_CONSTRUCT_KEEP_NULL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

使用键和值创建一个 JSON 对象 (JSON Object)。

- 参数是零个或多个键值对 (Key-Value Pair)（其中键是字符串，值是任意类型）。
- 如果键为 NULL，则生成的对象中将省略该键值对。但是，如果值为 NULL，则该键值对将被保留。
- 键必须互不相同，并且它们在生成的 JSON 中的顺序可能与您指定的顺序不同。
- `TRY_OBJECT_CONSTRUCT_KEEP_NULL` 在构建对象时如果发生错误，则返回 NULL 值。

## 别名

- `JSON_OBJECT_KEEP_NULL`
- `TRY_JSON_OBJECT_KEEP_NULL`

另请参阅：[OBJECT_CONSTRUCT](object-construct.md)

## 语法

```sql
OBJECT_CONSTRUCT_KEEP_NULL(key1, value1[, key2, value2[, ...]])

TRY_OBJECT_CONSTRUCT_KEEP_NULL(key1, value1[, key2, value2[, ...]])
```

## 返回类型

JSON 对象。

## 示例

```sql
SELECT OBJECT_CONSTRUCT_KEEP_NULL();
┌──────────────────────────────┐
│ object_construct_keep_null() │
├──────────────────────────────┤
│ {}                      │
└──────────────────────────────┘

SELECT OBJECT_CONSTRUCT_KEEP_NULL('a', 3.14, 'b', 'xx', 'c', NULL);
┌───────────────────────────────────────────────────────────┐
│ object_construct_keep_null('a', 3.14, 'b', 'xx', 'c', null) │
├───────────────────────────────────────────────────────────┤
│ {"a":3.14,"b":"xx","c":null}                           │
└───────────────────────────────────────────────────────────┘

SELECT OBJECT_CONSTRUCT_KEEP_NULL('fruits', ['apple', 'banana', 'orange'], 'vegetables', ['carrot', 'celery']);
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ object_construct_keep_null('fruits', ['apple', 'banana', 'orange'], 'vegetables', ['carrot', 'celery']) │
├───────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ {"fruits":["apple","banana","orange"],"vegetables":["carrot","celery"]}                            │
└───────────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT OBJECT_CONSTRUCT_KEEP_NULL('key');
  |
1 | SELECT OBJECT_CONSTRUCT_KEEP_NULL('key')
  |        ^^^^^^^^^^^^^^^^^^ 在评估函数 `object_construct_keep_null('key')` 时，键和值的数量必须相等


SELECT TRY_OBJECT_CONSTRUCT_KEEP_NULL('key');
┌─────────────────────────────────────┐
│ try_object_construct_keep_null('key') │
├─────────────────────────────────────┤
│ NULL                             │
└─────────────────────────────────────┘
```