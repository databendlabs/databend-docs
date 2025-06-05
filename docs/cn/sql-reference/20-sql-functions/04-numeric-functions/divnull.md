---
title: DIVNULL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.345"/>

返回第一个数除以第二个数的商。若第二个数为 0 或 NULL，则返回 NULL。

另请参阅：

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