---
title: 使用 Vector 自动化加载 JSON 日志
---

在本教程中，我们将模拟本地生成日志，使用 [Vector](https://vector.dev/) 收集日志，将它们存储在 S3 中，并使用计划任务自动化将它们加载到 Databend Cloud 中。

![使用 Vector 自动化加载 JSON 日志](@site/static/img/documents/tutorials/vector-tutorial.png)

## 开始之前

在开始之前，请确保已准备好以下先决条件：

- **Amazon S3 存储桶**：一个 S3 存储桶，用于存储 Vector 收集的日志。[了解如何创建 S3 存储桶](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。
- **AWS 凭证**：具有足够权限访问您的 S3 存储桶的 AWS 访问密钥 ID 和秘密访问密钥。[管理您的 AWS 凭证](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。
- **AWS CLI**：确保已安装并配置了 [AWS CLI](https://aws.amazon.com/cli/)，并具有访问您的 S3 存储桶的必要权限。
- **Docker**：确保在本地机器上安装了 [Docker](https://www.docker.com/)，因为它将用于设置 Vector。

## 步骤 1：在 S3 存储桶中创建目标文件夹

为了存储 Vector 收集的日志，请在您的 S3 存储桶中创建一个名为 `logs` 的文件夹。在本教程中，我们使用 `s3://databend-doc/logs/` 作为目标位置。

此命令在 `databend-doc` 存储桶中创建一个名为 `logs` 的空文件夹：

```bash
aws s3api put-object --bucket databend-doc --key logs/
```

## 步骤 2：创建本地日志文件

通过创建本地日志文件来模拟日志生成。在本教程中，我们使用 `/Users/eric/Documents/logs/app.log` 作为文件路径。

将以下 JSON 行添加到文件中，以表示示例日志事件：

```json title='app.log'
{"user_id": 1, "event": "login", "timestamp": "2024-12-08T10:00:00Z"}
{"user_id": 2, "event": "purchase", "timestamp": "2024-12-08T10:05:00Z"}
```

## 步骤 3：配置并运行 Vector

1. 在本地机器上创建一个名为 `vector.yaml` 的 Vector 配置文件。在本教程中，我们在 `/Users/eric/Documents/vector.yaml` 创建它，内容如下：

```yaml title='vector.yaml'
sources:
  logs:
    type: file
    include:
      - "/logs/app.log"
    read_from: beginning

transforms:
  extract_message:
    type: remap
    inputs:
      - "logs"
    source: |
      . = parse_json(.message) ?? {}

sinks:
  s3:
    type: aws_s3
    inputs:
      - "extract_message"
    bucket: databend-doc
    region: us-east-2
    key_prefix: "logs/" 
    content_type: "text/plain" 
    encoding:
      codec: "native_json" 
    auth:
      access_key_id: "<your-access-key-id>"
      secret_access_key: "<your-secret-access-key>"
```

2. 使用 Docker 启动 Vector，映射配置文件和本地日志目录：

```bash
docker run \
  -d \
  -v /Users/eric/Documents/vector.yaml:/etc/vector/vector.yaml:ro \
  -v /Users/eric/Documents/logs:/logs \
  -p 8686:8686 \
  --name vector \
  timberio/vector:nightly-alpine
```

3. 稍等片刻，然后检查是否有日志已同步到 S3 的 `logs` 文件夹中：

```bash
aws s3 ls s3://databend-doc/logs/
```

如果日志文件已成功同步到 S3，您应该会看到类似以下的输出：

```bash
2024-12-10 15:22:13          0
2024-12-10 17:52:42        112 1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz
```

现在，您可以从存储桶中下载同步的日志文件：

```bash
aws s3 cp s3://databend-doc/logs/1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz ~/Documents/
```

与原始日志相比，同步的日志为 NDJSON 格式，每个记录都包裹在一个外部的 `log` 字段中：

```json
{"log":{"event":"login","timestamp":"2024-12-08T10:00:00Z","user_id":1}}
{"log":{"event":"purchase","timestamp":"2024-12-08T10:05:00Z","user_id":2}}
```

## 步骤 4：在 Databend Cloud 中创建任务

1. 打开一个工作表，并创建一个外部 Stage，链接到存储桶中的 `logs` 文件夹：

```sql
CREATE STAGE mylog 's3://databend-doc/logs/' CONNECTION=(
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

一旦 Stage 成功创建，您可以列出其中的文件：

```sql
LIST @mylog;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                          name                          │  size  │                 md5                │         last_modified         │      creator     │
├────────────────────────────────────────────────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ 1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz │    112 │ "231ddcc590222bfaabd296b151154844" │ 2024-12-10 22:52:42.000 +0000 │ NULL             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

2. 创建一个表，其列映射到日志中的字段：

```sql
CREATE TABLE logs (
    event String,
    timestamp Timestamp,
    user_id Int32
);
```

3. 创建一个计划任务，将日志从外部 Stage 加载到 `logs` 表中：

```sql
CREATE TASK IF NOT EXISTS myvectortask
    WAREHOUSE = 'eric'
    SCHEDULE = 1 MINUTE
    SUSPEND_TASK_AFTER_NUM_FAILURES = 3
AS
COPY INTO logs 
FROM (
    SELECT $1:log:event, $1:log:timestamp, $1:log:user_id
    FROM @mylog/
)
FILE_FORMAT = (TYPE = NDJSON, COMPRESSION = AUTO) 
MAX_FILES = 10000 
PURGE = TRUE;
```

4. 启动任务：

```sql
ALTER TASK myvectortask RESUME;
```

稍等片刻，然后检查日志是否已加载到表中：

```sql
SELECT * FROM logs;

┌──────────────────────────────────────────────────────────┐
│       event      │      timestamp      │     user_id     │
├──────────────────┼─────────────────────┼─────────────────┤
│ login            │ 2024-12-08 10:00:00 │               1 │
│ purchase         │ 2024-12-08 10:05:00 │               2 │
└──────────────────────────────────────────────────────────┘
```

如果您现在运行 `LIST @mylog;`，您将看不到任何文件。这是因为任务配置了 `PURGE = TRUE`，在日志加载后会从 S3 中删除同步的文件。

现在，让我们在本地日志文件 `app.log` 中模拟生成两条新的日志：

```bash
echo '{"user_id": 3, "event": "logout", "timestamp": "2024-12-08T10:10:00Z"}' >> /Users/eric/Documents/logs/app.log
echo '{"user_id": 4, "event": "login", "timestamp": "2024-12-08T10:15:00Z"}' >> /Users/eric/Documents/logs/app.log
```

稍等片刻，等待日志同步到 S3（`logs` 文件夹中应出现一个新文件）。然后，计划任务将把新的日志加载到表中。如果您再次查询表，您将找到这些日志：

```sql
SELECT * FROM logs;

┌──────────────────────────────────────────────────────────┐
│       event      │      timestamp      │     user_id     │
├──────────────────┼─────────────────────┼─────────────────┤
│ logout           │ 2024-12-08 10:10:00 │               3 │
│ login            │ 2024-12-08 10:15:00 │               4 │
│ login            │ 2024-12-08 10:00:00 │               1 │
│ purchase         │ 2024-12-08 10:05:00 │               2 │
└──────────────────────────────────────────────────────────┘
```