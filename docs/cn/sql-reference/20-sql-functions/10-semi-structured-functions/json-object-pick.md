---
title: JSON_OBJECT_PICK
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.650"/>


从输入的 JSON 对象中创建一个仅包含指定键的新 JSON 对象。如果指定的键在输入对象中不存在，则结果中会忽略该键。

## 语法

```sql
json_object_pick(<json_object>, <key1> [, <key2>, ...])
```

## 参数

| 参数        | 描述               |
|-----------|------------------|
| json_object | 从中选择键的 JSON 对象（VARIANT 类型）。 |
| key1, key2, ... | 一个或多个字符串字面量，表示要在结果对象中包含的键。 |

## 返回类型

返回一个包含仅指定键及其对应值的新 JSON 对象的 VARIANT。

## 示例

选择单个键：
```sql
SELECT json_object_pick('{"a":1,"b":2,"c":3}'::VARIANT, 'a');
-- 结果: {"a":1}
```

选择多个键：
```sql
SELECT json_object_pick('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'b');
-- 结果: {"a":1,"b":2}
```

选择不存在的键（不存在的键会被忽略）：
```sql
SELECT json_object_pick('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'c');
-- 结果: {"a":1}
```