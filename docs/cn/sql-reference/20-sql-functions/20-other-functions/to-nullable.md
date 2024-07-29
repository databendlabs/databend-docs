---
title: TO_NULLABLE
---

将一个值转换为其可为空（nullable）的等价形式。

当你将此函数应用于一个值时，它会检查该值是否已经能够持有 NULL 值。如果该值已经能够持有 NULL 值，函数将返回该值而不做任何更改。

然而，如果该值不能持有 NULL 值，TO_NULLABLE 函数将修改该值，使其能够持有 NULL 值。它通过将该值包装在一个能够持有 NULL 值的结构中来实现这一点，这意味着该值现在可以在未来持有 NULL 值。

## 语法

```sql
TO_NULLABLE(x);
```

## 参数

| 参数      | 描述           |
|-----------|----------------|
| x         | 原始值。       |


## 返回类型

返回与输入值相同数据类型的值，但如果输入值本身不是可为空的，则将其包装在一个可为空的容器中。

## 示例

```sql
SELECT typeof(3), TO_NULLABLE(3), typeof(TO_NULLABLE(3));

typeof(3)       |to_nullable(3)|typeof(to_nullable(3))|
----------------+--------------+----------------------+
TINYINT UNSIGNED|             3|TINYINT UNSIGNED NULL |

```