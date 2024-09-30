---
title: dbt
---

[dbt](https://www.getdbt.com/) 是一个转换工作流，帮助您在产生更高质量结果的同时完成更多工作。您可以使用 dbt 模块化和集中化您的分析代码，同时为您的数据团队提供通常在软件工程工作流中发现的护栏。在安全部署到生产环境之前，协作处理数据模型、版本控制、测试和记录您的查询，并进行监控和可见性。

[dbt-databend-cloud](https://github.com/databendcloud/dbt-databend) 是由 Databend 开发的一个插件，其主要目标是实现 dbt 和 Databend 之间的顺畅集成。通过使用此插件，您可以无缝地使用 dbt 执行数据建模、转换和清洗任务，并方便地将输出加载到 Databend 中。下表说明了 dbt-databend-cloud 插件对 dbt 中常用功能的支持级别：

| 功能                      	| 支持？     |
|-----------------------------	|-----------	|
| 表物化                    	| 是       	|
| 视图物化                   	| 是       	|
| 增量物化                   	| 是       	|
| 临时物化                   	| 否       	|
| 种子                       	| 是       	|
| 源                        	| 是       	|
| 自定义数据测试             	| 是       	|
| 文档生成                   	| 是       	|
| 快照                       	| 否       	|
| 连接重试                   	| 是       	|

## 安装 dbt-databend-cloud

安装 dbt-databend-cloud 插件已经为您简化了流程，因为它现在包含了 dbt 作为必需的依赖项。要轻松设置 dbt 和 dbt-databend-cloud 插件，请运行以下命令：

```shell
pip3 install dbt-databend-cloud
```

但是，如果您更喜欢单独安装 dbt，您可以参考官方的 dbt 安装指南以获取详细说明。

## 教程：运行 dbt 项目 jaffle_shop

如果您是 dbt 的新手，Databend 建议您完成官方的 dbt 教程，网址为 https://github.com/dbt-labs/jaffle_shop。在开始之前，请按照 [安装 dbt-databend-cloud](#installing-dbt-databend-cloud) 安装 dbt 和 dbt-databend-cloud。

本教程提供了一个名为 "jaffle_shop" 的示例 dbt 项目，让您亲身体验 dbt 工具。通过使用必要的信息配置默认的全局配置文件（~/.dbt/profiles.yml）以连接到您的 Databend 实例，该项目将直接在您的 Databend 数据库中生成 dbt 模型中定义的表和视图。以下是连接到本地 Databend 实例的 profiles.yml 文件示例：

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

如果您使用的是 Databend Cloud，您可以参考此 [Wiki 页面](https://github.com/databendcloud/dbt-databend/wiki/How-to-use-dbt-with-Databend-Cloud) 以获取逐步说明，了解如何运行 jaffle_shop dbt 项目。