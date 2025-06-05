---
title: 数值函数（Numeric Functions）
---

本页面全面概述了 Databend 中的数值函数，按功能分类以便参考。

## 基本算术函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [PLUS](plus.md) / [ADD](add.md) | 加法运算符 | `5 + 3` → `8` |
| [MINUS](minus.md) / [SUBTRACT](subtract.md) | 减法运算符 | `5 - 3` → `2` |
| [MULTIPLY](multiply.md) | 乘法运算符 | `5 * 3` → `15` |
| [DIV](div.md) | 除法运算符 | `10 / 2` → `5.0` |
| [DIV0](div0.md) | 除数为零时返回 0 而不报错的除法 | `DIV0(10, 0)` → `0` |
| [DIVNULL](divnull.md) | 除数为零时返回 NULL 而不报错的除法 | `DIVNULL(10, 0)` → `NULL` |
| [INTDIV](intdiv.md) | 整数除法 | `10 DIV 3` → `3` |
| [MOD](mod.md) / [MODULO](modulo.md) | 取模运算（余数） | `10 % 3` → `1` |
| [NEG](neg.md) / [NEGATE](negate.md) | 取负运算 | `-5` → `-5` |

## 舍入和截断函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ROUND](round.md) | 将数字四舍五入到指定小数位 | `ROUND(123.456, 2)` → `123.46` |
| [FLOOR](floor.md) | 返回不大于参数的最大整数 | `FLOOR(123.456)` → `123` |
| [CEIL](ceil.md) / [CEILING](ceiling.md) | 返回不小于参数的最小整数 | `CEIL(123.456)` → `124` |
| [TRUNCATE](truncate.md) | 将数字截断到指定小数位 | `TRUNCATE(123.456, 1)` → `123.4` |

## 指数和对数函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [EXP](exp.md) | 返回 e 的 x 次幂 | `EXP(1)` → `2.718281828459045` |
| [POW](pow.md) / [POWER](power.md) | 返回 x 的 y 次幂 | `POW(2, 3)` → `8` |
| [SQRT](sqrt.md) | 返回 x 的平方根 | `SQRT(16)` → `4` |
| [CBRT](cbrt.md) | 返回 x 的立方根 | `CBRT(27)` → `3` |
| [LN](ln.md) | 返回 x 的自然对数 | `LN(2.718281828459045)` → `1` |
| [LOG10](log10.md) | 返回 x 的以 10 为底的对数 | `LOG10(100)` → `2` |
| [LOG2](log2.md) | 返回 x 的以 2 为底的对数 | `LOG2(8)` → `3` |
| [LOGX](logx.md) | 返回以 x 为底 y 的对数 | `LOGX(2, 8)` → `3` |
| [LOGBX](logbx.md) | 返回以 b 为底 x 的对数 | `LOGBX(8, 2)` → `3` |

## 三角函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [SIN](sin.md) | 返回 x 的正弦值 | `SIN(0)` → `0` |
| [COS](cos.md) | 返回 x 的余弦值 | `COS(0)` → `1` |
| [TAN](tan.md) | 返回 x 的正切值 | `TAN(0)` → `0` |
| [COT](cot.md) | 返回 x 的余切值 | `COT(1)` → `0.6420926159343306` |
| [ASIN](asin.md) | 返回 x 的反正弦值 | `ASIN(1)` → `1.5707963267948966` |
| [ACOS](acos.md) | 返回 x 的反余弦值 | `ACOS(1)` → `0` |
| [ATAN](atan.md) | 返回 x 的反正切值 | `ATAN(1)` → `0.7853981633974483` |
| [ATAN2](atan2.md) | 返回 y/x 的反正切值 | `ATAN2(1, 1)` → `0.7853981633974483` |
| [DEGREES](degrees.md) | 将弧度转换为角度 | `DEGREES(PI())` → `180` |
| [RADIANS](radians.md) | 将角度转换为弧度 | `RADIANS(180)` → `3.141592653589793` |
| [PI](pi.md) | 返回 π 的值 | `PI()` → `3.141592653589793` |

## 其他数值函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ABS](abs.md) | 返回 x 的绝对值 | `ABS(-5)` → `5` |
| [SIGN](sign.md) | 返回 x 的符号 | `SIGN(-5)` → `-1` |
| [FACTORIAL](factorial.md) | 返回 x 的阶乘 | `FACTORIAL(5)` → `120` |
| [RAND](rand.md) | 返回 0 到 1 之间的随机数 | `RAND()` → `0.123...`（随机） |
| [RANDN](randn.md) | 返回标准正态分布的随机数 | `RANDN()` → `-0.123...`（随机） |
| [CRC32](crc32.md) | 返回字符串的 CRC32 校验和 | `CRC32('Databend')` → `3899655467` |