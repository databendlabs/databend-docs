---
title: TO_WEEK_OF_YEAR
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.151"/>

计算给定日期在一年中的第几周。

ISO 周编号规则如下：1 月 4 日始终被视为第一周的一部分。如果 1 月 1 日是星期四，那么从 12 月 29 日星期一到 1 月 4 日星期日的这一周被指定为 ISO 第 1 周。如果 1 月 1 日是星期五，那么从 1 月 4 日星期一到 1 月 10 日星期日的这一周被标记为 ISO 第 1 周。

## 语法

```sql
TO_WEEK_OF_YEAR(<expr>)
```

## 参数

| 参数      | 描述           |
|-----------|----------------|
| `<expr>`  | date/timestamp |

## 别名

- [WEEK](week.md)
- [WEEKOFYEAR](weekofyear.md)

## 返回类型

返回一个整数，表示一年中的第几周，编号范围从 1 到 53。

## 示例

```sql
SELECT NOW(), TO_WEEK_OF_YEAR(NOW()), WEEK(NOW()), WEEKOFYEAR(NOW());

┌───────────────────────────────────────────────────────────────────────────────────────┐
│            now()           │ to_week_of_year(now()) │ week(now()) │ weekofyear(now()) │
├────────────────────────────┼────────────────────────┼─────────────┼───────────────────┤
│ 2024-03-14 23:30:04.011624 │                     11 │          11 │                11 │
└───────────────────────────────────────────────────────────────────────────────────────┘
```