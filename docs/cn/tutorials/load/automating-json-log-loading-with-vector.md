---
title: 自动导入 JSON 日志
---

在本教程中，我们将模拟在本地生成日志，使用 [Vector](https://vector.dev/) 收集日志，将其存储到 S3，并通过定时任务自动将其摄取到 Databend Cloud。

![使用 Vector 自动加载 JSON 日志](@site/static/img/documents/tutorials/vector-tutorial.png)

## 准备工作

开始前，请确保已准备好以下先决条件：

- **Amazon S3 存储桶**：用于存放 Vector 收集的日志。 [了解如何创建 S3 存储桶](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。
- **AWS 凭证**：具备访问 S3 存储桶权限的 AWS Access Key ID 和 Secret Access Key。 [管理 AWS 凭证](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。
- **AWS CLI**：确保已安装 [AWS CLI](https://aws.amazon.com/cli/) 并配置好访问 S3 存储桶所需的权限。
- **Docker**：确保本地已安装 [Docker](https://www.docker.com/)，用于部署 Vector。

## 第一步：在 S3 存储桶中创建目标文件夹

为存放 Vector 收集的日志，请在 S3 存储桶中创建一个名为 logs 的文件夹。本教程使用 `s3://databend-doc/logs/` 作为目标路径。

以下命令在 databend-doc 存储桶中创建名为 logs 的空文件夹：

```bash
aws s3api put-object --bucket databend-doc --key logs/
```

## 第二步：创建本地日志文件

通过创建本地日志文件来模拟日志生成。本教程使用 `/Users/eric/Documents/logs/app.log` 作为文件路径。

将以下 JSON 行添加到文件中，作为示例日志事件：

```json title='app.log'
{"user_id": 1, "event": "login", "timestamp": "2024-12-08T10:00:00Z"}
{"user_id": 2, "event": "purchase", "timestamp": "2024-12-08T10:05:00Z"}
```

## 第三步：配置并运行 Vector

1. 在本地创建名为 `vector.yaml` 的 Vector 配置文件。本教程将其放在 `/Users/eric/Documents/vector.yaml`，内容如下：

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

2. 使用 Docker 启动 Vector，并映射配置文件和本地日志目录：

```bash
docker run \
  -d \
  -v /Users/eric/Documents/vector.yaml:/etc/vector/vector.yaml:ro \
  -v /Users/eric/Documents/logs:/logs \
  -p 8686:8686 \
  --name vector \
  timberio/vector:nightly-alpine
```

3. 稍等片刻，然后检查日志是否已同步到 S3 的 logs 文件夹：

```bash
aws s3 ls s3://databend-doc/logs/
```

若日志文件已成功同步到 S3，将看到类似以下输出：

```bash
2024-12-10 15:22:13          0
2024-12-10 17:52:42        112 1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz
```

现在可从存储桶下载已同步的日志文件：

```bash
aws s3 cp s3://databend-doc/logs/1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz ~/Documents/
```

与原始日志相比，同步后的日志为 NDJSON 格式，每条记录被包裹在外层 `log` 字段中：

```json
{"log":{"event":"login","timestamp":"2024-12-08T10:00:00Z","user_id":1}}
{"log":{"event":"purchase","timestamp":"2024-12-08T10:05:00Z","user_id":2}}
```

## 第四步：在 Databend Cloud 中创建任务

1. 打开工作表，创建一个指向存储桶中 logs 文件夹的外部 Stage：

```sql
CREATE STAGE mylog 's3://databend-doc/logs/' CONNECTION=(
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

Stage 创建成功后，可列出其中的文件：

```sql
LIST @mylog;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                          name                          │  size  │                 md5                │         last_modified         │      creator     │
├────────────────────────────────────────────────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ 1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz │    112 │ "231ddcc590222bfaabd296b151154844" │ 2024-12-10 22:52:42.000 +0000 │ NULL             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

2. 创建与日志字段对应的表：

```sql
CREATE TABLE logs (
    event String,
    timestamp Timestamp,
    user_id Int32
);
```

3. 创建定时任务，将日志从外部 Stage 加载到 logs 表：

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

稍等片刻，检查日志是否已加载到表中：

```sql
SELECT * FROM logs;

┌──────────────────────────────────────────────────────────┐
│       event      │      timestamp      │     user_id     │
├──────────────────┼─────────────────────┼─────────────────┤
│ login            │ 2024-12-08 10:00:00 │               1 │
│ purchase         │ 2024-12-08 10:05:00 │               2 │
└──────────────────────────────────────────────────────────┘
```

此时若运行 `LIST @mylog;`，将看不到任何文件。这是因为任务配置了 `PURGE = TRUE`，加载日志后会从 S3 删除已同步的文件。

现在，让我们在本地日志文件 `app.log` 中再模拟生成两条日志：

```bash
echo '{"user_id": 3, "event": "logout", "timestamp": "2024-12-08T10:10:00Z"}' >> /Users/eric/Documents/logs/app.log
echo '{"user_id": 4, "event": "login", "timestamp": "2024-12-08T10:15:00Z"}' >> /Users/eric/Documents/logs/app.log
```

稍等片刻，日志将同步到 S3（logs 文件夹中会出现新文件）。随后定时任务会把新日志加载到表中。再次查询表，即可看到这些日志：

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