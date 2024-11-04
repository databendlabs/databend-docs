---
title: JSON_ARRAY_INSERT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.644"/>

在指定的索引位置向 JSON 数组中插入一个值，并返回更新后的 JSON 数组。

## 语法

```sql
JSON_ARRAY_INSERT(<json_array>, <index>, <json_value>)
```

| 参数           | 描述                                                                                                                                                                                              |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<json_array>` | 要修改的 JSON 数组。                                                                                                                                                                              |
| `<index>`      | 插入值的位置。正索引在指定位置插入值，如果超出范围则追加；负索引从末尾插入，如果超出范围则在开头插入。                                                                                            |
| `<json_value>` | 要插入到数组中的 JSON 值。                                                                                                                                                                         |

## 返回类型

JSON 数组。

## 示例

当 `<index>` 是非负整数时，新元素插入到指定位置，现有元素向右移动。

```sql
-- 新元素插入到位置 0（数组的开头），所有原始元素向右移动
SELECT JSON_ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 0, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
json_array_insert('["task1", "task2", "task3"]'::VARIANT, 0, '"new_task"'::VARIANT): ["new_task","task1","task2","task3"]

-- 新元素插入到位置 1，在 task1 和 task2 之间
SELECT JSON_ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 1, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
json_array_insert('["task1", "task2", "task3"]'::VARIANT, 1, '"new_task"'::VARIANT): ["task1","new_task","task2","task3"]

-- 如果索引超过数组的长度，新元素追加到数组的末尾
SELECT JSON_ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 6, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
json_array_insert('["task1", "task2", "task3"]'::VARIANT, 6, '"new_task"'::VARIANT): ["task1","task2","task3","new_task"]
```

负 `<index>` 从数组末尾开始计数，`-1` 表示最后一个元素之前的位置，`-2` 表示倒数第二个元素之前的位置，依此类推。

```sql
-- 新元素插入到最后一个元素（task3）之前
SELECT JSON_ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, -1, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
json_array_insert('["task1", "task2", "task3"]'::VARIANT, - 1, '"new_task"'::VARIANT): ["task1","task2","new_task","task3"]

-- 由于负索引超过数组的长度，新元素插入到开头
SELECT JSON_ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, -6, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
json_array_insert('["task1", "task2", "task3"]'::VARIANT, - 6, '"new_task"'::VARIANT): ["new_task","task1","task2","task3"]
```