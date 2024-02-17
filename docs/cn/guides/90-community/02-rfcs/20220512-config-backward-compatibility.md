```markdown
---
title: 配置向后兼容性
description: 针对向后配置兼容性的RFC
---

- RFC PR: [datafuselabs/databend#5324](https://github.com/datafuselabs/databend/pull/5324)
- 跟踪问题: [datafuselabs/databend#5297](https://github.com/datafuselabs/databend/issues/5297)

# 概要

添加配置向后兼容性将允许我们快速迭代，同时避免破坏环境。

# 动机

当早期用户开始自行部署databend时，是时候让我们与用户之间建立一些契约了。我们应该允许用户升级他们的部署而不破坏向后兼容性。在这个RFC中，我们将专注于`config`。

这里我提到的`config`包括：

- 由`databend-query`和`databend-meta`读取的配置文件。
- 由`databend-query`和`databend-meta`读取的配置环境变量。
- `databend-query`和`databend-meta`接受的应用参数。
- 由`databend-query`生成的protobuf消息（存储在`databend-meta`内）。

不在讨论范围内：

- 像`fuzz`和`metactl`这样的工具不在本RFC的讨论范围内。
- `databend-query`和`databend-meta`的命令行用户体验是另一个话题。我们不会在这个RFC中讨论它。
- 通过SQL/HTTP Rest API的配置输入/输出不在讨论范围内（例如，表`system.config`的输出）。

> 为了方便，我将使用`databend`来指代`databend-query`和`databend-meta`。

通过这个RFC，我们的用户将能够升级他们的部署而不会破坏。旧配置应该总是能够与新实现一起工作。

# 指南级说明

用户在升级他们的部署时不需要采取任何行动。他们通过直接替换二进制文件和镜像来升级databend。

有时，他们会收到一些配置字段的`DEPRECATED`警告。是否迁移由用户决定。在我们正式引入版本化配置之前，不会移除任何配置。并且所有配置字段将像以前一样工作。

# 参考级说明

在databend内部，我们将配置分为`inner`和`outer`：

**`inner`**

在databend内部使用的配置实例。所有逻辑**应该**针对`inner`配置实现。

**`outer`**

作为databend前台的配置实例。它们将转换为`inner`配置。其他模块**不应该**依赖于`outer`配置。

以`query`为例：

查询的内部配置将如下所示：

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

查询的外部配置将如下所示：

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

`inner`配置的用户必须维护`outer`配置。

例如：`common-io`应该提供`inner`配置`StorageConfig`。如果`query`想要在`QueryConfig`内包含`StorageConfig`，`query`需要：

- 为`StorageConfig`实现版本化的`outer`配置，称为`StorageConfigV0`。
- 实现`Into<StorageConfig> for StorageConfigV0`。
- 在`QueryConfig`中引用`StorageConfig`，
- 在`QueryConfigV0`中引用`StorageConfigV0`。

## 配置维护

所有维护通知**应该**应用于`outer`配置结构。

- 添加配置：以新的默认值添加是兼容的，否则是禁止的。
- 移除配置：不允许移除字段。应该将它们标记为`DEPRECATED`。
- 更改配置：不允许更改配置类型和结构。

# 缺点

## 维护负担

引入`outer`配置将增加配置处理器的复杂性。

# 原理和替代方案

## 为什么不使用`serde`和相关工具？

最重要的是，RFC旨在分离`inner`和`outer`配置实例。使`inner`尽可能简单，并留给`outer`处理用户交互工作。

`serde`不是这样工作的。

## 如何与`meta`使用的protobuf协同工作？

如参考所述，由`protobuf`使用的配置是另一个`outer`配置。它应该自行处理版本。基于databend `common-proto-conv`的当前状态，我们将保留所有字段，直到我们决定增加`OLDEST_COMPATIBLE_VER`。

# 先前的艺术

无，这个RFC是向后配置兼容性的首次尝试。

# 未解决的问题

无。

# 未来可能性

## 引入版本化配置

我们可以引入版本化配置，允许用户指定配置版本：

- 配置文件：`version=42`
- 配置环境变量：`export CONFIG_VERSION=42`
- 参数：`--config-version=42`

如果发生兼容性变化，如添加了新的配置项。databend将确保该项有一个默认值。

如果发生不兼容变化，如配置被移除/重命名/更改。databend增加配置版本。旧版本将通过指定的版本加载，并在内部转换为最新的配置。对于被移除的配置字段，也会打印`DEPRECATED`警告。因此用户可以决定是否迁移它们。

## 从配置文件和环境变量加载不同版本

有可能从配置文件和环境变量加载不同版本。

例如：

配置文件中的旧版本：

```toml
version = 23

a = "Version 23"
```

环境变量中的新版本：

```shell
export CONFIG_VERSION=42
export QUERY_B = "Version 42"
```

在最佳情况下，我们可以通过版本42从环境变量加载，然后通过版本23从配置加载。
```