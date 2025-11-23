---
title: DDL（Data Definition Language）命令
---

这些主题提供了 Databend 中 DDL（Data Definition Language）命令的参考信息。

## 数据库和表管理

| 组件 | 描述 |
|-----------|-------------|
| **[数据库](00-database/index.md)** | 创建、修改和删除数据库 |
| **[表](01-table/index.md)** | 创建、修改和管理表 |
| **[视图 (View)](05-view/index.md)** | 基于查询创建和管理虚拟表 |

## 性能和索引

| 组件 | 描述 |
|-----------|-------------|
| **[聚簇键 (Cluster Key)](06-clusterkey/index.md)** | 为查询优化定义数据聚簇 |
| **[聚合索引 (Aggregating Index)](07-aggregating-index/index.md)** | 预计算聚合以加快查询速度 |
| **[倒排索引 (Inverted Index)](07-inverted-index/index.md)** | 用于文本列的全文搜索索引 |
| **[Ngram 索引 (Ngram Index)](07-ngram-index/index.md)** | 用于 LIKE 模式的子字符串搜索索引 |
| **[虚拟列 (Virtual Column)](07-virtual-column/index.md)** | 将 JSON 字段提取并索引为虚拟列 |

## 安全和访问控制

| 组件 | 描述 |
|-----------|-------------|
| **[用户](02-user/index.md)** | 创建和管理数据库用户 |
| **[网络策略 (Network Policy)](12-network-policy/index.md)** | 控制对数据库的网络访问 |
| **[掩码策略 (Mask Policy)](12-mask-policy/index.md)** | 为敏感信息应用数据掩码 |
| **[密码策略 (Password Policy)](12-password-policy/index.md)** | 强制执行密码要求和轮换 |

## 数据集成和处理

| 组件 | 描述 |
|-----------|-------------|
| **[暂存区 (Stage)](03-stage/index.md)** | 为数据加载定义存储位置 |
| **[流 (Stream)](04-stream/index.md)** | 捕获和处理数据变更 |
| **[任务 (Task)](04-task/index.md)** | 调度和自动化 SQL 操作 |
| **[序列 (Sequence)](04-sequence/index.md)** | 生成唯一的序列号 |
| **[连接 (Connection)](13-connection/index.md)** | 配置外部数据源连接 |
| **[文件格式 (File Format)](13-file-format/index.md)** | 为数据导入/导出定义格式 |

## 函数和存储过程

| 组件 | 描述 |
|-----------|-------------|
| **[UDF](10-udf/index.md)** | 使用 Python 或 JavaScript 创建自定义函数 |
| **[外部函数 (External Function)](11-external-function/index.md)** | 将外部 API 集成为 SQL 函数 |
| **[存储过程 (Procedure)](18-procedure/index.md)** | 为复杂逻辑创建存储过程 |
| **[通知 (Notification)](16-notification/index.md)** | 设置事件通知和 Webhook |

## 资源管理

| 组件 | 描述 |
|-----------|-------------|
| **[计算集群 (Warehouse)](19-warehouse/index.md)** | 管理用于查询执行的计算资源 |
| **[工作负载组 (Workload Group)](20-workload-group/index.md)** | 控制资源分配和优先级 |
| **[事务 (Transaction)](14-transaction/index.md)** | 管理数据库事务 |
| **[变量 (Variable)](15-variable/index.md)** | 设置和使用会话/全局变量 |
