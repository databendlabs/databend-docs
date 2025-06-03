---
title: Databend Cloud 架构
sidebar_label: 架构
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![Alt text](@site/static/img/documents/overview/2.png)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="Meta-Service Layer">

元数据服务采用多租户架构，通过高可用 Raft 集群存储 Databend Cloud 中各租户的元数据。这些元数据包含：

- 表结构：记录每张表的字段结构与存储位置信息，为查询规划提供优化依据，并为存储层写入操作提供事务原子性保证；
- 集群管理：租户集群启动时，集群内多个实例将注册至元数据系统，并对实例进行健康检查，确保集群整体运行状态；
- 安全管理：存储用户、角色及权限授予信息，保障数据访问认证与授权流程的安全可靠。

</TabItem>
<TabItem value="Compute Layer" label="Compute Layer">

存算分离架构赋予 Databend Cloud 独特的计算弹性能力。

Databend Cloud 支持每个租户创建多个计算集群（Warehouse），各集群享有独占计算资源，并能在闲置超过 1 分钟后自动释放资源以降低使用成本。

计算集群通过高性能 Databend 引擎执行查询，每个查询将经历以下核心子模块处理：

- 规划器（Planner）：解析 SQL 语句后，根据查询类型将不同操作符（如 Projection、Filter、Limit 等）组合为查询计划；
- 优化器（Optimizer）：提供基于规则与成本的优化框架，实现谓词下推、Join 重排序、扫描剪枝等优化机制，显著提升查询速度；
- 处理器（Processors）：采用推拉式结合的流水线执行引擎，将查询物理执行过程组织为处理器中的流水线序列，并能根据查询任务运行时状态动态调整流水线配置，结合向量化表达式计算框架最大化释放 CPU 算力。

此外，Databend Cloud 可根据查询负载动态扩缩集群节点规模，实现高效经济的计算能力调度。

</TabItem>
<TabItem value="Storage Layer" label="Storage Layer">

Databend Cloud 存储层基于 FuseEngine 构建，该引擎专为低成本对象存储设计并优化。FuseEngine 根据对象存储特性高效组织数据，支持高吞吐量的数据写入与检索。

FuseEngine 以列式格式压缩数据后存储至对象存储，显著降低数据体积与存储成本。

除数据文件存储外，FuseEngine 还生成 MinMax 索引、Bloomfilter 索引等元信息。这些索引有效降低查询执行时的 I/O 与 CPU 消耗，大幅提升查询性能。

</TabItem>
</Tabs>