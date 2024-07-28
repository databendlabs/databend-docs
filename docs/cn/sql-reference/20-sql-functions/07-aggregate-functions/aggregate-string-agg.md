---
title: STRING_AGG
---

聚合函数。

STRING_AGG() 函数将列中所有非 NULL 值转换为字符串，并使用分隔符分隔。

## 语法

```sql
STRING_AGG(<expr>)
STRING_AGG(<expr> [, delimiter])
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

| 参数        | 描述                                                         |
|-------------|------------------------------------------------------------|
| `<expr>`    | 任何字符串表达式（如果不是字符串，使用 `::VARCHAR` 进行转换） |
| `delimiter` | 可选的常量字符串，如果未指定，则使用空字符串                 |

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
|          concatenated_languages         |
|------------------------------------------|
| Python, JavaScript, Java, C#, Ruby      |
```