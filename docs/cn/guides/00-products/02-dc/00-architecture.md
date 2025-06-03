以下是润色后的文档，严格遵循您提出的所有要求：

---
title: Databend Cloud 架构
sidebar_label: 架构
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![架构示意图](@site/static/img/documents/overview/2.png)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元数据服务层">

元数据服务采用多租户架构，通过高可用的 Raft 集群存储各租户的元数据，主要包括：

- 表结构：记录表的字段结构及存储位置信息，既为查询规划提供优化依据，又保障存储层写入的事务原子性
- 集群管理：租户集群启动时，自动注册集群内所有实例的元数据，并通过健康检查机制确保集群整体运行状态
- 安全管理：存储用户、角色及权限授予信息，为数据访问的认证授权流程提供安全保障

</TabItem>
<TabItem value="Compute Layer" label="计算层">

存储计算分离架构赋予 Databend Cloud 独特的计算弹性：

每个租户可创建多个独立计算集群（Warehouse），各集群独占计算资源，并在闲置1分钟后自动释放资源以优化成本。

查询通过高性能 Databend 引擎执行，处理流程包含以下核心模块：

- 查询规划器（Planner）：解析SQL语句后，根据查询类型组合各类操作符（如Projection、Filter、Limit等）生成查询计划
- 优化器（Optimizer）：基于规则与代价的优化框架，实现谓词下推、连接重排序、扫描剪枝等优化机制
- 处理器（Processors）：采用推拉结合的流水线执行引擎，将物理执行计划转化为处理器流水线，并动态调整流水线配置，结合向量化表达式计算框架最大化CPU利用率

系统还能根据查询负载动态伸缩集群节点，实现高效经济的计算资源调度。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

存储层基于专为低成本对象存储优化的 FuseEngine 构建，具有以下特性：

- 数据组织：针对对象存储特性优化设计，支持高吞吐量的数据写入与检索
- 存储优化：采用列式压缩格式存储数据，显著降低存储容量需求与成本
- 索引加速：自动生成 MinMax 索引和 Bloomfilter 索引等，减少查询时的IO/CPU开销，大幅提升查询性能

</TabItem>
</Tabs>

主要优化点：
1. 专业术语处理：首次出现的英文术语保留原文（如Warehouse），后续使用中文表述
2. 句式优化：将长句拆分为符合中文表达习惯的短句结构
3. 逻辑显化：通过分段和项目符号使技术描述更清晰
4. 术语统一：确保相同概念在全文中表述一致
5. 被动语态转换：将英文被动语态转换为中文主动表达
6. 标点规范：统一使用中文标点符号
7. 技术准确性：严格保持所有技术术语和参数（如1分钟闲置时间）的原始表述