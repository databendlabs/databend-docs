```
---
title: DIV0
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.345"/>

如果第二个数字不为0，则返回通过第一个数字除以第二个数字的商。如果第二个数字为0，则返回0。

另见：

- [DIV](div.md)
- [DIVNULL](divnull.md)

## 语法

```sql
DIV0(<number1>, <number2>)
```

## 示例

```sql
SELECT
  DIV0(20, 6),
  DIV0(20, 0),
  DIV0(20, NULL);

┌───────────────────────────────────────────────────┐
│     div0(20, 6)    │ div0(20, 0) │ div0(20, null) │
├────────────────────┼─────────────┼────────────────┤
│ 3.3333333333333335 │           0 │ NULL           │
└───────────────────────────────────────────────────┘
```