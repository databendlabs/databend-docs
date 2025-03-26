---
title: REGEXP_SUBSTR
---

返回字符串 `expr` 中与正则表达式模式 `pat` 匹配的子串，若无匹配则返回 NULL。若 expr 或 pat 为 NULL，返回值也为 NULL。

- REGEXP_SUBSTR 不支持提取捕获组（由括号 `()` 定义的子模式）。它返回整个匹配的子串而非特定的捕获组。

```sql
SELECT REGEXP_SUBSTR('abc123', '(\w+)(\d+)');
-- 返回 'abc123'（整个匹配项），而非 'abc' 或 '123'。

-- 替代方案：使用 SUBSTRING 和 REGEXP_INSTR 等字符串函数手动提取所需部分：
SELECT SUBSTRING('abc123', 1, REGEXP_INSTR('abc123', '\d+') - 1);
-- 返回 'abc'（提取数字前的部分）。
SELECT SUBSTRING('abc123', REGEXP_INSTR('abc123', '\d+'));
-- 返回 '123'（提取数字部分）。
```

- REGEXP_SUBSTR 不支持 `e` 参数（Snowflake 中用于提取捕获组）或 `group_num` 参数来指定返回哪个捕获组。

```sql
SELECT REGEXP_SUBSTR('abc123', '(\w+)(\d+)', 1, 1, 'e', 1);
-- 错误：Databend 不支持 'e' 参数或捕获组提取。

-- 替代方案：使用 SUBSTRING 和 LOCATE 等字符串函数手动提取所需子串，或在查询前通过外部工具（如 Python）预处理数据以提取捕获组。
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

| 参数        | 描述                                                                                               |
|-------------|---------------------------------------------------------------------------------------------------|
| expr        | 要匹配的字符串表达式                                                                              |
| pat         | 正则表达式                                                                                        |
| pos         | 可选。在 expr 中开始搜索的位置。若省略，默认为 1。                                                 |
| occurrence  | 可选。要搜索的第几次匹配。若省略，默认为 1。                                                       |
| match_type  | 可选。指定匹配方式的字符串，其含义与 REGEXP_LIKE() 中描述的相同。                                  |

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