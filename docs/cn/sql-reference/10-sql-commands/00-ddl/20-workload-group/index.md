---
title: 工作负载组（Workload Group）
---

工作负载组（Workload Group）通过为不同用户组分配 CPU、内存配额并限制并发查询，在 Databend 中实现资源管理与查询并发控制。

## 工作原理

1. **创建工作负载组（Workload Group）**，并指定具体的资源配额（CPU、内存、并发限制）。
2. 使用 `ALTER USER` **将用户分配**到工作负载组（Workload Group）。
3. **执行查询（Query）**时，系统会根据用户自动应用其所属工作负载组（Workload Group）的资源限制。

## 快速示例

```sql
-- 创建工作负载组
CREATE WORKLOAD GROUP analytics WITH cpu_quota = '50%', memory_quota = '30%', max_concurrency = 5;

-- 创建角色并授予权限
CREATE ROLE analyst_role;
GRANT ALL ON *.* TO ROLE analyst_role;
CREATE USER analyst IDENTIFIED BY 'password' WITH DEFAULT_ROLE = 'analyst_role';
GRANT ROLE analyst_role TO analyst;

-- 将用户分配到工作负载组
ALTER USER analyst WITH SET WORKLOAD GROUP = 'analytics';

-- 从工作负载组中移除用户（用户将使用默认的无限资源）
ALTER USER analyst WITH UNSET WORKLOAD GROUP;
```

## 命令参考

### 管理
| 命令 | 描述 |
|---------|-------------|
| [CREATE WORKLOAD GROUP](create-workload-group.md) | 创建新的工作负载组并设置资源配额 |
| [ALTER WORKLOAD GROUP](alter-workload-group.md) | 修改工作负载组配置 |
| [DROP WORKLOAD GROUP](drop-workload-group.md) | 删除工作负载组 |
| [RENAME WORKLOAD GROUP](rename-workload-group.md) | 重命名工作负载组 |

### 信息
| 命令 | 描述 |
|---------|-------------|
| [SHOW WORKLOAD GROUPS](show-workload-groups.md) | 列出所有工作负载组及其设置 |

:::tip
资源配额在计算集群（Warehouse）中的所有工作负载组之间进行归一化。例如，如果两个组的 CPU 配额分别为 60% 和 40%，它们将分别获得实际资源的 60% 和 40%。
:::
