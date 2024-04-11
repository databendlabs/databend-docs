---
title: Preparing Storage
sidebar_label: Preparing Storage
description:
  Recommendations for preparing storage for Databend deployments.
---

This topic explains the recommended storage configurations for deploying Databend in production environments.


## AWS S3

When deploying Databend with AWS S3 in production environments, consider the following recommendations:


### Security

Block public access to your S3 bucket to prevent unauthorized access to your data. You can configure the following settings to restrict public access:

Goto the AWS Management Console, select the S3 service, enter the bucket name, and click on the **Permissions** tab. Under the **Block public access** section, click **Edit**, then select the **Block all public access** option and click **Save**.


### Encryption

Enable server-side encryption on your S3 bucket to protect your data at rest. You can choose from the following encryption options:

- **SSE-S3**: Server-side encryption with Amazon S3-managed keys.
- **SSE-KMS**: Server-side encryption with AWS Key Management Service (KMS) keys.

Goto the AWS Management Console, select the S3 service, enter the bucket name, and click on the **Properties** tab. Under the **Default encryption** section, click **Edit**, then select the encryption option and click **Save**.


### Bucket Versioning

Enable versioning on your S3 bucket to protect against accidental deletion of objects. Versioning allows you to recover objects from accidental deletion or overwrite.

Goto the AWS Management Console, select the S3 service, enter the bucket name, and click on the **Properties** tab. Under the **Versioning** section, click **Edit**, then select **Enable versioning** and click **Save**.


### Bucket Lifecycle Policies

Lifecyle rule is needed when Bucket Versioning is enabled. You can configure lifecycle policies to automatically delete old versions of objects or transition objects to different storage classes.

- Goto the AWS Management Console, select the S3 service, enter the bucket name, and click on the **Management** tab. Under the **Lifecycle** section, click **Add lifecycle rule** to create a new rule.

- Input a rule name, select the object prefix, and configure the rule actions: **Permanently delete noncurrent versions of objects**.

- Input the Days after object become noncurrent: recommend 7 days.

- Input the Number of versions to retain: recommend 0.

- Click **Create rule** to save the lifecycle policy.
