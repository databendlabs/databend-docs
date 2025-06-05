---
title: "Creating External Stage with AWS IAM Role"
---

# Why IAM Role

AWS IAM (Identity and Access Management) Role provides a secure and flexible way to manage access to your AWS resources. When working with Databend Cloud, using IAM Role offers several key benefits:

- **Enhanced Security**: Instead of storing AWS access keys and secrets, IAM Role enables temporary credential access, significantly reducing security risks.
- **Simplified Access Management**: You can manage permissions centrally through AWS IAM, making it easier to control who can access your S3 buckets and what operations they can perform.
- **Seamless Integration**: Databend Cloud can securely access your AWS S3 buckets without requiring you to manage or rotate credentials manually.
- **Compliance and Audit**: IAM Role provides detailed audit trails of access to your S3 buckets, helping you maintain compliance with security policies.

By using IAM Role, you can securely connect your Databend Cloud environment to your AWS S3 buckets while maintaining full control over access permissions and security policies.

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

   ![Create Role](/img/cloud/iam/create-role.png)

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
         "Condition": {
           "StringEquals": {
             "sts:ExternalId": "my-external-id-123"
           }
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
   CREATE CONNECTION databend_test STORAGE_TYPE = 's3' ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test' EXTERNAL_ID = 'my-external-id-123';

   CREATE STAGE databend_test URL = 's3://test-bucket-123' CONNECTION = (CONNECTION_NAME = 'databend_test');

   SELECT * FROM @databend_test/test.parquet LIMIT 1;
   ```

:::info
Congratulations! You could now access your own AWS S3 buckets in Databend Cloud with IAM Role.
:::
