---
title: Amazon SQS (S3) - IAM Role (Beta)
---

本页介绍如何创建 `Amazon SQS (S3) - IAM Role` 数据源。该数据源用于保存访问 Amazon SQS 队列和对应 S3 存储桶所需的配置，适用于消费由 Amazon S3 发送到 SQS 的对象创建事件。

`Amazon SQS (S3) - IAM Role` 只保存 SQS (S3) 接入所需的连接与授权信息，不会直接消费消息。实际读取 SQS 消息、解析 S3 ObjectCreated 事件并写入云平台的操作由 [Amazon SQS (S3) 集成任务](../task/02-sqs-s3.md) 执行。

## 使用场景

- 统一管理 SQS (S3) 接入所需的队列地址、Region、IAM Role 和路径范围
- 消费 S3 `ObjectCreated` 事件，并将对应对象数据写入云平台
- 通过 S3 事件通知驱动数据接入，避免仅依赖轮询 S3 路径发现新文件
- 在 IAM Role、队列地址或路径范围变更后统一更新引用它的任务

## 创建 Amazon SQS (S3) - IAM Role

1. 前往 **Data** > **Data Sources**，点击 **Create Data Source**。
2. 将服务类型选择为 **Amazon SQS (S3) - IAM Role**，然后填写连接信息：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Name** | 是 | 当前数据源的描述性名称 |
| **Queue URL** | 是 | SQS 标准队列 URL，例如 `https://sqs.us-east-1.amazonaws.com/123456789012/my-queue` |
| **Queue Region** | 是 | SQS 队列所在的 AWS Region，例如 `us-east-1`。S3 存储桶必须与 SQS 队列位于同一 Region |
| **Role ARN** | 是 | 用户 AWS 账号中允许云平台 assume 的 IAM Role ARN |
| **External ID** | 是 | 云平台控制台中的组织 ID，用于配置 IAM Role 信任策略 |
| **Bucket** | 是 | 发送 ObjectCreated 事件的 S3 存储桶名称 |
| **Object Key Prefix** | 否 | S3 对象 key 前缀过滤条件，应与 S3 notification filter 保持一致 |
| **Object Key Suffix** | 否 | S3 对象 key 后缀过滤条件，应与 S3 notification filter 保持一致 |

3. 点击 **Test Connectivity** 验证连接；如果测试成功，点击 **OK** 保存数据源。

:::note
SQS (S3) 接入推荐使用 AssumeRole 模式，不需要向云平台提供 AWS Access Key 和 Secret Key。用户只需要在自己的 AWS 账号中创建 IAM Role，并在信任策略中允许云平台角色通过 `sts:AssumeRole` 获取临时凭证。
:::

## AWS 侧配置概览

在创建数据源前，需要先在您的 AWS 账号中完成以下配置：

1. 创建或准备一个 SQS 标准队列。
2. 配置 SQS queue policy，允许指定 S3 存储桶向该队列发送消息。
3. 配置 S3 bucket notification，将 `ObjectCreated` 事件发送到该 SQS 队列。
4. 创建一个 IAM Role，允许云平台角色通过 `sts:AssumeRole` 访问。
5. 为该 IAM Role 绑定 S3 读取权限和 SQS 消费权限。
6. 上传测试对象，确认 S3 能将事件投递到 SQS。

请先准备以下变量。`AWS_REGION` 必须是 S3 存储桶和 SQS 队列所在的同一个 Region；`EXTERNAL_ID` 使用云平台控制台中的组织 ID。

```bash
export AWS_REGION="<bucket-and-sqs-region>"
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

export BUCKET_NAME="<your-bucket-name>"
export BUCKET_ARN="arn:aws:s3:::$BUCKET_NAME"

export QUEUE_NAME="<your-sqs-standard-queue-name>"
export ROLE_NAME="platform-s3-sqs-consumer-role"

export PREFIX="<object-key-prefix>"
export SUFFIX="<object-key-suffix>"

export PLATFORM_SETUP_ROLE_ARN="<platform-setup-role-arn>"
export PLATFORM_LOAD_ROLE_ARN="<platform-load-role-arn>"
export EXTERNAL_ID="<platform-org-id>"
```

:::tip
使用云平台提供的两个角色 ARN：`PLATFORM_SETUP_ROLE_ARN` 对应 **云平台 setup and validation role**，`PLATFORM_LOAD_ROLE_ARN` 对应 **云平台 data loading role**。通常需要在用户 IAM Role 的信任策略中同时信任这两个平台角色。
:::

## 步骤 1：创建或获取 SQS 标准队列

创建 SQS 标准队列：

```bash
aws sqs create-queue \
  --region "$AWS_REGION" \
  --queue-name "$QUEUE_NAME"
```

获取后续配置需要使用的 queue URL 和 queue ARN：

