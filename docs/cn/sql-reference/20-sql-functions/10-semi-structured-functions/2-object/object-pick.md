---
title: OBJECT_PICK
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

从输入的 JSON 对象（JSON Object）中创建一个只包含指定键的新 JSON 对象。如果指定的键在输入对象中不存在，则在结果中省略该键。

## 别名

- `JSON_OBJECT_PICK`

## 语法

```sql
OBJECT_PICK(<json_object>, <key1> [, <key2>, ...])
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| json_object | 用于挑选键的 JSON 对象（VARIANT 类型）。 |
| key1, key2, ... | 一个或多个字符串字面量（string literals），表示要包含在结果对象中的键。 |

## 返回类型

返回包含新 JSON 对象的 VARIANT 类型结果，该对象仅包含指定键及其对应值。

## 示例

挑选单个键：
```sql
SELECT OBJECT_PICK('{"a":1,"b":2,"c":3}'::VARIANT, 'a');
-- 结果: {"a":1}
```

挑选多个键：
```sql
SELECT OBJECT_PICK('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'b');
-- 结果: {"a":1,"b":2}
```

挑选不存在的键（不存在的键将被忽略）：
```sql
SELECT OBJECT_PICK('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'c');
-- 结果: {"a":1}
```