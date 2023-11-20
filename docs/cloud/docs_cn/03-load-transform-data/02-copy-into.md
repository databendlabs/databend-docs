---
title: 从文件导入
---

Databend Cloud 使您能够通过在工作区中编辑和运行 COPY INTO 语句来从一个或多个文件导入数据。这些文件可以来自不同的位置，包括内部或外部 Stage，以及外部存储，例如对象存储服务的 Bucket、远程服务器和 IPFS。

COPY INTO 语句支持从 CSV、JSON、NDJSON 和 parquet 文件导入数据。如果文件被压缩为 GZIP、BZ2、BROTLI、ZSTD、DEFLATE 或 RAW_DEFLATE 格式，它可以自动解压缩文件。

从文件导入数据时，COPY INTO 语句从文件导入所有数据，以在文件级别提供事务保证。默认情况下它会跳过重复的文件，也就是说，如果您之前已经从文件中导入过数据，COPY INTO 语句将跳过该文件。

![](@site/static/img/documents/loading-data/copy-into.png)

## 语法和示例

COPY INTO 语句提供了广泛的选项以适应不同的用例。有关语法和用法示例，请参考 [COPY INTO table 命令](/sql/sql-commands/dml/dml-copy-into-table)

## 从 Stage 导入

请参考[使用 Stage](01-stages.md)。

## 从外部存储导入

编写一条从外部存储导入数据的 COPY INTO 语句主要包括以下步骤：

