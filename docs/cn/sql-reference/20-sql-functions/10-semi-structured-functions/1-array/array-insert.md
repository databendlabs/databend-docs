---
title: ARRAY_INSERT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

在指定索引位置向 JSON 数组中插入值，并返回更新后的 JSON 数组。

## 别名

- `JSON_ARRAY_INSERT`

## 语法

```sql
ARRAY_INSERT(<json_array>, <index>, <json_value>)
```

| 参数          | 描述                                                                                                                                 |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `<json_array>` | 待修改的 JSON 数组                                                                                                                  |
| `<index>`      | 插入位置索引。正索引在指定位置插入（若超出范围则追加至末尾）；负索引从末尾计算位置（若超出范围则在开头插入） |
| `<json_value>` | 待插入的 JSON 值                                                                                                                    |

## 返回类型

JSON 数组。

## 示例

当 `<index>` 为非负整数时，新元素插入指定位置，现有元素右移。

```sql
-- 新元素插入位置 0（数组起始处），所有原始元素右移
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 0, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, 0, '"new_task"'::VARIANT): ["new_task","task1","task2","task3"]

-- 新元素插入位置 1（task1 与 task2 之间）
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 1, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, 1, '"new_task"'::VARIANT): ["task1","new_task","task2","task3"]

-- 索引超出数组长度时，新元素追加至末尾
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 6, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, 6, '"new_task"'::VARIANT): ["task1","task2","task3","new_task"]
```

负值 `<index>` 从数组末尾计数：`-1` 表示末位元素前，`-2` 表示倒数第二位前，以此类推。

```sql
-- 新元素插入末位元素（task3）前
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, -1, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, - 1, '"new_task"'::VARIANT): ["task1","task2","new_task","task3"]

-- 负索引超出数组长度时，新元素插入数组开头
SELECT ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, -6, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
array_insert('["task1", "task2", "task3"]'::VARIANT, - 6, '"new_task"'::VARIANT): ["new_task","task1","task2","task3"]
```