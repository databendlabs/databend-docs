---
title: DIVNULL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.345"/>

返回第一个数字除以第二个数字的商。如果第二个数字为0或NULL，则返回NULL。

另请参阅:

- [DIV](div.md)
- [DIV0](div0.md)

## 语法

```sql
DIVNULL(<number1>, <number2>)
```

## 示例

```sql
SELECT
  DIVNULL(20, 6),
  DIVNULL(20, 0),
  DIVNULL(20, NULL);

┌─────────────────────────────────────────────────────────┐
│   divnull(20, 6)   │ divnull(20, 0) │ divnull(20, null) │
├────────────────────┼────────────────┼───────────────────┤
│ 3.3333333333333335 │ NULL           │ NULL              │
└─────────────────────────────────────────────────────────┘
```