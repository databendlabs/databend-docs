---
title: 上传到 Stage
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 推荐两种文件上传到 Stage 的方法：[PRESIGN](/sql/sql-commands/ddl/stage/presign) 和 PUT/GET 命令。这些方法使得客户端与您的存储之间可以直接进行数据传输，无需中介，通过减少 Databend 与您的存储之间的流量，从而节省成本。

![Alt text](@site/docs/public/img/load/staging-file.png)

PRESIGN 方法生成一个带有签名的限时 URL，客户端可以使用这个 URL 安全地启动文件上传。这个 URL 授予对指定 Stage 的临时访问权限，允许客户端直接传输数据，而不依赖于 Databend 服务器完成整个过程，提高了安全性和效率。

如果您使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 来管理 Stage 中的文件，您可以使用 PUT 命令上传文件和 GET 命令下载文件。

- GET 命令目前只能下载 Stage 中的所有文件，不能下载单个文件。
- 这些命令仅限于 BendSQL 使用，当 Databend 使用文件系统作为存储后端时，GET 命令将不起作用。

### 使用预签名 URL 上传

以下示例演示了如何使用预签名 URL 将示例文件（[books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)）上传到用户 Stage、内部 Stage 和外部 Stage。

<Tabs groupId="presign">

<TabItem value="user" label="上传到用户 Stage">

```sql
PRESIGN UPLOAD @~/books.parquet;
```

结果:

```
┌────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 名称   │ 值                                                                                                                │
├────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 方法   │ PUT                                                                                                                │
│ 头部   │ {"host":"s3.us-east-2.amazonaws.com"}                                                                              │
│ url    │ https://s3.us-east-2.amazonaws.com/databend-toronto/stage/user/root/books.parquet?X-Amz-Algorithm...               │
└────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```shell
curl -X PUT -T books.parquet "https://s3.us-east-2.amazonaws.com/databend-toronto/stage/user/root/books.parquet?X-Amz-Algorithm=... ...
```

检查 Stage 文件:

```sql
LIST @~;
```

结果:

```
┌───────────────┬──────┬──────────────────────────────────────┬─────────────────────────────────┬─────────┐
│ 名称          │ 大小 │ md5                                  │ 最后修改时间                       │ 创建者  │
├───────────────┼──────┼──────────────────────────────────────┼─────────────────────────────────┼─────────┤
│ books.parquet │  998 │ 88432bf90aadb79073682988b39d461c     │ 2023-06-27 16:03:51.000 +0000   │         │
└───────────────┴──────┴──────────────────────────────────────┴─────────────────────────────────┴─────────┘
```

</TabItem>

<TabItem value="internal" label="上传到内部 Stage">

```sql
CREATE STAGE my_internal_stage;
```

```sql
PRESIGN UPLOAD @my_internal_stage/books.parquet;
```

结果：

```
┌─────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 名称    │ 值                                                                                                                                                                                                                                                                                                                                                                                                                                 │
├─────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 方法    │ PUT                                                                                                                                                                                                                                                                                                                                                                                                                                 │
│ 头部    │ {"host":"s3.us-east-2.amazonaws.com"}                                                                                                                                                                                                                                                                                                                                                                                               │
│ 网址    │ https://s3.us-east-2.amazonaws.com/databend-toronto/stage/internal/my_internal_stage/books.parquet?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASTQNLUZWP2UY2HSN%2F20230628%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230628T022951Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=9cfcdf3b3554280211f88629d60358c6d6e6a5e49cd83146f1daea7dfe37f5c1 │
└─────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```shell
curl -X PUT -T books.parquet "https://s3.us-east-2.amazonaws.com/databend-toronto/stage/internal/my_internal_stage/books.parquet?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASTQNLUZWP2UY2HSN%2F20230628%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230628T022951Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=9cfcdf3b3554280211f88629d60358c6d6e6a5e49cd83146f1daea7dfe37f5c1"
```

检查已暂存的文件：

```sql
LIST @my_internal_stage;
```

</TabItem>
<TabItem value="external" label="上传到外部 Stage">

```sql
CREATE STAGE my_external_stage
URL = 's3://databend'
CONNECTION = (
    ENDPOINT_URL = 'http://127.0.0.1:9000',
    aws_key_id = 'ROOTUSER',
    aws_secret_key = 'CHANGEME123'
);
```

