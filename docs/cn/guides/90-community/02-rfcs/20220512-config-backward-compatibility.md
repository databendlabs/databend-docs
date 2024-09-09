---
title: 配置向后兼容性
description: 关于配置向后兼容性的RFC
---

- RFC PR: [datafuselabs/databend#5324](https://github.com/datafuselabs/databend/pull/5324)
- 跟踪问题: [datafuselabs/databend#5297](https://github.com/datafuselabs/databend/issues/5297)

# 概述

添加配置向后兼容性将使我们能够在避免破坏环境的情况下快速迭代。

# 动机

随着早期用户开始自行部署Databend，现在是时候在用户之间建立一些契约了。我们应该允许用户在不破坏向后兼容性的情况下升级他们的部署。在这个RFC中，我们将重点关注`config`。

这里提到的`config`包括：

- 由`databend-query`和`databend-meta`读取的配置文件。
- 由`databend-query`和`databend-meta`读取的配置环境变量。
- 由`databend-query`和`databend-meta`接受的程序参数。
- 由`databend-query`生成的protobuf消息（存储在`databend-meta`中）。

不在范围内的内容：

- 像`fuzz`和`metactl`这样的工具不在此RFC的覆盖范围内。
- `databend-query`和`databend-meta`的命令行用户体验是另一个话题。我们不会在这个RFC中讨论它。
- 通过SQL/HTTP Rest API的配置输入/输出不在此覆盖范围内（例如，表`system.config`的输出）。

> 为了方便，我将使用`databend`来指代`databend-query`和`databend-meta`。

通过这个RFC，我们的用户可以在不破坏的情况下升级他们的部署。旧的配置应该始终与新的实现一起工作。

# 指南级解释

用户在升级他们的部署时不需要采取任何行动。他们通过直接替换二进制文件和镜像来升级Databend。

有时，他们会对某些配置字段收到`DEPRECATED`警告。是否迁移这些字段由用户决定。在我们正式引入版本化配置之前，不会删除任何配置。所有配置字段将像以前一样工作。

# 参考级解释

在Databend内部，我们将配置分为`inner`和`outer`：

**`inner`**

在Databend内部使用的配置实例。所有逻辑**应该**针对`inner`配置实现。

**`outer`**

作为Databend前台使用的配置实例。它们将转换为`inner`配置。其他模块**不应该**依赖`outer`配置。

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

用户必须维护`inner`配置的`outer`配置。

例如：`common-io`应该提供`inner`配置`StorageConfig`。如果`query`想要在`QueryConfig`中包含`StorageConfig`，`query`需要：

- 为`StorageConfig`实现版本化的`outer`配置，称为`StorageConfigV0`。
- 实现`Into<StorageConfig> for StorageConfigV0`。
- 在`QueryConfig`中引用`StorageConfig`，
- 在`QueryConfigV0`中引用`StorageConfigV0`。

## 配置维护

所有维护通知**应该**应用于`outer`配置结构。

- 添加配置：添加具有新默认值是兼容的，否则是禁止的。
- 删除配置：不允许删除字段。应将其标记为`DEPRECATED`。
- 更改配置：不允许更改配置类型和结构。

# 缺点

## 维护负担

引入`outer`配置将增加配置处理程序的复杂性。

# 基本原理和替代方案

## 为什么不使用`serde`及相关工具？

最重要的是，RFC打算将`inner`和`outer`配置实例分开。使`inner`尽可能简单，并将用户交互工作留给`outer`处理。

`serde`不以这种方式工作。

## 如何与`meta`使用的protobuf一起工作？

如参考中所述，`protobuf`使用的配置是另一个`outer`配置。它应该自行处理版本。基于Databend当前的`common-proto-conv`状态，我们将保留所有字段，直到我们决定增加`OLDEST_COMPATIBLE_VER`。

# 先前技术

没有，这个RFC是配置向后兼容性的首次尝试。

# 未解决的问题

没有。

# 未来的可能性

## 引入版本化配置

我们可以引入版本化配置，允许用户指定配置版本：

- 配置文件：`version=42`
- 配置环境变量：`export CONFIG_VERSION=42`
- 参数：`--config-version=42`

假设发生了兼容性更改，例如添加了新的配置条目。Databend将确保该条目具有默认值。

假设发生了不兼容的更改，例如配置被删除/重命名/更改。Databend将增加配置版本。旧版本仍将通过指定的版本加载，并内部转换为最新的配置。对于删除的配置字段，还将打印`DEPRECATED`警告。因此，用户可以决定是否迁移它们。

## 从配置文件和环境变量加载不同版本

可以从配置文件和环境变量加载不同版本。

例如：

从配置文件加载旧版本：

```toml
version = 23

a = "Version 23"
```

从环境变量加载新版本：

```shell
export CONFIG_VERSION=42
export QUERY_B = "Version 42"
```

在最佳情况下，我们可以通过版本42从环境变量加载，然后通过版本23从配置文件加载。