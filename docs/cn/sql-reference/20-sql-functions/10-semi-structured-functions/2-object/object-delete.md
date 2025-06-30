---
title: OBJECT_DELETE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

从 JSON 对象中删除指定的键，并返回修改后的对象。如果指定的键在对象中不存在，则会被忽略。

## 别名

- `JSON_OBJECT_DELETE`

## 语法

```sql
OBJECT_DELETE(<json_object>, <key1> [, <key2>, ...])
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| json_object | 一个 JSON 对象（VARIANT 类型），将从中删除指定的键。 |
| key1, key2, ... | 一个或多个字符串字面量，表示要从对象中删除的键。 |

## 返回类型

返回一个 VARIANT，其中包含删除了指定键的修改后的 JSON 对象。

## 示例

删除单个键：
```sql
SELECT OBJECT_DELETE('{"a":1,"b":2,"c":3}'::VARIANT, 'a');
-- Result: {"b":2,"c":3}
```

删除多个键：
```sql
SELECT OBJECT_DELETE('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'c');
-- Result: {"b":2,"d":4}
```

删除不存在的键（该键被忽略）：
```sql
SELECT OBJECT_DELETE('{"a":1,"b":2}'::VARIANT, 'x');
-- Result: {"a":1,"b":2}
```