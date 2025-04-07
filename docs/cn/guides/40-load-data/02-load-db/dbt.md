---
title: dbt
---

[dbt](https://www.getdbt.com/) 是一种转换工作流，可以帮助您完成更多工作，同时产生更高质量的结果。您可以使用 dbt 来模块化和集中您的分析代码，同时为您的数据团队提供通常在软件工程工作流程中发现的保障。在安全地将数据模型部署到生产环境之前，可以协作处理数据模型、对其进行版本控制，以及测试和记录您的查询，并进行监控和可见性管理。

[dbt-databend-cloud](https://github.com/databendcloud/dbt-databend) 是 Databend 开发的插件，其主要目标是实现 dbt 和 Databend 之间的平滑集成。通过使用此插件，您可以使用 dbt 无缝地执行数据建模、转换和清理任务，并将输出方便地加载到 Databend 中。下表说明了 dbt-databend-cloud 插件对 dbt 中常用功能的支持级别：

| Feature                     	| Supported ? |
|-----------------------------	|-----------	|
| Table Materialization       	| Yes       	|
| View Materialization        	| Yes       	|
| Incremental Materialization 	| Yes       	|
| Ephemeral Materialization   	| No        	|
| Seeds                       	| Yes       	|
| Sources                     	| Yes       	|
| Custom Data Tests           	| Yes       	|
| Docs Generate               	| Yes       	|
| Snapshots                   	| No        	|
| Connection Retry            	| Yes       	|

## 安装 dbt-databend-cloud

安装 dbt-databend-cloud 插件已经过简化，以方便您的使用，因为它现在包含 dbt 作为必需的依赖项。要轻松设置 dbt 和 dbt-databend-cloud 插件，请运行以下命令：

```shell
pip3 install dbt-databend-cloud
```

但是，如果您希望单独安装 dbt，可以参考官方 dbt 安装指南以获取详细说明。

## 教程：运行 dbt 项目 jaffle_shop

如果您是 dbt 的新手，Databend 建议完成位于 https://github.com/dbt-labs/jaffle_shop 的官方 dbt 教程。在开始之前，请按照 [安装 dbt-databend-cloud](#installing-dbt-databend-cloud) 安装 dbt 和 dbt-databend-cloud。

本教程提供了一个名为 "jaffle_shop" 的示例 dbt 项目，提供了使用 dbt 工具的实践经验。通过使用连接到您的 Databend 实例的必要信息配置默认的全局配置文件（~/.dbt/profiles.yml），该项目将直接在您的 Databend 数据库中生成 dbt 模型中定义的表和视图。以下是连接到本地 Databend 实例的 profiles.yml 文件的示例：

```yml title="~/.dbt/profiles.yml"
jaffle_shop_databend:
  target: dev
  outputs:
    dev:
      type: databend
      host: 127.0.0.1
      port: 8000
      schema: sjh_dbt
      user: databend
      pass: ********
```

如果您使用的是 Databend Cloud，您可以参考此 [Wiki page](https://github.com/databendcloud/dbt-databend/wiki/How-to-use-dbt-with-Databend-Cloud)，以获取有关如何运行 jaffle_shop dbt 项目的分步说明。