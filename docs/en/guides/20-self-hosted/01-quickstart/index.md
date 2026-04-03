---
title: QuickStart
---

Get Databend running locally in under 5 minutes.

## 1. Start Databend

```shell
docker run -d \
    --name databend \
    --network host \
    -e MINIO_ENABLED=true \
    -e QUERY_DEFAULT_USER=databend \
    -e QUERY_DEFAULT_PASSWORD=databend \
    -v minio_data_dir:/var/lib/minio \
    --restart unless-stopped \
    datafuselabs/databend
```

Wait for Databend to be ready:

```shell
docker logs -f databend
```

Look for `Databend Query started` in the output.

## 2. Connect

Install BendSQL:

```shell
curl -fsSL https://repo.databend.com/install/bendsql.sh | bash
echo "export PATH=$PATH:~/.bendsql/bin" >> ~/.bash_profile
source ~/.bash_profile
```

Connect to Databend:

```shell
bendsql -u databend -p databend
```

## 3. Verify

```sql
CREATE TABLE t (id INT, name VARCHAR);
INSERT INTO t VALUES (1, 'Databend');
SELECT * FROM t;
```

You're all set. For a more realistic setup with separate components, see [Deploying on Docker](../02-deployment/01-non-production/00-deploying-local.md).

## Alternative: Databend Cloud

Skip the local setup and try [Databend Cloud](https://www.databend.com) for a fully managed experience.
