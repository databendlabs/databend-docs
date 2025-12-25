---
title: 节点配置
---

本页概述了配置 Databend Meta 和 Query 节点的可用方法。

Databend 允许您通过以下方法配置 Meta 和 Query 节点，从而灵活地根据您的需求调整 Databend：

:::note priority order
通过各种方法配置 Databend 节点时，Databend 遵循以下优先级顺序：命令行参数优先级最高，其次是环境变量，最后是配置文件。
:::

- **配置文件**：Databend 开箱即用地提供了配置文件 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 和 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)。这些文件包含您可能需要的最常用设置，Databend 建议使用它们来配置您的节点。有关配置文件中可用设置的更多信息，请参阅以下主题：

  - [Meta 配置](01-metasrv-config.md)
  - [Query 配置](02-query-config.md)

- **环境变量**：Databend 使您能够利用环境变量的灵活性，既可以指向自定义配置文件，也可以对单个配置进行精确调整。此外，您还可以利用存储服务中熟悉的环境变量。有关可用的环境变量，请参阅 [环境变量](03-environment-variables.md)。

- **命令行参数**：Databend 提供了在启动过程中配置节点的灵活性，使您能够进行快速而精确的调整，而无需进行广泛的更改或中断。您可以使用 `databend-meta` 和 `databend-query` 二进制文件，以及一系列命令行参数来实现此目的。要查看可用的命令行参数及其说明，请执行以下命令：

  ```bash
  # Show databend-meta command-line parameters
  ./bin/databend-meta --help

  # Show databend-query command-line parameters
  ./bin/databend-query --help
  ```

:::note About Command-Line Parameter Descriptions
我们了解到，某些用户可能因某些参数描述而感到困惑。过去，这些描述包含诸如 `<OSS_ACCESS_KEY_ID>` 之类的占位符，导致了误解。请注意，它们并非旨在作为环境变量名称，而是作为参数值的占位符。为了提高清晰度并避免混淆，我们在最近的版本中更新了参数描述，以使用 `<VALUE>` 作为占位符。
:::