---
title: 用户阶段
---

- RFC PR: [datafuselabs/databend#8519](https://github.com/datafuselabs/databend/pull/8519)
- 跟踪问题: [datafuselabs/databend#8520](https://github.com/datafuselabs/databend/issues/8520)

## 摘要

支持用户内部阶段。

## 动机

Databend 只支持命名的内部阶段：

```sql
CREATE STAGE @my_stage;
COPY INTO my_table FROM @my_stage;
```

然而，在某些情况下，命名的内部阶段使用起来很复杂。特别是对于只使用阶段来加载数据的用户。通过支持用户阶段，他们可以更高效地复制数据：

```sql
COPY INTO my_table from @~;
```

## 指南级解释

Databend 将添加对用户阶段的支持。每个 sql 用户都将拥有自己的阶段，可以通过 `~` 引用。

用户可以像使用命名阶段一样在任何地方使用 `~`：

```sql
COPY INTO my_table FROM @~;
LIST @~;
PRESIGN @~/data.csv;
REMOVE @~ PATTERN = 'ontime.*';
```

用户阶段是 sql 用户的内部匿名阶段，所以用户不能：

- 创建
- 删除
- 修改

并且用户不能为用户阶段设置格式选项。他们需要在 `COPY` 期间指定格式设置。

## 参考级解释

Databend 现在有两种不同的 [`StageType`](https://github.com/datafuselabs/databend/blob/c2d4e9d3e0a5bf7d54a2a6ce1db1d41b00cd2cd1/src/meta/types/src/user_stage.rs#L52-L55)：

```rust
pub enum StageType {
    Internal,
    External,
}
```

Databend 将为内部阶段生成一个唯一前缀，如 `stage/{stage_name}`。

我们将添加两种新的阶段类型：

```rust
pub enum StageType {
    LegacyInternal,
    External,
    Internal,
    User,
}
```

`StageType::Internal` 将废弃 `StageType::LegacyInternal`。从这个 RFC 开始，我们将不再使用 `StageType::LegacyInternal` 创建新的阶段。

阶段前缀规则将是：

- `LegacyInternal` => `stage/{stage_name}`
- `External` => 指定位置。
- `Internal` => `stage/internal/{stage_name}`
- `User` => `stage/user/{user_name}`

注意：`StageType::User` 不会存储在 metasrv 中，并且会直接在内存中不断构建。

## 缺点

无。

## 理由和替代方案

### 保留阶段名称前缀

为了简化，我们可以保留所有以 `bend_internal_` 为前缀的阶段。用户不能使用此前缀创建和删除阶段。

通过添加这个限制，我们可以更容易地实现用户阶段。每次用户尝试访问他们自己的用户阶段时，我们将扩展为 `bend_internal_user_<user_name>`。

以用户 `root` 为例：

```sql
COPY INTO my_table FROM @~;
```

将被转换为：

```sql
COPY INTO my_table FROM @bend_internal_user_root;
```

用户只能通过 `@~` 访问他们的用户阶段。访问 `@bend_internal_user_root` 将始终返回错误。

### 在 metasrv 中使用 UUID 创建阶段

我们可以为第一次访问他们用户阶段的用户创建一个带有 UUID 的阶段。

## 先前的艺术

无

## 未解决的问题

无

## 未来的可能性

### 表阶段

我们可以像 snowflake 那样引入表阶段：

```sql
COPY INTO my_table FROM @#my_table;
```

### 删除用户时清理

删除用户时应清除用户的阶段。

### 用户阶段的垃圾收集

我们可以支持用户阶段的垃圾收集，以便可以删除过时的文件。