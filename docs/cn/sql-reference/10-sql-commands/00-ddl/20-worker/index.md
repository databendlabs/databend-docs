---
title: 工作节点（Worker）
---

适用于启用了 cloud control 的部署的 Worker 相关 SQL 命令。

:::note
Worker 管理命令依赖 cloud control。如果未配置 `cloud_control_grpc_server_address`，执行这些命令时 Databend 会返回 `CloudControlNotEnabled` 错误。
:::

## 支持的语句

| 语句 | 用途 |
|-----------|---------|
| `CREATE WORKER` | 创建 worker，并可附带键值形式的选项 |
| `ALTER WORKER` | 更新 worker 的标签、选项或运行状态 |
| `DROP WORKER` | 删除 worker |
| `SHOW WORKERS` | 列出当前 tenant 下的 worker |

## 命令参考

| 命令 | 描述 |
|---------|-------------|
| [CREATE WORKER](create-worker.md) | 创建 worker 定义 |
| [ALTER WORKER](alter-worker.md) | 修改 worker 的标签、选项或状态 |
| [DROP WORKER](drop-worker.md) | 删除 worker 定义 |
| [SHOW WORKERS](show-workers.md) | 查看 worker 及其元数据 |

## 说明

- 选项名不区分大小写，Databend 在规划阶段会将它们规范化为小写。
- `SHOW WORKERS` 返回 `name`、`tags`、`options`、`created_at` 和 `updated_at` 列。
- `ALTER WORKER` 支持 `SET TAG`、`UNSET TAG`、`SET`、`UNSET`、`SUSPEND` 和 `RESUME`。
