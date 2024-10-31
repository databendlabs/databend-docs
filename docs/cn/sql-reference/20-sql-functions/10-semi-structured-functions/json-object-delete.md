---
title: JSON_OBJECT_DELETE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.650"/>

从 JSON 对象中删除指定的键，并返回修改后的对象。如果指定的键在对象中不存在，则忽略该键。

## 语法

```sql
json_object_delete(<json_object>, <key1> [, <key2>, ...])
```

## 参数

| 参数        | 描述               |
|-----------|------------------|
| json_object | 要从中删除键的 JSON 对象（VARIANT 类型）。 |
| key1, key2, ... | 表示要从对象中删除的一个或多个键的字符串字面量。 |

## 返回类型

返回一个包含已删除指定键的修改后 JSON 对象的 VARIANT。

## 示例

删除单个键：
```sql
SELECT json_object_delete('{"a":1,"b":2,"c":3}'::VARIANT, 'a');
-- 结果: {"b":2,"c":3}
```

删除多个键：
```sql
SELECT json_object_delete('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'c');
-- 结果: {"b":2,"d":4}
```

删除不存在的键（键被忽略）：
```sql
SELECT json_object_delete('{"a":1,"b":2}'::VARIANT, 'x');
-- 结果: {"a":1,"b":2}
```