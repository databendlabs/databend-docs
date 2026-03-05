---
title: 数据类型
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.100"/>

Databend 的列是强类型的。本页概述可用的数据类型、转换规则以及 NULL/默认值的行为。

## 基础类型

| 数据类型                                       | 别名      | 存储 / 精度                     | 最小值                | 最大值                        |
|-----------------------------------------------|-----------|--------------------------------|-----------------------|-------------------------------|
| [Boolean](boolean.md)                         | BOOL      | 1 字节                          | –                     | –                             |
| [Binary](binary.md)                           | VARBINARY | 可变长                          | –                     | –                             |
| [String](string.md)                           | STRING    | 可变长                          | –                     | –                             |
| [TinyInt](numeric.md#integer-data-types)      | INT8      | 1 字节                          | -128                  | 127                           |
| [SmallInt](numeric.md#integer-data-types)     | INT16     | 2 字节                          | -32768                | 32767                         |
| [Int](numeric.md#integer-data-types)          | INT32     | 4 字节                          | -2147483648           | 2147483647                    |
| [BigInt](numeric.md#integer-data-types)       | INT64     | 8 字节                          | -9223372036854775808  | 9223372036854775807           |
| [Float](numeric.md#floating-point-data-types) | –         | 4 字节（Float32）              | -3.40e38              | 3.40e38                       |
| [Double](numeric.md#floating-point-data-types)| –         | 8 字节（Float64）              | -1.79e308             | 1.79e308                      |
| [Decimal](decimal.md)                         | –         | 16/32 字节（精度 ≤38/76）      | `-(10^P-1)/10^S`      | `(10^P-1)/10^S`               |

## 日期与时间

| 数据类型             | 说明 |
|----------------------|------|
| [DATE](datetime.md)  | 仅存储日期。 |
| [TIMESTAMP](datetime.md) | 微秒级时间戳，显示受会话时区影响。 |
| [TIMESTAMP_TZ](datetime.md) | 微秒级时间戳并记录偏移。 |
| [INTERVAL](interval.md) | 微秒分辨率的时间间隔，可为负值。 |

## 结构化与半结构化

| 数据类型                | 示例                                | 描述 |
|-------------------------|-------------------------------------|------|
| [ARRAY](array.md)       | `[1, 2, 3]`                         | 元素类型一致的变长集合。 |
| [TUPLE](tuple.md)       | `('2023-02-14','Valentine's Day')`  | 定长且可混合类型。 |
| [MAP](map.md)           | `{'a':1, 'b':2}`                    | 键值对集合，内部为二元 Tuple。 |
| [VARIANT](variant.md)   | `[1, {"name":"databend"}]`       | JSON 风格的半结构化存储。 |
| [BITMAP](bitmap.md)     | `<bitmap binary>`                   | 支持集合计数与按位运算的压缩位图。 |

## 特殊领域

| 数据类型                               | 描述 |
|----------------------------------------|------|
| [VECTOR](vector.md)                    | Float32 向量，用于相似度搜索/ML。 |
| [GEOMETRY / GEOGRAPHY](geospatial.md)  | WKB/EWKB 格式的空间对象。 |

## 类型转换

### 显式转换

- `CAST(expr AS TYPE)`：转换失败会抛错。
- `expr::TYPE`：PostgreSQL 风格语法。
- `TRY_CAST(expr AS TYPE)`：失败时返回 NULL。

### 隐式转换

1. 整数可自动提升到 `INT64`。
2. 数值可自动提升到 `FLOAT64`。
3. 任意类型在表达式中出现 NULL 时可提升为 `Nullable<T>`。
4. 所有类型都可提升为 `VARIANT`。
5. 复合类型按元素递归转换（例如 `Array<T> -> Array<U>` 当 `T -> U`）。

若目标列为 `NOT NULL` 但数据中可能包含 NULL，请显式转换为 `Nullable<T>` 或使用 `TRY_CAST`。

```sql
SELECT CONCAT('1', col);      -- 字符串拼接
SELECT CONCAT(1, col);        -- 需要可用的数字转换，否则可能失败
```

## NULL 与默认值

| 类型类别       | 默认值 |
|----------------|--------|
| 整数           | `0`    |
| 浮点           | `0.0`  |
| 字符串 / 二进制 | 空字符串 / 空二进制 |
| 日期           | `1970-01-01` |
| 时间戳         | `1970-01-01 00:00:00` |
| 布尔           | `FALSE` |

示例：

```sql
CREATE TABLE test (
    id   INT64,
    name STRING NOT NULL,
    age  INT32
);

INSERT INTO test (id, name, age) VALUES (2, 'Alice', NULL);
INSERT INTO test (id, name) VALUES (1, 'John');
INSERT INTO test (id, age) VALUES (3, 45);
```

使用 `DESC test` 或 `SHOW CREATE TABLE test` 可查看列的默认值与可空设置。
