---
title: STRING_AGG
---

聚合函数。

STRING_AGG() 函数（也称为 GROUP_CONCAT 或 LISTAGG）将列中的所有非 NULL 值连接为一个字符串，并使用分隔符分隔。

## 语法

```sql 
STRING_AGG(<expr> [, delimiter]) [ WITHIN GROUP ( <orderby_clause> ) ]
GROUP_CONCAT(<expr> [, delimiter]) [ WITHIN GROUP ( <orderby_clause> ) ]
LISTAGG(<expr> [, delimiter]) [ WITHIN GROUP ( <orderby_clause> ) ]
```

:::info
如果 `<expr>` 不是字符串表达式，应使用 `::VARCHAR` 进行转换。

例如：
```sql
SELECT string_agg(number::VARCHAR, '|') AS s FROM numbers(5);
+-----------+
| s         |
+-----------+
| 0|1|2|3|4 |
+-----------+
```
:::

## 参数

| 参数       | 描述                                                         |
|------------|-------------------------------------------------------------|
| `<expr>`   | 任何字符串表达式（如果不是字符串，使用 `::VARCHAR` 进行转换） |

## 可选参数

| 可选参数                            | 描述                                                  |
|-------------------------------------|------------------------------------------------------|
| `delimiter`                         | 可选常量字符串，如果未指定，则使用空字符串            |
| WITHIN GROUP [&lt;orderby_clause&gt;](https://docs.databend.com/sql/sql-commands/query-syntax/query-select#order-by-clause) | 定义有序集合聚合中值的顺序                           |

## 返回类型

字符串类型

## 示例

**创建表并插入示例数据**

```sql
CREATE TABLE programming_languages (
  id INT,
  language_name VARCHAR
);

INSERT INTO programming_languages (id, language_name)
VALUES (1, 'Python'),
       (2, 'JavaScript'),
       (3, 'Java'),
       (4, 'C#'),
       (5, 'Ruby');
```

**查询示例：使用分隔符连接编程语言名称**
```sql
SELECT STRING_AGG(language_name, ', ') AS concatenated_languages
FROM programming_languages;
```

**结果**
```sql
|          concatenated_languages          |
|------------------------------------------|
| Python, JavaScript, Java, C#, Ruby       |
```

**查询示例：使用 `WITHIN GROUP` 按降序连接编程语言名称**
```sql
SELECT STRING_AGG(language_name, ', ') WITHIN GROUP ( ORDER BY language_name DESC ) AS concatenated_languages
FROM programming_languages;
```
**结果**
```sql
|          concatenated_languages          |
|------------------------------------------|
| Ruby, Python, JavaScript, Java, C#       |
```