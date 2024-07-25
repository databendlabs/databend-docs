---
title: NVL
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.312"/>

如果 `<expr1>` 为 NULL，则返回 `<expr2>`，否则返回 `<expr1>`。

## 语法

```sql
NVL(<expr1>, <expr2>)
```

## 别名

- [IFNULL](ifnull.md)

## 示例

```sql
SELECT NVL(NULL, 'b'), NVL('a', 'b');

┌────────────────────────────────┐
│ nvl(null, 'b') │ nvl('a', 'b') │
├────────────────┼───────────────┤
│ b              │ a             │
└────────────────────────────────┘

SELECT NVL(NULL, 2), NVL(1, 2);

┌──────────────────────────┐
│ nvl(null, 2) │ nvl(1, 2) │
├──────────────┼───────────┤
│            2 │         1 │
└──────────────────────────┘
```