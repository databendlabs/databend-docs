---
title: STRING_AGG
---

Aggregate function.

The STRING_AGG() function (also known by its alias GROUP_CONCAT or LISTAGG) converts all the non-NULL values of a column to String, separated by the delimiter.

## Syntax

```sql
STRING_AGG(<expr>)
GROUP_CONCAT(<expr>)
LISTAGG(<expr>)
          
STRING_AGG(<expr> [, delimiter])
GROUP_CONCAT(<expr> [, delimiter])
LISTAGG(<expr> [, delimiter])
          
STRING_AGG(<expr> [, delimiter]) WITHIN GROUP ( ORDER BY <expr1> [ ASC | DESC, NULLS FIRST | NULLS LAST ] )
GROUP_CONCAT(<expr> [, delimiter]) WITHIN GROUP ( ORDER BY <expr1> [ ASC | DESC, NULLS FIRST | NULLS LAST ] )
LISTAGG(<expr> [, delimiter]) WITHIN GROUP ( ORDER BY <expr1> [ ASC | DESC, NULLS FIRST | NULLS LAST ] )
```

:::info
If `<expr>` is not a String expression, should use `::VARCHAR` to convert.

For example:
```sql
SELECT string_agg(number::VARCHAR, '|') AS s FROM numbers(5);
+-----------+
| s         |
+-----------+
| 0|1|2|3|4 |
+-----------+
```
:::

## Arguments

| Arguments   | Description                                                         |
|-------------|---------------------------------------------------------------------|
| `<expr>`    | Any string expression (if not a string, use `::VARCHAR` to convert) |
| `delimiter` | Optional constant String, if not specified, use empty String        |
| `<expr1>`   | Any expression                                                      |

## Optional

| Optional                            | Description                                            |
|-------------------------------------|--------------------------------------------------------|
| WITHIN GROUP &lt;orderby_clause&gt; | defines the order of values for ordered set aggregates |

## Return Type

the String type

## Example

**Create a Table and Insert Sample Data**

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

**Query Demo: Concatenate Programming Language Names with a Delimiter**
```sql
SELECT STRING_AGG(language_name, ', ') AS concatenated_languages
FROM programming_languages;
```

**Result**
```sql
|          concatenated_languages          |
|------------------------------------------|
| Python, JavaScript, Java, C#, Ruby       |
```

**Query Demo: Concatenate Programming Language Names with a Delimiter Using `WITHIN GROUP`**
```sql
SELECT STRING_AGG(language_name, ', ') WITHIN GROUP ( ORDER BY language_name DESC ) AS concatenated_languages
FROM programming_languages;
```
**Result**
```sql
|          concatenated_languages          |
|------------------------------------------|
| Ruby, Python, JavaScript, Java, C#       |
```