```bash
export QUEUE_URL=$(
  aws sqs get-queue-url \
    --region "$AWS_REGION" \
    --queue-name "$QUEUE_NAME" \
    --query 'QueueUrl' \
    --output text
)

export QUEUE_ARN=$(
  aws sqs get-queue-attributes \
    --region "$AWS_REGION" \
    --queue-url "$QUEUE_URL" \
    --attribute-names QueueArn \
    --query 'Attributes.QueueArn' \
    --output text
)
```

建议一个 SQS (S3) 数据源对应一个专用 SQS 标准队列。不要将同一个队列复用给其他存储桶、其他 prefix / suffix 或其他业务事件。

## 步骤 2：配置 SQS queue policy

修改前先备份当前 SQS 属性：

```bash
aws sqs get-queue-attributes \
  --region "$AWS_REGION" \
  --queue-url "$QUEUE_URL" \
  --attribute-names Policy QueueArn \
  > "sqs-attributes.backup.$(date +%Y%m%d-%H%M%S).json"
```

生成只允许指定 S3 存储桶发送消息的 `queue-policy.json`：

```bash
jq -n \
  --arg policyId "$QUEUE_NAME-policy" \
  --arg queueArn "$QUEUE_ARN" \
  --arg bucketArn "$BUCKET_ARN" \
  --arg accountId "$AWS_ACCOUNT_ID" \
  '{
    Version: "2012-10-17",
    Id: $policyId,
    Statement: [
      {
        Sid: "AllowS3ToSendMessage",
        Effect: "Allow",
        Principal: {
          Service: "s3.amazonaws.com"
        },
        Action: "sqs:SendMessage",
        Resource: $queueArn,
        Condition: {
          ArnLike: {
            "aws:SourceArn": $bucketArn
          },
          StringEquals: {
            "aws:SourceAccount": $accountId
          }
        }
      }
    ]
  }' \
  > queue-policy.json
```

应用 policy：

```bash
jq -n \
  --arg policy "$(jq -c . queue-policy.json)" \
  '{Policy: $policy}' \
  > set-queue-attributes.json

aws sqs set-queue-attributes \
  --region "$AWS_REGION" \
  --queue-url "$QUEUE_URL" \
  --attributes file://set-queue-attributes.json
```

## 步骤 3：配置 S3 bucket notification

修改前先备份当前 bucket notification。`put-bucket-notification-configuration` 会整体替换 bucket notification 配置；如果存储桶已有其他 notification，请先合并后再提交。

```bash
aws s3api get-bucket-notification-configuration \
  --region "$AWS_REGION" \
  --bucket "$BUCKET_NAME" \
  > "bucket-notification.backup.$(date +%Y%m%d-%H%M%S).json"
```

生成 `bucket-notification.json`：

```bash
jq -n \
  --arg id "$QUEUE_NAME" \
  --arg queueArn "$QUEUE_ARN" \
  --arg prefix "$PREFIX" \
  --arg suffix "$SUFFIX" \
  '{
    QueueConfigurations: [
      (
        {
          Id: $id,
          QueueArn: $queueArn,
          Events: [
            "s3:ObjectCreated:*"
          ]
        }
        +
        (
          [
            if $prefix != "" then {Name: "prefix", Value: $prefix} else empty end,
            if $suffix != "" then {Name: "suffix", Value: $suffix} else empty end
          ] as $rules
          | if ($rules | length) > 0
            then {Filter: {Key: {FilterRules: $rules}}}
            else {}
            end
        )
      )
    ]
  }' \
  > bucket-notification.json
```

应用配置：

```bash
aws s3api put-bucket-notification-configuration \
  --region "$AWS_REGION" \
  --bucket "$BUCKET_NAME" \
  --notification-configuration file://bucket-notification.json
```

检查配置：

```bash
aws s3api get-bucket-notification-configuration \
  --region "$AWS_REGION" \
  --bucket "$BUCKET_NAME"
```

确认 `QueueArn` 指向目标 SQS，`Events` 包含 `s3:ObjectCreated:*`，`FilterRules` 与云平台数据源中的 `Object Key Prefix` / `Object Key Suffix` 保持一致。

## 步骤 4：创建供云平台 assume 的 IAM Role

生成 `trust-policy.json`。`ExternalId` 使用云平台控制台中的组织 ID。

```bash
jq -n \
  --arg platformSetupRoleArn "$PLATFORM_SETUP_ROLE_ARN" \
  --arg platformLoadRoleArn "$PLATFORM_LOAD_ROLE_ARN" \
  --arg externalId "$EXTERNAL_ID" \
  '{
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "AllowPlatformSetupAssumeRole",
        Effect: "Allow",
        Principal: {
          AWS: $platformSetupRoleArn
        },
        Action: "sts:AssumeRole",
        Condition: {
          StringEquals: {
            "sts:ExternalId": $externalId
          }
        }
      },
      {
        Sid: "AllowPlatformLoadAssumeRole",
        Effect: "Allow",
        Principal: {
          AWS: $platformLoadRoleArn
        },
        Action: "sts:AssumeRole",
        Condition: {
          StringEquals: {
            "sts:ExternalId": $externalId
          }
        }
      }
    ]
  }' \
  > trust-policy.json
```

