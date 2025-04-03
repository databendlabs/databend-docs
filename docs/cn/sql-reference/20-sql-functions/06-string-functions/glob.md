---
title: GLOB
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.714"/>

使用通配符执行区分大小写的模式匹配：

- `?` 匹配任何单个字符。
- `*` 匹配零个或多个字符。

## 语法

```sql
GLOB(<string>, <pattern>)
```

## 返回类型

返回 BOOLEAN 类型：如果输入字符串与模式匹配，则返回 `true`，否则返回 `false`。

## 示例

```sql
SELECT
    GLOB('abc', 'a?c'),
    GLOB('abc', 'a*d'),
    GLOB('abc', 'abc'),
    GLOB('abc', 'abcd'),
    GLOB('abcdef', 'a?c*'),
    GLOB('hello', 'h*l');;

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ glob('abc', 'a?c') │ glob('abc', 'a*d') │ glob('abc', 'abc') │ glob('abc', 'abcd') │ glob('abcdef', 'a?c*') │ glob('hello', 'h*l') │
├────────────────────┼────────────────────┼────────────────────┼─────────────────────┼────────────────────────┼──────────────────────┤
│ true               │ false              │ true               │ false               │ true                   │ false                │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```