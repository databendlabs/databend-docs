---
title: OBJECT_CONSTRUCT
title_includes: TRY_OBJECT_CONSTRUCT, JSON_OBJECT, TRY_JSON_OBJECT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.762"/>

使用键和值创建一个 JSON 对象 (JSON Object)。

- 参数是零个或多个键值对（其中键是字符串，值是任意类型）。
- 如果键或值为 NULL，则结果对象中会省略该键值对。
- 键必须互不相同，且结果 JSON 中的顺序可能与指定顺序不同。
- `TRY_OBJECT_CONSTRUCT` 在构建对象时若发生错误，则返回 NULL 值。

## 别名

- `JSON_OBJECT`
- `TRY_JSON_OBJECT`

另请参阅：[OBJECT_CONSTRUCT_KEEP_NULL](object-construct-keep-null.md)

## 语法

```sql
OBJECT_CONSTRUCT(key1, value1[, key2, value2[, ...]])

TRY_OBJECT_CONSTRUCT(key1, value1[, key2, value2[, ...]])
```

## 返回类型

JSON 对象。

## 示例

```sql
SELECT OBJECT_CONSTRUCT();
┌────────────────┐
│ object_construct() │
├────────────────┤
│ {}            │
└────────────────┘

SELECT OBJECT_CONSTRUCT('a', 3.14, 'b', 'xx', 'c', NULL);
┌──────────────────────────────────────────────┐
│ object_construct('a', 3.14, 'b', 'xx', 'c', null) │
├──────────────────────────────────────────────┤
│ {"a":3.14,"b":"xx"}                          │
└──────────────────────────────────────────────┘

SELECT OBJECT_CONSTRUCT('fruits', ['apple', 'banana', 'orange'], 'vegetables', ['carrot', 'celery']);
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ object_construct('fruits', ['apple', 'banana', 'orange'], 'vegetables', ['carrot', 'celery']) │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ {"fruits":["apple","banana","orange"],"vegetables":["carrot","celery"]}                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘

SELECT OBJECT_CONSTRUCT('key');
  |
1 | SELECT OBJECT_CONSTRUCT('key')
  |        ^^^^^^^^^^^^^^^^^^ The number of keys and values must be equal while evaluating function `object_construct('key')`


SELECT TRY_OBJECT_CONSTRUCT('key');
┌───────────────────────────┐
│ try_object_construct('key') │
├───────────────────────────┤
│ NULL                   │
└───────────────────────────┘
```
