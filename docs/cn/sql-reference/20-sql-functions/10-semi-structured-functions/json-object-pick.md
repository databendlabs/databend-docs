---
title: JSON_OBJECT_PICK
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.650"/>


创建一个新的 JSON 对象，其中仅包含来自输入 JSON 对象的指定键。如果指定的键在输入对象中不存在，则结果中将省略该键。

## 语法

```sql
json_object_pick(<json_object>, <key1> [, <key2>, ...])
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| json_object | 要从中选择键的 JSON 对象（VARIANT 类型）。 |
| key1, key2, ... | 一个或多个字符串字面量，表示要包含在结果对象中的键。 |

## 返回类型

返回一个 VARIANT，其中包含一个新的 JSON 对象，该对象仅包含指定的键及其对应的值。

## 示例

选择单个键：
```sql
SELECT json_object_pick('{"a":1,"b":2,"c":3}'::VARIANT, 'a');
-- Result: {"a":1}
```

选择多个键：
```sql
SELECT json_object_pick('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'b');
-- Result: {"a":1,"b":2}
```

选择不存在的键（不存在的键将被忽略）：
```sql
SELECT json_object_pick('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'c');
-- Result: {"a":1}
```