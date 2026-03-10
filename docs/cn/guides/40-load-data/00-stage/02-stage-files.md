---
title: 上传文件至 Stage
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 推荐两种文件上传至 Stage 的方法：[PRESIGN](/sql/sql-commands/ddl/stage/presign) 和 PUT/GET 命令。这些方法可实现客户端与存储之间的直接数据传输，无需中间环节，从而减少 Databend 与存储之间的流量，节省成本。

![Alt text](/img/load/staging-file.png)

PRESIGN 方法会生成一个带签名且有时效性的 URL，客户端可用其安全地发起文件上传。该 URL 授予对指定 Stage 的临时访问权限，允许客户端直接传输数据而无需依赖 Databend 服务器全程参与，既提升安全性又提高效率。

若使用 [BendSQL](../../35-connect/00-sql-clients/bendsql.md) 管理 Stage 中的文件，可通过 PUT 命令上传文件，GET 命令下载文件。

- 当前 GET 命令仅能下载 Stage 中的所有文件，无法单独下载特定文件。
- 这些命令仅适用于 BendSQL，且当 Databend 使用文件系统作为存储后端时，GET 命令将无法使用。

### 使用预签名 URL 上传

以下示例展示如何通过预签名 URL 将示例文件 ([books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)) 上传至用户 Stage、内部 Stage 及外部 Stage。

<Tabs groupId="presign">

<TabItem value="user" label="上传至用户 Stage">

```sql
PRESIGN UPLOAD @~/books.parquet;
```

结果：

```
┌────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Name   │ Value                                                                                                              │
├────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ method │ PUT                                                                                                                │
│ headers│ {"host":"s3.us-east-2.amazonaws.com"}                                                                              │
│ url    │ https://s3.us-east-2.amazonaws.com/databend-toronto/stage/user/root/books.parquet?X-Amz-Algorithm...               │
└────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```shell
curl -X PUT -T books.parquet "https://s3.us-east-2.amazonaws.com/databend-toronto/stage/user/root/books.parquet?X-Amz-Algorithm=... ...
```

检查已暂存文件：

```sql
LIST @~;
```

结果：

```
┌───────────────┬──────┬──────────────────────────────────────┬─────────────────────────────────┬─────────┐
│ name          │ size │ md5                                  │ last_modified                   │ creator │
├───────────────┼──────┼──────────────────────────────────────┼─────────────────────────────────┼─────────┤
│ books.parquet │  998 │ 88432bf90aadb79073682988b39d461c     │ 2023-06-27 16:03:51.000 +0000   │         │
└───────────────┴──────┴──────────────────────────────────────┴─────────────────────────────────┴─────────┘
```

</TabItem>

<TabItem value="internal" label="上传至内部 Stage">

```sql
CREATE STAGE my_internal_stage;
```

```sql
PRESIGN UPLOAD @my_internal_stage/books.parquet;
```

结果：

```
┌─────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Name    │ Value                                                                                                                                                                                                                                                                                                                                                                                                                               │
├─────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ method  │ PUT                                                                                                                                                                                                                                                                                                                                                                                                                                 │
│ headers │ {"host":"s3.us-east-2.amazonaws.com"}                                                                                                                                                                                                                                                                                                                                                                                               │
│ url     │ https://s3.us-east-2.amazonaws.com/databend-toronto/stage/internal/my_internal_stage/books.parquet?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASTQNLUZWP2UY2HSN%2F20230628%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230628T022951Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=9cfcdf3b3554280211f88629d60358c6d6e6a5e49cd83146f1daea7dfe37f5c1 │
└─────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```shell
curl -X PUT -T books.parquet "https://s3.us-east-2.amazonaws.com/databend-toronto/stage/internal/my_internal_stage/books.parquet?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASTQNLUZWP2UY2HSN%2F20230628%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230628T022951Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=9cfcdf3b3554280211f88629d60358c6d6e6a5e49cd83146f1daea7dfe37f5c1"
```

检查已暂存文件：

