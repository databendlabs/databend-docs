---
title: 用户Stage
---

- RFC PR: [datafuselabs/databend#8519](https://github.com/datafuselabs/databend/pull/8519)
- Tracking Issue: [datafuselabs/databend#8520](https://github.com/datafuselabs/databend/issues/8520)

## 概述

支持用户内部Stage。

## 动机

Databend目前仅支持命名的内部Stage：

```sql
CREATE STAGE @my_stage;
COPY INTO my_table FROM @my_stage;
```

然而，在某些情况下，命名的内部Stage使用起来较为复杂。特别是对于仅使用Stage来加载数据的用户。通过支持用户Stage，他们可以更高效地复制数据：

```sql
COPY INTO my_table from @~;
```

## 指南级解释

Databend将增加对用户Stage的支持。每个SQL用户都将拥有自己的Stage，可以通过`~`来引用。

用户可以在任何地方像使用命名Stage一样使用`~`：

```sql
COPY INTO my_table FROM @~;
LIST @~;
PRESIGN @~/data.csv;
REMOVE @~ PATTERN = 'ontime.*';
```

用户Stage是SQL用户的内部匿名Stage，因此用户不能：

- 创建
- 删除
- 修改

并且用户不能为用户Stage设置格式选项。他们需要在`COPY`时指定格式设置。

## 参考级解释

Databend目前有两种不同的[`StageType`](https://github.com/datafuselabs/databend/blob/c2d4e9d3e0a5bf7d54a2a6ce1db1d41b00cd2cd1/src/meta/types/src/user_stage.rs#L52-L55)：

```rust
pub enum StageType {
    Internal,
    External,
}
```

Databend将为内部Stage生成一个唯一的prefix，如`stage/{stage_name}`。

我们将添加两种新的Stage类型：

```rust
pub enum StageType {
    LegacyInternal,
    External,
    Internal,
    User,
}
```

`StageType::Internal`将弃用`StageType::LegacyInternal`。自此RFC起，我们将不再创建新的`StageType::LegacyInternal`Stage。

Stage prefix规则将是：

- `LegacyInternal` => `stage/{stage_name}`
- `External` => 指定的位置。
- `Internal` => `stage/internal/{stage_name}`
- `User` => `stage/user/{user_name}`

注意：`StageType::User`将不会存储在metasrv中，而是直接在内存中持续构建。

## 缺点

无。

## 基本原理和替代方案

### 保留Stage名称前缀

为了简化，我们可以保留所有以`bend_internal_`为前缀的Stage。用户不能创建和删除带有此前缀的Stage。

通过添加此限制，我们可以更容易地实现用户Stage。每次用户尝试访问他们自己的用户Stage时，我们将扩展为`bend_internal_user_<user_name>`。

以用户`root`为例：

```sql
COPY INTO my_table FROM @~;
```

将被转换为：

```sql
COPY INTO my_table FROM @bend_internal_user_root;
```

用户只能通过`@~`访问他们的用户Stage。访问`@bend_internal_user_root`将始终返回错误。

### 在metasrv中使用UUID创建Stage

我们可以为首次访问其用户Stage的用户创建一个带有UUID的Stage。

## 相关技术

无

## 未解决的问题

无

## 未来的可能性

### 表Stage

我们可以引入表Stage，类似于Snowflake的做法：

```sql
COPY INTO my_table FROM @#my_table;
```

### 删除用户时清理

删除用户时应清除用户的Stage。

### 用户Stage的垃圾回收

我们可以支持用户Stage的垃圾回收，以便可以删除过时的文件。