---
title: 用户 Stage
---

- RFC PR: [datafuselabs/databend#8519](https://github.com/databendlabs/databend/pull/8519)
- Tracking Issue: [datafuselabs/databend#8520](https://github.com/databendlabs/databend/issues/8520)

## Summary

支持用户内部 Stage。

## Motivation

Databend 仅支持命名的内部 Stage：

```sql
CREATE STAGE @my_stage;
COPY INTO my_table FROM @my_stage;
```

然而，命名的内部 Stage 在某些情况下使用起来很复杂。特别是对于那些只使用 Stage 来加载数据的用户。通过支持用户 Stage，他们可以更高效地复制数据：

```sql
COPY INTO my_table from @~;
```

## Guide-level explanation

Databend 将增加对用户 Stage 的支持。每个 SQL 用户都将拥有自己的 Stage，可以通过 `~` 来引用。

用户可以像使用命名 Stage 一样在任何地方使用 `~`：

```sql
COPY INTO my_table FROM @~;
LIST @~;
PRESIGN @~/data.csv;
REMOVE @~ PATTERN = 'ontime.*';
```

用户 Stage 是 SQL 用户的内部匿名 Stage，因此用户不能：

- 创建
- 删除
- 更改

并且用户不能为用户 Stage 设置格式选项。他们需要在 `COPY` 期间指定格式设置。

## Reference-level explanation

Databend 现在有两种不同的 [`StageType`](https://github.com/databendlabs/databend/blob/c2d4e9d3e0a5bf7d54a2a6ce1db1d41b00cd2cd1/src/meta/types/src/user_stage.rs#L52-L55)：

```rust
pub enum StageType {
    Internal,
    External,
}
```

Databend 将为内部 Stage 生成一个唯一的前缀，例如 `stage/{stage_name}`。

我们将添加两种新的 Stage 类型：

```rust
pub enum StageType {
    LegacyInternal,
    External,
    Internal,
    User,
}
```

`StageType::Internal` 将弃用 `StageType::LegacyInternal`。自此 RFC 起，我们将不再使用 `StageType::LegacyInternal` 创建新的 Stage。

Stage 前缀规则将是：

- `LegacyInternal` => `stage/{stage_name}`
- `External` => 指定的位置。
- `Internal` => `stage/internal/{stage_name}`
- `User` => `stage/user/{user_name}`

注意：`StageType::User` 不会存储在 metasrv 中，而是在内存中直接构建。

## Drawbacks

没有。

## Rationale and alternatives

### Preserve stage name prefix

为了简化，我们可以保留所有以 `bend_internal_` 为前缀的 Stage。用户无法创建和删除具有此前缀的 Stage。

通过添加此限制，我们可以更轻松地实现用户 Stage。每次用户尝试访问他们自己的用户 Stage 时，我们都会扩展到 `bend_internal_user_<user_name>`。

以用户 `root` 为例：

```sql
COPY INTO my_table FROM @~;
```

将被转换为：

```sql
COPY INTO my_table FROM @bend_internal_user_root;
```

用户只能通过 `@~` 访问他们的用户 Stage。访问 `@bend_internal_user_root` 将始终返回错误。

### Create stage with UUID in metasrv

我们可以为首次访问其用户 Stage 的用户创建一个带有 UUID 的 Stage。

## Prior art

None

## Unresolved questions

None

## Future possibilities

### Table Stage

我们可以像 Snowflake 一样引入表 Stage：

```sql
COPY INTO my_table FROM @#my_table;
```

### Cleanup while drop users

删除用户时，应清除用户的 Stage。

### Garbage Collection for user stage

我们可以支持用户 Stage 的垃圾回收，以便可以删除过时的文件。