```sql
LIST @my_internal_stage;
```

结果：

```
┌──────────────────────────────────┬───────┬──────────────────────────────────────┬─────────────────────────────────┬─────────┐
│ name                             │ size  │ md5                                  │ last_modified                  │ creator │
├──────────────────────────────────┼───────┼──────────────────────────────────────┼─────────────────────────────────┼─────────┤
│ books.parquet                    │   998 │ "88432bf90aadb79073682988b39d461c"     │ 2023-06-28 02:32:15.000 +0000  │         │
└──────────────────────────────────┴───────┴──────────────────────────────────────┴─────────────────────────────────┴─────────┘
```

</TabItem>
<TabItem value="external" label="上传至外部 Stage">

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

结果：

````
┌─────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 名称    │ 值                                                                                                                                                                                                                                                                                                                             │
├─────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ method  │ PUT                                                                                                                                                                                                                                                                                                                               │
│ headers │ {"host":"127.0.0.1:9000"}                                                                                                                                                                                                                                                                                                         │
│ url     │ http://127.0.0.1:9000/databend/books.parquet?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ROOTUSER%2F20230628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230628T040959Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=<signature...>                                                │
└─────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```shell
curl -X PUT -T books.parquet "http://127.0.0.1:9000/databend/books.parquet?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ROOTUSER%2F20230628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230628T040959Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=<signature...>"
````

检查暂存文件：

```sql
LIST @my_external_stage;
```

结果：

```
┌───────────────┬──────┬──────────────────────────────────────┬─────────────────────────────────┬─────────┐
│ name          │ size │ md5                                  │ last_modified                  │ creator │
├───────────────┼──────┼──────────────────────────────────────┼─────────────────────────────────┼─────────┤
│ books.parquet │  998 │ "88432bf90aadb79073682988b39d461c"    │ 2023-06-28 04:13:15.178 +0000  │         │
└───────────────┴──────┴──────────────────────────────────────┴─────────────────────────────────┴─────────┘
```

</TabItem>
</Tabs>

### 使用 PUT 命令上传文件

以下示例展示如何使用 BendSQL 通过 PUT 命令将示例文件 ([books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)) 上传到用户级 stage、内部 stage 和外部 stage。

<Tabs groupId="PUT">

<TabItem value="user" label="上传到用户级 Stage">

```sql
PUT fs:///Users/eric/Documents/books.parquet @~
```

结果：

```
┌───────────────────────────────────────────────┐
│                 file                │  status │
├─────────────────────────────────────┼─────────┤
│ /Users/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

检查暂存文件：

```sql
LIST @~;
```

结果：

```
┌────────────────────────────────────────────────────────────────────────┐
│      name     │  size  │ ··· │     last_modified    │      creator     │
├───────────────┼────────┼─────┼──────────────────────┼──────────────────┤
│ books.parquet │    998 │ ... │ 2023-09-04 03:27:... │ NULL             │
└────────────────────────────────────────────────────────────────────────┘
```

</TabItem>

<TabItem value="internal" label="上传到内部 Stage">

```sql
CREATE STAGE my_internal_stage;
```

```sql
PUT fs:///Users/eric/Documents/books.parquet @my_internal_stage;
```

结果：

```
┌───────────────────────────────────────────────┐
│                 file                │  status │
├─────────────────────────────────────┼─────────┤
│ /Users/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

检查暂存文件：

```sql
LIST @my_internal_stage;
```

结果：

```
┌────────────────────────────────────────────────────────────────────────┐
│      name     │  size  │ ··· │     last_modified    │      creator     │
├───────────────┼────────┼─────┼──────────────────────┼──────────────────┤
│ books.parquet │    998 │ ... │ 2023-09-04 03:32:... │ NULL             │
└────────────────────────────────────────────────────────────────────────┘
```

</TabItem>
<TabItem value="external" label="上传到外部 Stage">

```
CREATE STAGE my_external_stage
    URL = 's3://databend'
    CONNECTION = (
        ENDPOINT_URL = 'http://127.0.0.1:9000',
        AWS_KEY_ID = 'ROOTUSER',
        AWS_SECRET_KEY = 'CHANGEME123'
    );
