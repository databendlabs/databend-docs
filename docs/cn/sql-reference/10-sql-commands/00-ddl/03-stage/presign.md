---
title: PRESIGN
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.951"/>

通过您提供的 stage 名称和文件路径，为此 stage 文件生成预签名 URL。您可以通过预签名 URL，通过 Web 浏览器或 API 请求访问该文件。

:::tip
当使用 cURL 与非 S3 兼容的存储交互时，请记住包含由 PRESIGN 命令生成的 headers，以确保安全地上传或下载文件。例如，

```bash
curl -H "<header-generated-by-presign>" -o books.csv <presigned-url>

curl -X PUT -T books.csv -H "<header-generated-by-presign>" <presigned-url>
```
:::

参见：

- [LIST STAGE FILES](04-ddl-list-stage.md)：列出 stage 中的文件。
- [REMOVE STAGE FILES](05-ddl-remove-stage.md)：从 stage 中删除文件。

## 语法

```sql
PRESIGN [ { DOWNLOAD | UPLOAD }] @<stage_name>/.../<file_name> [ EXPIRE = <expire_in_seconds> ]
```
其中：

`[ { DOWNLOAD | UPLOAD }]`: 指定预签名 URL 用于下载还是上传。默认值为 `DOWNLOAD`。

`[ EXPIRE = <expire_in_seconds> ]`: 指定预签名 URL 过期的时间长度（以秒为单位）。默认值为 3,600 秒。

## 使用 Workload Identity 的 Azure Blob 内部 Stage

从 v1.2.951 开始，`PRESIGN` 可为使用 Azure Workload Identity 的 Azure Blob 内部 Stage 或用户 Stage 生成单 Blob 的 User Delegation SAS。此回退仅在以下条件同时满足时适用：Stage Operator 无法预签名、内部存储为 Azblob、未配置 Account Key，并且 Workload Identity 可用。

外部 Stage 不使用此回退。其他存储类型和现有 Operator 预签名路径（包括配置了 SAS 凭据的情况）保持原有行为。此功能不会为无法预签名的 Operator 添加 Account Key 回退。

### 身份和 Azure 权限

为 Query 服务配置 Azure Workload Identity 环境：

| 变量 | 要求 |
|----------|-------------|
| `AZURE_CLIENT_ID` | 必填；非空 Client ID。 |
| `AZURE_TENANT_ID` | 必填；非空 Tenant ID。 |
| `AZURE_FEDERATED_TOKEN_FILE` | 必填；可读取的联合令牌文件。 |
| `AZURE_AUTHORITY_HOST` | 可选；默认为 `https://login.microsoftonline.com/`。 |

Query 身份需要在存储账户范围获取用户委托密钥的权限。例如，在存储账户上分配 `Storage Blob Delegator`，并同时保留容器上的数据角色。SAS 的有效访问权限是签名权限与身份数据权限的交集。仅有 Delegator 角色并不授予 Blob 数据访问权限。

### 有效期和请求 Header

此回退要求 `EXPIRE` 在 `1` 至 `604800` 秒之间。接受 `EXPIRE = 604800`，但为容忍时钟偏差，有效期最多为七天减五分钟（`604500` 秒）。SAS 也不能晚于其委托密钥过期。此上限不改变其他存储后端的有效期规则。

| 操作 | 方法 | SAS 权限 | 返回的 Header |
|-----------|--------|-----------------|------------------|
| `DOWNLOAD` | `GET` | `sp=r` | 此回退不添加额外 Header。 |
| `UPLOAD` | `PUT` | `sp=cw` | `x-ms-blob-type: BlockBlob`；若预签名时提供了内容类型，还包含 `content-type`。 |

SAS 只针对单个 Blob（`sr=b`），且仅允许 HTTPS（`spr=https`）。使用 URL 时必须包含所有返回的 Header。请将 URL 视为凭据，不要公开或写入共享日志。

例如，部署已使用 Azure 内部存储，并具备所需身份和角色时：

```sql
CREATE STAGE azure_internal;
PRESIGN UPLOAD @azure_internal/books.csv EXPIRE = 3600;
```

使用返回的上传 URL 和 Header。下面示例包含必需的 Blob 类型 Header；还应添加 `PRESIGN` 返回的其他 Header：

```bash
curl --fail -X PUT -T books.csv \
  -H 'x-ms-blob-type: BlockBlob' \
  '<presigned-url>'
```

```sql
PRESIGN DOWNLOAD @azure_internal/books.csv EXPIRE = 3600;
```

### 故障排查

- `storage doesn't support presign operation`：检查是否为 Azblob 内部/用户 Stage、是否未配置 Account Key，以及所需 Workload Identity 变量是否齐全。外部 Stage 不符合条件。
- `StoragePermissionDenied`：检查身份联合、账户范围的委托权限和容器数据角色。Entra 诊断可能包含 `error`、`error_codes` 和 `trace_id`。
- Token/Key 服务返回 HTTP `429` 或 `5xx` 时，会映射为 `StorageOther`，而不是权限拒绝。请排查限流或服务可用性，不要直接认定为 RBAC 失败。
- 已有签名 URL 但上传失败：包含返回的 `x-ms-blob-type` 和其他 Header。检查身份的数据角色是否允许创建或覆盖该 Blob。

## 示例

### 生成和使用用于下载的预签名 URL

此示例生成用于下载 stage `my-stage` 上的文件 `books.csv` 的预签名 URL：

```sql
PRESIGN @my_stage/books.csv
+--------+---------+---------------------------------------------------------------------------------+
| method | headers | url                                                                             |
+--------+---------+---------------------------------------------------------------------------------+
| GET    | {}      | https://example.s3.amazonaws.com/books.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&... |
+--------+---------+---------------------------------------------------------------------------------+
```

此示例的功能与前一个示例相同：

```sql
PRESIGN DOWNLOAD @my_stage/books.csv
```

要使用预签名 URL 下载文件并将其另存为 `books.csv`，请执行以下命令：

```bash
curl <presigned-url> -o books.csv
```

此示例生成在 7,200 秒（2 小时）后过期的预签名 URL：

```sql
PRESIGN @my_stage/books.csv EXPIRE = 7200
```

### 生成和使用用于上传的预签名 URL

此示例生成用于将文件作为 `books.csv` 上传到 stage `my_stage` 的预签名 URL：

```sql
PRESIGN UPLOAD @my_stage/books.csv
```

要使用预签名 URL 上传文件 `books.csv`，请执行以下命令：

```bash
curl -X PUT -T books.csv <presigned-url>
```