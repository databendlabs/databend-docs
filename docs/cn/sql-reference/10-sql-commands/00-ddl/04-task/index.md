---
title: 任务（Task）
---

本页面提供了 Databend 中任务操作的全面概述，按功能组织以便于参考。

## 任务管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE TASK](01-ddl-create_task.md) | 创建新的计划任务 |
| [ALTER TASK](02-ddl-alter-task.md) | 修改现有任务 |
| [DROP TASK](03-ddl-drop-task.md) | 删除任务 |
| [EXECUTE TASK](04-ddl-execute-task.md) | 手动执行任务 |

## 任务信息

| 命令 | 描述 |
|---------|-------------|
| [TASK ERROR INTEGRATION PAYLOAD](10-task-error-integration-payload.md) | 显示任务错误通知的错误载荷格式 |

:::note
Databend 中的任务允许您安排和自动化 SQL 命令在指定间隔执行。
:::