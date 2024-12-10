---
title: Automating JSON Log Loading with Vector
---

In this tutorial, we'll simulate generating logs locally, collect them using [Vector](https://vector.dev/), store them in S3, and automate their ingestion into Databend Cloud using scheduled tasks.

## Before You Start

Before you start, ensure you have the following prerequisites in place:

- **Amazon S3 Bucket**: An S3 bucket where logs collected by Vector will be stored. [Learn how to create an S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html).
- **AWS Credentials**: AWS Access Key ID and Secret Access Key with sufficient permissions for accessing your S3 bucket. [Manage your AWS credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys).
- **AWS CLI**: Ensure that the [AWS CLI](https://aws.amazon.com/cli/) is installed and configured with the necessary permissions to access your S3 bucket.
- **Docker**: Ensure that [Docker](https://www.docker.com/) is installed on your local machine, as it will be used to set up Vector.

## Step 1: Create Target Folder in S3 Bucket

To store the logs collected by Vector, create a folder named logs in your S3 bucket. In this tutorial, we use `s3://databend-doc/logs/` as the target location. 

This command creates an empty folder named `logs` in the `databend-doc` bucket:

```bash
aws s3api put-object --bucket databend-doc --key logs/
```

## Step 2: Create Local Log File

Simulate log generation by creating a local log file. In this tutorial, we use `/Users/eric/Documents/logs/app.log` as the file path.

Add the following JSON lines to the file to represent sample log events:

```json title='app.log'
{"user_id": 1, "event": "login", "timestamp": "2024-12-08T10:00:00Z"}
{"user_id": 2, "event": "purchase", "timestamp": "2024-12-08T10:05:00Z"}
```

## Step 3: Configure & Run Vector

1. Create a Vector configuration file named `vector.yaml` on your local machine. In this tutorial, we create it at `/Users/eric/Documents/vector.yaml` with the following content:

```yaml title='vector.yaml'
sources:
  logs:
    type: file
    include:
      - "/logs/app.log"
    read_from: beginning

transforms:
  extract_message:
    type: remap
    inputs:
      - "logs"
    source: |
      . = parse_json(.message) ?? {}

sinks:
  s3:
    type: aws_s3
    inputs:
      - "extract_message"
    bucket: databend-doc
    region: us-east-2
    key_prefix: "logs/" 
    content_type: "text/plain" 
    encoding:
      codec: "native_json" 
    auth:
      access_key_id: "<your-access-key-id>"
      secret_access_key: "<your-secret-access-key>"
```

2. Start Vector using Docker, mapping the configuration file and local logs directory:

```bash
docker run \
  -d \
  -v /Users/eric/Documents/vector.yaml:/etc/vector/vector.yaml:ro \
  -v /Users/eric/Documents/logs:/logs \
  -p 8686:8686 \
  --name vector \
  timberio/vector:nightly-alpine
```

3. Wait for a moment, then check if any logs have been synced to the `logs` folder on S3:

```bash
aws s3 ls s3://databend-doc/logs/
```

If the log file has been successfully synced to S3, you should see output similar to this:

```bash

```




