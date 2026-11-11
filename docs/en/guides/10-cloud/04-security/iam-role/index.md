---
title: IAM Role
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

# Why IAM Role

Cloud-native identity delegation (AWS IAM Role, Azure Managed Identity, Google Service Account federation, etc.) lets Databend Cloud obtain short-lived credentials to your object storage without ever handling raw access keys. That keeps data plane access inside your cloud provider's control plane while you retain ownership of every permission.

## Benefits

- No static keys: temporary credentials eliminate long-lived secrets to rotate or leak.
- Least privilege: fine-grained policies restrict Databend Cloud to only the buckets and actions you approve.
- Central governance: continue auditing and revoking access through your existing IAM workflows.
- Automated rotation: the cloud provider refreshes tokens, so integrations keep working when teams change.

## How It Works

For AWS, copy **Role ARN** from the **Connect** dialog in the Databend Cloud console. Databend Cloud creates this principal for your organization. The standard setup does not require a support ticket or manual approval from Databend Cloud support. If the ARN does not appear, contact support.

Create a separate IAM role in your AWS account. Attach a policy that allows only the storage operations you need. Configure its trust policy to trust the Databend Cloud principal with an external ID. Then use your own role ARN and the same external ID in a Databend Connection.

Databend Cloud assumes your role when it accesses storage. AWS STS issues temporary credentials for the role.

## Choose Your Next Task

| Task | Start here |
|------|------------|
| Load files from Amazon S3 | [Loading from Bucket](/guides/load-data/load/s3) is the main tutorial. Choose authentication, create a Connection and Stage, verify access, and load data there. |
| Configure AWS role permissions and trust | [Authenticate with AWS IAM Role](aws.md) covers AWS authorization. Return to the loading tutorial after you create the role. |
| Look up Stage syntax | [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) provides SQL syntax and concise examples. |

<IndexOverviewList />
