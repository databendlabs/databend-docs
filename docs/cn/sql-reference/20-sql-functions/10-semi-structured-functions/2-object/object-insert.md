---
title: OBJECT_INSERT
title_includes: JSON_OBJECT_INSERT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.762"/>

在 JSON 对象中插入或更新键值对。

## 别名

- `JSON_OBJECT_INSERT`

## 语法

```sql
OBJECT_INSERT(<json_object>, <key>, <value>[, <update_flag>])
```

| 参数                | 描述                                                                                                                                 |   |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------|---|
| `<json_object>`     | 输入的 JSON 对象。                                                                                                                  |   |
| `<key>`             | 要插入或更新的键。                                                                                                                  |   |
| `<value>`           | 要赋给键的值。                                                                                                                      |   |
| `<update_flag>` | 布尔标志，控制当指定键已存在时是否替换其值。若为 `true` 则替换已存在键的值；若为 `false`（或省略）则键已存在时会报错。 |   |

## 返回类型

返回更新后的 JSON 对象。

## 示例

此示例演示如何将新键 'c' 及其值 3 插入现有 JSON 对象：

```sql
SELECT OBJECT_INSERT('{"a":1,"b":2,"d":4}'::variant, 'c', 3);

┌────────────────────────────────────────────────────────────┐
│ object_insert('{"a":1,"b":2,"d":4}'::VARIANT, 'c', 3) │
├────────────────────────────────────────────────────────────┤
│ {"a":1,"b":2,"c":3,"d":4}                                  │
└────────────────────────────────────────────────────────────┘
```

此示例展示如何将更新标志设为 `true`，从而将现有键 'a' 的值从 1 更新为 10：

```sql
SELECT OBJECT_INSERT('{"a":1,"b":2,"d":4}'::variant, 'a', 10, true);

┌───────────────────────────────────────────────────────────────────┐
│ object_insert('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 10, TRUE) │
├───────────────────────────────────────────────────────────────────┤
│ {"a":10,"b":2,"d":4}                                              │
└───────────────────────────────────────────────────────────────────┘
```

此示例演示未设置更新标志时，尝试为现有键 'a' 插入值会报错：

```sql
SELECT OBJECT_INSERT('{"a":1,"b":2,"d":4}'::variant, 'a', 10);

error: APIError: ResponseError with 1006: ObjectDuplicateKey while evaluating function `object_insert('{"a":1,"b":2,"d":4}', 'a', 10)` in expr `object_insert('{"a":1,"b":2,"d":4}', 'a', 10)`
```
