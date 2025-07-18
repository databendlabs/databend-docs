---
title: 工作负载组（Workload Group）
---

工作负载组（Workload Group）通过为不同用户组分配 CPU、内存配额和限制并发查询，在 Databend 中实现资源管理与查询并发控制。

## 工作原理

1. **创建工作负载组**，并指定资源配额（CPU、内存、并发限制）
2. 使用 `ALTER USER` **将用户分配**到工作负载组
3. **执行查询**时自动应用用户所在工作负载组的资源限制

## 快速示例

```sql
-- 创建工作负载组
CREATE WORKLOAD GROUP analytics WITH cpu_quota = '50%', memory_quota = '30%', max_concurrency = 5;

-- 将用户分配到工作负载组
CREATE USER analyst IDENTIFIED BY 'password';
ALTER USER analyst WITH SET WORKLOAD GROUP = 'analytics';
```

## 命令参考

### 管理
| 命令 | 描述 |
|---------|-------------|
| [CREATE WORKLOAD GROUP](create-workload-group.md) | 创建带资源配额的新工作负载组 |
| [ALTER WORKLOAD GROUP](alter-workload-group.md) | 修改工作负载组配置 |
| [DROP WORKLOAD GROUP](drop-workload-group.md) | 移除工作负载组 |
| [RENAME WORKLOAD GROUP](rename-workload-group.md) | 重命名工作负载组 |

### 信息
| 命令 | 描述 |
|---------|-------------|
| [SHOW WORKLOAD GROUPS](show-workload-groups.md) | 列出所有工作负载组及其设置 |

:::tip
在计算集群（Warehouse）中，所有工作负载组的资源配额会被归一化处理。例如，若两组 CPU 配额分别为 60% 和 40%，则它们将分别获得实际资源的 60% 和 40%。
:::