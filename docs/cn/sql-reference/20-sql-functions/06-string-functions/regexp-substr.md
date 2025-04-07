---
title: REGEXP_SUBSTR
---

返回与模式 `pat` 指定的正则表达式匹配的字符串 `expr` 的子字符串，如果没有匹配项，则返回 NULL。如果 expr 或 pat 为 NULL，则返回值也为 NULL。

- REGEXP_SUBSTR 不支持提取捕获组（由括号 `()` 定义的子模式）。它返回整个匹配的子字符串，而不是特定的捕获组。

```sql
SELECT REGEXP_SUBSTR('abc123', '(\w+)(\d+)');
-- 返回 'abc123' (整个匹配项)，而不是 'abc' 或 '123'。

-- 替代解决方案：使用 SUBSTRING 和 REGEXP_INSTR 等字符串函数手动提取字符串的所需部分：
SELECT SUBSTRING('abc123', 1, REGEXP_INSTR('abc123', '\d+') - 1);
-- 返回 'abc' (提取数字之前的部分)。
SELECT SUBSTRING('abc123', REGEXP_INSTR('abc123', '\d+'));
-- 返回 '123' (提取数字)。
```

- REGEXP_SUBSTR 不支持 `e` 参数（在 Snowflake 中用于提取捕获组）或用于指定要返回哪个捕获组的 `group_num` 参数。

```sql
SELECT REGEXP_SUBSTR('abc123', '(\w+)(\d+)', 1, 1, 'e', 1);
-- 错误：Databend 不支持 'e' 参数或捕获组提取。

-- 替代解决方案：使用 SUBSTRING 和 LOCATE 等字符串函数手动提取所需的子字符串，或使用外部工具（例如 Python）预处理数据，以便在查询之前提取捕获组。
SELECT SUBSTRING(
    REGEXP_SUBSTR('letters:abc,numbers:123', 'letters:[a-z]+,numbers:[0-9]+'),
    LOCATE('letters:', 'letters:abc,numbers:123') + 8,
    LOCATE(',', 'letters:abc,numbers:123') - (LOCATE('letters:', 'letters:abc,numbers:123') + 8)
);
-- 返回 'abc'
```

## 语法

```sql
REGEXP_SUBSTR(<expr>, <pat[, pos[, occurrence[, match_type]]]>)
```

## 参数

| 参数       | 描述                                                                                               |
|------------|-----------------------------------------------------------------------------------------------------------|
| expr       | 要匹配的字符串 expr                                                                                       |
| pat        | 正则表达式                                                                                             |
| pos        | 可选。在 expr 中开始搜索的位置。如果省略，则默认为 1。                                                        |
| occurrence | 可选。要搜索的匹配项的第几次出现。如果省略，则默认为 1。                                                        |
| match_type | 可选。一个字符串，用于指定如何执行匹配。其含义与 REGEXP_LIKE() 的描述相同。                                   |

## 返回类型

`VARCHAR`

## 示例

```sql
SELECT REGEXP_SUBSTR('abc def ghi', '[a-z]+');
+----------------------------------------+
| REGEXP_SUBSTR('abc def ghi', '[a-z]+') |
+----------------------------------------+
| abc                                    |
+----------------------------------------+

SELECT REGEXP_SUBSTR('abc def ghi', '[a-z]+', 1, 3);
+----------------------------------------------+
| REGEXP_SUBSTR('abc def ghi', '[a-z]+', 1, 3) |
+----------------------------------------------+
| ghi                                          |
+----------------------------------------------+

SELECT REGEXP_SUBSTR('周 周周 周周周 周周周周', '周+', 2, 3);
+------------------------------------------------------------------+
| REGEXP_SUBSTR('周 周周 周周周 周周周周', '周+', 2, 3)            |
+------------------------------------------------------------------+
| 周周周周                                                         |
+------------------------------------------------------------------+

```