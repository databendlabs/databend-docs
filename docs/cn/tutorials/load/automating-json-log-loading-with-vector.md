---
title: 使用 Vector 自动化 JSON 日志加载
---

在本教程中，我们将模拟在本地生成日志，使用 [Vector](https://vector.dev/) 收集它们，将它们存储在 S3 中，并使用计划任务自动将它们导入到 Databend Cloud 中。

![使用 Vector 自动化 JSON 日志加载](@site/static/img/documents/tutorials/vector-tutorial.png)

## 开始之前

在开始之前，请确保您已准备好以下先决条件：

- **Amazon S3 Bucket**: 一个 S3 bucket，用于存储 Vector 收集的日志。[了解如何创建 S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。
- **AWS 凭证**: AWS Access Key ID 和 Secret Access Key，具有访问您的 S3 bucket 的足够权限。[管理您的 AWS 凭证](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。
- **AWS CLI**: 确保已安装 [AWS CLI](https://aws.amazon.com/cli/) 并配置了访问您的 S3 bucket 的必要权限。
- **Docker**: 确保您的本地机器上已安装 [Docker](https://www.docker.com/)，因为它将用于设置 Vector。

## 步骤 1：在 S3 Bucket 中创建目标文件夹

要存储 Vector 收集的日志，请在您的 S3 bucket 中创建一个名为 logs 的文件夹。在本教程中，我们使用 `s3://databend-doc/logs/` 作为目标位置。

此命令在 `databend-doc` bucket 中创建一个名为 `logs` 的空文件夹：

```bash
aws s3api put-object --bucket databend-doc --key logs/
```

## 步骤 2：创建本地日志文件

通过创建本地日志文件来模拟日志生成。在本教程中，我们使用 `/Users/eric/Documents/logs/app.log` 作为文件路径。

将以下 JSON 行添加到文件中以表示示例日志事件：

```json title='app.log'
{"user_id": 1, "event": "login", "timestamp": "2024-12-08T10:00:00Z"}
{"user_id": 2, "event": "purchase", "timestamp": "2024-12-08T10:05:00Z"}
```

## 步骤 3：配置并运行 Vector

1. 在您的本地机器上创建一个名为 `vector.yaml` 的 Vector 配置文件。在本教程中，我们在 `/Users/eric/Documents/vector.yaml` 中创建它，内容如下：

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

3. 稍等片刻，然后检查是否有任何日志已同步到 S3 上的 `logs` 文件夹：

```bash
aws s3 ls s3://databend-doc/logs/
```

如果日志文件已成功同步到 S3，您应该看到类似于以下的输出：

```bash
2024-12-10 15:22:13          0
2024-12-10 17:52:42        112 1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz
```

您现在可以从您的 bucket 下载同步的日志文件：

```bash
aws s3 cp s3://databend-doc/logs/1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz ~/Documents/
```

与原始日志相比，同步的日志采用 NDJSON 格式，每个记录都包装在一个外部 `log` 字段中：

```json
{"log":{"event":"login","timestamp":"2024-12-08T10:00:00Z","user_id":1}}
{"log":{"event":"purchase","timestamp":"2024-12-08T10:05:00Z","user_id":2}}
```

## 步骤 4：在 Databend Cloud 中创建任务

1. 打开一个 worksheet，并创建一个外部 Stage，链接到您的 bucket 中的 `logs` 文件夹：

```sql
CREATE STAGE mylog 's3://databend-doc/logs/' CONNECTION=(
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

成功创建 Stage 后，您可以列出其中的文件：

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

如果您现在运行 `LIST @mylog;`，您将看不到任何列出的文件。这是因为该任务配置为 `PURGE = TRUE`，这会在加载日志后从 S3 中删除同步的文件。

现在，让我们模拟在本地日志文件 `app.log` 中生成另外两个日志：

```bash
echo '{"user_id": 3, "event": "logout", "timestamp": "2024-12-08T10:10:00Z"}' >> /Users/eric/Documents/logs/app.log
echo '{"user_id": 4, "event": "login", "timestamp": "2024-12-08T10:15:00Z"}' >> /Users/eric/Documents/logs/app.log
```

稍等片刻，让日志同步到 S3（新文件应出现在 `logs` 文件夹中）。然后，计划任务会将新日志加载到表中。如果您再次查询该表，您将找到这些日志：

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
