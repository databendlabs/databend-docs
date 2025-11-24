---
title: Vector 自动摄取日志
---

本教程将模拟本地生成日志，借助 [Vector](https://vector.dev/) 收集后写入 S3，并通过定时任务在 Databend Cloud 中自动加载。

![Automating JSON Log Loading with Vector](@site/static/img/documents/tutorials/vector-tutorial.png)

## 开始之前

请准备以下资源：

- **Amazon S3 Bucket**：用于存放 Vector 收集的日志。[了解如何创建 Bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)。
- **AWS 凭证**：具备目标 Bucket 访问权限的 AWS Access Key ID 与 Secret Access Key。[更多信息](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)。
- **AWS CLI**：已安装并配置好访问上述 Bucket 的权限。[下载 AWS CLI](https://aws.amazon.com/cli/)。
- **Docker**：本地安装 [Docker](https://www.docker.com/)，用于运行 Vector。

## 步骤 1：在 S3 Bucket 中创建目标文件夹

为了存放由 Vector 同步的日志，在 Bucket 内创建名为 `logs` 的文件夹。本教程使用 `s3://databend-doc/logs/`。

```bash
aws s3api put-object --bucket databend-doc --key logs/
```

## 步骤 2：创建本地日志文件

通过创建本地文件模拟日志生成。示例路径为 `/Users/eric/Documents/logs/app.log`。

添加以下 JSON 行表示示例事件：

```json title='app.log'
{"user_id": 1, "event": "login", "timestamp": "2024-12-08T10:00:00Z"}
{"user_id": 2, "event": "purchase", "timestamp": "2024-12-08T10:05:00Z"}
```

## 步骤 3：配置并运行 Vector

1. 创建 Vector 配置文件 `vector.yaml`（示例路径 `/Users/eric/Documents/vector.yaml`）：

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

2. 使用 Docker 启动 Vector，并挂载配置文件与日志目录：

```bash
docker run \
  -d \
  -v /Users/eric/Documents/vector.yaml:/etc/vector/vector.yaml:ro \
  -v /Users/eric/Documents/logs:/logs \
  -p 8686:8686 \
  --name vector \
  timberio/vector:nightly-alpine
```

3. 稍等片刻，并检查 `logs` 文件夹是否已有同步文件：

```bash
aws s3 ls s3://databend-doc/logs/
```

若同步成功，输出类似：

```bash
2024-12-10 15:22:13          0
2024-12-10 17:52:42        112 1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz
```

可将文件下载到本地查看：

```bash
aws s3 cp s3://databend-doc/logs/1733871161-7b89e50a-6eb4-4531-8479-dd46981e4674.log.gz ~/Documents/
```

与原始日志相比，同步后的日志是 NDJSON 格式，每条记录被包裹在 `log` 字段内：

```json
{"log":{"event":"login","timestamp":"2024-12-08T10:00:00Z","user_id":1}}
{"log":{"event":"purchase","timestamp":"2024-12-08T10:05:00Z","user_id":2}}
```

## 步骤 4：在 Databend Cloud 创建 Task

1. 打开 Worksheet，创建关联 `logs` 文件夹的 External Stage：

```sql
CREATE STAGE mylog 's3://databend-doc/logs/' CONNECTION=(
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

创建成功后可以列出 Stage 内的文件：

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

3. 创建定时任务，从 Stage 加载日志到 `logs` 表：

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

稍等片刻并查询表，确认日志已写入：

```sql
SELECT * FROM logs;

┌──────────────────────────────────────────────────────────┐
│       event      │      timestamp      │     user_id     │
├──────────────────┼─────────────────────┼─────────────────┤
│ login            │ 2024-12-08 10:00:00 │               1 │
│ purchase         │ 2024-12-08 10:05:00 │               2 │
└──────────────────────────────────────────────────────────┘
```

再次执行 `LIST @mylog;` 会发现 Stage 中已无文件，因为任务设置了 `PURGE = TRUE`，加载完成后会自动删除源文件。

现在在本地 `app.log` 中追加两条日志：

```bash
echo '{"user_id": 3, "event": "logout", "timestamp": "2024-12-08T10:10:00Z"}' >> /Users/eric/Documents/logs/app.log
echo '{"user_id": 4, "event": "login", "timestamp": "2024-12-08T10:15:00Z"}' >> /Users/eric/Documents/logs/app.log
```

等待新文件同步至 S3 后，定时任务会自动加载这些记录。再次查询表即可看到新增日志：

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
