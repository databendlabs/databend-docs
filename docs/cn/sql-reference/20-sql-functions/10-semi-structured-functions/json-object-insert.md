---
title: JSON_OBJECT_INSERT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.647"/>

在 JSON 对象中插入或更新键值对。

## 语法

```sql
JSON_OBJECT_INSERT(<json_object>, <key>, <value>[, <update_flag>])
```

| 参数            | 描述                                                                                                                                                                                                                                          |   |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|
| `<json_object>`     | 输入 JSON 对象。                                                                                                                                                                                                                               |   |
| `<key>`             | 要插入或更新的键。                                                                                                                                                                                                                   |   |
| `<value>`           | 要分配给键的值。                                                                                                                                                                                                                      |   |
| `<update_flag>` | 一个布尔标志，用于控制当指定的键已存在于 JSON 对象中时，是否替换该值。如果为 `true`，则当键已存在时，该函数将替换该值。如果为 `false`（或省略），则当键存在时，会发生错误。 |   |

## 返回类型

返回更新后的 JSON 对象。

## 示例

此示例演示了如何将新键 'c' 及其值 3 插入到现有 JSON 对象中：

```sql
SELECT JSON_OBJECT_INSERT('{"a":1,"b":2,"d":4}'::variant, 'c', 3);

┌────────────────────────────────────────────────────────────┐
│ json_object_insert('{"a":1,"b":2,"d":4}'::VARIANT, 'c', 3) │
├────────────────────────────────────────────────────────────┤
│ {"a":1,"b":2,"c":3,"d":4}                                  │
└────────────────────────────────────────────────────────────┘
```

此示例展示了如何使用设置为 `true` 的 update flag 将现有键 'a' 的值从 1 更新为 10，从而允许替换键的值：

```sql
SELECT JSON_OBJECT_INSERT('{"a":1,"b":2,"d":4}'::variant, 'a', 10, true);

┌───────────────────────────────────────────────────────────────────┐
│ json_object_insert('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 10, TRUE) │
├───────────────────────────────────────────────────────────────────┤
│ {"a":10,"b":2,"d":4}                                              │
└────────────────────────────────────────────────────────────┘
```

此示例演示了在未指定设置为 `true` 的 update flag 的情况下，尝试为现有键 'a' 插入值时发生的错误：

```sql
SELECT JSON_OBJECT_INSERT('{"a":1,"b":2,"d":4}'::variant, 'a', 10);

error: APIError: ResponseError with 1006: ObjectDuplicateKey while evaluating function `json_object_insert('{"a":1,"b":2,"d":4}', 'a', 10)` in expr `json_object_insert('{"a":1,"b":2,"d":4}', 'a', 10)`
```