---
title: IS_INTEGER
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.368"/>

检查输入的 JSON 值是否为整数。

## 语法

```sql
IS_INTEGER( <expr> )
```

## 返回类型

如果输入的 JSON 值为整数，则返回 `true`，否则返回 `false`。

## 示例

```sql
SELECT
  IS_INTEGER(PARSE_JSON('123')),
  IS_INTEGER(PARSE_JSON('[1,2,3]'));

┌───────────────────────────────────────────────────────────────────┐
│ is_integer(parse_json('123')) │ is_integer(parse_json('[1,2,3]')) │
├───────────────────────────────┼───────────────────────────────────┤
│ true                          │ false                             │
└───────────────────────────────────────────────────────────────────┘
```