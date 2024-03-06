---
title: Airbyte
---

<p align="center">
<img src="/img/integration/integration-airbyte.png"/>
</p>

## What is [Airbyte](https://airbyte.com/)?


* Airbyte is an open-source data integration platform that syncs data from applications, APIs & databases to data warehouses lakes & DBs.
* You could load data from any airbyte source to Databend.

Currently we implemented an experimental airbyte destination allow you to send data from your airbyte source to databend

**NOTE**: 

currently we only implemented the `append` mode, which means the destination will only append data to the table, and will not overwrite, update or delete any data.
Plus, we assume that your databend destination is **S3 Compatible** since we used presign to copy data from databend stage to table.

To check whether your backend support the integration, you could simply run the following command

```sql
CREATE STAGE IF NOT EXISTS airbyte_stage FILE_FORMAT = (TYPE = CSV);
PRESIGN UPLOAD @airbyte_stage/test.csv;
```

If you got an error like `Code: 501, Text = Presign is not supported`, then you could not use the integration.
Please read [this](../../10-deploy/01-deploy/01-non-production/00-deploying-local.md) for how to use S3 as a storage backend.

## Create a Databend User

Connect to Databend server with MySQL client:
```shell
mysql -h127.0.0.1 -uroot -P3307 
```

Create a user:
```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

Create a Database:
```sql
CREATE DATABASE airbyte;
```

Grant privileges for the user:
```sql
GRANT ALL PRIVILEGES ON airbyte.* TO user1;
```

## Configure Airbyte

To use Databend with Airbyte, you should add our customized connector to your Airbyte Instance.
You could add the destination in Settings -> Destinations -> Custom Destinations -> Add a Custom Destination Page.
Our custom destination image is `datafuselabs/destination-databend:alpha`
<p align="center">
<img src="/img/integration/integration-airbyte-plugins.png"/>
</p>

## Setup Databend destination
**Note**: 

You should have a databend instance running and accessible from your airbyte instance.
For local airbyte, you could not connect docker compose with your localhost network.
You may take a look at [ngrok](https://ngrok.com/) to tunnel your service(**NEVER** expose it on your production environment).

<p align="center">
<img src="/img/integration/integration-airbyte-destinations.png"/>
</p>

## Test your integration
You could use Faker source to test your integration, after sync completed, you could run the following command to see expected uploaded data.

```sql
select * from default._airbyte_raw_users limit 5;
```