---
title: Automating JSON Log Loading with Vector
---

In this tutorial, we'll simulate generating logs locally, collect them using [Vector](https://vector.dev/), store them in S3, and automate their ingestion into Databend Cloud using scheduled tasks.

## Before You Start

Before you start, ensure you have the following prerequisites in place:

- **Amazon S3 Bucket**: An S3 bucket where logs collected by Vector will be stored. [Learn how to create an S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html). In this tutorial, we use `s3://databend-doc/` as the location for staging the collected logs.
- **AWS Credentials**: AWS Access Key ID and Secret Access Key with sufficient permissions for accessing the S3 bucket. [Manage your AWS credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys).
- **Docker**: Ensure that [Docker](https://www.docker.com/) is installed on your local machine, as it will be used to set up Vector.