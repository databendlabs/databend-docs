---
title: dbt
---

[dbt](https://www.getdbt.com/) 是一个转换工作流，可帮助您在完成更多工作的同时产出更高质量的结果。您可以使用 dbt 模块化和集中化分析代码，同时为数据团队提供软件工程工作流中常见的保障措施。在安全地部署到生产环境（同时提供监控和可见性）之前，您可以协作处理数据模型、进行版本控制、测试和记录查询。

[dbt-databend-cloud](https://github.com/databendcloud/dbt-databend) 是 Databend 开发的插件，主要目标是实现 dbt 与 Databend 之间的平滑集成。通过此插件，您可以使用 dbt 无缝执行数据建模、转换和清洗任务，并便捷地将输出加载到 Databend。下表说明 dbt-databend-cloud 插件对 dbt 常用功能的支持程度：

| 功能                     	| 是否支持？ |
|-----------------------------	|-----------	|
| 表物化（Table Materialization） | 是       	|
| 视图物化（View Materialization） | 是       	|
| 增量物化（Incremental Materialization） | 是       	|
| 临时物化（Ephemeral Materialization） | 否        	|
| 种子数据（Seeds） | 是       	|
| 数据源（Sources） | 是       	|
| 自定义数据测试（Custom Data Tests） | 是       	|
| 文档生成（Docs Generate） | 是       	|
| 快照（Snapshots） | 否        	|
| 连接重试（Connection Retry） | 是       	|

## 安装 dbt-databend-cloud

dbt-databend-cloud 插件的安装已简化，该插件现包含 dbt 作为必需依赖项。要同时安装 dbt 和 dbt-databend-cloud，请运行以下命令：

```shell
pip3 install dbt-databend-cloud
```

若需单独安装 dbt，请参考官方 dbt 安装指南获取详细说明。

## 教程：运行 dbt 项目 jaffle_shop

dbt 新手建议先完成官方教程：https://github.com/dbt-labs/jaffle_shop。开始前请按[安装 dbt-databend-cloud](#installing-dbt-databend-cloud) 步骤安装 dbt 和 dbt-databend-cloud。

本教程提供名为 "jaffle_shop" 的 dbt 示例项目，供您实践 dbt 工具。通过配置默认全局配置文件 (~/.dbt/profiles.yml) 提供 Databend 实例连接信息，项目将直接在您的 Databend 数据库中生成模型定义的表和视图。以下为连接本地 Databend 实例的 profiles.yml 示例：

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

若使用 Databend Cloud，请参考此 [Wiki 页面](https://github.com/databendcloud/dbt-databend/wiki/How-to-use-dbt-with-Databend-Cloud)获取运行 jaffle_shop 项目的分步指南。