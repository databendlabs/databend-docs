---
title: Apache Iceberg™
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.668"/>

Databend 支持集成 [Apache Iceberg™](https://iceberg.apache.org/) catalog，从而增强了其兼容性和数据管理与分析的通用性。通过将 Apache Iceberg™ 强大的元数据和存储管理能力无缝集成到平台中，扩展了 Databend 的功能。

## Iceberg 快速入门

如果您想快速试用 Iceberg 并在本地进行表操作实验，可以使用 [基于 Docker 的入门项目](https://github.com/databendlabs/iceberg-quick-start)。此设置允许您：

- 运行支持 Iceberg 的 Spark
- 使用 REST catalog (Iceberg REST Fixture)
- 使用 MinIO 模拟与 S3 兼容的对象存储
- 将示例 TPC-H 数据加载到 Iceberg 表中以进行查询测试

### 前提条件

在开始之前，请确保您的系统上已安装 Docker 和 Docker Compose。

### 启动 Iceberg 环境

```bash
git clone https://github.com/databendlabs/iceberg-quick-start.git
cd iceberg-quick-start
docker compose up -d
```

这将启动以下服务：

- `spark-iceberg`: 带有 Iceberg 的 Spark 3.4
- `rest`: Iceberg REST Catalog
- `minio`: 与 S3 兼容的对象存储
- `mc`: MinIO 客户端（用于设置存储桶）

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

运行以下命令以生成示例 TPC-H 数据并将其加载到 Iceberg 表中：

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

加载 TPC-H 表后，您可以在 Databend 中查询数据：

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

2. 首先使用 BendSQL 连接到 Databend，然后创建一个 Iceberg catalog：

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

3. 使用新创建的 catalog：

```sql
USE CATALOG iceberg;
```

4. 显示可用的数据库：

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

5. 运行示例查询以聚合 TPC-H 数据：

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

下表映射了 Apache Iceberg™ 和 Databend 之间的数据类型。请注意，Databend 目前不支持表中未列出的 Iceberg 数据类型。

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
| ARRAY&lt;TYPE&gt;                           | [ARRAY](/sql/sql-reference/data-types/array), supports nesting           |
| MAP&lt;KEYTYPE, VALUETYPE&gt;               | [MAP](/sql/sql-reference/data-types/map)                                 |
| STRUCT&lt;COL1: TYPE1, COL2: TYPE2, ...&gt; | [TUPLE](/sql/sql-reference/data-types/tuple)                             |
| LIST                                        | [ARRAY](/sql/sql-reference/data-types/array)                             |

## 管理 Catalog

Databend 提供了以下命令来管理 catalog：

- [CREATE CATALOG](#create-catalog)
- [SHOW CREATE CATALOG](#show-create-catalog)
- [SHOW CATALOGS](#show-catalogs)
- [USE CATALOG](#use-catalog)

### CREATE CATALOG

在 Databend 查询引擎中定义并建立一个新的 catalog。

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

| 参数                         | 是否必需 | 描述                                                                                                                                                                                                                           |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<catalog_name>`             | 是        | 你想要创建的 catalog 的名称。                                                                                                                                                                                                |
| `TYPE`                       | 是        | 指定 catalog 类型。对于 Apache Iceberg™，设置为 `ICEBERG`。                                                                                                                                                                    |
| `CONNECTION`                 | 是        | Iceberg catalog 的连接参数。                                                                                                                                                                                                 |
| `TYPE` (在 `CONNECTION` 中) | 是        | 连接类型。对于 Iceberg，通常设置为 `rest` 以进行基于 REST 的连接。                                                                                                                                                           |
| `ADDRESS`                    | 是        | Iceberg 服务的地址或 URL (例如，`http://127.0.0.1:8181`)。                                                                                                                                                                    |
| `WAREHOUSE`                  | 是        | Iceberg warehouse 的位置，通常是 S3 bucket 或兼容的对象存储系统。                                                                                                                                                              |
| `<connection_parameter>`     | 是        | 用于建立与外部存储连接的连接参数。所需的参数因特定的存储服务和身份验证方法而异。有关可用参数的完整列表，请参见下表。                                                                                                                                                            |

| 连接参数                  | 描述                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `s3.endpoint`             | S3 端点。                                                                                                                          |
| `s3.access-key-id`        | S3 访问密钥 ID。                                                                                                                     |
| `s3.secret-access-key`    | S3 私有访问密钥。                                                                                                                    |
| `s3.session-token`        | S3 会话令牌，使用临时凭证时需要。                                                                                                       |
| `s3.region`               | S3 区域。                                                                                                                          |
| `client.region`           | 用于 S3 客户端的区域，优先于 `s3.region`。                                                                                              |
| `s3.path-style-access`    | S3 路径样式访问。                                                                                                                     |
| `s3.sse.type`             | S3 服务器端加密 (SSE) 类型。                                                                                                          |
| `s3.sse.key`              | S3 SSE 密钥。如果加密类型为 `kms`，则为 KMS 密钥 ID。如果加密类型为 `custom`，则为 base-64 AES256 对称密钥。                                |
| `s3.sse.md5`              | S3 SSE MD5 校验和。                                                                                                                  |
| `client.assume-role.arn`  | 要承担的 IAM 角色的 ARN，而不是使用默认凭证链。                                                                                             |
| `client.assume-role.external-id` | 用于承担 IAM 角色的可选外部 ID。                                                                                                          |
| `client.assume-role.session-name` | 用于承担 IAM 角色的可选会话名称。                                                                                                         |
| `s3.allow-anonymous`      | 允许匿名访问的选项（例如，对于公共存储桶/文件夹）。                                                                                              |
| `s3.disable-ec2-metadata` | 用于禁用从 EC2 元数据加载凭证的选项（通常与 `s3.allow-anonymous` 一起使用）。                                                                       |
| `s3.disable-config-load`  | 用于禁用从配置文件和环境变量加载配置的选项。                                                                                                  |

### SHOW CREATE CATALOG

返回指定 catalog 的详细配置，包括其类型和存储参数。

#### 语法

```sql
SHOW CREATE CATALOG <catalog_name>;
```

### SHOW CATALOGS

显示所有已创建的 catalogs。

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

## 缓存 Iceberg Catalog

Databend 提供了一个专门为 Iceberg catalog 设计的 Catalog Metadata Cache。当第一次在 Iceberg 表上执行查询时，元数据会被缓存在内存中。默认情况下，此缓存保持有效 10 分钟，之后会异步刷新。这确保了对 Iceberg 表的查询速度更快，避免了重复的元数据检索。

如果您需要最新的元数据，可以使用以下命令手动刷新缓存：

```sql
USE CATALOG iceberg;
ALTER DATABASE tpch REFRESH CACHE; -- 刷新 tpch 数据库的元数据缓存
ALTER TABLE tpch.lineitem REFRESH CACHE; -- 刷新 lineitem 表的元数据缓存
```

如果您不想使用元数据缓存，可以通过在 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中将 `iceberg_table_meta_count` 设置为 `0` 来完全禁用它：

```toml
...
# Cache config.
[cache]
...
iceberg_table_meta_count = 0
...
```

除了元数据缓存，Databend 还支持 Iceberg catalog 表的表数据缓存，类似于 Fuse 表。有关数据缓存的更多信息，请参阅 [Query Configurations](../10-deploy/04-references/02-node-config/02-query-config.md) 参考中的 `[cache] Section`。

## Apache Iceberg™ 表函数

Databend 提供了以下表函数来查询 Iceberg 元数据，允许用户有效地检查快照和清单：

- [ICEBERG_MANIFEST](/sql/sql-functions/table-functions/iceberg-manifest)
- [ICEBERG_SNAPSHOT](/sql/sql-functions/table-functions/iceberg-snapshot)

## 使用示例

此示例展示了如何使用基于 REST 的连接创建 Iceberg catalog，指定服务地址、计算集群位置 (S3) 和可选参数，如 AWS 区域和自定义端点：

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