---
title: 使用 Task 自动化数据加载
sidebar_label: Task
---

Task 封装了特定的 SQL 语句，这些语句旨在按预定间隔、由特定事件触发或作为更广泛的任务序列的一部分执行。Databend Cloud 中的 Task 通常用于定期从 Stream 中捕获数据更改 ( 例如新添加的记录 )，然后将这些数据同步到指定的目标位置。此外，Task 还支持 [Webhook](https://en.wikipedia.org/wiki/Webhook) 和其他消息系统，以便根据需要发送错误消息和通知。

## 创建 Task

本主题详细介绍了在 Databend Cloud 中创建 Task 的过程。在 Databend Cloud 中，您可以使用 [CREATE TASK](/sql/sql-commands/ddl/task/ddl-create_task) 命令创建 Task。创建 Task 时，请按照以下图示设计工作流：

![alt text](/img/load/task.png)

1. 设置 Task 的名称。
2. 指定运行 Task 的计算集群。要创建计算集群，请参阅 [使用计算集群](/guides/cloud/using-databend-cloud/warehouses)。
3. 确定如何触发 Task 运行。

   - 您可以通过指定分钟或秒为单位的间隔来安排 Task 运行，或者使用带有可选时区的 CRON 表达式进行更精确的调度。

```sql title='示例：'
-- 此 Task 每 2 分钟运行一次
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SCHEDULE = 2 MINUTE
AS ...

-- 此 Task 每天午夜 ( 当地时间 ) 在 Asia/Tokyo 时区运行
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SCHEDULE = USING CRON '0 0 0 * * *' 'Asia/Tokyo'
AS ...
```

    - 或者，您可以在 Task 之间建立依赖关系，将 Task 设置为 [有向无环图](https://en.wikipedia.org/wiki/Directed_acyclic_graph) 中的子 Task。

```sql title='示例：'
-- 此 Task 依赖于 DAG 中 'task_root' Task 的完成
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
AFTER task_root
AS ...
```

4. 指定 Task 将在何种条件下执行，允许您根据布尔表达式有选择地控制 Task 执行。

```sql title='示例：'
-- 此 Task 每 2 分钟运行一次，并且仅当 'mystream' 包含数据更改时才执行 AS 后的 SQL
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = 2 MINUTE
// highlight-next-line
WHEN STREAM_STATUS('mystream') = TRUE
AS ...
```

5. 指定如果 Task 出现错误该如何处理，包括设置连续失败次数以暂停 Task，以及指定用于错误通知的通知集成。有关设置错误通知的更多信息，请参阅 [配置通知集成](#configuring-notification-integrations)。

```sql title='示例：'
-- 此 Task 将在连续失败 3 次后暂停
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS ...

-- 此 Task 将使用 'my_webhook' 集成进行错误通知。
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
ERROR_INTEGRATION = 'my_webhook'
AS ...
```

6. 指定 Task 将执行的 SQL 语句。

```sql title='示例：'
-- 此 Task 更新 'employees' 表中的 'age' 列，每年递增 1。
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = USING CRON '0 0 1 1 * *' 'UTC'
// highlight-next-line
AS
UPDATE employees
SET age = age + 1;
```

## 查看已创建的 Task

要查看组织创建的所有 Task，请登录 Databend Cloud 并转到 **Data** > **Task**。您可以查看每个 Task 的详细信息，包括其状态和调度。

要查看 Task 运行历史记录，请转到 **Monitor** > **Task History**。您可以查看每个 Task 的运行情况，包括其结果、完成时间和其他详细信息。

## 配置通知集成

Databend Cloud 允许您为 Task 配置错误通知，从而在 Task 执行期间发生错误时自动发送通知。它目前支持 Webhook 集成，有助于将错误事件实时无缝地传达给外部系统或服务。

### Task 错误 Payload

Task 错误 Payload 是指当 Task 在执行期间遇到错误时，作为错误通知的一部分发送的数据或信息。此 Payload 通常包括有关错误的详细信息，例如错误代码、错误消息、时间戳，以及可能有助于诊断和解决问题的其他相关上下文信息。

```json title='Task 错误 Payload 示例：'
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

在为 Task 配置错误通知之前，您必须使用 [CREATE NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/ddl-create-notification) 命令创建通知集成。以下是为 Task 创建和配置通知集成的示例。该示例使用 [Webhook.site](http://webhook.site) 模拟消息系统，从 Databend Cloud 接收 Payload。

1. 在 Web 浏览器中打开 [Webhook.site](http://webhook.site)，并获取 Webhook 的 URL。

![alt text](/img/load/webhook-1.png)

2. 在 Databend Cloud 中，创建通知集成，然后使用该通知集成创建 Task：

```sql
-- 创建一个名为 'my_task' 的 Task，每分钟运行一次，错误通知发送到 'my_webhook'。
-- 故意除以零以生成错误。
CREATE TASK my_task
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
ERROR_INTEGRATION = 'my_webhook'
AS
SELECT 1 / 0;

-- 创建一个名为 'my_webhook' 的通知集成，用于发送 Webhook 通知。
CREATE NOTIFICATION INTEGRATION my_webhook
TYPE = WEBHOOK
ENABLED = TRUE
WEBHOOK = (
    url = '<YOUR-WEBHOOK_URL>',
    method = 'POST'
);

-- 创建后恢复 Task
ALTER TASK my_task RESUME;
```

3. 等待片刻，您会发现您的 Webhook 开始从创建的 Task 接收 Payload。

![alt text](/img/load/webhook-2.png)

## 使用示例

有关如何使用 Stream 捕获数据更改并使用 Task 同步它们的完整演示，请参阅 [示例：实时跟踪和转换数据](01-stream.md#example-tracking-and-transforming-data-in-real-time)。