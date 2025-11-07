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

After Databend Cloud support shares the trusted principal information for your organization, you create an IAM role/identity in your cloud account, attach a policy that allows the object storage operations you need (for example reading a set of buckets), and configure the trust policy so only Databend Cloud can assume the role with a unique external ID. Databend Cloud then assumes that role on demand, uses the temporary credentials to access your storage, and automatically logs out when the session expires.

<IndexOverviewList />
