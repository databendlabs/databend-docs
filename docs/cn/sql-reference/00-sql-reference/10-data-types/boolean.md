---
title: Boolean
description: 基本逻辑数据类型。
---

BOOLEAN 类型表示一个真值（ `true` 或 `false` ）。

## Boolean 数据类型

| 名称    | 别名 | 存储大小 | 最小值 | 最大值 | 描述                  |
|---------|---------|--------------|-----------|-----------|------------------------------|
| BOOLEAN | BOOL    | 1 byte       |           |           | 逻辑布尔值（真/假） |

## 隐式转换

布尔值可以从数值隐式转换为布尔值。

数值转换：
* 零 (0) 转换为 FALSE。
* 任何非零值转换为 TRUE。

字符串转换：
* 转换为 TRUE 的字符串： `true`
* 转换为 FALSE 的字符串： `false`
* 转换不区分大小写。
* 所有其他文本字符串不能转换为布尔值，否则会得到 `Code: 1010` 错误。

## 函数

请参阅 [条件函数](/sql/sql-functions/conditional-functions/)。

## 示例

```sql
SELECT 
    0::BOOLEAN, 
    1::BOOLEAN, 
    'true'::BOOLEAN, 
    'false'::BOOLEAN, 
    'True'::BOOLEAN;
```

结果：
```
+------------+------------+-----------------+------------------+-----------------+
| 0::Boolean | 1::Boolean | 'true'::Boolean | 'false'::Boolean | 'True'::Boolean |
+------------+------------+-----------------+------------------+-----------------+
|          0 |          1 |               1 |                0 |               1 |
+------------+------------+-----------------+------------------+-----------------+
```
```sql
SELECT 'xx'::BOOLEAN;
```
结果：
```
ERROR 1105 (HY000): Code: 1010, Text = Cast error happens in casting from String to Boolean.
```