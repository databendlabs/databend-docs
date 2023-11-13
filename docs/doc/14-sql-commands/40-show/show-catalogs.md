---
title: SHOW CATALOGS
---

Shows all the created catalogs.

## Syntax

```sql
SHOW CATALOGS [LIKE '<pattern>']
```

## Examples

```sql
SHOW CATALOGS;

----
default

CREATE CATALOG iceberg_ctl
TYPE = ICEBERG
CONNECTION = (
    URL = 's3://databend/iceberg/'
    AWS_KEY_ID = 'minioadmin'
    AWS_SECRET_KEY = 'minioadmin'
    ENDPOINT_URL = 'http://127.0.0.1:9000'
    REGION = 'us-east-2'
);

SHOW CATALOGS LIKE 'iceberg_ctl';

----
iceberg_ctl
```