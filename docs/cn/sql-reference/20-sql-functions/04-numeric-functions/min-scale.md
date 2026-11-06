---
title: MIN_SCALE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

返回精确表示十进制数值所需的最少小数位数。小数部分末尾的零不计入位数。此函数不会修改数值或其声明的十进制类型。

## 语法

```sql
MIN_SCALE(<decimal>)
```

## 参数

| 参数 | 说明 |
|----------|-------------|
| `<decimal>` | `DECIMAL` 表达式。支持所有十进制存储宽度，包括 Decimal256。 |

## 返回类型

`UInt8`。输入为 `NULL` 时返回 `NULL`。

数值为整数的十进制数或零返回 `0`。负数的最少小数位数与其绝对值相同。

## 示例

```sql
SELECT MIN_SCALE(1.2300::DECIMAL(10, 4)) AS scale;
-- 2

SELECT MIN_SCALE(-0.0010::DECIMAL(10, 4)) AS scale;
-- 3

SELECT MIN_SCALE(0::DECIMAL(10, 4)) AS scale;
-- 0

SELECT MIN_SCALE(1.0000000000000000001::DECIMAL(38, 19)) AS scale;
-- 19

SELECT MIN_SCALE(NULL) AS scale;
-- NULL
```

使用 `MAX(MIN_SCALE(...))` 可以获取列或分组中最大的最少小数位数。例如，包含十进制数值 `0.01`、`0.1234` 和 `NULL` 的分组返回 `4`。包含 `100` 和 `2.5` 的分组返回 `1`。
