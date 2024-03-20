---
title: 使用任务自动化数据加载
sidebar_label: 任务
---

任务封装了特定的 SQL 语句，旨在按预定间隔执行、由特定事件触发或作为更广泛任务序列的一部分执行。在 Databend Cloud 中，任务通常用于定期捕获来自流的数据变化，如新添加的记录，然后将这些数据与指定的目标目的地同步。此外，任务还支持 [Webhook](https://en.wikipedia.org/wiki/Webhook) 和其他消息系统，便于根据需要发送错误消息和通知。

## 创建任务 {#creating-a-task}

本主题详细介绍了在 Databend Cloud 中创建任务的过程。在 Databend Cloud 中，您可以使用 [CREATE TASK](/sql/sql-commands/ddl/task/ddl-create_task) 命令创建任务。创建任务时，请按照下面的说明设计工作流程：

![alt text](../../../../public/img/load/task.png)

1. 为任务设置一个名称。
2. 指定运行任务的仓库。要创建仓库，请参见 [使用仓库](/guides/cloud/using-databend-cloud/warehouses)。
3. 确定如何触发任务运行。

   - 您可以通过指定分钟或秒的间隔，或使用带有可选时区的 CRON 表达式来安排任务运行，以实现更精确的调度。

    ```sql title='示例：'
    -- 此任务每2分钟运行一次
    CREATE TASK mytask
    WAREHOUSE = 'default'
    // highlight-next-line
    SCHEDULE = 2 MINUTE
    AS ...

    -- 此任务在亚洲/东京时区的每天午夜运行
    CREATE TASK mytask
    WAREHOUSE = 'default'
    // highlight-next-line
    SCHEDULE = USING CRON '0 0 0 * * *' 'Asia/Tokyo'
    AS ...
    ```

    - 或者，您可以在任务之间建立依赖关系，将任务设置为 [有向无环图](https://en.wikipedia.org/wiki/Directed_acyclic_graph) 中的子任务。

    ```sql title='示例：'
    -- 此任务依赖于 DAG 中 'task_root' 任务的完成
    CREATE TASK mytask
    WAREHOUSE = 'default'
    // highlight-next-line
    AFTER task_root
    AS ...
    ```

4. 指定任务执行的条件，允许您根据布尔表达式选择性地控制任务执行。

```sql title='示例：'
-- 此任务每2分钟运行一次，并且仅当 'mystream' 包含数据变化时才执行 AS 后的 SQL
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = 2 MINUTE
// highlight-next-line
WHEN STREAM_STATUS('mystream') = TRUE
AS ...
```

5. 指定如果任务出错应该做什么，包括设置连续失败次数以暂停任务和指定错误通知的通知集成等选项。有关设置错误通知的更多信息，请参见 [配置通知集成](#configuring-notification-integrations)。

```sql title='示例：'
-- 连续失败3次后，此任务将暂停
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS ...

-- 此任务将使用 'my_webhook' 集成进行错误通知。
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
ERROR_INTEGRATION = 'my_webhook'
AS ...
```

6. 指定任务将执行的 SQL 语句。

```sql title='示例：'
-- 此任务每年更新 'employees' 表中的 'age' 列，将其增加1。
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = USING CRON '0 0 1 1 * *' 'UTC'
// highlight-next-line
AS
UPDATE employees
SET age = age + 1;
```

## 配置通知集成 {#configuring-notification-integrations}

Databend Cloud 允许您为任务配置错误通知，自动化在任务执行过程中发生错误时发送通知的过程。目前支持 Webhook 集成，便于实时将错误事件无缝通信到外部系统或服务。

### 任务错误负载 {#task-error-payload}

任务错误负载指的是在任务执行过程中遇到错误时作为错误通知的一部分发送的数据或信息。这个负载通常包括有关错误的详细信息，如错误代码、错误消息、时间戳，以及可能的其他相关上下文信息，这些信息有助于诊断和解决问题。

```json title='任务错误负载示例：'
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

### 使用示例 {#usage-examples}

在为任务配置错误通知之前，您必须使用 [CREATE NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/ddl-create-notification) 命令创建通知集成。以下是为任务创建和配置通知集成的示例。该示例使用 [Webhook.site](http://webhook.site) 来模拟消息系统，接收来自 Databend Cloud 的负载。

1. 在您的网络浏览器中打开 [Webhook.site](http://webhook.site)，并获取您的 Webhook URL。

![alt text](../../../../public/img/load/webhook-1.png)

2. 在 Databend Cloud 中，创建一个通知集成，然后创建一个带有通知集成的任务：

```sql
-- 创建一个名为 'my_task' 的任务，每分钟运行一次，错误通知发送到 'my_webhook'。
-- 故意除以零以生成错误。
CREATE TASK my_task
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
ERROR_INTEGRATION = 'my_webhook'
AS
SELECT 1 / 0;

-- 创建一个名为 'my_webhook' 的通知集成，用于发送 webhook 通知。
CREATE NOTIFICATION INTEGRATION my_webhook
TYPE = WEBHOOK
ENABLED = TRUE
WEBHOOK = (
    url = '<YOUR-WEBHOOK_URL>',
    method = 'POST'
);

-- 创建任务后恢复任务
ALTER TASK my_task RESUME;
```

3. 稍等片刻，您会注意到您的 webhook 开始接收来自创建的任务的负载。

![alt text](../../../../public/img/load/webhook-2.png)

## 使用示例 {#usage-examples}

请参阅 [示例：实时跟踪和转换数据](01-stream.md#example-tracking-and-transforming-data-in-real-time)，以获取如何使用流捕获数据变化并通过任务同步它们的完整演示。
