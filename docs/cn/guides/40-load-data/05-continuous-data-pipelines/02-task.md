---
title: 使用任务自动化数据加载
sidebar_label: 任务
---

任务封装了特定的 SQL 语句，设计用于按预定间隔执行、由特定事件触发或作为任务序列的一部分执行。在 Databend Cloud 中，任务通常用于定期捕获流中的变更数据（例如新增记录），然后将这些数据同步到指定目标。此外，任务还支持 [Webhook](https://en.wikipedia.org/wiki/Webhook) 等消息系统，可按需发送错误消息和通知。

## 创建任务

本主题详细说明在 Databend Cloud 中创建任务的步骤。您可以使用 [CREATE TASK](/sql/sql-commands/ddl/task/ddl-create_task) 命令创建任务。创建任务时，请参照下图设计工作流：

![alt text](/img/load/task.png)

1. 为任务设置名称。
2. 指定运行任务的计算集群。如需创建计算集群，请参阅 [使用计算集群](/guides/cloud/using-databend-cloud/warehouses)。
3. 确定任务触发方式。

   - 可通过指定分钟或秒为间隔来调度任务，或使用 CRON 表达式配合可选时区实现更精确的调度。

```sql title='示例:'
-- 此任务每 2 分钟运行一次
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SCHEDULE = 2 MINUTE
AS ...

-- 此任务每天午夜（东京时间）在 Asia/Tokyo 时区运行
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SCHEDULE = USING CRON '0 0 0 * * *' 'Asia/Tokyo'
AS ...
```

    - 或者，您可以在任务间建立依赖关系，将任务设置为 [有向无环图](https://en.wikipedia.org/wiki/Directed_acyclic_graph) 中的子任务。

```sql title='示例:'
-- 此任务依赖于 DAG 中 'task_root' 任务的完成
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
AFTER task_root
AS ...
```

4. 指定任务执行条件，允许基于布尔表达式控制任务执行（可选）。

```sql title='示例:'
-- 此任务每 2 分钟运行一次，仅当 'mystream' 包含数据变更时执行 AS 后的 SQL
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = 2 MINUTE
// highlight-next-line
WHEN STREAM_STATUS('mystream') = TRUE
AS ...
```

5. 指定任务出错时的处理方式，包括设置连续失败次数以暂停任务，以及指定错误通知的集成方式。有关设置错误通知的更多信息，请参阅 [配置通知集成](#configuring-notification-integrations)。

```sql title='示例:'
-- 此任务将在连续失败 3 次后暂停
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS ...

-- 此任务将使用 'my_webhook' 集成发送错误通知
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
ERROR_INTEGRATION = 'my_webhook'
AS ...
```

6. 指定任务将执行的 SQL 语句。

```sql title='示例:'
-- 此任务每年更新 'employees' 表中的 'age' 列，使其递增 1
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = USING CRON '0 0 1 1 * *' 'UTC'
// highlight-next-line
AS
UPDATE employees
SET age = age + 1;
```

## 查看已创建的任务

要查看组织创建的所有任务，请登录 Databend Cloud 并转到 **数据** > **任务**。您可以查看每个任务的详细信息，包括状态和调度计划。

要查看任务运行历史记录，请转到 **监控** > **任务历史**。您可以查看每次任务运行的结果、完成时间等详细信息。

## 配置通知集成

Databend Cloud 允许您为任务配置错误通知，在任务执行出错时自动发送通知。当前支持 Webhook 集成，可实现错误事件与外部系统或服务的实时通信。

### 任务错误负载

任务错误负载指任务执行出错时作为错误通知发送的数据或信息。该负载通常包含错误详情，如错误代码、错误消息、时间戳以及其他有助于诊断和解决问题的上下文信息。

```json title='任务错误负载示例:'
{
  "version": "1.0",
  "messageId": "063e40ab-0b55-439e-9cd2-504c496e1566",
  "messageType": "TASK_FAILED",
  "timestamp": "2024-03-19T02:37:21.160705788Z",
  "tenantId": "tn78p61xz",
  "taskName": "my_task",
  "taskId": "15",
  "rootTaskName": "my_task",
  "rootTaskId": "15",
  "messages": [
    {
      "runId": "unknown",
      "scheduledTime": "2024-03-19T02:37:21.157169855Z",
      "queryStartTime": "2024-03-19T02:37:21.043090475Z",
      "completedTime": "2024-03-19T02:37:21.157169205Z",
      "queryId": "88bb9d5d-5d5e-4e52-92cc-b1953406245a",
      "errorKind": "UnexpectedError",
      "errorCode": "500",
      "errorMessage": "query sync failed: All attempts fail:\n#1: query error: code: 1006, message: divided by zero while evaluating function `divide(1, 0)`"
    }
  ]
}
```

### 使用示例

在为任务配置错误通知前，您需要使用 [CREATE NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/ddl-create-notification) 命令创建通知集成。以下示例展示了如何为任务创建和配置通知集成。该示例使用 [Webhook.site](http://webhook.site) 模拟消息系统，接收来自 Databend Cloud 的负载。

1. 在浏览器中打开 [Webhook.site](http://webhook.site)，获取您的 Webhook URL。

![alt text](/img/load/webhook-1.png)

2. 在 Databend Cloud 中创建通知集成，然后创建带通知集成的任务：

```sql
-- 创建名为 'my_task' 的任务，每分钟运行一次，错误通知发送至 'my_webhook'
-- 故意除以零以生成错误
CREATE TASK my_task
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
ERROR_INTEGRATION = 'my_webhook'
AS
SELECT 1 / 0;

-- 创建名为 'my_webhook' 的通知集成，用于发送 webhook 通知
CREATE NOTIFICATION INTEGRATION my_webhook
TYPE = WEBHOOK
ENABLED = TRUE
WEBHOOK = (
    url = '<YOUR-WEBHOOK_URL>',
    method = 'POST'
);

-- 创建后恢复任务
ALTER TASK my_task RESUME;
```

3. 稍等片刻，您将看到 webhook 开始接收来自创建的任务的负载。

![alt text](/img/load/webhook-2.png)

## 使用示例

完整演示如何通过流捕获数据变更并使用任务同步，请参阅 [示例：实时跟踪和转换数据](01-stream.md#example-tracking-and-transforming-data-in-real-time)。