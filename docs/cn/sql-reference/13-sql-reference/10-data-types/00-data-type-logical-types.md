---
title: 布尔类型
description: 基本的逻辑数据类型. 
---

BOOLEAN 数据类型表示真 ( `true` ) 或假 ( `false` ) 的陈述. 

## 布尔数据类型

| 名称    | 别名 | 存储大小 | 最小值 | 最大值 | 描述                |
| ------- | ---- | -------- | ------ | ------ | ------------------- |
| BOOLEAN | BOOL | 1 字节   |        |        | 逻辑布尔值 (真/假) |

## 隐式转换

布尔值可以从数值类型隐式转换为布尔值. 

数值转换: 

- 零 (0) 转换为假 (FALSE) . 
- 任何非零值转换为真 (TRUE) . 

字符串转换: 

- 转换为真 (TRUE) 的字符串: `true` 
- 转换为假 (FALSE) 的字符串: `false` 
- 转换是不区分大小写的. 
- 所有其他文本字符串无法转换为布尔值, 将会报错 `Code: 1010` . 

## 函数

参见 [条件函数](/sql/sql-functions/conditional-functions/). 

## 示例

```sql
SELECT 0::BOOLEAN, 1::BOOLEAN, 'true'::BOOLEAN, 'false'::BOOLEAN, 'True'::BOOLEAN;
```

结果: 

```
+------------+------------+-----------------+------------------+-----------------+
| 0:: Boolean | 1:: Boolean | 'true':: Boolean | 'false':: Boolean | 'True':: Boolean |
+------------+------------+-----------------+------------------+-----------------+
|          0 |          1 |               1 |                0 |               1 |
+------------+------------+-----------------+------------------+-----------------+
---

```sql
SELECT 'xx'::BOOLEAN;
```

结果: 

```
ERROR 1105 (HY000): Code: 1010, Text = Cast error happens in casting from String to Boolean.
```
