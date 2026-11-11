---
title: "Authenticate with AWS IAM Role"
sidebar_label: "AWS IAM Role"
toc_max_heading_level: 4
---

<span id="how-to-use-iam-role" />

Use an AWS IAM role to let Databend Cloud access Amazon S3 without storing AWS access keys in Databend. You create the role in your AWS account. You control which buckets, paths, and operations the role can access.

This guide covers the **AWS authorization** part of [Loading from Bucket](/guides/load-data/load/s3). Complete the three AWS tasks below. Then return to the loading tutorial to create a Connection and Stage, verify access, and load data.

**Task flow:** [Get the Databend principal](#step-1-get-the-databend-cloud-principal) → [Create a read policy](#s3-permissions) → [Create a trusted role](#step-3-create-the-iam-role-and-trust-policy) → [Connect and verify](#step-4-create-a-connection-and-stage).

For access key authentication instead, see [Configure Access Keys](/guides/load-data/load/s3#access-keys).

## How It Works

<div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 144" role="img" aria-labelledby="aws-iam-flow-title" style={{ display: 'block', width: '100%', minWidth: '640px', height: 'auto', fontFamily: 'inherit' }}>
  <title id="aws-iam-flow-title">Databend Cloud uses AWS STS to assume your IAM role and access the authorized S3 prefix.</title>
  <defs>
    <marker id="aws-iam-flow-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 6 3 L 0 6 Z" fill="var(--color-primary)" />
    </marker>
  </defs>
  <g fill="var(--color-fill-0)" stroke="var(--color-border)">
    <rect x="8" y="28" width="162" height="88" rx="10" />
    <rect x="201" y="28" width="162" height="88" rx="10" />
    <rect x="394" y="28" width="162" height="88" rx="10" />
    <rect x="587" y="28" width="162" height="88" rx="10" />
  </g>
  <g fill="none" stroke="var(--color-primary)" strokeWidth="2" markerEnd="url(#aws-iam-flow-arrow)">
    <path d="M 172 72 H 197" />
    <path d="M 365 72 H 390" />
    <path d="M 558 72 H 583" />
  </g>
  <g textAnchor="middle" fill="var(--color-text-0)" fontSize="14" fontWeight="600">
    <text x="89" y="65">Databend Cloud</text>
    <text x="282" y="65">AWS STS</text>
    <text x="475" y="65">Your IAM role</text>
    <text x="668" y="65">S3 bucket</text>
  </g>
  <g textAnchor="middle" fill="var(--color-text-1)" fontSize="11.5">
    <text x="89" y="88">Organization principal</text>
    <text x="282" y="88">AssumeRole</text>
    <text x="475" y="88">Customer AWS account</text>
    <text x="668" y="88">Authorized prefix</text>
  </g>
</svg>
</div>

Two policies control access:

- **Trust policy**: Specifies which Databend Cloud principal can assume your role. The `sts:ExternalId` condition checks the external ID sent with the request.
- **Permissions policy**: Specifies which S3 resources and actions your role can access.

Databend Cloud uses AWS STS to obtain temporary credentials for the role. AWS checks the role permissions when Databend accesses S3. You do not need to create an IAM user or provide an access key for this method.

## Before You Begin

Prepare a Databend Cloud organization and AWS permissions to create IAM policies and roles. Ask your AWS administrator to perform the AWS tasks if needed.

This guide uses the same sample location as the loading tutorial: `s3://databend-toronto/load/` in `us-east-2`. Replace the bucket, prefix, and Region with your own values. If you have not prepared the bucket and sample file, start with [Prepare Your S3 Data](/guides/load-data/load/s3#prepare-s3-data).

:::note
This guide covers SQL access through a Connection and Stage. An [Amazon SQS (S3) data source](/guides/cloud/data-integration/datasource/sqs-s3) has a separate setup. Do not reuse its platform role ARNs or external ID for your SQL connection without checking its requirements.
:::

## Get the Databend Cloud Principal {/* #step-1-get-the-databend-cloud-principal */}

In the Databend Cloud console, select the organization that will access your S3 data. Open **Connect → Connection Information** on the organization overview page. Copy **Role ARN**.

Choose a unique external ID for this SQL connection. Use the same value in the AWS trust policy and Databend Connection. If support has supplied an external ID for your setup, use that value.

The standard setup does not require manual authentication or approval from Databend Cloud support. You configure the permissions and trust policy in your own AWS account.

If **Role ARN** does not appear, open a [support ticket](/guides/cloud/overview/support#getting-support). Ask support to confirm role-based access for your organization and provide the correct principal ARN. Do not construct the ARN from your DSN or copy an ARN from a different organization.

| Value | Meaning and source | Where to use it |
|-------|--------------------|-----------------|
| Databend Cloud principal ARN | Identifies the AWS identity that requests access to your role. Copy **Role ARN** from the Databend Cloud **Connect** dialog. | `Principal.AWS` in the trust policy: **who can assume the role** |
| External ID | An additional value checked when Databend assumes your role. Use the unique value chosen for this SQL connection, or supplied by support. | `sts:ExternalId` in the trust policy and `EXTERNAL_ID` in the Connection: **the request must carry the matching value** |
| Your IAM role ARN | Identifies the role whose permissions Databend will use. Create it in [Create the IAM Role](#step-3-create-the-iam-role-and-trust-policy). Copy its ARN from the AWS role details page. | `ROLE_ARN` in the Connection: **which role to assume** |
| Bucket, prefix, and Region | Identify the data location. In this example, `databend-toronto` is the bucket, `load/` is the object key prefix, and `us-east-2` is the bucket's AWS Region. Find these values in the S3 console. | Bucket and prefix in the permissions policy and Stage URL; Region in the Connection: **which data to access and where it is stored** |

:::warning
The Databend Cloud principal ARN and your IAM role ARN are different values. The trust policy trusts the Databend Cloud principal. The Connection uses the role in **your AWS account**.

Replace all example values before you run SQL or save a policy. Do not use `my-external-id-123` as your production external ID.
:::

### Understand and Configure the External ID {/* #external-id */}

An external ID is a string sent with the AWS STS `AssumeRole` request. This guide uses `my-external-id-123` as an example. It is not an AWS account ID, a role ID, or an access key. AWS does not generate it when you create a role. If you choose a new value for this SQL connection, you can use a random UUID.

The trust policy checks this value to restrict the context in which a trusted principal can assume the role. This helps prevent the [confused deputy problem](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html). AWS does not treat the external ID as a secret. It is not a login credential and does not grant S3 permissions by itself.

#### View the External ID in AWS {/* #view-external-id */}

Open **IAM → Roles → your role → Trust relationships**. Find `Condition.StringEquals["sts:ExternalId"]` in the trust policy. Use **Edit trust policy** to add or change it. There is no separate external ID resource to create. If your trust policy has no `sts:ExternalId` condition, this external ID check is not configured.

The following cases assume that all other AWS authorization checks pass and that no other trust-policy statement grants access without the condition:

| Trust policy | Databend Connection | Result of a new `AssumeRole` request |
|--------------|---------------------|-------------------------------------|
| No external ID condition | `EXTERNAL_ID` omitted | Can succeed. The external ID check is not enforced. |
| No external ID condition | `EXTERNAL_ID` provided | Can succeed, but sending the value does not enable the external ID check. |
| Requires `my-external-id-123` | `EXTERNAL_ID = 'my-external-id-123'` | Can succeed. The values match. |
| Requires `my-external-id-123` | `EXTERNAL_ID` omitted or different | Fails with `AccessDenied`. |

Setting `EXTERNAL_ID` in a Connection only sends the value to AWS. It does not add or change a condition in the AWS trust policy.

#### Add or Change the External ID Later {/* #update-external-id */}

You do not need to recreate the IAM role. Update its trust policy and the Databend Connection with the same value. Recreate affected Stages with the new Connection parameters because existing Stages usually retain a copy of the old parameters. Coordinate these changes to avoid failed requests. See [Maintain or Remove Access](#maintain-or-remove-access).

This guide recommends the external ID condition from the start. Adding the condition later does not invalidate temporary credentials that AWS STS has already issued.

## Create the S3 Permissions Policy {/* #s3-permissions */}

In the [AWS IAM console](https://console.aws.amazon.com/iam/), open **Policies → Create policy → JSON**.

Paste the following policy into the editor. Replace `databend-toronto` and `load/` with your bucket and prefix. Save the policy as `databend-docs-s3-read`.

This policy allows listing and reading only `s3://databend-toronto/load/`. It does not allow writes or deletes.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GetBucketRegion",
      "Effect": "Allow",
      "Action": "s3:GetBucketLocation",
      "Resource": "arn:aws:s3:::databend-toronto"
    },
    {
      "Sid": "ListLoadPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::databend-toronto",
      "Condition": {
        "StringLike": {
          "s3:prefix": ["load/", "load/*"]
        }
      }
    },
    {
      "Sid": "ReadLoadObjects",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::databend-toronto/load/*"
    }
  ]
}
```

The bucket ARN and object ARN have different purposes. `s3:ListBucket` applies to the bucket ARN. `s3:GetObject` applies to the object ARN, which includes the prefix and `/*`.

This screenshot shows the English AWS console with a separate test bucket. Use your own bucket name in the policy.

![English AWS IAM policy editor with a prefix-scoped S3 read policy](/img/cloud/iam/aws/en/create-policy.png)

## Create the IAM Role and Trust Policy {/* #step-3-create-the-iam-role-and-trust-policy */}

### Configure the Trust Relationship

In the IAM console, open **Roles → Create role → Custom trust policy**.

![Select Custom trust policy in the AWS IAM role wizard](/img/cloud/iam/aws/en/select-trusted-entity.png)

Paste the following trust policy. Replace `<databend-cloud-principal-arn>` with the Databend Cloud principal ARN. Replace `my-external-id-123` with your chosen external ID.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "<databend-cloud-principal-arn>"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "my-external-id-123"
        }
      }
    }
  ]
}
```

The principal is hidden in this screenshot. Use the principal ARN for your organization and your own external ID.

![Configure the Databend principal and External ID in the trust policy editor](/img/cloud/iam/aws/en/trust-policy.png)

### Attach the Read Policy

Complete the role wizard with these settings:

| Setting | Value |
|---------|-------|
| Trusted entity type | **Custom trust policy** |
| Permissions policy | `databend-docs-s3-read` |
| Role name | `databend-docs-s3-role` |

Attach only the dedicated read policy for this tutorial.

![Attach only the dedicated S3 read policy](/img/cloud/iam/aws/en/attach-policy.png)

### Copy Your Role ARN

After you create the role, copy **ARN** from its details page. For example: `arn:aws:iam::987654321987:role/databend-docs-s3-role`.

Check the **Permissions** and **Trust relationships** tabs. The role must have the S3 read policy and trust the Databend Cloud principal with the matching external ID. Do not set `Principal` to `*`. The trust policy allows role assumption; it does not replace the S3 permissions policy.

Account IDs are hidden in this screenshot. Copy the full ARN from your own AWS console.

![Find the customer role ARN and attached policy on the role details page](/img/cloud/iam/aws/en/role-details.png)

## Use the Role in Databend {/* #step-4-create-a-connection-and-stage */}

The AWS setup is complete. Continue with [Create a Connection and Stage](/guides/load-data/load/s3#connect-to-s3) in the loading tutorial. Select its **IAM Role** tab.

Use the values from this guide:

| Databend setting | Value |
|------------------|-------|
| `ROLE_ARN` | Your newly created customer role ARN |
| `EXTERNAL_ID` | The value in the role's `sts:ExternalId` condition |
| `REGION` | Your bucket's AWS Region |
| Stage URL | The bucket and prefix allowed by the permissions policy, such as `s3://databend-toronto/load/` |

### Verify Access and Load Data {/* #step-5-verify-access-and-load-data */}

<span id="list-files" />
<span id="read-the-test-file" />
<span id="load-the-test-file" />

Follow [Verify S3 Access](/guides/load-data/load/s3#verify-s3-access) before you load data. `LIST` must show `books.parquet`. Reading the file must return the two sample records. A successful list alone does not prove object read or KMS decryption access.

Then continue with [Load the Sample Data](/guides/load-data/load/s3#load-sample-data). The target table should contain two rows. Keep `PURGE = FALSE` to retain the source object.

The loading tutorial contains the shared SQL for both authentication methods. You do not need a separate Connection, Stage, or table for each guide.

## Additional Permissions {/* #additional-permissions */}

Add permissions only when your workload needs them. Keep object permissions limited to the required prefix.

| Operation | Additional AWS permissions |
|-----------|----------------------------|
| Export data to S3 with `COPY INTO <location>` | `s3:PutObject`; large multipart uploads can also require `s3:AbortMultipartUpload` and `s3:ListMultipartUploadParts` |
| Delete source files with `PURGE = TRUE` or `REMOVE` | `s3:DeleteObject` |
| Read objects encrypted with a customer managed AWS KMS key | `kms:Decrypt` on the key; the KMS key policy must also allow access |
| Write objects encrypted with a customer managed AWS KMS key | `kms:GenerateDataKey` and, for multipart uploads, `kms:Decrypt`; the KMS key policy must also allow access |

Keep `PURGE` disabled for the read-only example. Do not grant `s3:*` or `s3:*Object` just to resolve an access error.

:::note
These ARN examples use the AWS commercial partition (`arn:aws`). A Chinese console language does not change the AWS partition. AWS China uses `arn:aws-cn` and requires a compatible deployment and trust setup. Confirm support for your deployment with Databend Cloud support before you configure cross-partition access.
:::

## Troubleshooting

| Symptom | What to check |
|---------|---------------|
| `AssumeRole` fails or STS returns `AccessDenied` | Use your role ARN for `ROLE_ARN`. Check that the trust policy contains the exact Databend Cloud principal ARN. Check that `EXTERNAL_ID` matches `sts:ExternalId`. If the error remains after these checks, ask support to check the Databend-side permissions for `sts:AssumeRole`. |
| AWS reports an invalid principal when you save the trust policy | Replace the principal placeholder with **Role ARN** from the Databend Cloud **Connect** dialog. Check the full ARN, including its role path and AWS partition. |
| `LIST` returns `AccessDenied` | Check `s3:ListBucket`, the bucket ARN, and the `s3:prefix` condition. Check bucket policies, organization policies, permissions boundaries, and endpoint policies for an explicit deny. |
| `LIST` succeeds, but reading the file fails | Check `s3:GetObject` on the object ARN. For KMS-encrypted data, check `kms:Decrypt` and the KMS key policy. |
| No files appear | Check the bucket, Stage prefix, and object key. Upload `books.parquet` to `load/books.parquet`, not to the bucket root. |
| An endpoint or Region error occurs | Set `REGION` to the bucket's AWS Region. Check network restrictions separately. IAM authorization does not provide private network connectivity. |
| Databend reports a SQL privilege error | Check the current Databend role. AWS permissions do not grant Databend privileges. Other users need the appropriate Stage and table privileges. |
| A policy change does not take effect immediately | Allow time for AWS IAM changes to propagate. Retry the operation. |

## Maintain or Remove Access

- Review both policies when you add a bucket, change a prefix, or enable writes.
- Stages usually copy Connection parameters when you create them. Replacing a Connection does not update those stored parameters. To change the role ARN or external ID for an existing Stage, recreate the Stage with the new Connection parameters. See [CREATE CONNECTION](/sql/sql-commands/ddl/connection/create-connection).
- To revoke AWS access, remove the applicable permissions or trust relationship. Do not assume that dropping a Connection revokes an existing Stage's access. Role assumption uses temporary credentials, so a trust-policy change alone does not invalidate credentials already issued by STS. See [Revoking IAM role temporary security credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html).

For Databend test objects, follow [Clean Up](/guides/load-data/load/s3#cleanup) in the loading tutorial. Those SQL commands do not delete S3 objects or AWS IAM resources. Remove test-only AWS roles and policies separately when you no longer need them.
