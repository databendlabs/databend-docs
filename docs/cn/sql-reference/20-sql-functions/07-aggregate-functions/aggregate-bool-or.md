---
title: bool_or
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.756"/>

如果至少有一个输入值为 true，则返回 true，否则返回 false。

- 忽略 NULL 值。
- 如果所有输入值都为 null，则结果为 null。
- 支持布尔类型 (boolean)

## 语法

```sql
bool_or(<expr>)
```

## 返回类型

与输入类型相同。

## 示例

```sql
select bool_or(t) from (values (true), (true), (null)) a(t);
╭───────────────────╮
│    bool_or(t)     │
│ Nullable(Boolean) │
├───────────────────┤
│ true              │
╰───────────────────╯

select bool_or(t) from (values (true), (true), (false)) a(t);
╭───────────────────╮
│    bool_or(t)     │
│ Nullable(Boolean) │
├───────────────────┤
│ true              │
╰───────────────────╯

select bool_or(t) from (values (false), (false), (false)) a(t);
╭───────────────────╮
│    bool_or(t)    │
│ Nullable(Boolean) │
├───────────────────┤
│ false             │
╰───────────────────╯
```