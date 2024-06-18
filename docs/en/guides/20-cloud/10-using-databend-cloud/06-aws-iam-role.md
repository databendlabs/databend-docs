---
title: "Access your own AWS S3 bucket in Databend Cloud with IAM Role"
---

# Why IAM Role

With AWS IAM Role, you can access your own AWS S3 buckets in Databend Cloud. This allows you to securely access your data and perform data analysis without having to manage your AWS credentials.

# How to Use IAM Role

1. Raise a support ticket to get the IAM role ARN for your Databend Cloud organization:

   For example: `arn:aws:iam::123456789012:role/xxxxxxx/tnabcdefg/xxxxxxx-tnabcdefg`

2. Goto AWS Console:

   https://us-east-2.console.aws.amazon.com/iam/home?region=us-east-2#/policies

   Click `Create policy`, and select `Custom trust policy`, and input the policy document for S3 bucket access:

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

   Click `Next`, and input the policy name: `databend-test`, and click `Create policy`

3. Goto AWS Console:

   https://us-east-2.console.aws.amazon.com/iam/home?region=us-east-2#/roles

   Click `Create role`, and select `Custom trust policy` in `Trusted entity type`:

   ![Create Role](../../../../public/img/cloud/iam/create-role.png)

   Input the the trust policy document:

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

   Click `Next`, and select the previously created policy: `databend-test`

   Click `Next`, and input the role name: `databend-test`

   Click `View Role`, and record the role ARN: `arn:aws:iam::987654321987:role/databend-test`

4. Run the following SQL statement in Databend Cloud cloud worksheet or `BendSQL`:

   ```sql
   CREATE CONNECTION databend_test STORAGE_TYPE = 's3' ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test';

   CREATE STAGE databend_test URL = 's3://test-bucket-123' CONNECTION = (CONNECTION_NAME = 'databend_test');

   SELECT * FROM @databend_test/test.parquet LIMIT 1;
   ```

:::info
Congratulations! You could now access your own AWS S3 buckets in Databend Cloud with IAM Role.
:::
