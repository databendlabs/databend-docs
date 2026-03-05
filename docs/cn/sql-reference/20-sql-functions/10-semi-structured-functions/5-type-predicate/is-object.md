---
title: IS_OBJECT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="版本引入或更新：v1.2.368"/>

检查输入值是否为 JSON 对象。

## 语法

```sql
IS_OBJECT( <expr> )
```

## 返回类型

如果输入的 JSON 值为 JSON 对象，则返回 `true`，否则返回 `false`。

## 示例

```sql
SELECT
  IS_OBJECT(PARSE_JSON('{"a":"b"}')), -- JSON 对象
  IS_OBJECT(PARSE_JSON('["a","b","c"]')); --JSON 数组

┌─────────────────────────────────────────────────────────────────────────────┐
│ is_object(parse_json('{"a":"b"}')) │ is_object(parse_json('["a","b","c"]')) │
├────────────────────────────────────┼────────────────────────────────────────┤
│ true                               │ false                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```