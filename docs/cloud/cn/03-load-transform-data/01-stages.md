---
title: 使用暂存区 Stage
sidebar_position: 2
slug: /stages
---

## Stage 是什么？

Stage 是用于 Databend Cloud 中导入数据的一个暂存区域。举个例子，您可以通过创建的 Stage 存储 CSV，NDJSON 或是 Parquet 的文件，在 Databend Cloud 中使用 [COPY INTO](../03-load-transform-data/02-copy-into.md) 导入。  

Stage 在 Databend Cloud 中分为 内部 Stage 和外部 Stage。内部 Stage 的存储空间被 Databend Cloud 管理。上传到 Databend Cloud 内部 Stage 的文件所占用的存储成本需要租户承担。外部 Stage 是指 Databend Cloud 直接读取用户 OSS bucket 或是 AWS S3 bucket 等其它对象存储中的数据。

## 示例

### 示例 1：创建内部 Stage

以下创建一个名为 *my_internal_stage* 的内部 Stage:

```sql
CREATE STAGE my_internal_stage;

DESC STAGE my_internal_stage;

name             |stage_type|stage_params                                                  |copy_options                                                                                                                                                  |file_format_options             |number_of_files|creator           |comment|
-----------------+----------+--------------------------------------------------------------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+--------------------------------+---------------+------------------+-------+
my_internal_stage|Internal  |StageParams { storage: Fs(StorageFsConfig { root: "_data" }) }|CopyOptions { on_error: AbortNum(1), size_limit: 0, max_files: 0, split_size: 0, purge: false, single: false, max_file_size: 0, disable_variant_check: false }|Parquet(ParquetFileFormatParams)|              0|'root'@'127.0.0.1'|       |

```

### 示例 2：使用 AWS Access Key 创建外部 Stage

以下在 Amazon S3 上创建一个名为 *my_s3_stage* 的外部 Stage:

```sql
CREATE STAGE my_s3_stage URL='s3://load/files/' CONNECTION = (ACCESS_KEY_ID = '<your-access-key-id>' SECRET_ACCESS_KEY = '<your-secret-access-key>');

DESC STAGE my_s3_stage;
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| name        | stage_type | stage_params                                                                                                                                                           | copy_options                                  | file_format_options                                                                                                | comment |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
| my_s3_stage | External   | StageParams { storage: S3(StageS3Storage { bucket: "load", path: "/files/", credentials_aws_key_id: "", credentials_aws_secret_key: "", encryption_master_key: "" }) } | CopyOptions { on_error: None, size_limit: 0 } | FileFormatOptions { format: Csv, skip_header: 0, field_delimiter: ",", record_delimiter: "\n", compression: None } |         |
+-------------+------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------+-----------------------------------------------+--------------------------------------------------------------------------------------------------------------------+---------+
```

### 示例 3: 使用 AWS IAM 用户创建外部 Stage

此示例使用 AWS Identity and Access Management (IAM) 用户在 Amazon S3 上创建一个名为 iam_external_stage 的外部阶段。

#### 步骤 1：为 S3 存储桶创建访问策略

以下过程为 Amazon S3 上的存储桶 *databend-toronto* 创建名为 *databend-access* 的访问策略：

1. 登录 AWS 管理控制台，然后选择 **Services** > **Security, Identity, & Compliance** > **IAM**.
2. 在左侧导航栏选择 **Account settings**，进入右侧页面的 **Security Token Service (STS)** 部分。确保您的账户所属的 AWS 区域的状态为 Active。
3. 在左侧导航窗格中选择 **Policies**，然后在右侧页面中选择 **Create policy**。
4. 单击 JSON 选项卡，将以下代码复制并粘贴到编辑器中，然后将策略保存为 databend_access。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:GetObjectVersion",
                "s3:DeleteObject",
                "s3:DeleteObjectVersion",
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::databend-toronto/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::databend-toronto/*",
            "Condition": {
                "StringLike": {
                    "s3:prefix": [
                        "/*"
                    ]
                }
            }
        }
    ]
}
```

#### 步骤 2：创建 IAM 用户

以下过程创建一个名为 *databend* 的 IAM 用户并将访问策略 **databend-access** 附加到该用户。

1. 在左侧导航窗格中选择 **Users**，然后在右侧页面中选择 **Add users**。
2. 配置用户：
    - 将用户名设置为 *databend*。 
    - 为用户设置权限时，单击 **Attach policies directly**，然后搜索并选择访问策略 *databend-access*。
3. 创建用户后，单击用户名打开详细信息页面，然后选择 **Security credentials**。
4. 在 **Access keys** 部分中，单击 **Create access key**。
5. 为用例选择 **Third-party service**，然后勾选下面的复选框以确认创建访问密钥。
6. 将生成的访问密钥和秘密访问密钥复制并保存到安全的地方。

#### 步骤 3：创建外部 Stage

使用为 IAM 用户 *databend* 生成的访问密钥和秘密访问密钥来创建外部 Stage。

```sql
CREATE STAGE iam_external_stage url = 's3://databend-toronto' CONNECTION =(aws_key_id='<access-key>' aws_secret_key='<secret-access-key>' region='us-east-2');
```

## 教程：从外部 Stage 中导入数据

在本教程中，您将创建一个来自阿里云 OSS 的外部 Stage 并在里面存储相应的数据，然后通过外部 Stage 导入数据到 Databend Cloud 中。 

:::tip
请替换下面的语句中的 `<MY_OSS_BUCKET>`, `<MY_OSS_KEY>` 和 `<MY_OSS_SECRET>`。现在 Databend Cloud 在阿里云上部署，现在主要在北京区域。非北京区域记得更换 `ENDPOINT_URL` 对应的地址。
:::

### 第一步：创建外部 Stage

在 Databend Cloud 中我们执行以下命令，创建一个阿里云北京区的外部 Stage：

```sql
CREATE STAGE my_oss_stage url='oss://MY_OSS_BUCKET/booksdata/' 
connection=(
    ENDPOINT_URL = 'https://oss-cn-beijing.aliyuncs.com'
    ACCESS_KEY_ID='MY_OSS_KEY' 
    ACCESS_KEY_SECRET='MY_OSS_SECRET'
);
```

您可以通过 `SHOW STAGES` 命令来查看现有的 Stage：

![](@site/static/img/documents/working-with-stages/stages_cn.png)

### 第二步：向外部 Stage 中导入样本数据

1. 参考[阿里云文档](https://help.aliyun.com/document_detail/120075.html)，安装命令行工具 ossutils 用于上传数据到 OSS。

2. [下载样本数据](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.csv)到您的本地主机。

3. 使用 ossutils 工具将样本数据上传到 OSS：

```shell
ossutils cp ./books.csv oss://<MY_OSS_BUCKET>/booksdata/books.csv
```

### 第三步：从外部 Stage 中导入样本数据

打开一个工作区，创建表结构并且执行以下 COPY INTO 命令从外部 Stage 装载数据到 books 表中：

```sql
CREATE TABLE IF NOT EXISTS books (
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);
```
```sql
COPY INTO books FROM @my_oss_stage files=('books.csv') file_format = (type = CSV field_delimiter = ','  record_delimiter = '\n' skip_header = 0);
```
