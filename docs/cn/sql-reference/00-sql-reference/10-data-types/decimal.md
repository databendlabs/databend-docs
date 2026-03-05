---
title: Decimal
description: 用于存储和操作的高精度数值类型。
sidebar_position: 5
---

## 概览

`DECIMAL(P, S)` 存储精确的数值，其中精度 `P`（总位数，1–76）和标度 `S`（小数点后的位数，0–P）。数值必须位于 ±`(10^P - 1) / 10^S` 范围内。精度高达 38 的数值使用 `DECIMAL128`，更大的数值使用 `DECIMAL256`。

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

算术运算会自动保留精度：加法保留最宽的整数和小数部分，乘法累加精度，除法保留左操作数的标度。如果需要特定的结果形式，请使用显式转换。

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

如果操作会导致整数部分溢出，Databend 会引发错误；多余的小数位会被截断而不是四舍五入。调整 `P`/`S` 或转换结果以控制这两种行为。
