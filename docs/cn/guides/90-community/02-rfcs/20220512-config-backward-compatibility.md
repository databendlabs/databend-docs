---
title: Config Backward Compatibility
description: RFC for backward config compatibility
---

- RFC PR: [datafuselabs/databend#5324](https://github.com/databendlabs/databend/pull/5324)
- Tracking Issue: [datafuselabs/databend#5297](https://github.com/databendlabs/databend/issues/5297)

# Summary

添加配置向后兼容性将允许我们快速迭代，同时避免破坏环境。

# Motivation

当早期用户开始自行部署 databend 时，现在是我们与用户建立一些约定的时机。我们应该允许用户升级他们的部署，而不会破坏向后兼容性。在本 RFC 中，我们将重点关注 `config`。

我在这里提到的 `config` 包括：

- 由 `databend-query` 和 `databend-meta` 读取的配置文件。
- 由 `databend-query` 和 `databend-meta` 读取的配置环境变量。
- `databend-query` 和 `databend-meta` 接受的应用程序参数。
- 由 `databend-query` 生成的 protobuf 消息（存储在 `databend-meta` 中）。

范围之外：

- 像 `fuzz` 和 `metactl` 这样的工具不在此 RFC 的范围内。
- `databend-query` 和 `databend-meta` 的命令行用户体验是另一个话题。我们不会在此 RFC 中讨论它。
- 不包括通过 SQL/HTTP Rest API 进行的配置输入/输出（例如，表 `system.config` 的输出）

> 为了方便起见，我将使用 `databend` 来指代 `databend-query` 和 `databend-meta`。

通过此 RFC，我们的用户将升级他们的部署而不会中断。旧配置应始终与新实现一起使用。

# Guide-level explanation

用户在升级其部署时无需采取任何操作。他们通过直接替换二进制文件和镜像来升级 databend。

有时，他们会收到一些配置字段的 `DEPRECATED` 警告。是否迁移它们取决于用户。在我们正式引入版本化配置之前，不会删除任何配置。并且所有配置字段将像以前一样工作。

# Reference-level explanation

在 databend 内部，我们将配置分为 `inner` 和 `outer`：

**`inner`**

在 databend 内部使用的配置实例。所有逻辑 **应该** 针对 `inner` 配置实现。

**`outer`**

配置实例用作 databend 的前端。它们将转换为 `inner` 配置。其他模块 **不应该** 依赖于 `outer` 配置。

以 `query` 为例：

query 的内部配置将如下所示：

```rust
#[derive(Clone, Default, Debug, PartialEq, Serialize, Deserialize)]
#[serde(default)]
pub struct Config {
    pub query: QueryConfig,
    pub log: LogConfig,
    pub meta: MetaConfig,
    pub storage: StorageConfig,
    pub catalog: HiveCatalogConfig,
}
```

query 的外部配置将如下所示：

```rust
#[derive(Clone, Default, Debug, PartialEq, Serialize, Deserialize, Parser)]
#[clap(about, version, author)]
#[serde(default)]
pub struct ConfigV0 {
    #[clap(long, short = 'c', default_value_t)]
    pub config_file: String,

    #[clap(flatten)]
    pub query: QueryConfigV0,

    #[clap(flatten)]
    pub log: LogConfigV0,

    #[clap(flatten)]
    pub meta: MetaConfigV0,

    #[clap(flatten)]
    pub storage: StorageConfigV0,

    #[clap(flatten)]
    pub catalog: HiveCatalogConfigV0,
}
```

`inner` 配置用户必须维护 `outer` 配置。

例如：`common-io` 应该提供 `inner` 配置 `StorageConfig`。如果 `query` 想要在 `QueryConfig` 中包含 `StorageConfig`，则 `query` 需要：

- 为 `StorageConfig` 实现版本化的 `outer` 配置，称为 `StorageConfigV0`。
- 实现 `Into<StorageConfig> for StorageConfigV0`。
- 在 `QueryConfig` 中引用 `StorageConfig`，
- 在 `QueryConfigV0` 中引用 `StorageConfigV0`。

## Config Maintenance

所有维护通知 **应该** 应用于 `outer` 配置结构。

- 添加配置：添加新默认值是兼容的，否则是被禁止的。
- 删除配置：不允许删除字段。而是将它们标记为 `DEPRECATED`。
- 更改配置：不允许更改配置类型和结构。

# Drawbacks

## Maintenance burden

引入 `outer` 配置将增加配置处理程序的复杂性。

# Rationale and alternatives

## Why not use `serde` and related tools?

The most important thing is that RFC intends to split `inner` and `outer` config instances. Make `inner` as simple as possible and leave the userland interactive works for `outer` to handle.

`serde` doesn't work in this way.

## How to work with protobuf used by `meta`?

As described in the reference, the config used by `protobuf` is another `outer` config. It should handle versions by itself. Based on the current status of databend `common-proto-conv`, we will keep all fields until we decide to increase `OLDEST_COMPATIBLE_VER`.

# Prior art

None, this RFC is the first try for backward config compatibility.

# Unresolved questions

None.

# Future possibilities

## Introduce versioned config

We can introduce a versioned config to allow users to specify the config versions:

- config file: `version=42`
- config env: `export CONFIG_VERSION=42`
- args: `--config-version=42`

Suppose compatible changes happened as a new config entry was added. databend will make sure that the entry has a default value.

Suppose incompatible changes happened, like config been removed/renamed/changed. databend increases the config version. The older version will still load by the specified version and be converted to the latest config internally. A `DEPRECATED` warning will also be printed for removed config fields. So users can decide whether to migrate them.

## Load different versions from config files and envs

It's possible to load different versions from config files and envs.

For example:

Old version from config files:

```toml
version = 23

a = "Version 23"
```

New version from env:

```shell
export CONFIG_VERSION=42
export QUERY_B = "Version 42"
```

For the best situation, we can load from env via version 42 and then load from config via version 23.
