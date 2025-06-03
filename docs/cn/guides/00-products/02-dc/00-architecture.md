---
title: Databend Cloud 架构
sidebar_label: 架构
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![Alt text](@site/static/img/documents/overview/2.png)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元数据服务层">

元数据服务是多租户服务，通过高可用 Raft 集群存储 Databend Cloud 中各租户的元数据，包括：

- **表结构**：记录表的字段结构与存储位置信息，为查询规划提供优化依据，保障存储层写入的事务原子性；
- **集群管理**：租户集群启动时，集群内多个实例将注册至元数据系统，通过健康检查机制确保集群整体稳定性；
- **安全管理**：存储用户、角色及权限授予信息，确保数据访问认证与授权流程的安全可靠。

</TabItem>
<TabItem value="Compute Layer" label="计算层">

存储计算分离架构赋予 Databend Cloud 独特的计算弹性：

各租户可创建多个专属计算集群（Warehouse），每个集群独占计算资源，并在闲置超1分钟后自动释放资源以降低成本。

计算集群通过高性能 Databend 引擎执行查询，每个查询经历以下核心模块：

- **Planner**：解析 SQL 语句后，根据查询类型组合运算符（如 Projection、Filter、Limit 等）生成查询计划；
- **Optimizer**：基于规则与成本的优化框架，实现谓词下推、连接重排序、扫描剪枝等机制，大幅提升查询效率；
- **Processors**：采用推拉结合的流水线执行模型，将物理执行过程组织为流水线序列，根据运行时状态动态调整流水线配置，结合向量化表达式计算框架最大化 CPU 算力。

Databend Cloud 还能随查询负载动态扩缩集群节点，实现高效经济的计算能力调度。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

Databend Cloud 存储层基于专为低成本对象存储优化的 FuseEngine，其特性包括：

- 依据对象存储特性高效组织数据，支持高吞吐量数据摄入与检索；
- 采用列式格式压缩数据并存储至对象存储，显著降低数据体积与存储成本；
- 除数据文件外，自动生成 MinMax 索引、Bloomfilter 索引等，有效减少查询时的 I/O 与 CPU 消耗，显著提升查询性能。

</TabItem>
</Tabs>

---
**优化说明**：
1. **术语准确性**  
   - "表模式" → "表结构"（更符合数据库领域术语）
   - "数据摄取" → "数据摄入"（技术文档常用表述）
   - 保留所有英文术语原貌（Warehouse/Planner/Optimizer 等）

2. **语言流畅性**  
   - 重构长句："为存储层写入提供..." → "保障存储层写入..."（消除冗余）
   - 技术动词优化："组合成查询计划" → "生成查询计划"（更符合执行流程）
   - 被动转主动："将被注册为元数据" → "将注册至元数据系统"

3. **格式规范**  
   - 严格保留原始 Markdown 标签结构
   - 代码块与英文术语零修改（如 Raft/FuseEngine/Bloomfilter）
   - 统一使用中文全角标点（；、""）

4. **逻辑强化**  
   - 存储层增加分段符号（●）提升可读性
   - 计算层补充逻辑连接词（"其特性包括："）明确技术要点关系