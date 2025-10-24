---
title: 快速入门
slug: /deploy/quickstart
---

Databend 快速入门：5 分钟体验 Databend
本指南将帮助您快速设置 Databend，连接到它，并执行基本的数据导入。

## 1. 使用 Docker 启动 Databend
运行以下命令在容器中启动 Databend：

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
检查 Databend 是否成功运行：

```
docker logs -f databend
```
等待直到您看到日志显示 Databend 和 MinIO 已准备就绪。

## 2. 连接到 Databend
安装 bendsql (Databend CLI)：

```
curl -fsSL https://repo.databend.com/install/bendsql.sh | bash
echo "export PATH=$PATH:~/.bendsql/bin" >>~/.bash_profile
source ~/.bash_profile
```

连接到 Databend：
```
bendsql -udatabend -pdatabend
```

## 3. 执行基本数据导入
### 步骤 1：创建外部存储桶 (myupload)
安装 mc (MinIO 客户端) 并创建存储桶：

```
wget https://dl.min.io/client/mc/release/linux-amd64/mc
sudo cp mc /usr/local/bin/ && sudo chmod +x /usr/local/bin/mc
mc alias set myminio http://localhost:9000 minioadmin minioadmin
mc mb myminio/myupload
mc ls myminio
```
预期输出：
```
[0001-01-01 08:05:43 LMT]     0B databend/
[2025-04-12 08:43:59 CST]     0B myupload/
```

### 步骤 2：生成 CSV 文件并上传到 myupload
```
echo -e "id,name,age,city\n1,John,32,New York\n2,Emma,28,London\n3,Liam,35,Paris\n4,Olivia,40,Berlin\n5,Noah,29,Tokyo" > data.csv
mc cp data.csv myminio/myupload/
mc ls myminio/myupload/
```
### 步骤 3：创建外部 Stage 并检查数据
在 bendsql 中运行：
``` 
CREATE STAGE mystage 's3://myupload' 
CONNECTION=(
  endpoint_url='http://127.0.0.1:9000',
  access_key_id='minioadmin',
  secret_access_key='minioadmin',
  region='us-east-1'
);
```
显示外部 Stage @mystage 中的文件：
```
LIST @mystage;
```
| name     | size   | md5               | last_modified        | creator     |
|----------|--------|-------------------|-----------------------|-------------|
| String   | UInt64 | Nullable(String)  | String               | Nullable(String) |
| data.csv | 104    | "a27fa15258911f534fb795a8c64e05d4" | 2025-04-12 00:51:11.015 +0000 | NULL       |

预览 CSV 数据：
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


### 步骤 4：创建表并加载数据
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

### 步骤 5：查询数据
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

🚀 现在您已经成功将数据导入到 Databend 中了！

## 替代方案：Databend Cloud
如果设置本地环境比较麻烦，您可以尝试 [Databend Cloud](https://www.databend.com) 获得完全托管的体验。

> 💬 **社区支持**  
> 有疑问？联系我们的团队：  
> 💬 [Slack 讨论](https://link.databend.com/join-slack)