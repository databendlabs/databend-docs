---
title: SOUNDS LIKE
---

通过 Soundex 编码比较两个字符串的发音。Soundex 是一种语音算法，它生成一个代码来表示字符串的发音，从而可以根据字符串的发音而不是拼写来进行近似匹配。Databend 提供了 [SOUNDEX](soundex.md) 函数，允许你从字符串中获取 Soundex 编码。

SOUNDS LIKE 经常用于 SQL 查询的 WHERE 子句中，以使用模糊字符串匹配来缩小行范围，例如用于名称和地址，请参阅 [示例](#examples) 中的 [过滤行](#filtering-rows)。

:::note
虽然该函数对于近似字符串匹配很有用，但请务必注意，它并不总是准确的。Soundex 算法基于英语发音规则，可能不适用于其他语言或方言的字符串。
:::

## 语法

```sql
<str1> SOUNDS LIKE <str2>
```

## 参数

| 参数   | 描述     |
| -------- | -------- |
| str1, 2 | 你比较的字符串。 |

## 返回类型

如果两个字符串的 Soundex 编码相同（这意味着它们听起来相似），则返回布尔值 1，否则返回 0。

## 示例

### 比较字符串

```sql
SELECT 'two' SOUNDS LIKE 'too'
----
1

SELECT CONCAT('A', 'B') SOUNDS LIKE 'AB';
----
1

SELECT 'Monday' SOUNDS LIKE 'Sunday';
----
0
```

### 过滤行

```sql
SELECT * FROM  employees;

id|first_name|last_name|age|
--+----------+---------+---+
 0|John      |Smith    | 35|
 0|Mark      |Smythe   | 28|
 0|Johann    |Schmidt  | 51|
 0|Eric      |Doe      | 30|
 0|Sue       |Johnson  | 45|


SELECT * FROM  employees
WHERE  first_name SOUNDS LIKE 'John';

id|first_name|last_name|age|
--+----------+---------+---+
 0|John      |Smith    | 35|
 0|Johann    |Schmidt  | 51|
```