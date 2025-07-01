---
title: IS_STRING
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="自 v1.2.368 版本引入或更新"/>

检查输入的 JSON 值是否为字符串。

## 语法

```sql
IS_STRING( <expr> )
```

## 返回类型

如果输入的 JSON 值是字符串，则返回 `true`，否则返回 `false`。

## 示例

```sql
SELECT
  IS_STRING(PARSE_JSON('"abc"')),
  IS_STRING(PARSE_JSON('123'));

┌───────────────────────────────────────────────────────────────┐
│ is_string(parse_json('"abc"')) │ is_string(parse_json('123')) │
├────────────────────────────────┼──────────────────────────────┤
│ true                           │ false                        │
└───────────────────────────────────────────────────────────────┘
```