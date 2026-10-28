---
title: 通过 SQL 发送通知
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

Databend Cloud 可以通过自定义机器人从 SQL 向飞书群发送消息。你在通知集成中保存 Webhook 和消息格式，然后在查询或任务中调用 [`system$send_notification`](/sql/sql-functions/table-functions/send-notification)。

本指南及示例仅验证飞书自定义机器人。

你可以将此功能用于查询错误告警、数据质量检查、任务结果，或任何可以由 SQL 语句生成的消息。

## 准备工作

请确认以下事项：

- 你的角色具有全局 `SUPER` 权限。如果角色没有该权限，请让 `account_admin` 执行：

  ```sql
  GRANT SUPER ON *.* TO ROLE <role_name>;
  SYSTEM FLUSH PRIVILEGES;
  ```

  任务使用其执行角色的权限。
- 任务示例需要一个现有 Warehouse。示例使用 `monitoring_wh`。
- 你可以在目标飞书群中添加自定义机器人。

## 本指南使用的值

示例使用以下值。请按步骤将它们替换为你自己的值。

| 值 | 示例中的值 | 替换为 |
|----|------------|--------|
| 通知集成名称 | `feishu_alerts` | 你的通知集成名称 |
| 飞书 Webhook 地址 | `OPEN_FEISHU_URL` | 第 1 步获取的地址 |
| 飞书关键词 | `DatabendAlert` | 第 1 步设置的关键词 |
| Warehouse | `monitoring_wh` | 现有 Warehouse |
| 消息 | `查询错误数超过阈值。` | 你的告警文本 |

## 第 1 步：配置飞书机器人

飞书自定义机器人支持自定义关键词、IP 白名单和签名校验三种验证方式。Databend 不会计算飞书签名，也不能设置任意 HTTP 头。请使用自定义关键词方式。如需使用 IP 白名单，请先向支持人员确认出口 IP 地址。

1. 在飞书中打开目标群。
2. 打开**设置** > **机器人** > **添加机器人** > **自定义机器人**。
3. 输入名称并复制 Webhook 地址。
4. 打开安全设置，选择**自定义关键词**。
5. 输入关键词，例如 `DatabendAlert`。
6. 保存机器人。

第 2 步会使用这个关键词。如果你选择了其他关键词，请将模板中的 `DatabendAlert` 替换为你的关键词。

关键词必须出现在飞书收到的消息文本中。

请将 Webhook 地址视为机密信息。任何获得该地址的人都可以向群发送消息。

### 可选：测试机器人

如果你有终端，可以在配置 Databend 前先确认 Webhook 地址和关键词是否可用。运行命令前，请替换 `OPEN_FEISHU_URL` 和 `DatabendAlert`：

```bash
curl -X POST 'OPEN_FEISHU_URL' \
  -H 'Content-Type: application/json' \
  -d '{"msg_type":"text","content":{"text":"[DatabendAlert] test"}}'
```

飞书群中应显示 `test`。如果没有显示，请先修正机器人设置。Webhook 地址是机密信息，不要在共享机器上运行此命令。

:::warning
使用关键词校验时，飞书不会识别消息的发送方。关键词是唯一的筛选条件。如果多个系统向同一个机器人发送消息，请使用仅包含 Databend 消息的关键词。如果多个 Databend 集成使用同一个机器人，它们共享同一个关键词。需要区分时，请使用不同的机器人，或在消息中加入集成名称。
:::

## 第 2 步：创建通知集成

在 Databend Cloud 控制台打开 Worksheet，选择 Warehouse，然后执行以下语句：

```sql
CREATE NOTIFICATION INTEGRATION feishu_alerts
  TYPE = WEBHOOK
  ENABLED = TRUE
  WEBHOOK = (
    URL = 'OPEN_FEISHU_URL',
    METHOD = 'POST'
  )
  WEBHOOK_BODY_TEMPLATE = '{"msg_type":"text","content":{"text":"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE"}}';
```

请将 `OPEN_FEISHU_URL` 替换为第 1 步获取的 Webhook 地址。将 `DatabendAlert` 替换为你的关键词。模板中必须包含你在机器人中设置的关键词。

示例说明：

- 飞书机器人 Webhook 必须使用 `METHOD = 'POST'`。默认方法是 `GET`。
- `WEBHOOK_BODY_TEMPLATE` 定义飞书要求的 JSON 请求体。它是顶层子句，不是 `WEBHOOK` 中的属性。
- 投递时，`DATABEND_WEBHOOK_MESSAGE` 会替换为消息文本。
- `[DatabendAlert]` 是第 1 步中的飞书关键词。模板会将它添加到每条消息中，调用方无需再包含关键词。
- Databend 会自动发送 `Content-Type: application/json`。

飞书不接受原始文本请求体。如果未设置模板，Databend 会将消息作为请求体直接发送，飞书不会接受。

验证通知集成：

```sql
DESC NOTIFICATION INTEGRATION feishu_alerts;
```

确认 `enabled` 为 `true`，并且 `webhook_options` 中包含 `body_template`。如果缺少 `body_template`，请联系支持人员。

仅在设置了模板时，`webhook_options` 才会包含 `body_template`：

