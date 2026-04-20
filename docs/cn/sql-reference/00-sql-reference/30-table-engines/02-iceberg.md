---
id: iceberg
title: Apache Iceberg™ 表
sidebar_label: Apache Iceberg™ 表
slug: /sql-reference/table-engines/iceberg
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.725"/>

Databend 支持集成 [Apache Iceberg™](https://iceberg.apache.org/) catalog，增强了数据管理和分析的兼容性与灵活性。通过将 Apache Iceberg™ 强大的元数据和存储管理能力无缝融入平台，进一步扩展了 Databend 的功能边界。

## Iceberg 快速入门

如果你想快速体验 Iceberg 并在本地进行表操作实验，可以使用这个[基于 Docker 的入门项目](https://github.com/databendlabs/iceberg-quick-start)。该环境支持：

- 运行带 Iceberg 支持的 Spark
- 使用 REST catalog（Iceberg REST Fixture）
- 通过 MinIO 模拟 S3 兼容的对象存储
- 将 TPC-H 示例数据加载到 Iceberg 表中进行查询测试

### 前置条件

开始前，请确保系统已安装 Docker 和 Docker Compose。

### 启动 Iceberg 环境

```bash
git clone https://github.com/databendlabs/iceberg-quick-start.git
cd iceberg-quick-start
docker compose up -d
```

该命令会启动以下服务：

- `spark-iceberg`：带 Iceberg 的 Spark 3.4
- `rest`：Iceberg REST Catalog
- `minio`：S3 兼容的对象存储
- `mc`：MinIO 客户端（用于初始化 bucket）

```bash
WARN[0000] /Users/eric/iceberg-quick-start/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
[+] Running 5/5
 ✔ Network iceberg-quick-start_iceberg_net  Created                        0.0s
 ✔ Container iceberg-rest-test              Started                        0.4s
 ✔ Container minio                          Started                        0.4s
 ✔ Container mc                             Started                        0.6s
 ✔ Container spark-iceberg                  S...                           0.7s
```

### 通过 Spark Shell 加载 TPC-H 数据

执行以下命令，生成并加载 TPC-H 示例数据到 Iceberg 表：

```bash
docker exec spark-iceberg bash /home/iceberg/load_tpch.sh
```

```bash
Collecting duckdb
  Downloading duckdb-1.2.2-cp310-cp310-manylinux_2_24_aarch64.manylinux_2_28_aarch64.whl (18.7 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 18.7/18.7 MB 5.8 MB/s eta 0:00:00
Requirement already satisfied: pyspark in /opt/spark/python (3.5.5)
Collecting py4j==0.10.9.7
  Downloading py4j-0.10.9.7-py2.py3-none-any.whl (200 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 200.5/200.5 kB 5.9 MB/s eta 0:00:00
Installing collected packages: py4j, duckdb
Successfully installed duckdb-1.2.2 py4j-0.10.9.7

[notice] A new release of pip is available: 23.0.1 -> 25.1.1
[notice] To update, run: pip install --upgrade pip
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
25/05/07 12:17:27 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
25/05/07 12:17:28 WARN Utils: Service 'SparkUI' could not bind on port 4040. Attempting port 4041.
[2025-05-07 12:17:18] [INFO] Starting TPC-H data generation and loading process
[2025-05-07 12:17:18] [INFO] Configuration: Scale Factor=1, Data Dir=/home/iceberg/data/tpch_1
[2025-05-07 12:17:18] [INFO] Generating TPC-H data with DuckDB (Scale Factor: 1)
[2025-05-07 12:17:27] [INFO] Generated 8 Parquet files in /home/iceberg/data/tpch_1
[2025-05-07 12:17:28] [INFO] Loading data into Iceberg catalog
[2025-05-07 12:17:33] [INFO] Created Iceberg table: demo.tpch.part from part.parquet
[2025-05-07 12:17:33] [INFO] Created Iceberg table: demo.tpch.region from region.parquet
[2025-05-07 12:17:33] [INFO] Created Iceberg table: demo.tpch.supplier from supplier.parquet
[2025-05-07 12:17:35] [INFO] Created Iceberg table: demo.tpch.orders from orders.parquet
[2025-05-07 12:17:35] [INFO] Created Iceberg table: demo.tpch.nation from nation.parquet
[2025-05-07 12:17:40] [INFO] Created Iceberg table: demo.tpch.lineitem from lineitem.parquet
[2025-05-07 12:17:40] [INFO] Created Iceberg table: demo.tpch.partsupp from partsupp.parquet
[2025-05-07 12:17:41] [INFO] Created Iceberg table: demo.tpch.customer from customer.parquet
+---------+---------+-----------+
|namespace|tableName|isTemporary|
+---------+---------+-----------+
|     tpch| customer|      false|
|     tpch| lineitem|      false|
|     tpch|   nation|      false|
|     tpch|   orders|      false|
|     tpch|     part|      false|
|     tpch| partsupp|      false|
|     tpch|   region|      false|
|     tpch| supplier|      false|
+---------+---------+-----------+

[2025-05-07 12:17:42] [SUCCESS] TPCH data generation and loading completed successfully
```

### 在 Databend 中查询数据

TPC-H 表加载完成后，即可在 Databend 中查询数据：

1. 在 Docker 中启动 Databend：

```bash
docker network create iceberg_net
```

```bash
docker run -d \
  --name databend \
  --network iceberg_net \
  -p 3307:3307 \
  -p 8000:8000 \
  -p 8124:8124 \
  -p 8900:8900 \
  datafuselabs/databend
```

2. 先通过 BendSQL 连接 Databend，再创建 Iceberg catalog：

```bash
bendsql
```

```bash
Welcome to BendSQL 0.24.1-f1f7de0(2024-12-04T12:31:18.526234000Z).
Connecting to localhost:8000 as user root.
Connected to Databend Query v1.2.725-8d073f6b7a(rust-1.88.0-nightly-2025-04-21T11:49:03.577976082Z)
Loaded 1436 auto complete keywords from server.
Started web server at 127.0.0.1:8080
```

```sql
CREATE CATALOG iceberg TYPE = ICEBERG CONNECTION = (
    TYPE = 'rest'
    ADDRESS = 'http://host.docker.internal:8181'
    warehouse = 's3://warehouse/wh/'
    "s3.endpoint" = 'http://host.docker.internal:9000'
    "s3.access-key-id" = 'admin'
    "s3.secret-access-key" = 'password'
    "s3.region" = 'us-east-1'
);
```

3. 切换到新创建的 catalog：

```sql
USE CATALOG iceberg;
```

4. 查看可用数据库：

```sql
SHOW DATABASES;
```

```sql
╭──────────────────────╮
│ databases_in_iceberg │
│        String        │
├──────────────────────┤
│ tpch                 │
╰──────────────────────╯
```

5. 执行示例查询，对 TPC-H 数据进行聚合：

```bash
SELECT
    l_returnflag,
    l_linestatus,
    SUM(l_quantity) AS sum_qty,
    SUM(l_extendedprice) AS sum_base_price,
    SUM(l_extendedprice * (1 - l_discount)) AS sum_disc_price,
    SUM(l_extendedprice * (1 - l_discount) * (1 + l_tax)) AS sum_charge,
    AVG(l_quantity) AS avg_qty,
    AVG(l_extendedprice) AS avg_price,
    AVG(l_discount) AS avg_disc,
    COUNT(*) AS count_order
FROM
    iceberg.tpch.lineitem
GROUP BY
    l_returnflag,
    l_linestatus
ORDER BY
    l_returnflag,
    l_linestatus;
```

```sql
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   l_returnflag   │   l_linestatus   │          sum_qty         │      sum_base_price      │      sum_disc_price      │        sum_charge        │          avg_qty         │         avg_price        │         avg_disc         │ count_order │
│ Nullable(String) │ Nullable(String) │ Nullable(Decimal(38, 2)) │ Nullable(Decimal(38, 2)) │ Nullable(Decimal(38, 4)) │ Nullable(Decimal(38, 6)) │ Nullable(Decimal(38, 8)) │ Nullable(Decimal(38, 8)) │ Nullable(Decimal(38, 8)) │    UInt64   │
├──────────────────┼──────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼─────────────┤
│ A                │ F                │ 37734107.00              │ 56586554400.73           │ 53758257134.8700         │ 55909065222.827692       │ 25.52200585              │ 38273.12973462           │ 0.04998530               │     1478493 │
│ N                │ F                │ 991417.00                │ 1487504710.38            │ 1413082168.0541          │ 1469649223.194375        │ 25.51647192              │ 38284.46776085           │ 0.05009343               │       38854 │
│ N                │ O                │ 76633518.00              │ 114935210409.19          │ 109189591897.4720        │ 113561024263.013782      │ 25.50201964              │ 38248.01560906           │ 0.05000026               │     3004998 │
│ R                │ F                │ 37719753.00              │ 56568041380.90           │ 53741292684.6040         │ 55889619119.831932       │ 25.50579361              │ 38250.85462610           │ 0.05000941               │     1478870 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 数据类型映射

下表列出了 Apache Iceberg™ 与 Databend 之间的数据类型对应关系。注意，表中未列出的 Iceberg 数据类型暂不支持。

| Apache Iceberg™                             | Databend                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| BOOLEAN                                     | [BOOLEAN](/sql/sql-reference/data-types/boolean)                         |
| INT                                         | [INT32](/sql/sql-reference/data-types/numeric#integer-data-types)        |
| LONG                                        | [INT64](/sql/sql-reference/data-types/numeric#integer-data-types)        |
| DATE                                        | [DATE](/sql/sql-reference/data-types/datetime)                           |
| TIMESTAMP/TIMESTAMPZ                        | [TIMESTAMP](/sql/sql-reference/data-types/datetime)                      |
| FLOAT                                       | [FLOAT](/sql/sql-reference/data-types/numeric#floating-point-data-types) |
| DOUBLE                                      | [DOUBLE](/sql/sql-reference/data-types/numeric#floating-point-data-type) |
| STRING/BINARY                               | [STRING](/sql/sql-reference/data-types/string)                           |
| DECIMAL                                     | [DECIMAL](/sql/sql-reference/data-types/decimal)                         |
| ARRAY&lt;TYPE&gt;                           | [ARRAY](/sql/sql-reference/data-types/array)，支持嵌套                   |
| MAP&lt;KEYTYPE, VALUETYPE&gt;               | [MAP](/sql/sql-reference/data-types/map)                                 |
| STRUCT&lt;COL1: TYPE1, COL2: TYPE2, ...&gt; | [TUPLE](/sql/sql-reference/data-types/tuple)                             |
| LIST                                        | [ARRAY](/sql/sql-reference/data-types/array)                             |

## 管理 Catalog

Databend 提供以下命令用于管理 catalog：

- [CREATE CATALOG](#create-catalog)
- [SHOW CREATE CATALOG](#show-create-catalog)
- [SHOW CATALOGS](#show-catalogs)
- [USE CATALOG](#use-catalog)

### CREATE CATALOG

在 Databend 查询引擎中定义并创建一个新的 catalog。

#### 语法

```sql
CREATE CATALOG <catalog_name>
TYPE=ICEBERG
CONNECTION=(
    TYPE='<connection_type>'
    ADDRESS='<address>'
    WAREHOUSE='<warehouse_location>'
    "<connection_parameter>"='<connection_parameter_value>'
    "<connection_parameter>"='<connection_parameter_value>'
    ...
);
```

| 参数                         | 是否必填 | 说明                                                                                                                                                                                                                                  |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<catalog_name>`             | 是       | 要创建的 catalog 名称。                                                                                                                                                                                                               |
| `TYPE`                       | 是       | 指定 catalog 类型。Apache Iceberg™ 对应设置为 `ICEBERG`。                                                                                                                                                                             |
| `CONNECTION`                 | 是       | Iceberg catalog 的连接参数。                                                                                                                                                                                                          |
| `TYPE`（`CONNECTION` 内部）  | 是       | 连接类型。Iceberg 通常设置为 `rest`，表示使用 REST 连接。                                                                                                                                                                             |
| `ADDRESS`                    | 是       | Iceberg 服务的地址或 URL（例如 `http://127.0.0.1:8181`）。                                                                                                                                                                            |
| `WAREHOUSE`                  | 是       | Iceberg warehouse 的位置，通常为 S3 bucket 或兼容的对象存储路径。                                                                                                                                                                    |
| `<connection_parameter>`     | 是       | 与外部存储建立连接所需的参数。具体参数因存储服务和认证方式而异，完整参数列表见下表。                                                                                                                                                  |

| 连接参数                          | 说明                                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `s3.endpoint`                     | S3 endpoint 地址。                                                                                                                     |
| `s3.access-key-id`                | S3 access key ID。                                                                                                                     |
| `s3.secret-access-key`            | S3 secret access key。                                                                                                                 |
| `s3.session-token`                | S3 session token，使用临时凭证时必填。                                                                                                 |
| `s3.region`                       | S3 区域。                                                                                                                              |
| `client.region`                   | S3 客户端使用的区域，优先级高于 `s3.region`。                                                                                          |
| `s3.path-style-access`            | S3 路径风格访问。                                                                                                                      |
| `s3.sse.type`                     | S3 服务端加密（SSE）类型。                                                                                                             |
| `s3.sse.key`                      | S3 SSE 密钥。加密类型为 `kms` 时为 KMS Key ID；加密类型为 `custom` 时为 base-64 编码的 AES256 对称密钥。                              |
| `s3.sse.md5`                      | S3 SSE MD5 校验值。                                                                                                                    |
| `client.assume-role.arn`          | 要代入的 IAM 角色 ARN，替代默认凭证链。                                                                                                |
| `client.assume-role.external-id`  | 代入 IAM 角色时使用的可选外部 ID。                                                                                                     |
| `client.assume-role.session-name` | 代入 IAM 角色时使用的可选会话名称。                                                                                                    |
| `s3.allow-anonymous`              | 是否允许匿名访问（例如公开 bucket/目录）。                                                                                             |
| `s3.disable-ec2-metadata`         | 是否禁止从 EC2 metadata 加载凭证（通常与 `s3.allow-anonymous` 配合使用）。                                                             |
| `s3.disable-config-load`          | 是否禁止从配置文件和环境变量加载配置。                                                                                                 |

### Catalog 类型

Databend 支持四种 Iceberg catalog 类型：

- REST Catalog

REST catalog 通过 RESTful API 与 Iceberg 表交互。

```sql
CREATE CATALOG iceberg_rest TYPE = ICEBERG CONNECTION = (
    TYPE = 'rest'
    ADDRESS = 'http://localhost:8181'
    warehouse = 's3://warehouse/demo/'
    "s3.endpoint" = 'http://localhost:9000'
    "s3.access-key-id" = 'admin'
    "s3.secret-access-key" = 'password'
    "s3.region" = 'us-east-1'
)
```

- AWS Glue Catalog

Glue catalog 的配置同时包含 Glue 服务参数和存储（S3）参数。Glue 服务参数在前，S3 存储参数（以 `s3.` 为前缀）在后。

```sql
CREATE CATALOG iceberg_glue TYPE = ICEBERG CONNECTION = (
    TYPE = 'glue'
    ADDRESS = 'http://localhost:5000'
    warehouse = 's3a://warehouse/glue/'
    "aws_access_key_id" = 'my_access_id'
    "aws_secret_access_key" = 'my_secret_key'
    "region_name" = 'us-east-1'
    "s3.endpoint" = 'http://localhost:9000'
    "s3.access-key-id" = 'admin'
    "s3.secret-access-key" = 'password'
    "s3.region" = 'us-east-1'
)
```

- Storage Catalog（S3Tables Catalog）

Storage catalog 需要提供 `table_bucket_arn` 参数。S3Tables bucket 与普通 bucket 不同，它是由 S3Tables 管理的虚拟 bucket，无法通过 `s3://{bucket_name}/{file_path}` 路径直接访问，所有操作均基于 bucket ARN 进行。

Properties 参数说明：

```
profile_name: 使用的 AWS profile 名称。
region_name: 使用的 AWS 区域。
aws_access_key_id: AWS access key ID。
aws_secret_access_key: AWS secret access key。
aws_session_token: AWS session token。
```

```sql
CREATE CATALOG iceberg_storage TYPE = ICEBERG CONNECTION = (
    TYPE = 'storage'
    ADDRESS = 'http://localhost:9111'
    "table_bucket_arn" = 'my-bucket'
    -- 根据需要添加其他参数
)
```

- Hive Catalog（HMS Catalog）

Hive catalog 需要提供 `ADDRESS` 参数（Hive metastore 地址）以及 `warehouse` 参数（Iceberg warehouse 位置，通常为 S3 bucket 或兼容的对象存储路径）。

```sql
CREATE CATALOG iceberg_hms TYPE = ICEBERG CONNECTION = (
    TYPE = 'hive'
    ADDRESS = '192.168.10.111:9083'
    warehouse = 's3a://warehouse/hive/'
    "s3.endpoint" = 'http://localhost:9000'
    "s3.access-key-id" = 'admin'
    "s3.secret-access-key" = 'password'
    "s3.region" = 'us-east-1'
)
```

### SHOW CREATE CATALOG

返回指定 catalog 的详细配置，包括类型和存储参数。

#### 语法

```sql
SHOW CREATE CATALOG <catalog_name>;
```

### SHOW CATALOGS

显示所有已创建的 catalog。

#### 语法

```sql
SHOW CATALOGS [LIKE '<pattern>']
```

### USE CATALOG

将当前会话切换到指定的 catalog。

#### 语法

```sql
USE CATALOG <catalog_name>
```

## Iceberg Catalog 缓存

Databend 为 Iceberg catalog 提供了专属的 Catalog Metadata Cache。首次查询 Iceberg 表时，元数据会被缓存到内存中。默认缓存有效期为 10 分钟，到期后异步刷新。这样可以避免重复获取元数据，提升 Iceberg 表的查询性能。

如需获取最新元数据，可通过以下命令手动刷新缓存：

```sql
USE CATALOG iceberg;
ALTER DATABASE tpch REFRESH CACHE; -- 刷新 tpch 数据库的元数据缓存
ALTER TABLE tpch.lineitem REFRESH CACHE; -- 刷新 lineitem 表的元数据缓存
```

如果不想使用元数据缓存，可在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中将 `iceberg_table_meta_count` 设置为 `0` 来完全禁用：

```toml
...
# Cache config.
[cache]
...
iceberg_table_meta_count = 0
...
```

除元数据缓存外，Databend 还支持对 Iceberg catalog 表进行表数据缓存，与 Fuse 表的缓存机制类似。详情请参考查询配置参考中的 [cache 章节](/guides/self-hosted/references/node-config/query-config#cache-section)。

## 写入 Iceberg 表

Databend 支持通过 `INSERT INTO` 向 Iceberg 表写入数据。可以直接使用 `ENGINE = ICEBERG` 子句创建 Iceberg 表，并通过 `PARTITION BY` 可选地定义分区列。

### 创建 Iceberg 表

#### 语法

```sql
CREATE TABLE <table_name> (
    <column_definitions>
) ENGINE = ICEBERG
[PARTITION BY (<column1>[, <column2>, ...])];
```

- `ENGINE = ICEBERG`：指定表以 Iceberg 格式存储。
- `PARTITION BY`：可选。定义一个或多个分区列。

#### 支持的数据类型

以下 Databend 数据类型支持写入 Iceberg 表：

| Databend 类型 | Iceberg 类型 |
|---------------|-------------|
| BOOLEAN       | Boolean     |
| INT           | Int         |
| BIGINT        | Long        |
| FLOAT         | Float       |
| DOUBLE        | Double      |
| STRING        | String      |
| DATE          | Date        |
| TIMESTAMP     | Timestamp   |

### 插入数据

使用标准 `INSERT INTO` 语句向 Iceberg 表写入数据：

```sql
INSERT INTO <table_name> VALUES (...), (...);
```

分区表和非分区表均支持单行和多行插入。对于分区表，Databend 会自动将数据路由到对应分区。分区列中的 NULL 值同样支持。

### 示例

#### 非分区表

```sql
CREATE TABLE t_scores(id INT, name STRING, score DOUBLE) ENGINE = ICEBERG;

INSERT INTO t_scores VALUES (1, 'alice', 85.5);
INSERT INTO t_scores VALUES (2, 'bob', 90.0), (3, 'charlie', 75.5);

SELECT * FROM t_scores;

┌──────────────────────────────────────────┐
│   id   │   name   │       score         │
├────────┼──────────┼─────────────────────┤
│ 1      │ alice    │ 85.5                │
│ 2      │ bob      │ 90.0                │
│ 3      │ charlie  │ 75.5                │
└──────────────────────────────────────────┘
```

#### 单字段分区表

```sql
CREATE TABLE t_partitioned(id INT, category STRING, amount DOUBLE)
ENGINE = ICEBERG
PARTITION BY (category);

INSERT INTO t_partitioned VALUES (1, 'A', 100.5);
INSERT INTO t_partitioned VALUES (2, 'B', 200.0), (3, 'A', 150.5), (4, 'C', 400.0);

SELECT * FROM t_partitioned;

┌──────────────────────────────────────────────┐
│   id   │  category  │       amount           │
├────────┼────────────┼────────────────────────┤
│ 1      │ A          │ 100.5                  │
│ 3      │ A          │ 150.5                  │
│ 2      │ B          │ 200.0                  │
│ 4      │ C          │ 400.0                  │
└──────────────────────────────────────────────┘
```

#### 多字段分区表

```sql
CREATE TABLE t_multi_part(id INT, region STRING, year INT, amount DOUBLE)
ENGINE = ICEBERG
PARTITION BY (region, year);

INSERT INTO t_multi_part VALUES
    (1, 'US', 2023, 100.5),
    (2, 'EU', 2023, 200.5),
    (3, 'US', 2024, 300.5),
    (4, 'EU', 2024, 400.5);

-- 向已有分区插入数据
INSERT INTO t_multi_part VALUES
    (5, 'US', 2023, 500.5);

-- 分区列支持 NULL 值
INSERT INTO t_multi_part VALUES
    (6, NULL, 2023, 600.5),
    (7, 'US', NULL, 700.5);

SELECT * FROM t_multi_part;

┌──────────────────────────────────────────────────────┐
│   id   │  region  │   year   │       amount          │
├────────┼──────────┼──────────┼───────────────────────┤
│ 1      │ US       │ 2023     │ 100.5                 │
│ 5      │ US       │ 2023     │ 500.5                 │
│ 3      │ US       │ 2024     │ 300.5                 │
│ 2      │ EU       │ 2023     │ 200.5                 │
│ 4      │ EU       │ 2024     │ 400.5                 │
│ 6      │ NULL     │ 2023     │ 600.5                 │
│ 7      │ US       │ NULL     │ 700.5                 │
└──────────────────────────────────────────────────────┘
```

## Apache Iceberg™ 表函数

Databend 提供以下表函数用于查询 Iceberg 元数据，方便用户高效检查 snapshot 和 manifest：

- [ICEBERG_MANIFEST](/sql/sql-functions/table-functions/iceberg-manifest)
- [ICEBERG_SNAPSHOT](/sql/sql-functions/table-functions/iceberg-snapshot)

## 使用示例

以下示例展示如何通过 REST 连接创建 Iceberg catalog，指定服务地址、warehouse 位置（S3）以及 AWS 区域、自定义 endpoint 等可选参数：

```sql
CREATE CATALOG ctl
TYPE=ICEBERG
CONNECTION=(
    TYPE='rest'
    ADDRESS='http://127.0.0.1:8181'
    WAREHOUSE='s3://iceberg-tpch'
    "s3.region"='us-east-1'
    "s3.endpoint"='http://127.0.0.1:9000'
);
```
