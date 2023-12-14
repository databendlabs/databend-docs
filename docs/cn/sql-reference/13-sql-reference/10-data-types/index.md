---
title: 数据类型
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.100"/>

本页面解释了数据类型的各个方面，包括数据类型列表、数据类型转换、强制转换方法以及处理 NULL 值和 NOT NULL 约束。

## 数据类型列表

以下是 Databend 中的常见数据类型列表：

| 数据类型                                                            | 别名   | 存储大小   | 最小值                   | 最大值                         |
| ------------------------------------------------------------------- | ------ | ---------- | ------------------------ | ------------------------------ |
| [BOOLEAN](./00-data-type-logical-types.md)                          | BOOL   | 1 字节     | N/A                      | N/A                            |
| [TINYINT](./10-data-type-numeric-types.md#integer-data-types)       | INT8   | 1 字节     | -128                     | 127                            |
| [SMALLINT](./10-data-type-numeric-types.md#integer-data-types)      | INT16  | 2 字节     | -32768                   | 32767                          |
| [INT](./10-data-type-numeric-types.md#integer-data-types)           | INT32  | 4 字节     | -2147483648              | 2147483647                     |
| [BIGINT](./10-data-type-numeric-types.md#integer-data-types)        | INT64  | 8 字节     | -9223372036854775808     | 9223372036854775807            |
| [FLOAT](./10-data-type-numeric-types.md#floating-point-data-types)  | N/A    | 4 字节     | -3.40282347e+38          | 3.40282347e+38                 |
| [DOUBLE](./10-data-type-numeric-types.md#floating-point-data-types) | N/A    | 8 字节     | -1.7976931348623157E+308 | 1.7976931348623157E+308        |
| [DECIMAL](./11-data-type-decimal-types.md)                          | N/A    | 16/32 字节 | -10^P / 10^S             | 10^P / 10^S                    |
| [DATE](./20-data-type-time-date-types.md)                           | N/A    | 4 字节     | 1000-01-01               | 9999-12-31                     |
| [TIMESTAMP](./20-data-type-time-date-types.md)                      | N/A    | 8 字节     | 0001-01-01 00:00:00      | 9999-12-31 23:59:59.999999 UTC |
| [VARCHAR](./30-data-type-string-types.md)                           | STRING | N/A        | N/A                      | N/A                            |

以下是 Databend 中的半结构化数据类型列表：

| 数据类型                               | 别名 | 示例                    | 描述                                                             |
| -------------------------------------- | ---- | ----------------------- | ---------------------------------------------------------------- | --- |
| [ARRAY](./40-data-type-array-types.md) | N/A  | [1, 2, 3, 4]            | 由相同数据类型的值组成的集合，通过索引访问。                     |
| [TUPLE](./41-data-type-tuple-types.md) | N/A  | ('2023-02-14','情人节') | 由不同数据类型的值按顺序组成的集合，通过索引访问。               |
| [MAP](./42-data-type-map.md)           | N/A  | {"a":1, "b":2, "c":3}   | 一组键值对，每个键都是唯一的并映射到一个值。                     |     |
| [VARIANT](./43-data-type-variant.md)   | JSON | [1,{"a":1,"b":{"c":2}}] | 由不同数据类型的元素组成的集合，包括 `ARRAY` 和 `OBJECT`。       |
| [BITMAP](44-data-type-bitmap.md)       | N/A  | 0101010101              | 用于表示一组值的二进制数据类型，其中每个位表示值的存在或不存在。 |

## 数据类型转换

### 显式转换

我们有两种表达式将一个值转换为另一种数据类型。

1. `CAST` 函数，如果转换过程中出现错误，将抛出错误。

我们还支持 pg 转换样式：`CAST(c as INT)` 等同于 `c::Int`

2. `TRY_CAST` 函数，如果转换过程中出现错误，将返回 NULL。

### 隐式转换（"强制转换"）

关于 "强制转换"（自动转换）的一些基本规则

1. 所有整数数据类型可以隐式转换为 `BIGINT`（`INT64`）数据类型。

例如：

```sql
Int --> bigint
UInt8 --> bigint
Int32 --> bigint
```

2. 所有数值数据类型可以隐式转换为 `Double`（`Float64`）数据类型。

例如：

```sql
Int --> Double
Float --> Double
Int32 --> Double
```

3. 所有非空数据类型 `T` 可以隐式转换为 `Nullable(T)` 数据类型。

例如：

```sql
Int --> Nullable<Int>
String -->  Nullable<String>
```

4. 所有数据类型可以隐式转换为 `Variant` 数据类型。

例如：

```sql
Int --> Variant
```

5. 字符串数据类型是不能隐式转换为其他数据类型的最低数据类型。
6. 如果 `T` 可以转换为 `U`，则 `Array<T>` 可以隐式转换为 `Array<U>`。
7. 如果 `T` 可以转换为 `U`，则 `Nullable<T>` 可以隐式转换为 `Nullable<U>`。
8. 对于任何 `T` 数据类型，`Null` 可以隐式转换为 `Nullable<T>`。
9. 如果没有损失，数值可以隐式转换为其他数值数据类型。

### 常见问题

> 为什么数值类型不能自动转换为字符串类型。

看上去实现这一点并不困难，甚至其他流行数据库也支持这种做法。但它会造成歧义。

例如：

```sql
select 39 > '301';
select 39 = '  39  ';
```

我们无法明确如何将其与数字规则或字符串规则进行比较。依据不同的规则，会产生不同的结果。

`select 39 > 301` 是 false，而 `select '39' > '301'` 是 true。

为了使语法更加精确并减少歧义，Databend 会将错误抛出给用户以获得更精确的 SQL。

> 为什么布尔类型不能自动转换为数值类型。

这也会带来歧义。

例如：

```sql
select true > 0.5;
```

> 错误消息 "can't cast from nullable data into non-nullable type" 是什么意思。

这意味着您的源列中有一个空值。您可以使用 `TRY_CAST` 函数或将目标类型设置为可为空类型。

> `select concat(1, col)` 不起作用

您可以将 SQL 改为 `select concat('1', col)`。

我们可能会在未来改进表达式，在可行的情况下，将会允许将字面量 1 解析为字符串值（`concat` 函数只接受字符串参数）。

## NULL 值和 NOT NULL 约束

NULL 值用于表示数据不存在或未知。在 Databend 中，每个列都可以包含 NULL 值，这意味着列可以同时容纳 NULL 和常规数据。

如果您需要一个不允许 NULL 值的列，请使用 NOT NULL 约束。如果在 Databend 中配置了禁止 NULL 值的列，并且在插入数据时没有为该列明确提供值，则将自动应用与该列数据类型关联的默认值。

| 数据类型           | 默认值                                                 |
| ------------------ | ------------------------------------------------------ |
| 整数数据类型       | 0                                                      |
| 浮点数数据类型     | 0.0                                                    |
| 字符和字符串       | 空字符串 ('')                                          |
| 日期和时间数据类型 | DATE 为'1970-01-01'，TIMESTAMP 为'1970-01-01 00:00:00' |
| 布尔数据类型       | False                                                  |

例如，如果您按以下方式创建一个表：

```sql
CREATE TABLE test(
    id Int64,
    name String NOT NULL,
    age Int32
);

DESC test;

Field|Type   |Null|Default|Extra|
-----+-------+----+-------+-----+
id   |BIGINT |YES |NULL   |     |
name |VARCHAR|NO  |''     |     |
age  |INT    |YES |NULL   |     |
```

- "id"列可以包含 NULL 值，因为它没有"NOT NULL"约束。这意味着它可以存储整数或留空表示缺失的数据。

- "name"列由于"NOT NULL"约束，必须始终有值，不允许 NULL 值。

- "age"列和"id"一样，由于没有"NOT NULL"约束，可以包含 NULL 值，以表示空条目或未知年龄。

以下 INSERT 语句插入了一行，其中"age"列的值为 NULL。这是允许的，因为"age"列没有 NOT NULL 约束，所以它可以包含 NULL 值来表示缺失或未知数据。

```sql
INSERT INTO test (id, name, age) VALUES (2, 'Alice', NULL);
```

以下 INSERT 语句在"test"表中插入了具有"id"和"name"列的值，而没有为"age"列提供值。这是允许的，因为"age"列没有 NOT NULL 约束，所以它可以留空或分配一个 NULL 值来表示缺失或未知数据。

```sql
INSERT INTO test (id, name) VALUES (1, 'John');
```

以下 INSERT 语句尝试插入一行，但没有为"name"列提供值。将应用列类型的默认值。

```sql
INSERT INTO test (id, age) VALUES (3, 45);
```
