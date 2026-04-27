---
title: FeiShuBot
---

本页介绍如何创建 `FeiShuBot` 数据源。该数据源用于保存飞书机器人地址和消息模板，通常用于任务失败通知等场景。

## 使用场景

- 在任务运行失败时向飞书群发送通知
- 为多个任务复用同一套机器人配置和消息模板
- 统一维护通知入口和通知格式

## 创建 FeiShuBot

1. 前往 **Data** > **Data Sources**，点击 **Create Data Source**。
2. 将服务类型选择为 **FeiShuBot**，然后填写凭据信息：

| 字段            | 是否必填 | 说明                                           |
|---------------|----------|----------------------------------------------|
| **Name**      | 是 | 当前数据源的描述性名称，仅支持由字母、数字和下划线组成的名称 |
| **URL**       | 是 | 自定义飞书机器人地址                                   |
| **Warehouse** | 是 | 创建 `NOTIFICATION INTEGRATION` 所使用的 warehouse |
| **Payload**   | 是 | 消息内容格式 (目前 `Task Error`)                     |
| **Template**  | 是 | 自定义接收消息模板                                    |

3. 点击 **Test Connectivity** 验证凭据；如果测试成功，点击 **OK** 保存数据源。

## 使用方式

`FeiShuBot` 可用于 SQL Task 的 `ERROR_INTEGRATION` 属性，也可在控制台 Task Flow 中通过 **Error Notification** 引用。

### 使用 SQL 设置 Task 属性

设置 Task ERROR_INTEGRATION 参数 (假设 Data Source 名称 `test_1`):

```sql
CREATE TASK my_daily_task
   WAREHOUSE = 'compute_wh'
   SCHEDULE = USING CRON '0 0 9 * * *' 'America/Los_Angeles'
   COMMENT = 'Daily summary task'
   ERROR_INTEGRATION = 'test_1'
AS
   INSERT INTO summary_table SELECT * FROM source_table;
```

### 控制台 Task Flow UI 修改

在创建或修改页面中，将 **Error Notification** 设置为对应的 `FeiShuBot` 数据源即可。

![create datasource feishubot](/img/cloud/dataintegration/create-datasource-feishubot.png)

### 自定义 Task Error 模板内容

默认模板:

```
**[ALERT] {{ .MessageType }} - {{ .TaskName }}**
---
taskId: {{ .TaskId }}
taskName: {{ .TaskName }}
tenantId: {{ .TenantId }}

Messages: {{ range .Messages }}
- runId: {{ .RunId }}
  queryId: {{ .QueryId }}
  error: {{ .ErrorKind }} ({{ .ErrorCode }})
  message: {{ .ErrorMessage }} {{ end }}


---
{{ .Timestamp }}
```

接收到的消息类似:

![feishubo example](/img/cloud/dataintegration/feishubot-example.png)

自定义支持:

- 内容格式为 Markdown
- 语法为 Golang template

涉及变量如下:

```golang
type ErrorIntegrationPayload struct {
        Version      string          `json:"version"`
        MessageId    string          `json:"messageId"`
        MessageType  string          `json:"messageType"`
        Timestamp    time.Time       `json:"timestamp"`
        TenantId     string          `json:"tenantId"`
        TaskName     string          `json:"taskName"`
        TaskId       string          `json:"taskId"`
        RootTaskName string          `json:"rootTaskName"`
        RootTaskId   string          `json:"rootTaskId"`
        Messages     []*ErrorMessage `json:"messages"`
}

type ErrorMessage struct {
        RunId          string     `json:"runId"`
        ScheduledTime  time.Time  `json:"scheduledTime"`
        QueryStartTime *time.Time `json:"queryStartTime"`
        CompletedTime  *time.Time `json:"completedTime"`
        QueryId        string     `json:"queryId"`
        ErrorKind      string     `json:"errorKind"`
        ErrorCode      string     `json:"errorCode"`
        ErrorMessage   string     `json:"errorMessage"`
}
```

## 说明

`FeiShuBot` 属于通知类数据源，不用于将业务数据导入 Databend。
