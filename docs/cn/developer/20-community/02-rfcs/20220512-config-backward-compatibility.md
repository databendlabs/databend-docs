---
title: 配置向后兼容性
description: 关于配置向后兼容性的 RFC
---

- RFC PR: [datafuselabs/databend#5324](https://github.com/databendlabs/databend/pull/5324)
- Tracking Issue: [datafuselabs/databend#5297](https://github.com/databendlabs/databend/issues/5297)

# 概要

添加配置向后兼容性将使我们能够快速迭代，同时避免破坏环境。

# 动机

由于早期用户开始自行部署 Databend，现在是我们与用户建立一些约定的时机。我们应该允许用户升级他们的部署，而不会破坏向后兼容性。在本 RFC 中，我们将重点关注 `config`。

我在这里提到的 `config` 包括：

- 由 `databend-query` 和 `databend-meta` 读取的配置文件。
- 由 `databend-query` 和 `databend-meta` 读取的配置环境变量。
- `databend-query` 和 `databend-meta` 接受的应用程序参数。
- 由 `databend-query` 生成的 protobuf 消息（存储在 `databend-meta` 中）。

范围之外：

- 诸如 `fuzz` 和 `metactl` 之类的工具不在此 RFC 的范围内。
- `databend-query` 和 `databend-meta` 的命令行用户体验是另一个话题。我们不会在此 RFC 中讨论它。
- 不包括通过 SQL/HTTP Rest API 进行的配置输入/输出（例如，表 `system.config` 的输出）。

> 为方便起见，我将使用 `databend` 来指代 `databend-query` 和 `databend-meta`。

通过此 RFC，我们的用户将升级他们的部署而不会中断。旧配置应始终与新实现一起使用。

# 指导性解释

用户在升级其部署时无需采取任何操作。他们通过直接替换二进制文件和镜像来升级 Databend。

有时，他们会收到一些配置字段的 `DEPRECATED` 警告。是否迁移它们取决于用户。在我们正式引入版本化配置之前，不会删除任何配置。并且所有配置字段将像以前一样工作。

# 参考级解释

在 Databend 内部，我们将配置分为 `inner` 和 `outer`：

**`inner`**

在 Databend 内部使用的配置实例。所有逻辑 **应该** 针对 `inner` 配置实现。

**`outer`**

配置实例用作 Databend 的前端。它们将转换为 `inner` 配置。其他模块 **不应该** 依赖于 `outer` 配置。

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
- 在 `QueryConfig` 中引用 `StorageConfig`。
- 在 `QueryConfigV0` 中引用 `StorageConfigV0`。

## 配置维护

所有维护通知 **应该** 应用于 `outer` 配置结构。

- 添加配置：添加具有新默认值是兼容的，否则是被禁止的。
- 删除配置：不允许删除字段。而是将它们标记为 `DEPRECATED`。
- 更改配置：不允许更改配置类型和结构。

# 缺点

## 维护负担

引入 `outer` 配置将增加配置处理程序的复杂性。

# 原理和替代方案

## 为什么不使用 `serde` 和相关工具？

最重要的是，RFC 旨在拆分 `inner` 和 `outer` 配置实例。使 `inner` 尽可能简单，并将用户交互工作留给 `outer` 处理。

`serde` 不以这种方式工作。

## 如何使用 `meta` 使用的 protobuf？

如参考中所述，`protobuf` 使用的配置是另一个 `outer` 配置。它应该自行处理版本。基于 Databend `common-proto-conv` 的当前状态，我们将保留所有字段，直到我们决定增加 `OLDEST_COMPATIBLE_VER`。

# 先例

没有，此 RFC 是向后配置兼容性的首次尝试。

# 未解决的问题

没有。

# 未来可能性

## 引入版本化配置

我们可以引入版本化配置，以允许用户指定配置版本：

- 配置文件：`version=42`
- 配置环境变量：`export CONFIG_VERSION=42`
- 参数：`--config-version=42`

假设兼容的更改发生，例如添加了新的配置条目。Databend 将确保该条目具有默认值。

假设发生了不兼容的更改，例如配置被删除/重命名/更改。Databend 增加了配置版本。旧版本仍将通过指定的版本加载，并在内部转换为最新配置。对于已删除的配置字段，还将打印 `DEPRECATED` 警告。因此，用户可以决定是否迁移它们。

## 从配置文件和环境变量加载不同版本

可以从配置文件和环境变量加载不同版本。

例如：

来自配置文件的旧版本：

```toml
version = 23

a = "Version 23"
```

来自环境变量的新版本：

```shell
export CONFIG_VERSION=42
export QUERY_B = "Version 42"
```

对于最佳情况，我们可以通过版本 42 从环境变量加载，然后通过版本 23 从配置文件加载。
