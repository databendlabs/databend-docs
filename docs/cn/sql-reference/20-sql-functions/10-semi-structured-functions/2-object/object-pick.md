---
title: OBJECT_PICK
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

创建一个新的 JSON 对象，仅包含输入 JSON 对象中指定的键。如果指定的键在输入对象中不存在，则在结果中省略该键。

## 别名

- `JSON_OBJECT_PICK`

## 语法

```sql
OBJECT_PICK(<json_object>, <key1> [, <key2>, ...])
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| json_object | 一个 JSON 对象（VARIANT 类型），用于从中选取键。 |
| key1, key2, ... | 一个或多个字符串字面量，表示要包含在结果对象中的键。 |

## 返回类型

返回一个 VARIANT，其中包含一个仅带有指定键及其对应值的新 JSON 对象。

## 示例

选取单个键：
```sql
SELECT OBJECT_PICK('{"a":1,"b":2,"c":3}'::VARIANT, 'a');
-- 返回结果：{"a":1}
```

选取多个键：
```sql
SELECT OBJECT_PICK('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'b');
-- 返回结果：{"a":1,"b":2}
```

选取不存在的键（不存在的键将被忽略）：
```sql
SELECT OBJECT_PICK('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'c');
-- 返回结果：{"a":1}
```