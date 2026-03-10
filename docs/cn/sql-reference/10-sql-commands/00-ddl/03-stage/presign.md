---
title: PRESIGN
sidebar_position: 3
---

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