```json
{"url":"OPEN_FEISHU_URL","method":"POST","authorization_header":"","body_template":"{\"msg_type\":\"text\",\"content\":{\"text\":\"[DatabendAlert] DATABEND_WEBHOOK_MESSAGE\"}}"}
```

将该集成用作任务的 `ERROR_INTEGRATION` 时，模板同样生效。此时消息是 [TASK ERROR INTEGRATION PAYLOAD](/sql/sql-commands/ddl/task/task-error-integration-payload) 中所述的任务错误载荷。模板会将载荷作为文本插入，并进行 JSON 转义。

## 第 3 步：发送通知

```sql
CALL system$send_notification('feishu_alerts', '查询错误数超过阈值。');
```

语句返回零行的 `result` 列，不返回投递 ID。语句成功表示 Databend Cloud 已接受消息，不表示已投递。请继续执行第 4 步检查投递状态。

`CALL` 是以下语句的便捷形式：

```sql
SELECT * FROM send_notification('feishu_alerts', '查询错误数超过阈值。');
```

`CALL` 只支持固定的字符串字面量，不支持变量或表达式。消息需要用到变量或表达式时，以及在 `BEGIN ... END` 脚本中，请使用 `SELECT` 形式。`CALL` 在脚本中不可用，原因有两个：

- 脚本编译器会拒绝 `CALL` 语句，并返回错误 `CALL in script is not supported yet`。
- Databend 不会对 `CALL` 的参数求值。`CONCAT(...)` 等表达式或 `:message` 等变量引用会导致语法错误。标识符或 `$name` 会话变量会被当作普通文本发送。

`SELECT` 形式支持任意表达式，包括脚本变量。

## 第 4 步：检查投递状态

查询通知历史：

```sql
SELECT created_on, processed, integration_name, status, error_message
FROM system.notification_history
WHERE integration_name = 'feishu_alerts'
ORDER BY created_on DESC
LIMIT 10;
```

Databend Cloud 完成投递尝试后才会写入该行。Databend Cloud 接受消息时不会写入。新消息可能需要几秒钟才会出现在历史中。如果没有查询到记录，请稍后重试。

`status` 列为 `success` 或 `failure`。当 Webhook 返回 200 到 399 的 HTTP 状态码时，Databend Cloud 记录为 `success`。它不会解析响应体。

:::warning
飞书拒绝消息时会返回 HTTP 200 和业务错误。由于 HTTP 请求成功，Databend 会将此响应记录为 `success`。如果飞书未显示消息，请检查消息和机器人关键词。需要查看 Webhook 响应时，请联系支持人员并提供查询 ID 和时间范围。
:::

通知历史保存原始消息，不保存渲染后的请求体。当前历史视图不显示投递 ID 或查询 ID。联系支持人员时，请提供查询 ID 和时间范围。你可以在 `system_history.query_history` 中或使用 `LAST_QUERY_ID()` 获取查询 ID。

## 在任务中发送通知

使用 `IF` 决定是否发送消息。脚本中请使用 `SELECT` 形式。请将 `monitoring_wh` 替换为现有 Warehouse，并将查询和消息替换为你自己的条件。

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
            CONCAT('最近 10 分钟查询错误数：', TO_STRING(:failed_count))
        );
    END IF;
END;
$$;
```

脚本中引用变量有两种写法：

- 在脚本表达式中（例如 `IF` 条件），直接使用变量名：`failed_count`。
- 在 SQL 语句中（例如 `SELECT`），变量名前需加冒号：`:failed_count`。如果省略冒号，Databend 会将其视为列名，并返回 `column failed_count doesn't exist`。

`system_history.query_history` 需要 Query History 功能。如果该功能不可用，请替换为自己的查询条件。

不要依赖 `LIMIT 0`、`WHERE` 或其他查询优化来阻止发送通知。语句执行时函数会产生副作用。请改用脚本中的 `IF`。

## 限制

- **异步投递：** SQL 成功表示 Databend Cloud 已接受消息。投递可能稍后失败。
- **至少一次投递：** 响应丢失、HTTP 超时或重试都可能产生重复消息。查询 ID 不是幂等键。
- **业务错误不算投递失败：** Databend 检查 HTTP 状态，不检查服务特定的响应码。飞书关键词错误可能显示为 `success`。
- **飞书验证：** 集成不支持飞书签名校验或任意 HTTP 头。请使用自定义关键词方式。
- **需要全局 `SUPER`：** 通知集成没有按集成授予的权限。
- **大小限制：** 消息可以包含 1 到 262,144 个 UTF-8 字节。模板最大为 64 KiB。渲染后的请求体最大为 256 KiB。
- **SQL 不返回投递 ID：** 函数返回零行。请使用通知历史查看最终状态。
- **配置变更：** Databend Cloud 在投递时使用最新的 URL 和模板。删除并重新创建同名集成不会将队列消息转发到新集成。
- **禁用不会暂停队列：** 待处理消息在投递重试耗尽后失败。

## 相关文档

- [CREATE NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/ddl-create-notification)
- [ALTER NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/ddl-alter-notification)
- [DESCRIBE NOTIFICATION INTEGRATION](/sql/sql-commands/ddl/notification/desc-notification)
- [SYSTEM$SEND_NOTIFICATION](/sql/sql-functions/table-functions/send-notification)
