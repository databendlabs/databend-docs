---
title: 任务错误通知负载
sidebar_position: 10
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.371"/>

任务错误通知的负载体。

**注意：**此功能仅在 Databend Cloud 中开箱即用。

以下是描述任务错误的示例消息负载。负载可以包含一个或多个错误消息。

```json
{
  "version": "1.0",
  "messageId": "8389a9c7-7263-4f92-a44a-ba0e23b005cb",
  "messageType": "TASK_FAILED",
  "timestamp": "2024-03-11T10:19:23.965382326Z",
  "tenantId": "tnc7yee14",
  "taskName": "notification_n2",
  "taskId": "56",
  "rootTaskName": "notification_n2",
  "rootTaskId": "56",
  "runId": "unknown",
  "scheduledTime": "2024-03-11T10:19:23.963349422Z",
  "queryStartTime": "2024-03-11T10:19:23.850156389Z",
  "completedTime": "2024-03-11T10:19:23.963348812Z",
  "queryId": "2424b81e-f489-491b-bbab-e3556a27f867",
  "errorKind": "UnexpectedError",
  "errorCode": "500",
  "errorMessage": "query sync failed: All attempts fail: #1: query error: code: 1006, message: divided by zero while evaluating function divide(1, 0)"
}
```