---
title: 十进制类型
description: 十进制类型是用于存储和操作高精度数值的数据类型. 
---

## 十进制数据类型

十进制类型适用于需要精确表示的应用程序, 如金融计算或科学计算. 

我们可以使用 `DECIMAL(P, S)` 来表示十进制类型. 

- `P` 是精度, 即数字中的总位数, 取值范围为 [1, 76]. 
- `S` 是小数点右侧的位数, 取值范围为 [0, P]. 

如果 `P` 小于 38, 则十进制的物理数据类型为 `Decimal128` , 否则为 `Decimal256` . 

对于 DECIMAL(P, S) 数据类型: 

- 最小值为 `-10^P + 1` 除以 `10^S` . 
- 最大值为 `10^P - 1` 除以 `10^S` . 

如果你有一个 `DECIMAL(10, 2)` , 你可以存储最多 `10` 位数, 其中小数点右侧有 `2` 位数. 最小值为 `-9999999.99` , 最大值为 `9999999.99` . 

## 示例

```sql
-- Create a table with decimal data type.
CREATE TABLE decimal (
    value DECIMAL(36, 18)
);

-- Insert two values.
INSERT INTO decimal 
VALUES
    (0.152587668674722117), 
    (0.017820781941443176);

-- Select all values from the table.
SELECT * FROM decimal;
```

结果: 

```
┌────────────────────────────┐
│ value                      │
├────────────────────────────┤
│ 0.152587668674722117       │
│ 0.017820781941443176       │
└────────────────────────────┘
```

## 精度推断

DECIMAL 有一套复杂的规则用于推断精度. 不同的表达式将应用不同的规则来推断精度. 

### 算术运算

- 加法/减法: `DECIMAL(a, b) + DECIMAL(x, y) -> DECIMAL(max(a - b, x - y) + max(b, y) + 1, max(b, y))` , 这意味着整数部分和小数部分都使用两个操作数中较大的值. 

- 乘法: `DECIMAL(a, b) * DECIMAL(x, y) -> DECIMAL(a + x, b + y)` . 

- 除法: `DECIMAL(a, b) / DECIMAL(x, y) -> DECIMAL(a + y, b)` . 

### 比较运算

- 十进制可以与其他数值类型进行比较. 
- 十进制可以与其他十进制类型进行比较. 

### 聚合运算

- SUM: `SUM(DECIMAL(a, b)) -> DECIMAL(MAX, b)` 
- AVG: `AVG(DECIMAL(a, b)) -> DECIMAL(MAX, max(b, 4))` 

其中 `MAX` 对于 decimal128 是 38, 对于 decimal256 是 76. 

## 调整结果精度

不同的用户对 DECIMAL 有不同的精度要求. 上述规则是 databend 的默认行为. 如果用户有不同的精度要求, 可以通过以下方式调整精度: 

如果期望的结果精度高于默认精度, 则调整输入精度以调整结果精度. 例如, 如果用户期望计算 AVG(col) 得到 DECIMAL(x, y) 作为结果, 其中 col 的类型为 DECIMAL(a, b), 则可以将表达式重写为 `cast(AVG(col) as Decimal(x, y)` 或 `AVG(col)::Decimal(x, y)` . 

请注意, 在十进制类型的转换或计算中, 如果整数部分溢出, 将抛出错误, 如果小数部分的精度溢出, 将直接丢弃而不是四舍五入. 
