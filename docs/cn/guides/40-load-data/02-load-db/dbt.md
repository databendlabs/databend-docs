---
title: dbt
---

[dbt](https://www.getdbt.com/) 是一个数据转换工作流工具，可帮助您高效完成工作并产出更高质量的结果。通过 dbt，您可以将分析代码模块化和集中化，同时为数据团队提供通常见于软件工程工作流程的规范保障。您可以在安全部署到生产环境前，协作处理数据模型、进行版本控制、测试查询并生成文档，同时享受监控和可视化支持。

[dbt-databend-cloud](https://github.com/databendcloud/dbt-databend) 是由 Databend 开发的插件，主要目标是实现 dbt 与 Databend 之间的无缝集成。通过使用该插件，您可以利用 dbt 流畅地执行数据建模、转换和清洗任务，并便捷地将结果加载到 Databend 中。下表展示了 dbt-databend-cloud 插件对 dbt 常用功能的支持情况：

| 功能特性                   	| 是否支持  |
|---------------------------	|---------	|
| 表物化 (Table Materialization)      	| 是      	|
| 视图物化 (View Materialization)     	| 是      	|
| 增量物化 (Incremental Materialization) | 是      	|
| 临时物化 (Ephemeral Materialization) 	| 否      	|
| 种子数据 (Seeds)                    	| 是      	|
| 数据源 (Sources)                    	| 是      	|
| 自定义数据测试 (Custom Data Tests)   	| 是      	|
| 文档生成 (Docs Generate)             	| 是      	|
| 快照 (Snapshots)                    	| 否      	|
| 连接重试 (Connection Retry)          	| 是      	|

## 安装 dbt-databend-cloud

为简化安装流程，dbt-databend-cloud 插件现已将 dbt 作为必需依赖项包含在内。要一键安装 dbt 和 dbt-databend-cloud 插件，请运行以下命令：

```shell
pip3 install dbt-databend-cloud
```

若您希望单独安装 dbt，可参考官方 dbt 安装指南获取详细说明。

## 教程：运行 jaffle_shop dbt 项目

如果您是 dbt 新手，Databend 建议您先完成官方提供的教程项目 https://github.com/dbt-labs/jaffle_shop。开始前，请按照 [安装 dbt-databend-cloud](#installing-dbt-databend-cloud) 的指引完成环境搭建。

本教程提供了一个名为 "jaffle_shop" 的示例 dbt 项目，让您能实际体验 dbt 工具的使用。通过在全局配置文件 (~/.dbt/profiles.yml) 中配置连接 Databend 实例所需的信息，该项目会将 dbt 模型中定义的表和视图直接生成到您的 Databend 数据库中。以下是一个连接本地 Databend 实例的 profiles.yml 文件示例：

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

如果您使用的是 Databend Cloud，可以参考此 [Wiki 页面](https://github.com/databendcloud/dbt-databend/wiki/How-to-use-dbt-with-Databend-Cloud) 获取分步指导，了解如何运行 jaffle_shop dbt 项目。