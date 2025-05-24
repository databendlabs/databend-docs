---
title: dbt
---

[dbt](https://www.getdbt.com/) 是一种转换工作流，可以帮助您完成更多工作，同时生成更高质量的结果。您可以使用 dbt 对分析代码进行模块化和集中化管理，同时为数据团队提供通常在软件工程工作流中才有的保障。通过 dbt，您可以协作处理数据模型、对其进行版本控制、测试和记录查询，然后安全地将其部署到生产环境，并进行监控和可视化。

[dbt-databend-cloud](https://github.com/databendcloud/dbt-databend) 是 Databend 开发的一个插件，其主要目标是实现 dbt 和 Databend 之间的顺畅集成。通过使用此插件，您可以利用 dbt 无缝执行数据建模、转换和清洗任务，并方便地将输出加载到 Databend 中。下表展示了 dbt-databend-cloud 插件对 dbt 中常用功能的兼容性：

| 功能                  	| 是否支持？ |
|-----------------------	|----------	|
| Table Materialization 	| 是       	|
| View Materialization  	| 是       	|
| Incremental Materialization | 是       	|
| Ephemeral Materialization | 否       	|
| Seeds                 	| 是       	|
| Sources               	| 是       	|
| Custom Data Tests     	| 是       	|
| Docs Generate         	| 是       	|
| Snapshots             	| 否       	|
| Connection Retry      	| 是       	|

## 安装 dbt-databend-cloud

dbt-databend-cloud 插件的安装已为您简化，因为它现在将 dbt 作为必需的依赖项。要轻松设置 dbt 和 dbt-databend-cloud 插件，请运行以下命令：

```shell
pip3 install dbt-databend-cloud
```

但是，如果您更喜欢单独安装 dbt，可以参考官方 dbt 安装指南获取详细说明。

## 教程：运行 dbt 项目 jaffle_shop

如果您是 dbt 的新手，Databend 建议您完成官方 dbt 教程，该教程可在 https://github.com/dbt-labs/jaffle_shop 获取。在开始之前，请按照 [安装 dbt-databend-cloud](#installing-dbt-databend-cloud) 的说明安装 dbt 和 dbt-databend-cloud。

本教程提供了一个名为 "jaffle_shop" 的 dbt 示例项目，让您亲身体验 dbt 工具。通过使用连接到 Databend 实例所需的信息配置默认的全局配置文件 (~/.dbt/profiles.yml)，该项目将直接在您的 Databend 数据库中生成 dbt 模型中定义的表和视图。以下是连接到本地 Databend 实例的 profiles.yml 文件示例：

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

如果您正在使用 Databend Cloud，可以参考此 [Wiki 页面](https://github.com/databendcloud/dbt-databend/wiki/How-to-use-dbt-with-Databend-Cloud) 获取有关如何运行 jaffle_shop dbt 项目的分步说明。