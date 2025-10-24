---
title: 快速入门
slug: /deploy/quickstart
---

Databend 快速入门：5 分钟体验 Databend
本指南将帮助您快速部署 Databend，连接数据库，并完成一次基础的数据导入。

## 1. 使用 Docker 启动 Databend
执行以下命令，在容器中启动 Databend：

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

检查 Databend 是否成功启动：

```
docker logs -f databend
```

等待日志显示 Databend 与 MinIO 已就绪即可。

## 2. 连接 Databend
安装 bendsql（Databend CLI）：

```
curl -fsSL https://repo.databend.cn/install/bendsql.sh | bash
echo "export PATH=$PATH:~/.bendsql/bin" >>~/.bash_profile
source ~/.bash_profile
```

连接 Databend：

```
bendsql -udatabend -pdatabend
```

## 3. 基础数据导入
### 步骤 1：创建外部存储桶（myupload）
安装 mc（MinIO 客户端）并创建存储桶：

```
wget https://dl.min.io/client/mc/release/linux-amd64/mc
sudo cp mc /usr/local/bin && sudo chmod +x /usr/local/bin/mc
mc alias set myminio http://localhost:9000 minioadmin minioadmin
mc mb myminio/myupload
mc ls myminio
```

预期输出：

```
[0001-01-01 08:05:43 LMT]     0B databend/
[2025-04-12 08:43:59 CST]     0B myupload/
```

### 步骤 2：生成 CSV 并上传至 myupload

```
echo -e "id,name,age,city\n1,John,32,New York\n2,Emma,28,London\n3,Liam,35,Paris\n4,Olivia,40,Berlin\n5,Noah,29,Tokyo" > data.csv
mc cp data.csv myminio/myupload/
mc ls myminio/myupload/
```

### 步骤 3：创建外部 Stage 并查看数据
在 bendsql 中执行：

```
CREATE STAGE mystage 's3://myupload' 
CONNECTION=(
  endpoint_url='http://127.0.0.1:9000',
  access_key_id='minioadmin',
  secret_access_key='minioadmin',
  region='us-east-1'
);
```

列出外部 Stage @mystage 中的文件：

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

### 步骤 4：建表并导入数据

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

🚀 至此，您已成功将数据导入 Databend！

## 替代方案：Databend Cloud
若本地部署过于繁琐，可直接体验全托管的 [Databend Cloud](https://www.databend.cn)。

> 💬 **社区支持**  
> 有疑问？欢迎加入讨论：  
> 💬 [Slack 交流群](https://link.databend.cn/join-slack)