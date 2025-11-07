---
title: Automating Data Loading with Tasks
sidebar_label: Task
---

A task encapsulates specific SQL statements that are designed to be executed either at predetermined intervals, triggered by specific events, or as part of a broader sequence of tasks. Tasks in Databend are commonly used to regularly capture data changes from streams, such as newly added records, and then synchronize this data with designated target destinations. Furthermore, tasks offer support for [Webhook](https://en.wikipedia.org/wiki/Webhook) and other messaging systems, facilitating the delivery of error messages and notifications as needed.

## Creating a Task

This topic breaks down the procedure of creating a task in Databend. In Databend, you create a task using the [CREATE TASK](/sql/sql-commands/ddl/task/ddl-create_task) command. When creating a task, follow the illustration below to design the workflow:

![alt text](/img/load/task.png)

1. Set a name for the task.
2. Specify a warehouse to run the task. To create a warehouse, see [Work with Warehouses](/guides/cloud/using-databend-cloud/warehouses).
3. Determine how to trigger the task to run.

   - You can schedule the task to run by specifying the interval in minutes or seconds, or by using a CRON expression with an optional time zone for more precise scheduling.

```sql title='Examples:'
-- This task runs every 2 minutes
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SCHEDULE = 2 MINUTE
AS ...

-- This task runs daily at midnight (local time) in the Asia/Tokyo timezone
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SCHEDULE = USING CRON '0 0 0 * * *' 'Asia/Tokyo'
AS ...
```

    - Alternatively, you can establish dependencies between tasks, setting the task as a child task in a [Directed Acyclic Graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

```sql title='Examples:'
--  This task is dependent on the completion of the 'task_root' task in the DAG
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
AFTER task_root
AS ...
```

4. Specify the condition under which the task will execute, allowing you to optionally control task execution based on a boolean expression.

```sql title='Examples:'
-- This task runs every 2 minutes and executes the SQL after AS only if 'mystream' contains data changes
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = 2 MINUTE
// highlight-next-line
WHEN STREAM_STATUS('mystream') = TRUE
AS ...
```

5. Specify what to do if the task results in an error, including options such as setting the number of consecutive failures to suspend the task and specifying the notification integration for error notifications. For more information about setting an error notification, see [Configuring Notification Integrations](#configuring-notification-integrations).

```sql title='Examples:'
--  This task will suspend after 3 consecutive failures
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS ...

-- This task will utilize the 'my_webhook' integration for error notifications.
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
ERROR_INTEGRATION = 'my_webhook'
AS ...
```

6. Specify the SQL statement the task will execute.

```sql title='Examples:'
-- This task updates the 'age' column in the 'employees' table, incrementing it by 1 every year.
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = USING CRON '0 0 1 1 * *' 'UTC'
// highlight-next-line
AS
UPDATE employees
SET age = age + 1;
```

## Viewing Created Tasks

To view all tasks created by your organization, log in to Databend and go to **Data** > **Task**. You can see detailed information for each task, including their status and schedules.

To view the task run history, go to **Monitor** > **Task History**. You can see each run of tasks with their result, completion time, and other details.

## Configuring Notification Integrations

Databend allows you to configure error notifications for a task, automating the process of sending notifications when an error occurs during the task execution. It currently supports Webhook integrations, facilitating seamless communication of error events to external systems or services in real-time.
:::caution
Supported only in Databend Cloud
:::

### Task Error Payload

A task error payload refers to the data or information that is sent as part of an error notification when a task encounters an error during its execution. This payload typically includes details about the error, such as error codes, error messages, timestamps, and potentially other relevant contextual information that can help in diagnosing and resolving the issue.

```json title='Task Error Payload Example:'
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

### Usage Examples

Before configuring error notifications for a task, you must create a notification integration with the [CREATE NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/ddl-create-notification) command. The following is an example of creating and configuring a notification integration for a task. The example utilizes [Webhook.site](http://webhook.site) to simulate the messaging system, receiving payloads from Databend Cloud.

1. Open the [Webhook.site](http://webhook.site) in your web browser, and obtain the URL of your Webhook.

![alt text](/img/load/webhook-1.png)

2. In Databend Cloud, create a notification integration, and then create a task with the notification integration:

```sql
-- Create a task named 'my_task' to run every minute, with error notifications sent to 'my_webhook'.
-- Intentionally divide by zero to generate an error.
CREATE TASK my_task
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
ERROR_INTEGRATION = 'my_webhook'
AS
SELECT 1 / 0;

-- Create a notification integration named 'my_webhook' for sending webhook notifications.
CREATE NOTIFICATION INTEGRATION my_webhook
TYPE = WEBHOOK
ENABLED = TRUE
WEBHOOK = (
    url = '<YOUR-WEBHOOK_URL>',
    method = 'POST'
);

-- Resume the task after creation
ALTER TASK my_task RESUME;
```

3. Wait for a moment, and you'll notice that your webhook starts to receive the payload from the created task.

![alt text](/img/load/webhook-2.png)

## Usage Examples

See [Example: Tracking and Transforming Data in Real-Time](01-stream.md#example-tracking-and-transforming-data-in-real-time) for a complete demo on how to capture data changes with a stream and sync them with a task.