```sql
PRESIGN UPLOAD @my_external_stage/books.parquet;
```

结果:

```
┌─────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 名称    │ 值                                                                                                                                                                                                                                                                                                                               │
├─────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 方法    │ PUT                                                                                                                                                                                                                                                                                                                               │
│ 头部    │ {"host":"127.0.0.1:9000"}                                                                                                                                                                                                                                                                                                         │
│ url     │ http://127.0.0.1:9000/databend/books.parquet?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ROOTUSER%2F20230628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230628T040959Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=<signature...>                                                │
└─────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```shell
curl -X PUT -T books.parquet "http://127.0.0.1:9000/databend/books.parquet?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ROOTUSER%2F20230628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230628T040959Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=<signature...>"
```

检查 Stage 文件:

```sql
LIST @my_external_stage;
```

Result:

```
┌────────────────────────────────────────────────────────────────────────┐
│ name │ size │ ··· │ last_modified │ creator │
├───────────────┼────────┼─────┼──────────────────────┼──────────────────┤
│ books.parquet │ 998 │ ... │ 2023-09-04 03:32:... │ NULL │
└────────────────────────────────────────────────────────────────────────┘
```

```sql
GET @my_internal_stage/ fs:///Users/eric/Downloads/fromStage/;
```

Result:

```
┌─────────────────────────────────────────────────────────┐
│                      file                     │  status │
├───────────────────────────────────────────────┼─────────┤
│ /Users/eric/Downloads/fromStage/books.parquet │ SUCCESS │
└─────────────────────────────────────────────────────────┘
```

</TabItem>

<TabItem value="external" label="Download from External Stage">

```sql
LIST @my_external_stage;
```

Result:

```
┌──────────────────────────────────────────────────────────────────────┐
│         name         │ ··· │     last_modified    │      creator     │
├──────────────────────┼─────┼──────────────────────┼──────────────────┤
│ books.parquet        │ ... │ 2023-09-04 03:37:... │ NULL             │
└──────────────────────────────────────────────────────────────────────┘
```

```sql
GET @my_external_stage/ fs:///Users/eric/Downloads/fromStage/;
```

Result:

```
┌─────────────────────────────────────────────────────────┐
│                      file                     │  status │
├───────────────────────────────────────────────┼─────────┤
│ /Users/eric/Downloads/fromStage/books.parquet │ SUCCESS │
└─────────────────────────────────────────────────────────┘
```

</TabItem>
</Tabs>

<Tabs>
<TabItem value="internal" label="从内部 Stage下载">

```
┌────────────────────────────────────────────────────────────────────────┐
│ name │ size │ ··· │ last_modified │ creator │
├───────────────┼────────┼─────┼──────────────────────┼──────────────────┤
│ books.parquet │ 998 │ ... │ 2023-09-04 03:32:... │ NULL │
└────────────────────────────────────────────────────────────────────────┘
```

```sql
GET @my_internal_stage/ fs:///Users/eric/Downloads/fromStage/;
```

结果:

```
┌─────────────────────────────────────────────────────────┐
│                      file                     │  status │
├───────────────────────────────────────────────┼─────────┤
│ /Users/eric/Downloads/fromStage/books.parquet │ SUCCESS │
└─────────────────────────────────────────────────────────┘
```

</TabItem>
<TabItem value="external" label="从外部 Stage下载">

```sql
LIST @my_external_stage;
```

结果:

```
┌──────────────────────────────────────────────────────────────────────┐
│         name         │ ··· │     last_modified    │      creator     │
├──────────────────────┼─────┼──────────────────────┼──────────────────┤
│ books.parquet        │ ... │ 2023-09-04 03:37:... │ NULL             │
└──────────────────────────────────────────────────────────────────────┘
```

```sql
GET @my_external_stage/ fs:///Users/eric/Downloads/fromStage/;
```

结果:

```
┌─────────────────────────────────────────────────────────┐
│                      file                     │  status │
├───────────────────────────────────────────────┼─────────┤
│ /Users/eric/Downloads/fromStage/books.parquet │ SUCCESS │
└─────────────────────────────────────────────────────────┘
```

</TabItem>
</Tabs>