创建 IAM Role：

```bash
aws iam create-role \
  --role-name "$ROLE_NAME" \
  --assume-role-policy-document file://trust-policy.json
```

如果 role 已存在，请先备份再更新信任策略：

```bash
aws iam get-role \
  --role-name "$ROLE_NAME" \
  --query 'Role.AssumeRolePolicyDocument' \
  --output json \
  > "trust-policy.backup.$(date +%Y%m%d-%H%M%S).json"

aws iam update-assume-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-document file://trust-policy.json
```

## 步骤 5：绑定 S3/SQS 权限

生成 `permissions-policy.json`：

```bash
jq -n \
  --arg bucketArn "$BUCKET_ARN" \
  --arg objectArn "$BUCKET_ARN/*" \
  --arg queueArn "$QUEUE_ARN" \
  '{
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "S3BucketMetadataAccess",
        Effect: "Allow",
        Action: [
          "s3:GetBucketLocation",
          "s3:ListBucket"
        ],
        Resource: $bucketArn
      },
      {
        Sid: "S3ObjectReadAccess",
        Effect: "Allow",
        Action: [
          "s3:GetObject"
        ],
        Resource: $objectArn
      },
      {
        Sid: "SQSConsumeAccess",
        Effect: "Allow",
        Action: [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:ChangeMessageVisibility"
        ],
        Resource: $queueArn
      }
    ]
  }' \
  > permissions-policy.json
```

应用权限：

```bash
aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name platform-s3-sqs-access \
  --policy-document file://permissions-policy.json
```

权限检查点：

- SQS 权限限定到目标 queue ARN。
- S3 权限限定到目标 bucket 和 object ARN。
- 默认情况下，该 policy 不需要 S3 写入或删除权限。
- 如果后续 SQS (S3) 集成任务会启用 **PURGE** 或 **Clean Up Original Files**，即导入成功后删除源对象，请为目标对象路径额外授予 `s3:DeleteObject` 权限。

## 步骤 6：验证 S3 到 SQS

上传一个匹配 `PREFIX` / `SUFFIX` 的测试对象：

```bash
echo 'a,b' > /tmp/sqs-s3-local-test.csv

aws s3 cp /tmp/sqs-s3-local-test.csv \
  "s3://$BUCKET_NAME/${PREFIX}sqs-s3-local-test-$(date +%s)$SUFFIX" \
  --region "$AWS_REGION"
```

从 SQS 拉取一条消息：

```bash
aws sqs receive-message \
  --region "$AWS_REGION" \
  --queue-url "$QUEUE_URL" \
  --max-number-of-messages 1 \
  --wait-time-seconds 10 \
  --visibility-timeout 60
```

确认消息中包含 `Records`，`eventSource` 为 `aws:s3`，`eventName` 为 `ObjectCreated:*`，并且 `Records[].s3.bucket.name` 和 `Records[].s3.object.key` 与测试对象匹配。

:::note
`receive-message` 不会自动删除消息，但会在 visibility timeout 内临时隐藏消息。如果希望云平台后续继续消费这条测试消息，请不要手动删除，等待 visibility timeout 结束后再测试数据源连通性。
:::

## 提供给云平台的信息

完成 AWS 侧配置后，请在云平台创建数据源时填写：

| 参数 | 说明 |
|------|------|
| `role_arn` | 用户 AWS 账号中允许云平台 assume 的 IAM Role ARN |
| `external_id` | 云平台控制台中的组织 ID |
| `queue_url` | SQS 标准队列 URL |
| `queue_region` | SQS 队列所在 Region |
| `bucket` | S3 存储桶名称 |
| `prefix` / `suffix` | 可选；应与 S3 notification filter 保持一致 |

获取 `role_arn` 的命令示例：

```bash
aws iam get-role \
  --role-name "$ROLE_NAME" \
  --query 'Role.Arn' \
  --output text
```

## 配置要求

- S3 存储桶与 SQS 队列应位于同一个 AWS Region。
- SQS 队列必须是标准队列，不能使用 FIFO queue。
- SQS 队列应专用于一个 S3 notification 规则，不要复用给其他存储桶、其他 prefix / suffix 或其他业务事件。
- S3 notification 的存储桶、prefix 和 suffix 应与云平台数据源配置保持一致。
- `put-bucket-notification-configuration` 会整体替换 bucket notification，修改前必须备份并合并已有配置。
- S3 事件通知和 SQS 标准队列都采用至少一次投递语义，消息可能重复。

## 后续操作

创建完成后，您可以基于该数据源创建 [Amazon SQS (S3) 集成任务](../task/02-sqs-s3.md)。
