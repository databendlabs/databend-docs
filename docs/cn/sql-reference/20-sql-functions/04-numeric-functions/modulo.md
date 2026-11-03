---
title: MODULO
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

返回 `x` 除以 `y` 的余数。如果 `y` 为 0，会报错。

## 语法

```sql
MODULO( <x>, <y> )
```

## 别名

- [MOD](mod.md)

<a id="decimal-operands"></a>

## Decimal 操作数

当操作数解析为 DECIMAL 类型时，`MODULO`、`MOD` 和 `%` 计算精确的十进制余数，不会先将操作数转换为 Float64。需要此行为时，请显式转换为 DECIMAL；不要假定混合浮点表达式使用十进制运算。

对于 `DECIMAL(P1, S1)` 和 `DECIMAL(P2, S2)` 操作数，结果为 DECIMAL，具有：

- 标度 `S = max(S1, S2)`。
- 精度 `P = min(P1 - S1, P2 - S2) + S`。

非零余数的符号与被除数一致，而不是与除数一致。除数为零时会报错。这些规则适用于十进制重载，并不表示所有数值输入都返回 DECIMAL。

```sql
SELECT
    MODULO(5.5::DECIMAL(10, 2), 0.1::DECIMAL(2, 1)) AS exact_zero,
    MOD(-7.5::DECIMAL(2, 1), 2::DECIMAL(1, 0)) AS negative_remainder,
    7.5::DECIMAL(2, 1) % (-2)::DECIMAL(1, 0) AS positive_remainder;

SELECT TYPEOF(0.25::DECIMAL(2, 2) % 0.1::DECIMAL(1, 1));
```

第一个查询的值为 `0.00`、`-1.5` 和 `1.5`。第二个查询的类型为 `DECIMAL(2, 2)`。第一个表达式在除数带小数的情况下仍精确为零。

## 示例

```sql
SELECT MOD(9, 2), MODULO(9, 2);

┌──────────────────────────┐
│ mod(9, 2) │ modulo(9, 2) │
├───────────┼──────────────┤
│         1 │            1 │
└──────────────────────────┘
```