```

```sql
PUT fs:///Users/eric/Documents/books.parquet @my_external_stage
```

结果：

```
┌───────────────────────────────────────────────┐
│                 file                │  status │
├─────────────────────────────────────┼─────────┤
│/eric/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

检查暂存文件：

```sql
LIST @my_external_stage;
```

结果：

```
┌──────────────────────────────────────────────────────────────────────┐
│         name         │ ··· │     last_modified    │      creator     │
├──────────────────────┼─────┼──────────────────────┼──────────────────┤
│ books.parquet        │ ... │ 2023-09-04 03:37:... │ NULL             │
└──────────────────────────────────────────────────────────────────────┘
```

</TabItem>
</Tabs>

### 使用 PUT 命令上传目录

您还可以使用带通配符的 PUT 命令上传目录中的多个文件。这在需要一次性暂存大量文件时非常有用。

```sql
PUT fs:///home/ubuntu/datas/event_data/*.parquet @your_stage;
```

结果：

```
┌───────────────────────────────────────────────────────┐
│                 file                        │status   │
├─────────────────────────────────────────────┼─────────┤
│ /home/ubuntu/datas/event_data/file1.parquet │ SUCCESS │
│ /home/ubuntu/datas/event_data/file2.parquet │ SUCCESS │
│ /home/ubuntu/datas/event_data/file3.parquet │ SUCCESS │
└───────────────────────────────────────────────────────┘
```

### 使用 GET 命令下载文件

以下示例展示如何使用 BendSQL 通过 GET 命令从用户级 stage、内部 stage 和外部 stage 下载示例文件 ([books.parquet](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet))。

<Tabs groupId="GET">

<TabItem value="user" label="从用户级 Stage 下载">

```sql
LIST @~;
```

结果：

```
┌────────────────────────────────────────────────────────────────────────┐
│      name     │  size  │ ··· │     last_modified    │      creator     │
├───────────────┼────────┼────────────┼─────┼──────────────────────┼──────────────────┤
│ books.parquet │    998 │ ... │ 2023-09-04 03:27:... │ NULL             │
└────────────────────────────────────────────────────────────────────────┘
```

```sql
GET @~/ fs:///Users/eric/Downloads/fromStage/;
```

结果：

```
┌─────────────────────────────────────────────────────────┐
│                      file                     │  status │
├───────────────────────────────────────────────┼─────────┤
│ /Users/eric/Downloads/fromStage/books.parquet │ SUCCESS │
└─────────────────────────────────────────────────────────┘
```

</TabItem>

<TabItem value="internal" label="从内部 Stage 下载">

```sql
LIST @my_internal_stage;
```

结果：

```
┌────────────────────────────────────────────────────────────────────────┐
│      name     │  size  │ ··· │     last_modified    │      creator     │
├───────────────┼────────┼─────┼──────────────────────┼──────────────────┤
│ books.parquet │    998 │ ... │ 2023-09-04 03:32:... │ NULL             │
└────────────────────────────────────────────────────────────────────────┘
```

```sql
GET @my_internal_stage/ fs:///Users/eric/Downloads/fromStage/;
```

结果：

```
┌─────────────────────────────────────────────────────────┐
│                      file                     │  status │
├───────────────────────────────────────────────┼─────────┤
│ /Users/eric/Downloads/fromStage/books.parquet │ SUCCESS │
└─────────────────────────────────────────────────────────┘
```

</TabItem>
<TabItem value="external" label="从外部 Stage 下载">

```sql

LIST @my_external_stage;

```

结果：

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

执行结果:

```
┌─────────────────────────────────────────────────────────┐
│                      file                     │  status │
├───────────────────────────────────────────────┼─────────┤
│ /Users/eric/Downloads/fromStage/books.parquet │ SUCCESS │
└─────────────────────────────────────────────────────────┘
```

</TabItem>
</Tabs>