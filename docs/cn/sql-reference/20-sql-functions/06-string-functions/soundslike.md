---
title: SOUNDS LIKE
---

通过它们的 Soundex 代码比较两个字符串的发音。Soundex 是一种语音算法，它生成一个表示字符串发音的代码，允许基于发音而不是拼写进行字符串的近似匹配。Databend 提供了 [SOUNDEX](soundex.md) 函数，允许你从字符串中获取 Soundex 代码。

SOUNDS LIKE 经常在 SQL 查询的 WHERE 子句中使用，以通过模糊字符串匹配来缩小行范围，例如用于名称和地址，请参见 [示例](#examples) 中的 [过滤行](#filtering-rows)。

:::note
虽然该函数对于近似字符串匹配很有用，但需要注意的是它并不总是准确的。Soundex 算法基于英语发音规则，可能不适用于其他语言或方言的字符串。
:::

## 语法

```sql
<str1> SOUNDS LIKE <str2>
```

## 参数

| 参数    | 描述         |
|-----------|-------------|
| str1, 2   | 你比较的字符串。 |

## 返回类型

如果两个字符串的 Soundex 代码相同（这意味着它们发音相似），则返回布尔值 1，否则返回 0。

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