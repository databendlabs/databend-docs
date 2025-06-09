---
id: string-char
title: CHAR
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.752"/>

返回每个传入整数对应的字符。该函数将每个整数转换为其对应的 Unicode 字符。

## 语法

```sql
CHAR(N, ...)
CHR(N)
```

## 参数

| 参数 | 描述 |
|-----------|----------------------------------------------------------------|
| N | 表示 Unicode 码点（0 到 2^32-1）的整数值。 |

## 返回类型

`STRING`

## 说明

- 接受任何整数类型（自动转换为 Int64）。
- 对于无效的码点，返回空字符串（''）并记录错误。
- `chr` 是 `char` 的别名。
- NULL 输入导致 NULL 输出。

## 示例

```sql
-- 基本用法
SELECT CHAR(65, 66, 67);
┌───────┐
│ char  │
│ String│
├───────┤
│ ABC   │
└───────┘

-- 使用 CHR 别名
SELECT CHR(68);
┌───────┐
│ chr   │
│ String│
├───────┤
│ D     │
└───────┘

-- 从多个码点创建字符串
SELECT CHAR(77,121,83,81,76);
┌───────┐
│ char  │
│ String│
├───────┤
│ MySQL │
└───────┘

-- 从不同整数类型自动转换
SELECT CHAR(CAST(65 AS UInt16));
┌───────┐
│ char  │
│ String│
├───────┤
│ A     │
└───────┘

-- NULL 处理
SELECT CHAR(NULL);
┌───────┐
│ char  │
│ String│
├───────┤
│ NULL  │
└───────┘
```