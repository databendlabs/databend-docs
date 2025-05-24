---
title: "使用 AWS IAM Role 创建外部 Stage"
---

# 为什么选择 IAM Role

通过 AWS IAM Role，您可以在 Databend Cloud 中访问自己的 AWS S3 存储桶。这使您能够安全地访问数据并执行数据分析，而无需管理 AWS 凭证。

# 如何使用 IAM Role

1. 提交支持工单以获取 Databend Cloud 组织的 IAM 角色 ARN：

   例如：`arn:aws:iam::123456789012:role/xxxxxxx/tnabcdefg/xxxxxxx-tnabcdefg`

2. 前往 AWS 控制台：

   https://us-east-2.console.aws.amazon.com/iam/home?region=us-east-2#/policies

   点击 `Create policy` (创建策略)，选择 `Custom trust policy` (自定义信任策略)，然后输入 S3 存储桶访问的策略文档：

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "s3:ListBucket",
         "Resource": "arn:aws:s3:::test-bucket-123"
       },
       {
         "Effect": "Allow",
         "Action": "s3:*Object",
         "Resource": "arn:aws:s3:::test-bucket-123/*"
       }
     ]
   }
   ```

   点击 `Next` (下一步)，输入策略名称：`databend-test`，然后点击 `Create policy` (创建策略)。

3. 前往 AWS 控制台：

   https://us-east-2.console.aws.amazon.com/iam/home?region=us-east-2#/roles

   点击 `Create role` (创建角色)，在 `Trusted entity type` (信任实体类型) 中选择 `Custom trust policy` (自定义信任策略)：

   ![Create Role](/img/cloud/iam/create-role.png)

   输入信任策略文档：

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::123456789012:role/xxxxxxx/tnabcdefg/xxxxxxx-tnabcdefg"
         },
         "Action": "sts:AssumeRole"
       }
     ]
   }
   ```

   点击 `Next` (下一步)，选择之前创建的策略：`databend-test`。

   点击 `Next` (下一步)，输入角色名称：`databend-test`。

   点击 `View Role` (查看角色)，并记录角色 ARN：`arn:aws:iam::987654321987:role/databend-test`。

4. 在 Databend Cloud 工作表或 `BendSQL` 中运行以下 SQL 语句：

   ```sql
   CREATE CONNECTION databend_test STORAGE_TYPE = 's3' ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test';

   CREATE STAGE databend_test URL = 's3://test-bucket-123' CONNECTION = (CONNECTION_NAME = 'databend_test');

   SELECT * FROM @databend_test/test.parquet LIMIT 1;
   ```

:::info
恭喜！您现在可以使用 IAM Role 在 Databend Cloud 中访问自己的 AWS S3 存储桶了。
:::