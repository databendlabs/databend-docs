---
title: dbt
---

[dbt](https://www.getdbt.com/) 是一个转换工作流，可帮助您在产出更高质量结果的同时提升工作效率。通过 dbt 您可以模块化与集中化管理分析代码，并为数据团队提供软件工程工作流中常见的规范约束。协作开发数据模型、进行版本控制，并在安全部署到生产环境前完成查询测试与文档编写，同时提供监控和可见性支持。

[dbt-databend-cloud](https://github.com/databendcloud/dbt-databend) 是由 Databend 开发的插件，主要目标是实现 dbt 与 Databend 的无缝集成。借助此插件，您可以使用 dbt 执行数据建模、转换和清洗任务，并将结果便捷地加载到 Databend 中。下表展示了 dbt-databend-cloud 插件对 dbt 常用功能的支持情况：

| 功能                        	| 是否支持？ |
|-----------------------------	|-----------	|
| 表物化（Table Materialization）       	| 是       	|
| 视图物化（View Materialization）        	| 是       	|
| 增量物化（Incremental Materialization） 	| 是       	|
| 临时物化（Ephemeral Materialization）   	| 否        	|
| 种子（Seeds）                       	| 是       	|
| 数据源（Sources）                     	| 是       	|
| 自定义数据测试（Custom Data Tests）           	| 是       	|
| 文档生成（Docs Generate）               	| 是       	|
| 快照（Snapshots）                   	| 否        	|
| 连接重试（Connection Retry）            	| 是       	|

## 安装 dbt-databend-cloud

dbt-databend-cloud 插件的安装已简化，它现在包含 dbt 作为必需依赖项。执行以下命令可同时安装 dbt 和 dbt-databend-cloud 插件：

```shell
pip3 install dbt-databend-cloud
```

如需单独安装 dbt，请参阅官方 [dbt 安装指南](https://docs.getdbt.com/docs/get-started/installation)。

## 教程：运行 dbt 项目 jaffle_shop

dbt 新手建议先完成官方教程：https://github.com/dbt-labs/jaffle_shop。开始前请按[安装 dbt-databend-cloud](#installing-dbt-databend-cloud) 步骤安装所需组件。

本教程提供名为 "jaffle_shop" 的示例项目，帮助您获得 dbt 工具的实操经验。通过配置默认全局配置文件 (~/.dbt/profiles.yml) 连接 Databend 实例，项目将直接在您的 Databend 数据库中生成模型定义的表和视图。以下示例连接本地 Databend 实例：

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

使用 Databend Cloud 时，请参考此 [Wiki 页面](https://github.com/databendcloud/dbt-databend/wiki/How-to-use-dbt-with-Databend-Cloud) 获取 jaffle_shop 项目的分步运行指南。