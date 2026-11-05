---
title: ROUND
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

将 `x` 舍入至 `d` 位小数。`d` 默认为 0。负的 `d` 表示对小数点左侧的位数进行舍入。结果类型和 `d` 的范围取决于重载。

整数和浮点数重载返回 DOUBLE（Float64）。这些重载将 `d` 限制在 -30 到 30 的范围内。浮点结果可能存在二进制表示误差：

```sql
SELECT ROUND(4/7, 4) - ROUND(3/7, 4); -- 结果：0.14280000000000004
SELECT ROUND(4/7, 4)::DECIMAL(8,4) - ROUND(3/7, 4)::DECIMAL(8,4); -- 结果：0.1428
```

## 语法

```sql
ROUND( <x, d> )
```

<a id="decimal-input"></a>

## Decimal 输入

对于 `DECIMAL(P, S)` 输入，DECIMAL 重载返回 `DECIMAL(P, clamp(d, 0, S))`。它保留输入精度。如果 `d` 大于或等于 `S`，值和标度均不变。十进制重载不受浮点重载的 30 位限制。

十进制舍入使用最接近的值。恰好在中点时向远离零的方向舍入。它不依赖 `numeric_cast_option`。很大的负 `d` 可以产生零。如果进位导致结果超出精度 `P`，舍入会报溢出错误。

```sql
SELECT ROUND(95::DECIMAL(3, 0), -1), ROUND((-95)::DECIMAL(3, 0), -1);
-- Expected values: 100, -100

SELECT ROUND(99::DECIMAL(2, 0), -2);
-- Expected error: Decimal round overflow
```

第二个查询无法将 `100` 存入 `DECIMAL(2, 0)`。需要此结果时，请在舍入前提高输入精度。

## 示例

```sql
SELECT ROUND(0.123, 2);

┌─────────────────┐
│ round(0.123, 2) │
├─────────────────┤
│ 0.12            │
└─────────────────┘
```