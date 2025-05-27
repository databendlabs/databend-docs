---
title: 数据类型
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.100"/>

本页面解释了数据类型的各个方面，包括数据类型列表、数据类型转换、转换方法以及 NULL 值和 NOT NULL 约束的处理。

## 数据类型列表

以下是 Databend 中的通用数据类型列表：

| Data Type                                                           | Alias  | Storage Size | Min Value                | Max Value                      |
| ------------------------------------------------------------------- | ------ | ------------ | ------------------------ | ------------------------------ |
| [BOOLEAN](boolean.md)                          | BOOL   | 1 byte       | N/A                      | N/A                            |
| [TINYINT](numeric.md#integer-data-types)       | INT8   | 1 byte       | -128                     | 127                            |
| [SMALLINT](numeric.md#integer-data-types)      | INT16  | 2 bytes      | -32768                   | 32767                          |
| [INT](numeric.md#integer-data-types)           | INT32  | 4 bytes      | -2147483648              | 2147483647                     |
| [BIGINT](numeric.md#integer-data-types)        | INT64  | 8 bytes      | -9223372036854775808     | 9223372036854775807            |
| [FLOAT](numeric#floating-point-data-types)  | N/A    | 4 bytes      | -3.40282347e+38          | 3.40282347e+38                 |
| [DOUBLE](numeric#floating-point-data-types) | N/A    | 8 bytes      | -1.7976931348623157E+308 | 1.7976931348623157E+308        |
| [DECIMAL](decimal.md)                          | N/A    | 16/32 bytes  | -10^P / 10^S             | 10^P / 10^S                    |
| [DATE](datetime.md)                           | N/A    | 4 bytes      | 1000-01-01               | 9999-12-31                     |
| [TIMESTAMP](datetime.md)                      | N/A    | 8 bytes      | 0001-01-01 00:00:00      | 9999-12-31 23:59:59.999999 UTC |
| [VARCHAR](string.md)                           | STRING | N/A          | N/A                      | N/A                            |

以下是 Databend 中的半结构化数据类型列表：

| Data Type                              | Alias | Sample                         | Description                                                                                                         |
| -------------------------------------- | ----- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| [ARRAY](array.md) | N/A   | [1, 2, 3, 4]                   | A collection of values of the same data type, accessed by their index.                                              |
| [TUPLE](tuple.md) | N/A   | ('2023-02-14','Valentine Day') | An ordered collection of values of different data types, accessed by their index.                                   |
| [MAP](map.md)           | N/A   | `{"a":1, "b":2, "c":3}`        | A set of key-value pairs where each key is unique and maps to a value.                                              |
| [VARIANT](variant.md)   | JSON  | `[1,{"a":1,"b":{"c":2}}]`      | Collection of elements of different data types, including `ARRAY` and `OBJECT`.                                     |
| [BITMAP](bitmap.md)       | N/A   | 0101010101                     | A binary data type used to represent a set of values, where each bit represents the presence or absence of a value. |

## 数据类型转换

### 显式转换

我们有两种表达式可以将一个值转换为另一种数据类型。

1. `CAST` 函数，如果在转换过程中发生错误，它会抛出错误。

我们也支持 PG 转换风格：`CAST(c as INT)` 等同于 `c::Int`

2. `TRY_CAST` 函数，如果在转换过程中发生错误，它会返回 NULL。

### 隐式转换（“Coercion”）

关于“Coercion”（即自动转换）的一些基本规则。


1. 所有整型数据类型都可以隐式转换为 `BIGINT` (即 `INT64`) 数据类型。

例如：

```sql
Int --> bigint
UInt8 --> bigint
Int32 --> bigint
```

2. 所有数值数据类型都可以隐式转换为 `Double` (即 `Float64`) 数据类型。

例如：

```sql
Int --> Double
Float --> Double
Int32 --> Double
```

3. 所有非空数据类型 `T` 都可以隐式转换为 `Nullable(T)` 数据类型。

例如：

```sql
Int --> Nullable<Int>
String -->  Nullable<String>
```

4. 所有数据类型都可以隐式转换为 `Variant` 数据类型。

例如：

```sql
Int --> Variant
```

5. String 数据类型是不能隐式转换为其他数据类型的最低数据类型。
6. 如果 `T` --> `U`，则 `Array<T>` --> `Array<U>`。
7. 如果 `T` --> `U`，则 `Nullable<T>` --> `Nullable<U>`。
8. 对于任何 `T` 数据类型，`Null` --> `Nullable<T>`。
9. 如果没有精度损失，数值类型可以隐式转换为其他数值数据类型。

### 常见问题

> 为什么数值类型不能自动转换为 String 类型？

这看起来微不足道，甚至在其他流行的数据库中也有效。但这会引入歧义。

例如：

```sql
select 39 > '301';
select 39 = '  39  ';
```

我们不知道是应该用数值规则还是 String 规则来比较它们。因为根据不同的规则，结果会不同。

`select 39 > 301` 的结果是 false，而 `select '39' > '301'` 的结果是 true。

为了使语法更精确、更少歧义，我们向用户抛出错误，以获得更精确的 SQL。

> 为什么布尔类型不能自动转换为数值类型？

这也会带来歧义。
例如：

```sql
select true > 0.5;
```

> 错误消息：“can't cast from nullable data into non-nullable type”是什么意思？

这意味着你的源列中包含 null 值。你可以使用 `TRY_CAST` 函数，或者将目标类型设置为可空类型。

> `select concat(1, col)` 不起作用

你可以将 SQL 改进为 `select concat('1', col)`。

我们将来可能会改进表达式，使其在可能的情况下将字面量 `1` 解析为 String 值 (concat 函数只接受 String 参数)。

## NULL 值和 NOT NULL 约束

NULL 值用于表示不存在或未知的数据。在 Databend 中，每个列本身都能够包含 NULL 值，这意味着一个列可以容纳 NULL 和常规数据。

如果你需要一个不允许 NULL 值的列，请使用 NOT NULL 约束。如果在 Databend 中将列配置为不允许 NULL 值，并且在插入数据时没有为该列显式提供值，则将自动应用与该列数据类型关联的默认值。

| 数据类型                 | 默认值                                                     |
| :----------------------- | :--------------------------------------------------------- |
| 整型数据类型             | 0                                                          |
| 浮点数据类型             | 0.0                                                        |
| 字符和字符串             | 空字符串 ('')                                              |
| 日期和时间数据类型       | DATE 为 '1970-01-01'，TIMESTAMP 为 '1970-01-01 00:00:00' |
| 布尔数据类型             | False                                                      |

例如，如果你创建如下表：

```sql
CREATE TABLE test(
    id Int64,
    name String NOT NULL,
    age Int32
);

DESC test;

Field|Type   |Null|Default|Extra|
-----+-----------+-------+-----+
id   |BIGINT |YES |NULL   |     |
name |VARCHAR|NO  |''     |     |
age  |INT    |YES |NULL   |     |
```

- “id”列可以包含 NULL 值，因为它缺少 “NOT NULL” 约束。这意味着它可以存储整数或留空以表示缺失数据。

- “name”列由于 “NOT NULL” 约束，必须始终具有值，不允许 NULL 值。

- “age”列与 “id” 类似，也可以包含 NULL 值，因为它没有 “NOT NULL” 约束，允许空条目或 NULL 来表示未知年龄。

以下 INSERT 语句为 “age” 列插入一个 NULL 值的行。这是允许的，因为 “age” 列没有 NOT NULL 约束，因此它可以包含 NULL 值来表示缺失或未知数据。

```sql
INSERT INTO test (id, name, age) VALUES (2, 'Alice', NULL);
```

以下 INSERT 语句将一行插入到 “test” 表中，其中包含 “id” 和 “name” 列的值，但未提供 “age” 列的值。这是允许的，因为 “age” 列没有 NOT NULL 约束，因此可以留空或分配 NULL 值以表示缺失或未知数据。

```sql
INSERT INTO test (id, name) VALUES (1, 'John');
```

以下 INSERT 语句尝试插入一行，但没有为 “name” 列提供值。将应用列类型的默认值。

```sql
INSERT INTO test (id, age) VALUES (3, 45);
```