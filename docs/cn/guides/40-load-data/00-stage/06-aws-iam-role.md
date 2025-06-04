---
title: "使用 AWS IAM 角色创建外部阶段 (External Stage)"
---

# 为什么使用 IAM 角色

通过 AWS IAM 角色，您可以在 Databend Cloud 中访问自己的 AWS S3 存储桶。这使您能够安全地访问数据并执行数据分析，而无需管理 AWS 凭证。

# 如何使用 IAM 角色

1. 提交支持工单以获取您的 Databend Cloud 组织的 IAM 角色 ARN：

   例如：`arn:aws:iam::123456789012:role/xxxxxxx/tnabcdefg/xxxxxxx-tnabcdefg`

2. 访问 AWS 控制台：

   https://us-east-2.console.aws.amazon.com/iam/home?region=us-east-2#/policies

   点击 `Create policy`，选择 `Custom trust policy`，并输入 S3 存储桶访问策略文档：

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

   点击 `Next`，输入策略名称：`databend-test`，然后点击 `Create policy`

3. 访问 AWS 控制台：

   https://us-east-2.console.aws.amazon.com/iam/home?region=us-east-2#/roles

   点击 `Create role`，在 `Trusted entity type` 中选择 `Custom trust policy`：

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

   点击 `Next`，选择之前创建的策略：`databend-test`

   点击 `Next`，输入角色名称：`databend-test`

   点击 `View Role`，记录角色 ARN：`arn:aws:iam::987654321987:role/databend-test`

4. 在 Databend Cloud 工作区或 BendSQL 中运行以下 SQL 语句：

   ```sql
   CREATE CONNECTION databend_test STORAGE_TYPE = 's3' ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test';

   CREATE STAGE databend_test URL = 's3://test-bucket-123' CONNECTION = (CONNECTION_NAME = 'databend_test');

   SELECT * FROM @databend_test/test.parquet LIMIT 1;
   ```

:::info
恭喜。您现在可以通过 IAM 角色在 Databend Cloud 中访问自己的 AWS S3 存储桶。
:::