1. [提供连接信息](#提供连接信息)
2. [筛选文件](#筛选文件)

### 提供连接信息

COPY INTO 语句通常需要连接信息才能访问您的外部文件。以下示例包含用于访问存储文件的 S3 存储桶的连接信息：

```sql
COPY INTO books
FROM 's3://<your-bucket>/data/'
CONNECTION=(
  aws_key_id='<your-access-key-id>'
  aws_secret_key='<your-secret-access-key>')
PATTERN ='.*[.]csv'
FILE_FORMAT = (type = 'CSV' field_delimiter = ','  record_delimiter = '\n' skip_header = 0);
```

以下示例包含用于访问 Azure Blob 和 Google Cloud Storage 中的容器的连接信息：

```sql
COPY INTO books
FROM 'azblob://<container>[<path>]'
CONNECTION = (
  ENDPOINT_URL = 'https://<endpoint-URL>'
  ACCOUT_NAME = '<your-account-name>'
  ACCOUNT_KEY = '<your-account-key>'
)
...
```

```sql
COPY INTO books
FROM 'gcs://<container>[<path>]'
CONNECTION = (
  ENDPOINT_URL = 'https://<endpoint-URL>'
  CREDENTIAL = '<your-credential>'
)
...
```

您还可以直接通过 URL 访问的远程文件导入数据：

```sql
COPY INTO mytable
FROM 'https://repo.databend.rs/dataset/stateful/ontime_200{6,7,8}_200.csv'
FILE_FORMAT = (type = 'CSV');
```

### 筛选文件

在使用 COPY INTO 语句导入数据时，您可以通过多种方式按名称过滤文件。

**FILES** 选项允许您明确指定文件。例如：

```sql
COPY INTO books
FROM @mystage/data/
FILES = ("books1.csv", "books2.csv")
FILE_FORMAT = (type = 'CSV' field_delimiter = ','  record_delimiter = '\n' skip_header = 0);
```

**PATTERN** 选项允许您指定文件名模式来过滤文件。例如：

```sql
COPY INTO books
FROM @mystage/data/
PATTERN = "books.*[.]csv"
FILE_FORMAT = (type = 'CSV' field_delimiter = ','  record_delimiter = '\n' skip_header = 0);
```

COPY INTO 语句允许您使用 glob 模式在 URL 中指定多个文件。以下示例从文件“ontime_2006.csv”、“ontime_2007.csv”和“ontime_2008.csv”导入数据：

```sql
COPY INTO ontime
FROM 'https://repo.databend.rs/dataset/stateful/ontime_200{6,7,8}_200.csv'
FILE_FORMAT = (type = 'CSV' field_delimiter = ','  record_delimiter = '\n' skip_header = 0);
```

以下示例从文件“ontime_2006_1.csv”、“ontime_2006_2.csv”和“ontime_2006_3.csv”导入数据：

```sql
COPY INTO ontime
FROM 'https://repo.databend.rs/dataset/stateful/ontime_2006_[1-3].csv'
FILE_FORMAT = (type = 'CSV' field_delimiter = ','  record_delimiter = '\n' skip_header = 0);
```

## 教程 - 使用 Python 从 GH 存档导入

[GH Archive](https://www.gharchive.org/) 是一个记录公共 GitHub 时间线的公共数据集。它每小时自动生成一个压缩文件。这些文件可以通过 https://data.gharchive.org/{year}-{month}-{day}-{hour}.json.gz 模式的 URL 访问。

在本教程中，您将使用 COPY INTO 语句创建一个 Python 脚本，以从 GH Archive 导入一天内生成的数据。

### 步骤 1. 创建数据库和 SQL 用户

1. 在工作区中创建一个名为 `github` 的数据库：

```sql
CREATE DATABASE github;
```

2. 创建一个名为 `github` 的 SQL 用户并授予该用户权限：

```sql
CREATE USER github IDENTIFIED BY '<YOUR_PASSWORD>';

GRANT SELECT, INSERT, CREATE ON github.* TO github;
```

### 步骤 2. 创建计算集群

1. 创建一个名为 `medium-compute1` 的计算集群。创建计算集群的方法参见 [管理计算集群](../02-using-databend-cloud/00-warehouses.md#managing)。

2. 获取创建的计算集群的连接信息。有关如何执行此操作，请参阅 [连接到计算集群](../02-using-databend-cloud/00-warehouses.md#connecting)。

### 步骤 3. 安装 Python 依赖项

Databend Cloud 支持 ClickHouse HTTP 协议。您可以使用 `clickhouse-sqlalchemy` 将 Databend Cloud 集成到您的 Python 脚本中：

```python
pip install SQLAlchemy==1.4
pip install clickhouse-sqlalchemy==0.2.1
```

### 步骤 4. 编写脚本

将以下代码中的变量 WAREHOUSE_CONN 更新为您在[步骤 2](#step-2-create-a-warehouse) 中获得的实际连接信息，然后将代码保存为名为 syncgithub.py 的文件：

```python
import time
import datetime
from sqlalchemy import create_engine

# Update this DSN with your warehouse's connection information
WAREHOUSE_CONN = 'clickhouse+http://<YOUR_USER>:<YOUR_PASSWORD>@<YOUR_HOST>:443/<YOUR_DATABASE>?protocol=https'

def gen_copy_sql(year, month, day):
    sql="COPY INTO github_events FROM 'https://data.gharchive.org/%d-%02d-%02d-[0-23].json.gz' FILE_FORMAT = ( TYPE =NDJSON compression = auto )"% (year, month, day)
    return sql

def execute_sql(sql):
    print("execute sql: %s" % sql)
    start_time = float(time.time())
    engine = create_engine(WAREHOUSE_CONN, connect_args={'protocol': 'https', 'port': 443})
    r = engine.execute(sql)
    duration = float(time.time()) - start_time
    print("duration: %ss result: %s" % (duration, r.fetchall()))

execute_sql("""
CREATE TABLE IF NOT EXISTS `github_events` (
  `id` VARCHAR,
  `type` VARCHAR,
  `actor` VARIANT,
  `repo` VARIANT,
  `payload` VARIANT,
  `public` BOOLEAN,
  `created_at` TIMESTAMP(0),
  `org` VARIANT
) ENGINE=FUSE
""")
# execute_sql("show tables")

today = datetime.date.today()
yesterday = today - datetime.timedelta(days=1)
execute_sql(gen_copy_sql(yesterday.year, yesterday.month, yesterday.day))
execute_sql("SELECT count(*) FROM github_events")
```

### 步骤 5. 运行脚本

在 Python shell 中运行脚本：

```python
python syncgithub.py
```

第一次执行脚本大约需要两分钟。输出如下：

```python
execute sql:
CREATE TABLE IF NOT EXISTS `github_events` (
  `id` VARCHAR,
  `type` VARCHAR,
  `actor` VARIANT,
  `repo` VARIANT,
  `payload` VARIANT,
  `public` BOOLEAN,
  `created_at` TIMESTAMP(0),
  `org` VARIANT
) ENGINE=FUSE

duration: 2.0071640014648438s result: []
execute sql: COPY INTO github_events FROM 'https://data.gharchive.org/2022-09-26-[0-23].json.gz' FILE_FORMAT = ( TYPE =NDJSON compression = auto )
duration: 175.7749960422516s result: []
duration: 1.708847999572754s result: [(4302833,)]
```

:::tip
COPY INTO 语句会自动跳过重复文件，因此您可以安全地重试该命令而不会在 Databend Cloud 中生成重复数据。

您可以在云主机中使用脚本创建计划任务，以同步来自 [GH Archive](https://www.gharchive.org/) 的每日增量数据。例如：

```python
0 1 * * * python /home/myuser/syncgithub.py
```
:::