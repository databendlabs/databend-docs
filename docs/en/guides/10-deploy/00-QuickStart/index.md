---
title: QuickStart
slug: /deploy/quickstart
---

Databend Quick Start: Experience Databend in 5 Minutes
This guide will help you quickly set up Databend, connect to it, and perform a basic data import.

## 1. Start Databend with Docker
Run the following command to launch Databend in a container:

```
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
Check if Databend is running successfully:

```
docker logs -f databend
```
Wait until you see logs indicating that Databend and MinIO are ready.

## 2. Connect to Databend
Install bendsql (Databend CLI):

```
curl -fsSL https://repo.databend.com/install/bendsql.sh | bash
echo "export PATH=$PATH:~/.bendsql/bin" >>~/.bash_profile
source ~/.bash_profile
```

Connect to Databend:
```
bendsql -udatabend -pdatabend
```

## 3. Perform a Basic Data Import
### Step 1: Create an External Bucket (myupload)
Install mc (MinIO client) and create a bucket:

```
wget https://dl.min.io/client/mc/release/linux-amd64/mc
sudo cp mc /usr/local/bin/ && sudo chmod +x /usr/local/bin/mc
mc alias set myminio http://localhost:9000 minioadmin minioadmin
mc mb myminio/myupload
mc ls myminio
```
Expected output:
```
[0001-01-01 08:05:43 LMT]     0B databend/
[2025-04-12 08:43:59 CST]     0B myupload/
```

### Step 2: Generate a CSV and Upload to myupload
```
echo -e "id,name,age,city\n1,John,32,New York\n2,Emma,28,London\n3,Liam,35,Paris\n4,Olivia,40,Berlin\n5,Noah,29,Tokyo" > data.csv
mc cp data.csv myminio/myupload/
mc ls myminio/myupload/
```
### Step 3: Create an External Stage and Check Data
Run in bendsql:
``` 
CREATE STAGE mystage 's3://myupload' 
CONNECTION=(
  endpoint_url='http://127.0.0.1:9000',
  access_key_id='minioadmin',
  secret_access_key='minioadmin',
  region='us-east-1'
);
```
Show  files in the external stage @mystage:
```
LIST @mystage;
```
| name     | size   | md5               | last_modified        | creator     |
|----------|--------|-------------------|-----------------------|-------------|
| String   | UInt64 | Nullable(String)  | String               | Nullable(String) |
| data.csv | 104    | "a27fa15258911f534fb795a8c64e05d4" | 2025-04-12 00:51:11.015 +0000 | NULL       |

Preview the CSV data:
```
SELECT $1, $2, $3, $4 FROM @mystage/data.csv (FILE_FORMAT=>'CSV') LIMIT 10;
```
| \$1                | \$2                | \$3                | \$4                |
|-------------------|-------------------|-------------------|-------------------|
| Nullable(String)  | Nullable(String)  | Nullable(String)  | Nullable(String)  |
| id                | name              | age               | city              |
| 1                 | John              | 32                | New York          |
| 2                 | Emma              | 28                | London            |
| 3                 | Liam              | 35                | Paris             |
| 4                 | Olivia            | 40                | Berlin            |
| 5                 | Noah              | 29                | Tokyo             |


### Step 4: Create a Table and Load Data
```
CREATE DATABASE wubx;
USE wubx;

CREATE TABLE t_person (
  id INT,
  name VARCHAR,
  age INT UNSIGNED,
  city VARCHAR
);

COPY INTO t_person FROM @mystage PATTERN='.*[.]csv' FILE_FORMAT=(TYPE=CSV, SKIP_HEADER=1);

```

| File      | Rows_loaded | Errors_seen | First_error      | First_error_line |
|-----------|-------------|-------------|------------------|------------------|
| String    | Int32       | Int32       | Nullable(String) | Nullable(Int32)  |
| data.csv  | 5           | 0           | NULL             | NULL             |

### Step 5: Query the Data
```
SELECT * FROM t_person;
```
| id       | name     | age      | city     |
|----------|----------|----------|----------|
| Nullable(Int32) | Nullable(String) | Nullable(UInt32) | Nullable(String) |
| 1        | John     | 32       | New York |
| 2        | Emma     | 28       | London   |
| 3        | Liam     | 35       | Paris    |
| 4        | Olivia   | 40       | Berlin   |
| 5        | Noah     | 29       | Tokyo    |

🚀 Now you’ve successfully imported data into Databend! 

## Alternative: Databend Cloud
If setting up a local environment is troublesome, you can try [Databend Cloud](https://www.databend.com) for a fully managed experience.


> 💬 **Community Support**  
> Have questions? Connect with our team:  
> 💬 [Slack Discussion](https://link.databend.com/join-slack)
