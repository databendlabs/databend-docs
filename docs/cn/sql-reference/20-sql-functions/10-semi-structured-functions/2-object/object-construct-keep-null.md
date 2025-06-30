---
title: OBJECT_CONSTRUCT_KEEP_NULL
title_includes: TRY_OBJECT_CONSTRUCT_KEEP_NULL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

使用键和值创建 JSON 对象。

- 参数为零个或多个键值对（键为字符串，值可为任意类型）
- 若键为 NULL，则省略该键值对；若值为 NULL，则保留该键值对
- 键必须互不相同，生成 JSON 中的键顺序可能与指定顺序不同
- `TRY_OBJECT_CONSTRUCT_KEEP_NULL` 在构建对象出错时返回 NULL 值

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
  |        ^^^^^^^^^^^^^^^^^^ 执行函数 `object_construct_keep_null('key')` 时键值数量必须相等


SELECT TRY_OBJECT_CONSTRUCT_KEEP_NULL('key');
┌─────────────────────────────────────┐
│ try_object_construct_keep_null('key') │
├─────────────────────────────────────┤
│ NULL                             │
└─────────────────────────────────────┘
```