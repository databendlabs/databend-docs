---
title: Lambda 表达式
---

Lambda 表达式（Lambda Expressions）是匿名函数，允许您封装逻辑并将其作为参数传递给高阶函数（Higher-Order Functions），例如用于处理数组、列表或其他复杂数据类型的函数。它通常接受一组输入参数和一段代码体，该代码体对集合中的每个元素或排序逻辑中的每次比较执行。

## 语法

```sql
-- 接受一个参数
<parameter> -> <expression>

-- 接受多个参数
(<parameter1>, <parameter2>, ...) -> <expression>
```

| 参数                              | 说明                                                               |
|-----------------------------------|--------------------------------------------------------------------|
| `<parameter1>, <parameter2>, ...` | Lambda 将要操作的值（例如，数组的元素）。                          |
| `->`                              | 分隔输入参数和逻辑。                                               |
| `<expression>`                    | 应用于输入参数的逻辑，通常写为条件或计算。                         |

## 示例

这个 Lambda 表达式接受一个参数 n，并将其加 5：

```bash
n -> (n + 5)
```

这个 Lambda 表达式接受一个整数 x，如果 x 大于 0，则返回 `Positive`，否则返回 `Non-Positive`：

```bash
x -> (CASE WHEN x > 0 THEN 'Positive' ELSE 'Non-Positive' END)
```

这个 Lambda 表达式检查 num 是否为偶数。对于偶数返回 `true`，对于奇数返回 `false`：

```bash
num -> (num % 2 = 0)
```

这个 Lambda 表达式将两个参数 x 和 y 相加：

```bash
(x, y) -> (x + y)
```