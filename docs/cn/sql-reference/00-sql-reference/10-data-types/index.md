---
title: 数据类型
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.100"/>

本页介绍数据类型的各个方面，包括数据类型列表、数据类型转换、转换方法以及 `NULL` 值和 `NOT NULL` 约束的处理。

## 数据类型列表

以下是 Databend 中的通用数据类型列表：

| 数据类型                                                              | 别名   | 存储大小 | 最小值                   | 最大值                         |
| --------------------------------------------------------------------- | ------ | -------- | ------------------------ | ------------------------------ |
| [布尔值（BOOLEAN）](boolean.md)                                       | BOOL   | 1 字节   | 不适用                   | 不适用                         |
| [极小整数（TINYINT）](numeric.md#integer-data-types)                  | INT8   | 1 字节   | -128                     | 127                            |
| [小整数（SMALLINT）](numeric.md#integer-data-types)                   | INT16  | 2 字节   | -32768                   | 32767                          |
| [整数（INT）](numeric.md#integer-data-types)                          | INT32  | 4 字节   | -2147483648              | 2147483647                     |
| [大整数（BIGINT）](numeric.md#integer-data-types)                     | INT64  | 8 字节   | -9223372036854775808     | 9223372036854775807            |
| [单精度浮点数（FLOAT）](numeric.md#floating-point-data-types)         | 不适用 | 4 字节   | -3.40282347e+38          | 3.40282347e+38                 |
| [双精度浮点数（DOUBLE）](numeric.md#floating-point-data-types)        | 不适用 | 8 字节   | -1.7976931348623157E+308 | 1.7976931348623157E+308        |
| [定点数（DECIMAL）](decimal.md)                                       | 不适用 | 16/32 字节 | -10^P / 10^S             | 10^P / 10^S                    |
| [日期（DATE）](datetime.md)                                           | 不适用 | 4 字节   | 1000-01-01               | 9999-12-31                     |
| [时间戳（TIMESTAMP）](datetime.md)                                    | 不适用 | 8 字节   | 0001-01-01 00:00:00      | 9999-12-31 23:59:59.999999 UTC |
| [可变长字符串（VARCHAR）](string.md)                                  | STRING | 不适用   | 不适用                   | 不适用                         |

以下是 Databend 中的半结构化数据类型列表：

| 数据类型                               | 别名 | 示例                           | 描述                                                                                                        |
| -------------------------------------- | ---- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [数组（ARRAY）](array.md)              | 不适用 | [1, 2, 3, 4]                   | 由相同数据类型的值组成的集合，通过索引访问。                                                                |
| [元组（TUPLE）](tuple.md)              | 不适用 | ('2023-02-14','Valentine Day') | 由不同数据类型的值组成的有序集合，通过索引访问。                                                            |
| [映射（MAP）](map.md)                  | 不适用 | `{"a":1, "b":2, "c":3}`        | 一组键值对，其中每个键都是唯一的并映射到一个值。                                                            |
| [半结构化（VARIANT）](variant.md)      | JSON | `[1,{"a":1,"b":{"c":2}}]`      | 包含不同数据类型元素的集合，包括 `数组（ARRAY）` 和 `对象（OBJECT）`。                                       |
| [向量（VECTOR）](vector.md)            | 不适用 | [1.0, 2.1, 3.2]                | 用于机器学习和相似性搜索操作的 32 位浮点数多维数组。                                                        |
| [位图（BITMAP）](bitmap.md)            | 不适用 | 0101010101                     | 一种二进制数据类型，用于表示一组值，其中每个位代表一个值的存在与否。                                        |

## 数据类型转换

### 显式转换

我们提供两种表达式来转换值的数据类型：

1. `CAST` 函数：转换失败时抛出错误

同时支持 PostgreSQL 转换风格：`CAST(c as INT)` 等同于 `c::Int`

2. `TRY_CAST` 函数：转换失败时返回 NULL

### 隐式转换（强制转换 Coercion）

以下是一些关于强制转换（Coercion）的基本规则：

1. 所有整数类型可隐式转换为 `大整数（BIGINT）`（即 `INT64`）类型

```sql
Int --> bigint
UInt8 --> bigint
Int32 --> bigint
```

2. 所有数值类型可隐式转换为 `双精度浮点数（DOUBLE）`（即 `Float64`）类型

```sql
Int --> Double
Float --> Double
Int32 --> Double
```

3. 所有非空类型 `T` 可隐式转换为 `Nullable(T)` 类型

```sql
Int --> Nullable<Int>
String -->  Nullable<String>
```

4. 所有类型可隐式转换为 `半结构化（VARIANT）` 类型

```sql
Int --> Variant
```

5. 字符串（String）类型不可隐式转换为其他类型
6. 若 `T` → `U`，则 `Array<T>` → `Array<U>`
7. 若 `T` → `U`，则 `Nullable<T>` → `Nullable<U>`
8. 对任意类型 `T`，`Null` → `Nullable<T>`
9. 无精度损失时，数值类型可隐式转换

### 常见问题

> 为何数值类型不能自动转为字符串类型？

这虽然在其他主流数据库中可行，但会引入歧义：

```sql
select 39 > '301';
select 39 = '  39  ';
```

数值比较 `39 > 301` 结果为 false，而字符串比较 `'39' > '301'` 结果为 true。为避免歧义，系统要求编写更精确的 SQL。

> 为何布尔类型不能自动转为数值类型？

同样会引发歧义：
```sql
select true > 0.5;
```

> 错误信息 "can't cast from nullable data into non-nullable type" 的含义？

源列包含 NULL 值。解决方案：使用 `TRY_CAST` 函数或将目标类型设为可空类型。

> `select concat(1, col)` 为何无效？

可优化为 `select concat('1', col)`。未来版本可能支持将字面量 `1` 解析为字符串（因 concat 函数仅接受字符串参数）。

## NULL 值与 NOT NULL 约束

`NULL` 值表示不存在或未知的数据。Databend 中所有列默认可包含 NULL 值。

如需禁用 NULL 值，请使用 `NOT NULL` 约束。插入数据时若未显式赋值，系统将应用该类型的默认值：

| 数据类型                  | 默认值                                                     |
| ------------------------- | ---------------------------------------------------------- |
| 整数类型                  | 0                                                          |
| 浮点类型                  | 0.0                                                        |
| 字符与字符串              | 空字符串 ('')                                              |
| 日期时间类型              | '1970-01-01' (DATE), '1970-01-01 00:00:00' (TIMESTAMP)    |
| 布尔类型                  | False                                                      |

示例表结构：
```sql
CREATE TABLE test(
    id Int64,
    name String NOT NULL,
    age Int32
);

DESC test;

字段 |类型   |为空|默认   |额外 |
-----+-------+----+-------+-----+
id   |BIGINT |是  |NULL   |     |
name |VARCHAR|否  |''     |     |
age  |INT    |是  |NULL   |     |
```

- `id` 列：无约束，可存 NULL 值
- `name` 列：`NOT NULL` 约束，禁止 NULL 值
- `age` 列：无约束，可存 NULL 值

允许为可空列插入 NULL：
```sql
INSERT INTO test (id, name, age) VALUES (2, 'Alice', NULL);
```

未赋值时自动置为 NULL：
```sql
INSERT INTO test (id, name) VALUES (1, 'John');
```

未赋值的 `NOT NULL` 列使用默认值：
```sql
INSERT INTO test (id, age) VALUES (3, 45);
```