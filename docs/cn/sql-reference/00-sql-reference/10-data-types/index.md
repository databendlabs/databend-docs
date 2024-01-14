---
title: 数据类型
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.100"/>

本页面解释了数据类型的各个方面，包括数据类型列表、数据类型转换、转换方法以及 NULL 值和 NOT NULL 约束的处理。

## 数据类型列表

以下是 Databend 中通用数据类型的列表：

| 数据类型                                                            | 别名   | 存储大小   | 最小值                   | 最大值                         |
| ------------------------------------------------------------------- | ------ | ---------- | ------------------------ | ------------------------------ |
| [BOOLEAN](./00-data-type-logical-types.md)                          | BOOL   | 1 字节     | 不适用                   | 不适用                         |
| [TINYINT](./10-data-type-numeric-types.md#integer-data-types)       | INT8   | 1 字节     | -128                     | 127                            |
| [SMALLINT](./10-data-type-numeric-types.md#integer-data-types)      | INT16  | 2 字节     | -32768                   | 32767                          |
| [INT](./10-data-type-numeric-types.md#integer-data-types)           | INT32  | 4 字节     | -2147483648              | 2147483647                     |
| [BIGINT](./10-data-type-numeric-types.md#integer-data-types)        | INT64  | 8 字节     | -9223372036854775808     | 9223372036854775807            |
| [FLOAT](./10-data-type-numeric-types.md#floating-point-data-types)  | 不适用 | 4 字节     | -3.40282347e+38          | 3.40282347e+38                 |
| [DOUBLE](./10-data-type-numeric-types.md#floating-point-data-types) | 不适用 | 8 字节     | -1.7976931348623157E+308 | 1.7976931348623157E+308        |
| [DECIMAL](./11-data-type-decimal-types.md)                          | 不适用 | 16/32 字节 | -10^P / 10^S             | 10^P / 10^S                    |
| [DATE](./20-data-type-time-date-types.md)                           | 不适用 | 4 字节     | 1000-01-01               | 9999-12-31                     |
| [TIMESTAMP](./20-data-type-time-date-types.md)                      | 不适用 | 8 字节     | 0001-01-01 00:00:00      | 9999-12-31 23:59:59.999999 UTC |
| [VARCHAR](./30-data-type-string-types.md)                           | STRING | 不适用     | 不适用                   | 不适用                         |

以下是 Databend 中半结构化数据类型的列表：

| 数据类型                               | 别名   | 示例                    | 描述                                                           |
| -------------------------------------- | ------ | ----------------------- | -------------------------------------------------------------- | --- |
| [ARRAY](./40-data-type-array-types.md) | 不适用 | [1, 2, 3, 4]            | 相同数据类型的值的集合，通过索引访问。                         |
| [TUPLE](./41-data-type-tuple-types.md) | 不适用 | ('2023-02-14','情人节') | 不同数据类型的值的有序集合，通过索引访问。                     |
| [MAP](./42-data-type-map.md)           | 不适用 | {"a":1, "b":2, "c":3}   | 键值对的集合，每个键都是唯一的，并映射到一个值。               |     |
| [VARIANT](./43-data-type-variant.md)   | JSON   | [1,{"a":1,"b":{"c":2}}] | 不同数据类型的元素的集合，包括`ARRAY`和`OBJECT`。              |
| [BITMAP](44-data-type-bitmap.md)       | 不适用 | 0101010101              | 用于表示一组值的二进制数据类型，其中每个位表示值的存在或缺失。 |

## 数据类型转换

### 显式转换

我们有两种表达式将一个值转换为另一种数据类型。

1. `CAST`函数，如果转换过程中发生错误，它会抛出错误。

我们还支持 pg 风格的转换：`CAST(c as INT)`与`c::Int`相同

2. `TRY_CAST`函数，如果转换过程中发生错误，它会返回 NULL。

### 隐式转换（"强制"）

关于"强制"即（自动转换）的一些基本规则：

1. 所有整数数据类型都可以隐式转换为`BIGINT`即（`INT64`）数据类型。

例如：

```sql
Int --> bigint
UInt8 --> bigint
Int32 --> bigint
```

2. 所有数值数据类型都可以隐式转换为`Double`即（`Float64`）数据类型。

例如：

```sql
Int --> Double
Float --> Double
Int32 --> Double
```

3. 所有非空数据类型`T`都可以隐式转换为`Nullable(T)`数据类型。

例如：

```sql
Int --> Nullable<Int>
String -->  Nullable<String>
```

4. 所有数据类型都可以隐式转换为`Variant`数据类型。

例如：

```sql
Int --> Variant
```

5. String 数据类型是最低级的数据类型，不能隐式转换为其他数据类型。
6. `Array<T>` --> `Array<U>` 如果 `T` --> `U`。
7. `Nullable<T>` --> `Nullable<U>` 如果 `T`--> `U`。
8. `Null` --> `Nullable<T>` 对于任何`T`数据类型。
9. 数值可以隐式转换为其他数值数据类型，如果没有损失精度。

### 常见问题解答

> 为什么数值类型不能自动转换为 String 类型。

这是微不足道的，甚至在其他流行的数据库中也能工作。但它会引入歧义。

例如：

```sql
select 39 > '301';
select 39 = '  39  ';
```

我们不知道该用数值规则还是 String 规则来比较它们。因为根据不同的规则，结果是不同的。

`select 39 > 301` 是假的，而 `select '39' > '301'` 是真的。

为了使语法更精确、更少歧义，我们向用户抛出错误并获得更精确的 SQL。

> 为什么布尔类型不能自动转换为数值类型。

这也会带来歧义。例如：

```sql
select true > 0.5;
```

> 错误消息是什么意思："不能从可空数据类型转换为非空数据类型"。

这意味着你的源列中有一个 null 值。你可以使用`TRY_CAST`函数或使你的目标类型为可空类型。

> `select concat(1, col)`不起作用

你可以将 SQL 改进为`select concat('1', col)`。

我们可能会在将来改进表达式，如果可能的话，将字面量`1`解析为 String 值（concat 函数只接受 String 参数）。

## NULL 值和 NOT NULL 约束

NULL 值用于表示不存在或未知的数据。在 Databend 中，每一列本质上都能包含 NULL 值，这意味着一列可以同时容纳 NULL 和常规数据。

如果你需要一个不允许 NULL 值的列，请使用 NOT NULL 约束。如果在 Databend 中配置了一个列不允许 NULL 值，并且在插入数据时你没有为该列明确提供一个值，将自动应用与该列数据类型相关联的默认值。

| 数据类型           | 默认值                                                 |
| ------------------ | ------------------------------------------------------ |
| 整数数据类型       | 0                                                      |
| 浮点数数据类型     | 0.0                                                    |
| 字符和字符串       | 空字符串('')                                           |
| 日期和时间数据类型 | DATE 为'1970-01-01'，TIMESTAMP 为'1970-01-01 00:00:00' |
| 布尔数据类型       | False                                                  |

例如，如果你创建一个表如下：

```sql
CREATE TABLE test(
    id Int64,
    name String NOT NULL,
    age Int32
);

DESC test;

字段|类型    |空  |默认值 |额外信息|
-----+-------+----+-------+-----+
id   |BIGINT |是  |NULL   |     |
name |VARCHAR|否  |''     |     |
age  |INT    |是  |NULL   |     |
```

- "id"列可以包含 NULL 值，因为它没有"NOT NULL"约束。这意味着它可以存储整数或留空以表示缺失数据。

- "name"列由于有"NOT NULL"约束，必须始终有值，不允许 NULL 值。

- "age"列和"id"一样，也可以包含 NULL 值，因为它没有"NOT NULL"约束，允许空条目或 NULL 值来表示未知年龄。

以下 INSERT 语句插入了一个"age"列为 NULL 值的行。这是允许的，因为"age"列没有 NOT NULL 约束，所以可以包含 NULL 值来表示缺失或未知数据。

```sql
INSERT INTO test (id, name, age) VALUES (2, 'Alice', NULL);
```

以下 INSERT 语句将一行插入到"test"表中，为"id"和"name"列提供了值，没有为"age"列提供值。这是允许的，因为"age"列没有 NOT NULL 约束，所以可以留空或赋予 NULL 值来表示缺失或未知数据。

```sql
INSERT INTO test (id, name) VALUES (1, 'John');
```

以下 INSERT 语句尝试插入一行，没有为"name"列提供值。将应用列类型的默认值。

```sql
INSERT INTO test (id, age) VALUES (3, 45);
```

## Databend、MySQL 和 Oracle 之间的数据类型映射

此表提供了 Databend、MySQL 和 Oracle 之间数据类型映射的概述。

| Databend      | MySQL     | Oracle       |
| ------------- | --------- | ------------ |
| TINYINT       | TINYINT   | NUMBER(3,0)  |
| SMALLINT      | SMALLINT  | NUMBER(5,0)  |
| INT           | INT       | NUMBER(10,0) |
| BIGINT        | BIGINT    | NUMBER(19,0) |
| FLOAT         | FLOAT     | FLOAT        |
| DOUBLE        | DOUBLE    | FLOAT(24)    |
| DECIMAL       | DECIMAL   | FLOAT(24)    |
| DATE          | DATE      | DATE         |
| TIMESTAMP     | TIMESTAMP | NUMBER       |
| DATETIME      | DATETIME  | DATE         |
| YEAR          | INT       | NUMBER       |
| VARCHAR       | VARCHAR   | VARCHAR2     |
| VARCHAR       | CHAR      | CHAR         |
| VARBINARY     | VARBINARY | RAW, BLOB    |
| VARCHAR       | VARCHAR   | VARCHAR2     |
| VARCHAR       | VARCHAR   | RAW, CBLOB   |
| VARBINARY     | VARBINARY | RAW, BLOB    |
| VARCHAR       | VARCHAR   | RAW, CBLOB   |
| VARCHAR       | VARCHAR   | VARCHAR2     |
| VARCHAR       | VARCHAR   | VARCHAR2     |
| ARRAY         | 不适用    | 不适用       |
| BOOLEAN       | 不适用    | 不适用       |
| TUPLE         | 不适用    | 不适用       |
| MAP           | 不适用    | 不适用       |
| JSON, VARIANT | JSON      | JSON         |
| BITMAP        | 不适用    | 不适用       |
