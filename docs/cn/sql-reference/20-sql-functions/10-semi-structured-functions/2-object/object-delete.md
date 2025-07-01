---
title: OBJECT_DELETE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

从 JSON 对象中删除指定键并返回修改后的对象。若指定键不存在于对象中，则忽略该键。

## 别名

- `JSON_OBJECT_DELETE`

## 语法

```sql
OBJECT_DELETE(<json_object>, <key1> [, <key2>, ...])
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| json_object | 待删除键的 JSON 对象（VARIANT 类型） |
| key1, key2, ... | 要删除的键（一个或多个字符串字面量） |

## 返回类型

返回移除指定键后的 JSON 对象（VARIANT 类型）。

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

删除不存在的键（自动忽略）：
```sql
SELECT OBJECT_DELETE('{"a":1,"b":2}'::VARIANT, 'x');
-- Result: {"a":1,"b":2}
```