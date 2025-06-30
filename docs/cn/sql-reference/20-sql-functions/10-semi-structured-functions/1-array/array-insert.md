---
title: ARRAY_INSERT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.762"/>

在 JSON 数组的指定索引位置插入值，并返回更新后的 JSON 数组。

## 别名

- `JSON_ARRAY_INSERT`

## 语法

```sql
ARRAY_INSERT(<json_array>, <index>, <json_value>)
```

| 参数          | 描述                                                                                                                                                                                              |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<json_array>` | 待修改的 JSON 数组                                                                                                                                                                               |
| `<index>`      | 插入值的位置。正数索引在指定位置插入，若超出范围则追加至末尾；负数索引从末尾开始计算，若超出范围则在开头插入                                                                                      |
| `<json_value>` | 要插入数组的 JSON 值                                                                                                                                                                             |

## 返回类型

JSON 数组。

## 示例

当 `<index>` 为非负整数时，新元素将在指定位置插入，现有元素向右移动。

```sql
-- 新元素在位置 0（数组开头）插入，所有原始元素右移
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 0, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, 0, '"new_task"'::VARIANT): ["new_task","task1","task2","task3"]

-- 新元素在位置 1 插入（位于 task1 和 task2 之间）
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 1, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, 1, '"new_task"'::VARIANT): ["task1","new_task","task2","task3"]

-- 索引超出数组长度时，新元素追加至末尾
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 6, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, 6, '"new_task"'::VARIANT): ["task1","task2","task3","new_task"]
```

负数 `<index>` 从数组末尾开始计算，`-1` 表示倒数第一个元素前的位置，`-2` 表示倒数第二个元素前的位置，依此类推。

```sql
-- 新元素在最后一个元素（task3）前插入
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, -1, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, - 1, '"new_task"'::VARIANT): ["task1","task2","new_task","task3"]

-- 负索引超出数组长度时，新元素在开头插入
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, -6, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, - 6, '"new_task"'::VARIANT): ["new_task","task1","task2","task3"]
```