---
title: 使用任务（Task）自动化数据加载
sidebar_label: 任务（Task）
---

任务（Task）封装了特定的 SQL 语句，这些语句设计用于在预定间隔执行、由特定事件触发或作为任务序列的一部分运行。Databend Cloud 中的任务通常用于定期捕获流（Stream）中的数据变更（如新增记录），并将数据同步到指定目标。此外，任务支持 [Webhook](https://en.wikipedia.org/wiki/Webhook) 等消息系统，实现错误消息和通知的传递。

## 创建任务（Task）

本主题分步说明在 Databend Cloud 创建任务的过程。请使用 [CREATE TASK](/sql/sql-commands/ddl/task/ddl-create_task) 命令创建任务，并按以下流程设计：

![alt text](/img/load/task.png)

1. 设置任务名称
2. 指定运行任务的计算集群（Warehouse）。创建方法参见[使用计算集群（Warehouse）](/guides/cloud/using-databend-cloud/warehouses)
3. 确定任务触发方式：
   - 按分钟/秒设置执行间隔
   - 使用带时区的 CRON 表达式实现精确调度

```sql title='示例：'
-- 每 2 分钟运行
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SCHEDULE = 2 MINUTE
AS ...

-- 在亚洲/东京时区每日午夜运行
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SCHEDULE = USING CRON '0 0 0 * * *' 'Asia/Tokyo'
AS ...
```

   - 或在[有向无环图](https://en.wikipedia.org/wiki/Directed_acyclic_graph)中建立任务依赖关系

```sql title='示例：'
-- 依赖 DAG 中 task_root 任务完成
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
AFTER task_root
AS ...
```

4. 通过布尔表达式控制任务执行条件

```sql title='示例：'
-- 仅当 mystream 有数据变更时执行
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = 2 MINUTE
// highlight-next-line
WHEN STREAM_STATUS('mystream') = TRUE
AS ...
```

5. 配置错误处理机制：
   - 设置连续失败暂停阈值
   - 指定错误通知集成
   - 详见[配置通知集成](#configuring-notification-integrations)

```sql title='示例：'
-- 连续失败 3 次后暂停
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS ...

-- 使用 my_webhook 发送错误通知
CREATE TASK mytask
WAREHOUSE = 'default'
// highlight-next-line
ERROR_INTEGRATION = 'my_webhook'
AS ...
```

6. 定义任务执行的 SQL 语句

```sql title='示例：'
-- 每年更新 employees 表年龄字段
CREATE TASK mytask
WAREHOUSE = 'default'
SCHEDULE = USING CRON '0 0 1 1 * *' 'UTC'
// highlight-next-line
AS
UPDATE employees
SET age = age + 1;
```

## 查看已创建任务

登录 Databend Cloud：
1. 前往 **Data** > **Task** 查看所有任务状态与调度信息
2. 进入 **Monitor** > **Task History** 查看任务运行历史（含结果与完成时间）

## 配置通知集成

Databend Cloud 支持为任务配置错误通知，当任务执行失败时自动发送告警。当前支持 Webhook 集成，可实时向外部系统推送错误事件。

### 任务错误载荷

错误发生时发送的载荷包含诊断信息：
- 错误代码与消息
- 时间戳
- 任务上下文信息

```json title='任务错误载荷示例：'
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

前置步骤：使用 [CREATE NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/ddl-create-notification) 创建通知集成。本例通过 [Webhook.site](http://webhook.site) 模拟消息接收：

1. 访问 [Webhook.site](http://webhook.site) 获取 Webhook URL  
   ![alt text](/img/load/webhook-1.png)

2. 在 Databend Cloud 执行：
```sql
-- 创建每分钟运行的任务，错误时通知 my_webhook
-- 故意触发除零错误
CREATE TASK my_task
WAREHOUSE = 'default'
SCHEDULE = 1 MINUTE
ERROR_INTEGRATION = 'my_webhook'
AS
SELECT 1 / 0;

-- 创建 Webhook 通知集成
CREATE NOTIFICATION INTEGRATION my_webhook
TYPE = WEBHOOK
ENABLED = TRUE
WEBHOOK = (
    url = '<YOUR-WEBHOOK_URL>',
    method = 'POST'
);

-- 激活任务
ALTER TASK my_task RESUME;
```

3. 等待片刻，Webhook 将接收到错误载荷  
   ![alt text](/img/load/webhook-2.png)

## 使用示例

完整实践演示参见：[示例：实时跟踪和转换数据](01-stream.md#example-tracking-and-transforming-data-in-real-time)