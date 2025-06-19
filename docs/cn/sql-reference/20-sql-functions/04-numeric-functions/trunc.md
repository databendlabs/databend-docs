---
title: TRUNC
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.756"/>

返回数字 `x`，截断到 `d` 位小数。如果 `d` 为 0，结果将没有小数点或小数部分。`d` 可以是负数，这将使 `x` 的小数点左侧 `d` 位数字变为零。`d` 的最大绝对值为 30；如果 `d` 的绝对值超过 30，则会被截断为 30 或 -30（取决于符号）。

如果只提供 `x`，`d` 的默认值为 0。

## 语法

```sql
TRUNC( x [, d] )
```

## 示例

```sql
SELECT TRUNC(1.223, 1);

┌────────────────────┐
│ truncate(1.223, 1) │
├────────────────────┤
│ 1.2                │
└────────────────────┘

SELECT TRUNC(1.223)
    
╭─────────────────╮
│ truncate(1.223) │
├─────────────────┤
│               1 │
╰─────────────────╯
```