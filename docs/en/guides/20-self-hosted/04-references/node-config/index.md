---
title: Node Configurations
---

This page provides an overview of the available methods for configuring the Databend Meta and Query nodes.

Databend allows you to configure your Meta and Query nodes through the following methods, giving you the flexibility to tune Databend to your needs:

:::note priority order
When configuring Databend nodes through various methods, Databend follows the following priority order: Command-Line Parameters take precedence, followed by Environment Variables, and finally Configuration Files.
:::

- **Configuration Files**: Databend comes with the configuration files [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) and [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) out of the box. These files contain the most common settings you may need, and Databend recommends using them to configure your nodes. For more information about the settings available in the configuration files, refer to the topics below:

  - [Meta Configurations](metasrv-config.md)
  - [Query Configurations](query-config.md)

- **Environment Variables**: Databend empowers you to harness the flexibility of environment variables, allowing you to both point to custom configuration files and make precise adjustments to individual configurations. Additionally, you can leverage familiar environment variables from your storage service. For the available environment variables, see [Environment Variables](environment-variables.md).

- **Command-Line Parameters**: Databend provides the flexibility to configure your nodes during the startup process, allowing you to make quick and precise adjustments without requiring extensive changes or disruptions. You can use the `databend-meta` and `databend-query` binaries, along with a range of command-line arguments, to achieve this. To view the available command-line parameters and their descriptions, execute the following commands:

  ```bash
  # Show databend-meta command-line parameters
  ./bin/databend-meta --help

  # Show databend-query command-line parameters
  ./bin/databend-query --help
  ```

:::note About Command-Line Parameter Descriptions
We understand that some users may have experienced confusion due to certain parameter descriptions. In the past, the descriptions included placeholders like `<OSS_ACCESS_KEY_ID>` that led to misunderstandings. Please be aware that they were NOT intended as environment variable names but rather as placeholders for the parameter values. To enhance clarity and avoid confusion, we have updated the parameter descriptions to use `<VALUE>` as the placeholders in a recent release.
:::
