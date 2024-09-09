---
title: 节点配置
---

本页概述了配置 Databend Meta 和 Query 节点的可用方法。

Databend 允许您通过以下方法配置您的 Meta 和 Query 节点，为您提供灵活性以根据需要调整 Databend：

:::note 优先级顺序
在通过各种方法配置 Databend 节点时，Databend 遵循以下优先级顺序：命令行参数优先，其次是环境变量，最后是配置文件。
:::

- **配置文件**：Databend 自带配置文件 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 和 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)。这些文件包含您可能需要的常见设置，Databend 建议使用它们来配置您的节点。有关配置文件中可用设置的更多信息，请参阅以下主题：
    - [Meta 配置](01-metasrv-config.md)
    - [Query 配置](02-query-config.md)

- **环境变量**：Databend 使您能够利用环境变量的灵活性，允许您指向自定义配置文件并对单个配置进行精确调整。此外，您还可以利用存储服务中熟悉的环境变量。有关可用的环境变量，请参阅 [环境变量](03-environment-variables.md)。

- **命令行参数**：Databend 提供了在启动过程中配置节点的灵活性，使您能够快速精确地进行调整，而无需进行大量更改或中断。您可以使用 `databend-meta` 和 `databend-query` 二进制文件以及一系列命令行参数来实现这一点。要查看可用的命令行参数及其描述，请执行以下命令：

    ```bash
    # 显示 databend-meta 命令行参数
    ./bin/databend-meta --help

    # 显示 databend-query 命令行参数
    ./bin/databend-query --help
    ```

:::note 关于命令行参数描述
我们了解到一些用户可能因某些参数描述而感到困惑。过去，描述中包含 `<OSS_ACCESS_KEY_ID>` 等占位符，导致误解。请注意，它们并非作为环境变量名称，而是作为参数值的占位符。为了提高清晰度并避免混淆，我们在最近的版本中更新了参数描述，使用 `<VALUE>` 作为占位符。
:::