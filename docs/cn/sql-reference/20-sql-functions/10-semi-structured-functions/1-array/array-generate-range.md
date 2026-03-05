---
title: ARRAY_GENERATE_RANGE
---

生成一个等差整数序列数组，终点为开区间。

## 语法

```sql
ARRAY_GENERATE_RANGE(<start>, <end>[, <step>])
```

- `<start>`：区间起点。
- `<end>`：终点（不包含）。
- `<step>`：步长，默认为 1，可为负数以生成降序序列。

## 返回类型

`ARRAY`

## 示例

```sql
SELECT ARRAY_GENERATE_RANGE(1, 5) AS seq;
```

```
+---------+
| seq     |
+---------+
| [1,2,3,4] |
+---------+
```

```sql
SELECT ARRAY_GENERATE_RANGE(0, 6, 2) AS seq_step;
```

```
+-----------+
| seq_step  |
+-----------+
| [0,2,4]   |
+-----------+
```

```sql
SELECT ARRAY_GENERATE_RANGE(5, 0, -2) AS seq_down;
```

```
+-----------+
| seq_down  |
+-----------+
| [5,3,1]   |
+-----------+
```
