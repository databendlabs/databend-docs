---
title: dbt
---

[dbt](https://www.getdbt.com/) 是一个转换工作流程，它可以帮助您完成更多的工作，同时产生更高质量的结果。您可以使用 dbt 来模块化和集中化您的分析代码，同时为您的数据团队提供通常在软件工程工作流中找到的保护措施。在安全地将它们部署到生产环境之前，协作数据模型，对它们进行版本控制，并测试和记录您的查询，具有监控和可见性。

[dbt-databend-cloud](https://github.com/databendcloud/dbt-databend) 是由 Databend 开发的插件，其主要目标是实现 dbt 和 Databend 之间的顺畅集成。通过使用这个插件，您可以无缝地执行数据建模、转换和清洗任务，并方便地将输出加载到 Databend 中。下表显示了 dbt-databend-cloud 插件对 dbt 中常用功能的支持程度：

| 功能                     	| 支持？ |
|-----------------------------	|-----------	|
| 表物化（Table Materialization）       	| 是       	|
| 视图物化（View Materialization）        	| 是       	|
| 增量物化（Incremental Materialization） 	| 是       	|
| 临时物化（Ephemeral Materialization）   	| 否        	|
| 种子（Seeds）                       	| 是       	|
| 源（Sources）                     	| 是       	|
| 自定义数据测试（Custom Data Tests）           	| 是       	|
| 文档生成（Docs Generate）               	| 是       	|
| 快照（Snapshots）                   	| 否        	|
| 连接重试（Connection Retry）            	| 是       	|

## 安装 dbt-databend-cloud

为了您的方便，安装 dbt-databend-cloud 插件已经被简化，因为它现在包括 dbt 作为必需的依赖项。要轻松地设置 dbt 和 dbt-databend-cloud 插件，请运行以下命令：

```shell
pip3 install dbt-databend-cloud
```

然而，如果您更喜欢单独安装 dbt，您可以参考官方的 dbt 安装指南以获取详细说明。

## 教程：运行 dbt 项目 jaffle_shop

如果您是 dbt 的新手，Databend 推荐您完成官方的 dbt 教程，该教程可在 https://github.com/dbt-labs/jaffle_shop 获得。在开始之前，请按照[安装 dbt-databend-cloud](#installing-dbt-databend-cloud) 来安装 dbt 和 dbt-databend-cloud。

这个教程提供了一个名为 "jaffle_shop" 的示例 dbt 项目，为您提供了使用 dbt 工具的实践经验。通过配置默认的全局配置文件（~/.dbt/profiles.yml）以连接到您的 Databend 实例所需的信息，该项目将直接在您的 Databend 数据库中生成 dbt 模型中定义的表和视图。以下是连接到本地 Databend 实例的文件 profiles.yml 的示例：

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

如果您正在使用 Databend Cloud，您可以参考这个[Wiki 页面](https://github.com/databendcloud/dbt-databend/wiki/How-to-use-dbt-with-Databend-Cloud) 获取如何运行 jaffle_shop dbt 项目的分步指南。