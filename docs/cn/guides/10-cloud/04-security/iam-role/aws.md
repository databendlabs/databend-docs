---
title: "使用 AWS IAM 角色进行认证"
sidebar_label: "AWS IAM 角色"
toc_max_heading_level: 4
---

<span id="如何使用-iam-角色" />

通过 AWS IAM 角色，Databend Cloud 无需在 Databend 中保存 AWS 访问密钥，即可访问 Amazon S3。您在自己的 AWS 账户中创建角色，并控制该角色可以访问的存储桶、路径和操作。

本指南负责[从存储桶导入数据](/guides/load-data/load/s3)流程中的 **AWS 授权**。完成下方三个 AWS 配置任务后，返回导入教程，统一创建 Connection 和 Stage、验证访问并导入数据。

**任务路径：**[获取 Databend 主体](#步骤-1获取-databend-cloud-主体信息) → [创建只读策略](#s3-permissions) → [创建受信任角色](#步骤-3创建-iam-角色和信任策略) → [连接并验证](#步骤-4创建-connection-和-stage)。

如需使用访问密钥认证，请参阅[配置访问密钥](/guides/load-data/load/s3#access-keys)。

## 工作原理

<div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 144" role="img" aria-labelledby="aws-iam-flow-title" style={{ display: 'block', width: '100%', minWidth: '640px', height: 'auto', fontFamily: 'inherit' }}>
  <title id="aws-iam-flow-title">Databend Cloud 通过 AWS STS 代入您的 IAM 角色，访问已授权的 S3 前缀。</title>
  <defs>
    <marker id="aws-iam-flow-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 6 3 L 0 6 Z" fill="var(--color-primary)" />
    </marker>
  </defs>
  <g fill="var(--color-fill-0)" stroke="var(--color-border)">
    <rect x="8" y="28" width="162" height="88" rx="10" />
    <rect x="201" y="28" width="162" height="88" rx="10" />
    <rect x="394" y="28" width="162" height="88" rx="10" />
    <rect x="587" y="28" width="162" height="88" rx="10" />
  </g>
  <g fill="none" stroke="var(--color-primary)" strokeWidth="2" markerEnd="url(#aws-iam-flow-arrow)">
    <path d="M 172 72 H 197" />
    <path d="M 365 72 H 390" />
    <path d="M 558 72 H 583" />
  </g>
  <g textAnchor="middle" fill="var(--color-text-0)" fontSize="14" fontWeight="600">
    <text x="89" y="65">Databend Cloud</text>
    <text x="282" y="65">AWS STS</text>
    <text x="475" y="65">您的 IAM 角色</text>
    <text x="668" y="65">S3 存储桶</text>
  </g>
  <g textAnchor="middle" fill="var(--color-text-1)" fontSize="11.5">
    <text x="89" y="88">组织对应的主体</text>
    <text x="282" y="88">AssumeRole</text>
    <text x="475" y="88">您自己的 AWS 账户</text>
    <text x="668" y="88">已授权的前缀</text>
  </g>
</svg>
</div>

访问由两种策略控制：

- **信任策略**：指定哪个 Databend Cloud 主体可以代入您的角色。`sts:ExternalId` 条件用于检查请求携带的外部 ID。
- **权限策略**：指定角色可以访问的 S3 资源和执行的操作。

Databend Cloud 通过 AWS STS 获取角色的临时凭证。Databend 访问 S3 时，AWS 会检查角色权限。此方式不需要创建 IAM 用户，也不需要提供访问密钥。

## 准备工作

准备一个 Databend Cloud 组织，以及创建 IAM 策略和角色的 AWS 权限。如无此权限，请让 AWS 管理员执行 AWS 侧的配置任务。

本指南与导入教程使用相同的示例位置：`us-east-2` 区域的 `s3://databend-toronto/load/`。请将存储桶、前缀和区域替换为您的实际配置。如果尚未准备存储桶和示例文件，请先完成[准备 S3 数据](/guides/load-data/load/s3#prepare-s3-data)。

:::note
本指南介绍通过 Connection 和 Stage 进行 SQL 访问。[Amazon SQS (S3) 数据源](/guides/cloud/data-integration/datasource/sqs-s3)使用独立的配置流程。请先核对 SQL 连接的要求，不要直接复用该数据源的平台角色 ARN 或外部 ID。
:::

## 获取 Databend Cloud 主体信息 {/* #步骤-1获取-databend-cloud-主体信息 */}

在 Databend Cloud 控制台中，选择需要访问 S3 数据的组织。在组织概览页打开**连接 → 连接信息**，复制 **Role ARN**。

为此 SQL 连接选择一个唯一的外部 ID。在 AWS 信任策略和 Databend Connection 中使用相同的值。如果支持团队已为您的配置提供外部 ID，请使用该值。

标准配置流程不需要 Databend Cloud 支持团队进行人工认证或审批。您需要在自己的 AWS 账户中配置权限和信任策略。

如果未显示 **Role ARN**，请提交[支持工单](/guides/cloud/overview/support#获取支持)。让支持团队确认您的组织是否支持角色访问，并提供正确的主体 ARN。不要根据 DSN 拼接 ARN，也不要复制其他组织的 ARN。

| 配置值 | 含义与来源 | 使用位置 |
|--------|------------|----------|
| Databend Cloud 主体 ARN | 标识请求代入您角色的 AWS 身份。从 Databend Cloud **连接**对话框中复制 **Role ARN**。 | 信任策略中的 `Principal.AWS`：**谁可以代入角色** |
| 外部 ID | Databend 代入角色时需要校验的附加值。使用为此 SQL 连接选择的唯一值，或支持团队提供的值。 | 信任策略中的 `sts:ExternalId` 和 Connection 中的 `EXTERNAL_ID`：**请求必须携带匹配的值** |
| 您的 IAM 角色 ARN | 标识 Databend 要代入并使用其权限的角色。在[创建 IAM 角色](#步骤-3创建-iam-角色和信任策略)任务中创建后，从 AWS 角色详情页复制 ARN。 | Connection 中的 `ROLE_ARN`：**要代入哪个角色** |
| 存储桶、前缀和区域 | 标识数据位置。本例中，`databend-toronto` 是存储桶，`load/` 是对象键前缀，`us-east-2` 是存储桶所在的 AWS 区域。可在 S3 控制台查看这些值。 | 存储桶和前缀用于权限策略与 Stage URL，区域用于 Connection：**访问哪些数据，以及数据存放在哪里** |

:::warning
Databend Cloud 主体 ARN 与您的 IAM 角色 ARN 是两个不同的值。信任策略信任 Databend Cloud 主体。Connection 使用的是**您自己的 AWS 账户中的角色**。

执行 SQL 或保存策略前，请替换所有示例值。不要将 `my-external-id-123` 用作生产环境的外部 ID。
:::

### 理解和配置外部 ID {/* #external-id */}

外部 ID（External ID）是调用 AWS STS `AssumeRole` 时携带的字符串。本指南以 `my-external-id-123` 为例。它不是 AWS 账户 ID、角色 ID 或访问密钥。AWS 不会在创建角色时自动生成此值。如果需要为此 SQL 连接选择新值，可以使用随机 UUID。

信任策略通过此值，限制受信任主体可以在什么上下文中代入角色，有助于防范[混淆代理人问题](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html)。AWS 不将外部 ID 视为秘密信息。它不是登录凭证，也不会单独授予 S3 权限。

#### 在 AWS 中查看外部 ID {/* #view-external-id */}

进入 **IAM → 角色 → 您的角色 → 信任关系**，在信任策略中查找 `Condition.StringEquals["sts:ExternalId"]`。选择 **编辑信任策略** 可添加或修改此值。不需要单独创建“外部 ID”资源。如果信任策略中没有 `sts:ExternalId` 条件，表示尚未配置外部 ID 校验。

下表假设其他 AWS 授权检查均通过，且没有其他信任策略语句允许绕过该条件代入角色：

| 信任策略 | Databend Connection | 新的 `AssumeRole` 请求结果 |
|----------|---------------------|---------------------------|
| 没有外部 ID 条件 | 不填写 `EXTERNAL_ID` | 可以成功，但不会执行外部 ID 校验。 |
| 没有外部 ID 条件 | 填写 `EXTERNAL_ID` | 可以成功，但仅传入此值不会启用外部 ID 校验。 |
| 要求 `my-external-id-123` | `EXTERNAL_ID = 'my-external-id-123'` | 可以成功，两边的值匹配。 |
| 要求 `my-external-id-123` | 不填写 `EXTERNAL_ID`，或填写不同的值 | 返回 `AccessDenied`。 |

在 Connection 中填写 `EXTERNAL_ID` 只是向 AWS 传入此值，不会自动添加或修改 AWS 信任策略中的条件。

#### 创建角色后添加或修改外部 ID {/* #update-external-id */}

无需重建 IAM 角色。修改角色的信任策略，并在 Databend Connection 中配置相同的值。已有 Stage 通常保留旧 Connection 参数的副本，因此还需使用新 Connection 参数重新创建受影响的 Stage。请协调两侧的修改，避免请求失败。详情请参阅[维护或移除访问权限](#maintain-or-remove-access)。

本指南建议从一开始就配置外部 ID 条件。后续添加该条件，不会使 AWS STS 已签发的临时凭证立即失效。

## 创建 S3 权限策略 {/* #s3-permissions */}

在 [AWS IAM 控制台](https://console.aws.amazon.com/iam/)中，进入**策略 → 创建策略 → JSON**。

将以下策略粘贴到编辑器中。将 `databend-toronto` 和 `load/` 替换为您的存储桶和前缀。将策略保存为 `databend-docs-s3-read`。

此策略仅允许列出并读取 `s3://databend-toronto/load/` 下的对象，不允许写入或删除。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GetBucketRegion",
      "Effect": "Allow",
      "Action": "s3:GetBucketLocation",
      "Resource": "arn:aws:s3:::databend-toronto"
    },
    {
      "Sid": "ListLoadPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::databend-toronto",
      "Condition": {
        "StringLike": {
          "s3:prefix": ["load/", "load/*"]
        }
      }
    },
    {
      "Sid": "ReadLoadObjects",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::databend-toronto/load/*"
    }
  ]
}
```

存储桶 ARN 和对象 ARN 的用途不同。`s3:ListBucket` 使用存储桶 ARN。`s3:GetObject` 使用包含前缀和 `/*` 的对象 ARN。

下图为简体中文 AWS 控制台，使用的是独立测试存储桶。请在策略中填写您自己的存储桶名称。

![简体中文 AWS IAM 策略编辑器，配置限定前缀的 S3 只读策略](/img/cloud/iam/aws/cn/create-policy.png)

## 创建 IAM 角色和信任策略 {/* #步骤-3创建-iam-角色和信任策略 */}

### 配置信任关系

在 IAM 控制台中，进入**角色 → 创建角色 → 自定义信任策略**。

![在 AWS IAM 角色向导中选择自定义信任策略](/img/cloud/iam/aws/cn/select-trusted-entity.png)

粘贴以下信任策略。将 `<databend-cloud-principal-arn>` 替换为 Databend Cloud 主体 ARN。将 `my-external-id-123` 替换为您选择的外部 ID。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "<databend-cloud-principal-arn>"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "my-external-id-123"
        }
      }
    }
  ]
}
```

截图中的主体已遮盖。请使用您组织对应的主体 ARN 和您自己的外部 ID。

![在信任策略编辑器中配置 Databend 主体和外部 ID](/img/cloud/iam/aws/cn/trust-policy.png)

### 附加只读策略

使用以下配置完成角色创建向导：

| 配置项 | 值 |
|--------|----|
| 可信实体类型 | **自定义信任策略** |
| 权限策略 | `databend-docs-s3-read` |
| 角色名称 | `databend-docs-s3-role` |

本教程仅需附加专用的只读策略。

![仅附加专用的 S3 只读策略](/img/cloud/iam/aws/cn/attach-policy.png)

### 复制您的角色 ARN

创建角色后，从详情页复制 **ARN**。例如：`arn:aws:iam::987654321987:role/databend-docs-s3-role`。

检查**权限**和**信任关系**选项卡。角色应附加 S3 只读策略，并通过匹配的外部 ID 信任 Databend Cloud 主体。不要将 `Principal` 设为 `*`。信任策略允许代入角色，但不能替代 S3 权限策略。

截图中的账户 ID 已遮盖。请从您自己的 AWS 控制台复制完整 ARN。

![在角色详情页查找客户角色 ARN 和已附加的策略](/img/cloud/iam/aws/cn/role-details.png)

## 在 Databend 中使用角色 {/* #步骤-4创建-connection-和-stage */}

AWS 侧配置已完成。接下来请在导入教程中[创建 Connection 和 Stage](/guides/load-data/load/s3#connect-to-s3)，并选择其中的 **IAM 角色**选项卡。

使用本指南中准备的值：

| Databend 配置项 | 值 |
|----------------|----|
| `ROLE_ARN` | 您刚创建的客户角色 ARN |
| `EXTERNAL_ID` | 角色信任策略中 `sts:ExternalId` 的值 |
| `REGION` | 存储桶所在的 AWS 区域 |
| Stage URL | 权限策略允许的存储桶和前缀，例如 `s3://databend-toronto/load/` |

### 验证访问并导入数据 {/* #步骤-5验证访问并导入数据 */}

<span id="列出文件" />
<span id="读取测试文件" />
<span id="导入测试文件" />

导入前，请先[验证 S3 访问](/guides/load-data/load/s3#verify-s3-access)。`LIST` 应显示 `books.parquet`，读取文件应返回两条示例记录。仅列举成功不能证明具备对象读取或 KMS 解密权限。

然后继续[导入示例数据](/guides/load-data/load/s3#load-sample-data)。目标表应包含两行数据。请保持 `PURGE = FALSE`，以保留源对象。

导入教程提供两种认证方式共用的 SQL。无需为每篇指南分别创建 Connection、Stage 或表。

## 附加权限 {/* #additional-permissions */}

仅在工作负载需要时添加权限。请将对象权限限制在所需前缀内。

| 操作 | 所需的附加 AWS 权限 |
|------|--------------------|
| 使用 `COPY INTO <location>` 将数据导出到 S3 | `s3:PutObject`；大文件分段上传还可能需要 `s3:AbortMultipartUpload` 和 `s3:ListMultipartUploadParts` |
| 使用 `PURGE = TRUE` 或 `REMOVE` 删除源文件 | `s3:DeleteObject` |
| 读取使用客户管理的 AWS KMS 密钥加密的对象 | 该密钥的 `kms:Decrypt` 权限；KMS 密钥策略也必须允许访问 |
| 写入使用客户管理的 AWS KMS 密钥加密的对象 | `kms:GenerateDataKey`；分段上传还需要 `kms:Decrypt`；KMS 密钥策略也必须允许访问 |

运行只读示例时，请保持 `PURGE` 关闭。不要仅为解决访问错误就授予 `s3:*` 或 `s3:*Object`。

:::note
这些 ARN 示例使用 AWS 商业分区（`arn:aws`）。将控制台语言切换为中文不会改变 AWS 分区。AWS 中国使用 `arn:aws-cn`，并需要兼容的部署和信任配置。配置跨分区访问前，请向 Databend Cloud 支持团队确认您的部署是否支持。
:::

## 故障排查 {/* #troubleshooting */}

<span id="故障排查" />

| 现象 | 检查项 |
|------|--------|
| `AssumeRole` 失败，或 STS 返回 `AccessDenied` | `ROLE_ARN` 应填写您的角色 ARN。检查信任策略是否包含准确的 Databend Cloud 主体 ARN。检查 `EXTERNAL_ID` 是否与 `sts:ExternalId` 一致。完成上述检查后如果仍然报错，再请支持团队检查 Databend 侧的 `sts:AssumeRole` 权限。 |
| 保存信任策略时 AWS 提示主体无效 | 将主体占位符替换为 Databend Cloud **连接**对话框中的 **Role ARN**。检查完整 ARN，包括角色路径和 AWS 分区。 |
| `LIST` 返回 `AccessDenied` | 检查 `s3:ListBucket`、存储桶 ARN 和 `s3:prefix` 条件。检查存储桶策略、组织策略、权限边界和端点策略是否存在显式拒绝。 |
| `LIST` 成功，但读取文件失败 | 检查对象 ARN 的 `s3:GetObject` 权限。对于 KMS 加密数据，还需检查 `kms:Decrypt` 和 KMS 密钥策略。 |
| 未显示任何文件 | 检查存储桶、Stage 前缀和对象键。请将 `books.parquet` 上传到 `load/books.parquet`，而不是存储桶根目录。 |
| 出现端点或区域错误 | 将 `REGION` 设为存储桶所在的 AWS 区域。单独检查网络限制。IAM 授权不会提供私有网络连接。 |
| Databend 提示 SQL 权限不足 | 检查当前 Databend 角色。AWS 权限不会授予 Databend 权限。其他用户需要相应的 Stage 和表权限。 |
| 策略修改未立即生效 | 等待 AWS IAM 变更传播后重试。 |

## 维护或移除访问权限 {/* #maintain-or-remove-access */}

<span id="维护或移除访问权限" />

- 添加存储桶、修改前缀或启用写入时，请检查两种策略。
- Stage 通常会在创建时复制 Connection 参数。替换 Connection 不会更新这些已保存的参数。如需修改已有 Stage 的角色 ARN 或外部 ID，请使用新的 Connection 参数重新创建 Stage。详情请参阅 [CREATE CONNECTION](/sql/sql-commands/ddl/connection/create-connection)。
- 如需撤销 AWS 访问权限，请移除相应的权限或信任关系。不要认为删除 Connection 就会撤销已有 Stage 的访问权限。代入角色使用临时凭证，因此仅修改信任策略不会使 STS 已签发的凭证失效。详情请参阅[撤销 IAM 角色临时安全凭证](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html)。

Databend 测试对象请按导入教程的[清理资源](/guides/load-data/load/s3#cleanup)部分移除。这些 SQL 命令不会删除 S3 对象或 AWS IAM 资源。不再需要测试专用的 AWS 角色和策略时，请单独清理。
