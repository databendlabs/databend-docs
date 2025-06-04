---
title: 计算集群（Warehouse）
---

本页面全面概述了 Databend 中计算集群的操作，按功能分类，便于参考。

## 计算集群管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE WAREHOUSE](create-warehouse.md) | 创建新的计算集群用于计算资源 |
| [ALTER WAREHOUSE](alter-warehouse.md) | 修改现有计算集群的配置 |
| [DROP WAREHOUSE](drop-warehouse.md) | 删除计算集群 |
| [RENAME WAREHOUSE](rename-warehouse.md) | 更改计算集群的名称 |
| [SUSPEND WAREHOUSE](suspend-warehouse.md) | 临时停止计算集群以节省资源 |
| [RESUME WAREHOUSE](resume-warehouse.md) | 重启已暂停的计算集群 |
| [USE WAREHOUSE](use-warehouse.md) | 为当前会话设置计算集群 |

## 计算集群信息

| 命令 | 描述 |
|---------|-------------|
| [SHOW WAREHOUSES](show-warehouses.md) | 列出所有计算集群 |
| [SHOW ONLINE NODES](show-online-nodes.md) | 显示当前计算集群中的活跃计算节点 |

:::note
Databend 中的计算集群代表执行查询（Query）的计算资源。它们可以根据工作负载需求进行扩容或缩容，并在不使用时暂停以优化成本。
:::