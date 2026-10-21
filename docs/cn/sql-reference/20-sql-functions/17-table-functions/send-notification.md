---
title: SYSTEM$SEND_NOTIFICATION
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

通过现有通知集成发送消息。Databend Cloud 接受消息后将其加入队列，异步投递。SQL 语句在 Databend Cloud 接受消息后返回成功，不会等待 Webhook 请求完成。

**注意：** 此函数仅在 Databend Cloud 中可用。

## 语法

```sql
CALL system$send_notification('<integration_name>', '<message>');
```

也可以直接调用底层表函数：

```sql
SELECT * FROM send_notification('<integration_name>', '<message>');
```

`CALL system$send_notification(...)` 会改写为等价的 `SELECT * FROM send_notification(...)` 语句。

## 参数

| 参数 | 是否必需 | 说明 |
|------|----------|------|
| `integration_name` | 是 | 现有且已启用的通知集成名称。 |
| `message` | 是 | 消息文本。消息必须包含 1 到 262,144 个 UTF-8 字节。 |

两个参数都必须是字符串。`NULL`、空集成名称和空消息都会被拒绝。

## 返回值

函数返回一个名为 `result` 的 `STRING` 列，零行。不返回投递 ID 或投递状态。

## 所需权限

当前用户必须具有全局 `SUPER` 权限。对于任务，任务执行角色必须具有全局 `SUPER` 权限。

## 行为

- 函数仅在语句执行时提交通知。`EXPLAIN` 和 `EXPLAIN PIPELINE` 不会发送通知。
- Databend 会为使用此函数的语句禁用查询结果缓存，无需修改缓存设置。
- 即使查询在多个节点上运行，一条语句也只提交一条通知。
- SQL 成功表示 Databend Cloud 已接受消息，不表示 Webhook 已投递消息。
- Databend Cloud 会有限次重试 Webhook 投递。最终结果记录在 `system.notification_history` 中。
- 入队请求不会自动重试。网络错误可能在 Databend Cloud 已接受消息后返回 SQL 错误。重试可能产生重复消息。重试前请检查通知历史，并为投递留出时间。
- 投递可能重复。Databend Cloud 会记录查询 ID 用于关联。查询 ID 不是幂等键。
- 通知集成必须存在且已启用。否则语句失败，不会创建投递任务。
- Databend Cloud 在投递时使用最新的集成配置。如果在消息被接受后修改 URL 或模板，新配置会生效。
- 队列中的消息绑定集成 ID。如果删除集成后创建同名集成，旧集成的队列消息会失败。
- 禁用集成不会暂停队列。待处理消息在投递重试耗尽后失败。
- 如果当前部署不支持主动通知，语句会返回错误。

## 示例

### 发送消息

```sql
CALL system$send_notification('feishu_alerts', '查询错误数超过阈值。');
```

### 使用表函数形式

```sql
SELECT * FROM send_notification('feishu_alerts', '每日加载已完成。');
```

### 在任务中发送通知

在脚本中使用 `SELECT` 形式。使用 `IF` 控制是否发送通知。不要使用 `LIMIT`、`WHERE` 或其他查询优化来抑制调用。

```sql
CREATE TASK notify_query_errors
  WAREHOUSE = 'monitoring_wh'
  SCHEDULE = 5 MINUTE
AS
EXECUTE IMMEDIATE $$
BEGIN
    LET failed_count := (
        SELECT count(*)
        FROM system_history.query_history
        WHERE event_time >= now() - INTERVAL 10 MINUTE
          AND log_type = 3
    );

    IF failed_count > 0 THEN
        SELECT * FROM send_notification(
            'feishu_alerts',
            CONCAT('最近 10 分钟查询错误数：', TO_STRING(failed_count))
        );
    END IF;
END;
$$;
```

`system_history.query_history` 需要 Query History 功能。如果该功能不可用，请替换为自己的查询条件。

### 检查投递状态

```sql
SELECT created_on, processed, integration_name, status, error_message
FROM system.notification_history
WHERE integration_name = 'feishu_alerts'
ORDER BY created_on DESC
LIMIT 10;
```

`status` 列为 `success` 或 `failure`。`success` 表示 Webhook 返回了 200 到 399 的 HTTP 状态码，不表示接收服务已接受消息。例如，飞书可能返回 HTTP 200 和业务错误码。

## 相关文档

- [CREATE NOTIFICATION INTEGRATION](../../10-sql-commands/00-ddl/16-notification/01-ddl-create-notification.md)
- [ALTER NOTIFICATION INTEGRATION](../../10-sql-commands/00-ddl/16-notification/02-ddl-alter-notification.md)
- [通过 SQL 发送通知](/guides/cloud/administration/notifications)
