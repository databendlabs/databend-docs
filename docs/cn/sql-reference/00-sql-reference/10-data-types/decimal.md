---
title: Decimal
description: 用于存储和操作的高精度数值类型。
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

## 概览

`DECIMAL(P, S)` 存储精确的数值，其中精度 `P`（总位数，1–76）和标度 `S`（小数点后的位数，0–P）。数值必须位于 ±`(10^P - 1) / 10^S` 范围内。

## 示例

```sql
CREATE TABLE invoices (
  description STRING,
  amount DECIMAL(10, 2),
  tax_rate DECIMAL(5, 4)
);

INSERT INTO invoices VALUES
  ('Laptop', 1299.99, 0.1300),
  ('Monitor', 399.50, 0.0750);

SELECT
  description,
  amount,
  tax_rate,
  amount * tax_rate          AS tax_value,
  amount + amount * tax_rate AS total_due
FROM invoices;
```

结果：
```
┌─────────────┬──────────┬──────────┬────────────┬────────────┐
│ description │ amount   │ tax_rate │ tax_value  │ total_due  │
├─────────────┼──────────┼──────────┼────────────┼────────────┤
│ Laptop      │ 1299.99  │ 0.1300   │ 168.998700 │ 1468.988700 │
│ Monitor     │  399.50  │ 0.0750   │  29.962500 │  429.462500 │
└─────────────┴──────────┴──────────┴────────────┴────────────┘
```

算术运算会选择结果精度和标度。结果类型可能与输入类型不同。如果需要特定的结果类型，请使用显式转换。有关标度和舍入规则，请参阅[Decimal 规则](#decimal-rules)。

```sql
SELECT
  SUM(amount)                              AS sum_default,
  CAST(SUM(amount) AS DECIMAL(12, 2))      AS sum_cast,
  AVG(amount)                              AS avg_default,
  CAST(AVG(amount) AS DECIMAL(12, 4))      AS avg_cast
FROM invoices;
```

结果：
```
┌─────────────┬───────────┬────────────────┬──────────┐
│ sum_default │ sum_cast  │ avg_default    │ avg_cast │
├─────────────┼───────────┼────────────────┼──────────┤
│ 1699.49     │ 1699.49   │ 849.74500000   │ 849.7450 │
└─────────────┴───────────┴────────────────┴──────────┘
```

<a id="decimal-rules"></a>

## Decimal 规则

对于标度为 `S1` 和 `S2` 的十进制操作数，算术运算使用以下结果标度：

| 运算 | 结果标度 |
|------|----------|
| 加法或减法 | `max(S1, S2)` |
| 乘法 | `min(S1 + S2, max(12, S1, S2))` |
| 除法 | `max(S1, min(S1 + 6, 12))` |

当两个输入精度均不超过 38 时，结果精度上限为 38。否则，上限为 76。如果计算结果超出结果精度，则会报溢出错误。除以零也会报错。

乘法和除法丢弃小数位时，按最接近值舍入，恰好在中点时向远离零的方向舍入，而不是始终截断。`numeric_cast_option` 设置控制类型转换，不控制这些算术舍入规则。

[ROUND](/sql/sql-functions/numeric-functions/round#decimal-input) 也支持十进制结果。如果舍入后的整数值超出结果精度，则会报错。

有关十进制标度缩减及 FLOAT 或 DOUBLE 的转换，请参阅 [TO_DECIMAL](/sql/sql-functions/conversion-functions/to-decimal#numeric-conversion)。转换规则与算术运算不同。需要保留十进制文本而非二进制浮点值时，请使用十进制字面量或字符串。
