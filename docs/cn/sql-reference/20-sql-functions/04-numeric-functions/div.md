---
title: DIV
---

返回第一个数字除以第二个数字的商，向下取整到最接近的较小整数。等同于除法运算符“//”。

另请参阅：

- [DIV0](div0.md)
- [DIVNULL](divnull.md)

## 语法

```sql
<number1> DIV <number2>
```

## 别名

- [INTDIV](intdiv.md)

## 示例

```sql
-- 等同于除法运算符“//”
SELECT 6.1 DIV 2, 6.1//2;

┌──────────────────────────┐
│ (6.1 div 2) │ (6.1 // 2) │
├─────────────┼────────────┤
│           3 │          3 │
└──────────────────────────┘

SELECT 6.1 DIV 2, INTDIV(6.1, 2), 6.1 DIV NULL;

┌───────────────────────────────────────────────┐
│ (6.1 div 2) │ intdiv(6.1, 2) │ (6.1 div null) │
├─────────────┼────────────────┼────────────────┤
│           3 │              3 │ NULL           │
└───────────────────────────────────────────────┘

-- 除以零时出错
root@localhost:8000/default> SELECT 6.1 DIV 0;
error: APIError: ResponseError with 1006: divided by zero while evaluating function `div(6.1, 0)`
```