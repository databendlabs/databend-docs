---
title: Preparing Storage
sidebar_label: Preparing Storage
description: Recommendations for preparing storage for Databend deployments.
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

This topic explains the recommended storage configurations for deploying Databend in production environments.

## AWS S3

When deploying Databend with AWS S3 in production environments, consider the following recommendations:

### Region Detection on Private Networks

Since v1.2.955, S3 region detection can probe a regional endpoint selected by `AWS_REGION`. This applies when the storage location has no explicit region and uses the default endpoint, `https://s3.amazonaws.com`. It applies to server storage configuration and SQL S3 locations, such as stages and `COPY` or `SELECT` locations.

Set `AWS_REGION` in the Query service environment to a reachable AWS commercial region. For example:

```bash
export AWS_REGION='ap-northeast-1'
```

On a cache miss, Databend sends an anonymous `HEAD` request to `https://s3.ap-northeast-1.amazonaws.com/<bucket>`. This avoids probing the global endpoint on networks that can reach S3 only through a regional endpoint. `AWS_REGION` selects the probe destination; it does not force the bucket's detected region to that value.

- Detection reads `x-amz-bucket-region` even when the response status is `301` or `403`. The regional probe does not follow redirects.
- Successful nonempty results use the existing one-hour region cache, keyed by the configured endpoint and bucket.
- Without that header, the region remains unknown. No guessed region is cached or persisted to stage metadata. The operator can still use the existing `AWS_REGION` fallback.
- A failed or headerless regional probe does not retry the global endpoint. For external SQL locations, if the endpoint egress policy rejects the regional destination, detection probes the configured endpoint instead. Policy checking and detection share one ten-second deadline.
- Trusted server storage configuration does not use the external SQL endpoint policy. This change does not bypass the policy for SQL locations.

The optimization does not apply when the region is explicit, the endpoint is custom (including an explicit regional AWS endpoint), or `AWS_REGION` is unset. It also does not select regional probes for other AWS partitions, such as GovCloud, China, ISO, or EUSC. Their existing detection path remains unchanged.

If detection still times out, check DNS, routing, and the endpoint policy. You can avoid detection by setting the correct region explicitly in the storage configuration or stage connection. Region discovery does not grant access to the bucket; keep the required S3 permissions and credentials.

### Security

Block public access to your S3 bucket to prevent unauthorized access to your data. You can configure the following settings to restrict public access:

Go to the AWS Management Console, select the S3 service, enter the bucket name, and click on the **Permissions** tab. Under the **Block public access** section, click **Edit**, then select the **Block all public access** option and click **Save**.

### Encryption

Enable server-side encryption on your S3 bucket to protect your data at rest. You can choose from the following encryption options:

- **SSE-S3**: Server-side encryption with Amazon S3-managed keys.
- **SSE-KMS**: Server-side encryption with AWS Key Management Service (KMS) keys.

Go to the AWS Management Console, select the S3 service, enter the bucket name, and click on the **Properties** tab. Under the **Default encryption** section, click **Edit**, then select the encryption option and click **Save**.

### Bucket Versioning

Enable versioning on your S3 bucket to protect against accidental deletion of objects. Versioning allows you to recover objects from accidental deletion or overwrite.

Go to the AWS Management Console, select the S3 service, enter the bucket name, and click on the **Properties** tab. Under the **Versioning** section, click **Edit**, then select **Enable versioning** and click **Save**.

### Bucket Lifecycle Policies

Lifecycle rule is needed when Bucket Versioning is enabled. You can configure lifecycle policies to automatically delete old versions of objects or transition objects to different storage classes.

- Configure lifecycle rule to delete old versions of objects.

  1. Go to the AWS Management Console, select the S3 service, enter the bucket name, and click on the **Management** tab. Under the **Lifecycle** section, click **Add lifecycle rule** to create a new rule.

  2. Input a rule name, select the object prefix, and configure the rule actions: **Permanently delete noncurrent versions of objects**.

  3. Input the Days after object become noncurrent: 7 days recommended.

  4. Input the Number of versions to retain: 0 recommended.

  5. Click **Create rule** to save the lifecycle policy.

- Configure lifecycle rules to clean up expired delete markers and incomplete multipart uploads.

  1. Go to the AWS Management Console, select the S3 service, enter the bucket name, and click on the **Management** tab. Under the **Lifecycle** section, click **Add lifecycle rule** to create a new rule.

  2. Input a rule name, select the object prefix, and configure the rule actions: **Delete expired object delete markers or incomplete multipart uploads**.

  3. Enable both options by toggling the checkboxes:

     - **Expired object delete markers**: Removes delete markers for expired objects
     - **Incomplete multipart uploads**: Cleans up incomplete multipart uploads after the specified number of days

  4. Click **Create rule** to save the lifecycle policy.
