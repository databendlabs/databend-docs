---
title: 架构
---

Databend Cloud 是基于开源数仓引擎 [Databend](https://github.com/datafuselabs/databend) 而构造的云服务，它简单可靠、可扩展、安全且成本低廉，可以为您的数据科学、BI 报表、日志分析等场景提供强大助力。Databend Cloud 服务有下述架构优势：

- 即时弹性：彻底的存储与计算分离，允许随着数据分析规模的需要而扩展、收缩需要的计算资源；
- 极速性能：Databend Cloud 利用推拉结合的流水线执行引擎、向量化表达式引擎、处理器 SIMD 技术，将处理器的计算能力压榨到极限；
- 丰富的数据类型：Databend Cloud 支持来自诸多格式的数据摄入，比如 CSV、JSON、Parquet 等，更支持 Array、Map、JSON 等半结构化数据类型，大大简化数据导入的过程；
- 生态集成：Databend Cloud 除了提供有 Python、Go、Java 等语言的 SQL Driver 实现，也兼容 Clickhouse 的 HTTP 通信协议，可以与现有的丰富生态（如 vector、Metabase、Deepnote 等）进行集成；
- 易用：Databend Cloud 不需要配置索引、分区等复杂的人工调优，为您提供开箱即用的高性能体验；

![Alt text](@site/static/img/documents/getting-started/architecture.png)

## 元信息服务

元信息服务是一套多租户服务，它会将 Databend Cloud 中各个租户的元信息保存在一套高可用的 Raft 集群中。这些元信息包括：

- 表结构信息：包含各个表的字段结构及存储的位置信息，为查询计划提供优化信息，并为存储层的写入提供事务原子性保障；
- 集群管理：当各租户的集群启动时，会将集群内部的多个实例注册为元信息，并为实例提供健康检查以保障集群总体的健康；
- 安全管理：保存用户、角色与权限授予信息，保障数据访问的认证与授权过程安全可靠。

## 计算层

计算与存储完全分离的架构，使 Databend Cloud 拥有得天独厚的计算弹性。

Databend Cloud 中的每位租户可以拥有多个计算集群（Warehouse），每个集群有独占的计算资源，并可以在超过 1 分钟不活跃时自动释放以降低使用成本。

计算集群内通过高性能的 Databend 引擎执行查询。每条查询在执行时，会进一步经过多个不同的子模块：

1. Planner: 解析 SQL 语句后，会根据不同的查询类型，基于不同的算子（比如 Projection、Filter、Limit 等）组合为查询计划。
2. Optimizer: Databend 引擎中提供了基于规则和基于代价的优化器框架，实现了谓词下推、Join Reorder、Scan Pruning 等一系列优化机制，使查询大大加速。
3. Processors: Databend 实现了推拉结合的流水线执行引擎。它在 Processor 中将查询的物理执行组成一系列流水线，并能根据查询任务的运行信息动态适应流水线配置，结合向量化表达式计算框架，最大限度地跑满 CPU 的计算能力。

除此之外，Databend Cloud 还可以随着查询工作负载的变化动态增减集群中的节点，使计算更快，成本也更加低廉。

## 存储层

Databend Cloud 的存储层基于为廉价的对象存储而设计与优化的 FuseEngine。FuseEngine 能够基于对象存储的性质，高效地组织数据，允许高吞吐地数据摄入与数据检索。

FuseEngine 会将数据按列式格式压缩后存储于对象存储，能够大比例地降低您的数据体积从而降低存储成本。

在存储数据文件的同时，FuseEngine 也会自动生成索引信息，其中包括 MinMax 索引、Bloomfilter 索引等，这些索引能够在查询执行期间减少 IO 与 CPU 消耗，大大加速查询的性能。