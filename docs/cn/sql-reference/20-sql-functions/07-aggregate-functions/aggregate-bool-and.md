---
title: bool_and
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.756"/>

当所有输入值均为 true 时返回 true，否则返回 false。

- 忽略 NULL 值。
- 如果所有输入值均为 null，则结果为 null。
- 支持布尔类型。

## 语法

```sql
bool_and(<expr>)
```

## 返回类型

与输入类型相同。

## 示例

```sql
select bool_and(t) from (values (true), (true), (null)) a(t);
╭───────────────────╮
│    bool_and(t)    │
│ Nullable(Boolean) │
├───────────────────┤
│ true              │
╰───────────────────╯

select bool_and(t) from (values (true), (true), (true)) a(t);

╭───────────────────╮
│    bool_and(t)    │
│ Nullable(Boolean) │
├───────────────────┤
│ true              │
╰───────────────────╯

select bool_and(t) from (values (true), (true), (false)) a(t);
╭───────────────────╮
│    bool_and(t)    │
│ Nullable(Boolean) │
├───────────────────┤
│ false             │
╰───────────────────╯
```