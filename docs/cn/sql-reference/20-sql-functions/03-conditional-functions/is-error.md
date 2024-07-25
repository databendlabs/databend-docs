---
title: IS_ERROR
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.379"/>

返回一个布尔值，指示表达式是否为错误值。

另请参阅: [IS_NOT_ERROR](is-not-error.md)

## 语法

```sql
IS_ERROR( <expr> )
```

## 返回类型

如果表达式是错误，则返回 `true`，否则返回 `false`。

## 示例

```sql
-- 表示除以零，因此是错误
SELECT IS_ERROR(1/0), IS_NOT_ERROR(1/0);

┌───────────────────────────────────────────┐
│ is_error((1 / 0)) │ is_not_error((1 / 0)) │
├───────────────────┼───────────────────────┤
│ true              │ false                 │
└───────────────────────────────────────────┘

-- 转换为 DATE 成功，因此不是错误
SELECT IS_ERROR('2024-03-17'::DATE), IS_NOT_ERROR('2024-03-17'::DATE);

┌─────────────────────────────────────────────────────────────────┐
│ is_error('2024-03-17'::date) │ is_not_error('2024-03-17'::date) │
├──────────────────────────────┼──────────────────────────────────┤
│ false                        │ true                             │
└─────────────────────────────────────────────────────────────────┘
```