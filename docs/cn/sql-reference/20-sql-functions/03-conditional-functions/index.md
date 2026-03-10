---
title: '条件函数（Conditional Functions）'
---

本页面全面概述了 Databend 中的条件函数，按功能分类以便参考。

## 基本条件函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [IF](if.md) / [IFF](iff.md) | 根据条件返回值 | `IF(1 > 0, 'yes', 'no')` → `'yes'` |
| [CASE](case.md) | 评估条件并返回匹配结果 | `CASE WHEN 1 > 0 THEN 'yes' ELSE 'no' END` → `'yes'` |
| [DECODE](decode.md) | 比较表达式与搜索值并返回结果 | `DECODE(2, 1, 'one', 2, 'two', 'other')` → `'two'` |
| [COALESCE](coalesce.md) | 返回第一个非 NULL 表达式 | `COALESCE(NULL, 'hello', 'world')` → `'hello'` |
| [NULLIF](nullif.md) | 若两表达式相等则返回 NULL，否则返回第一个表达式 | `NULLIF(5, 5)` → `NULL` |
| [IFNULL](ifnull.md) | 若第一个表达式不为 NULL 则返回该值，否则返回第二个 | `IFNULL(NULL, 'default')` → `'default'` |
| [NVL](nvl.md) | 返回第一个非 NULL 表达式 | `NVL(NULL, 'default')` → `'default'` |
| [NVL2](nvl2.md) | 若 expr1 不为 NULL 则返回 expr2，否则返回 expr3 | `NVL2('value', 'not null', 'is null')` → `'not null'` |

## 比较函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [GREATEST](greatest.md) | 从列表中返回最大值 | `GREATEST(1, 5, 3)` → `5` |
| [LEAST](least.md) | 从列表中返回最小值 | `LEAST(1, 5, 3)` → `1` |
| [GREATEST_IGNORE_NULLS](greatest-ignore-nulls.md) | 返回最大的非 NULL 值 | `GREATEST_IGNORE_NULLS(NULL, 5, 3)` → `5` |
| [LEAST_IGNORE_NULLS](least-ignore-nulls.md) | 返回最小的非 NULL 值 | `LEAST_IGNORE_NULLS(NULL, 5, 3)` → `3` |
| [BETWEEN](between.md) | 检查值是否在指定范围内 | `5 BETWEEN 1 AND 10` → `true` |
| [IN](in.md) | 检查值是否匹配列表中的任意值 | `5 IN (1, 5, 10)` → `true` |

## NULL 和错误处理函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [IS_NULL](is-null.md) | 检查值是否为 NULL | `IS_NULL(NULL)` → `true` |
| [IS_NOT_NULL](is-not-null.md) | 检查值是否不为 NULL | `IS_NOT_NULL('value')` → `true` |
| [IS_DISTINCT_FROM](is-distinct-from.md) | 检查两值是否不同，将 NULL 视为相同值 | `NULL IS DISTINCT FROM 0` → `true` |
| [IS_ERROR](is-error.md) | 检查表达式计算是否导致错误 | `IS_ERROR(1/0)` → `true` |
| [IS_NOT_ERROR](is-not-error.md) | 检查表达式计算是否未导致错误 | `IS_NOT_ERROR(1/1)` → `true` |
| [ERROR_OR](error-or.md) | 若第一个表达式无错误则返回该值，否则返回第二个 | `ERROR_OR(1/0, 0)` → `0` |