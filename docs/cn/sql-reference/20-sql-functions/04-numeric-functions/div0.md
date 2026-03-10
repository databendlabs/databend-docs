---
title: DIV0
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本： v1.2.345"/>

返回第一个数除以第二个数的商。若第二个数为 0，则返回 0。

另请参阅：

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