---
title: Vector
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本: v1.1.55"/>

[Vector](https://vector.dev/) 是一个高性能的可观测性数据管道，让组织能够完全掌控其可观测性数据。它可以收集、转换并路由所有日志、指标和跟踪数据到您当前选择的任何供应商，也能灵活适应未来可能需要的其他供应商。Vector 能显著降低成本，提供创新的数据丰富功能，并在您需要的位置确保数据安全——而非仅考虑供应商的便利性。作为开源解决方案，其性能比所有替代方案快 10 倍。

Vector 原生支持[将 Databend 作为接收器](https://vector.dev/docs/reference/configuration/sinks/databend/)，可将数据发送至 Databend 进行存储或后续处理。Databend 作为 Vector 收集和处理数据的最终目的地。通过配置 Vector 使用 Databend 作为接收器，您能无缝实现数据从 Vector 到 Databend 的高效传输，为数据分析、存储和检索提供支持。

## 与 Vector 集成

要将 Databend 与 Vector 集成，首先在 Databend 中创建 SQL 账户并分配适当权限。该账户将用于 Vector 和 Databend 之间的通信与数据传输，随后在 Vector 配置中将 Databend 设置为接收器。

### 步骤 1：在 Databend 中创建 SQL 用户

创建 SQL 用户及授权操作请参阅[创建用户](/sql/sql-commands/ddl/user/user-create-user)。以下示例创建名为 *user1* 且密码为 *abc123* 的用户：

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

CREATE DATABASE nginx;

GRANT INSERT ON nginx.* TO user1;
```

### 步骤 2：在 Vector 中配置 Databend 接收器

通过指定输入源、压缩方式、数据库、端点、表及身份验证凭据（用户名和密码）等必要参数，在 Vector 中配置 Databend 接收器。下方是基础配置示例，完整参数请参阅 Vector 文档：https://vector.dev/docs/reference/configuration/sinks/databend/

```toml title='vector.toml'
...

[sinks.databend_sink]
type = "databend"
inputs = [ "my-source-or-transform-id" ] # 输入源
compression = "none"
database = "nginx" # 您的数据库
endpoint = "http://localhost:8000"
table = "mytable" # 您的表

...

[sinks.databend_sink.auth]
strategy = "basic"
// highlight-next-line
user = "user1" # Databend 用户名
// highlight-next-line
password = "abc123" # Databend 密码

...
```

## Nginx 访问日志示例

### 步骤 1. 部署 Databend

#### 1.1 安装 Databend

按照[Docker 与本地部署指南](../../10-deploy/01-deploy/01-non-production/00-deploying-local.md)部署本地 Databend，或在 Databend Cloud 中创建计算集群。

#### 1.2 创建数据库和表

```sql
CREATE DATABASE nginx;
```

```sql
CREATE TABLE nginx.access_logs (
  `timestamp` TIMESTAMP,
  `remote_addr` VARCHAR,
  `remote_port` INT,
  `request_method` VARCHAR,
  `request_uri` VARCHAR,
  `server_protocol` VARCHAR,
  `status` INT,
  `bytes_sent` INT,
  `http_referrer` VARCHAR,
  `http_user_agent` VARCHAR,
  `upstream_addr` VARCHAR,
  `scheme` VARCHAR,
  `gzip_ratio` VARCHAR,
  `request_length` INT,
  `request_time` FLOAT,
  `ssl_protocol` VARCHAR,
  `upstream_response_time` VARCHAR
);
```

#### 1.3 创建 Vector 认证用户

创建用户：

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

授予权限：

```sql
GRANT INSERT ON nginx.* TO user1;
```

### 步骤 2. 部署 Nginx

#### 2.1 安装 Nginx

未安装 Nginx 请参考[官方安装指南](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)。

#### 2.2 配置 Nginx

```shell title='nginx.conf'
user www-data;
worker_processes 4;
pid /var/run/nginx.pid;

events {
        worker_connections 768;
}

http {
        ##
        # 日志设置
        ##
	    log_format upstream '$remote_addr "$time_local" $host "$request_method $request_uri $server_protocol" $status $bytes_sent "$http_referrer" "$http_user_agent" $remote_port $upstream_addr $scheme $gzip_ratio $request_length $request_time $ssl_protocol "$upstream_response_time"';

        access_log /var/log/nginx/access.log upstream;
        error_log /var/log/nginx/error.log;

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
}
```
日志记录示例：
```text
::1 "09/Apr/2022:11:13:39 +0800" localhost "GET /?xx HTTP/1.1" 304 189 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36" 50758 - http - 1202 0.000 - "-"
```

替换 Nginx 配置后重启服务。

### 步骤 3. 部署 Vector

#### 3.1 安装 Vector

通过安装脚本[部署 Vector](https://vector.dev/docs/setup/installation/)：

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.vector.dev | bash
```

#### 3.2 配置 Vector

```toml title='vector.toml'
[sources.nginx_access_log]
type = "file"
// highlight-next-line
include = ["/var/log/nginx/access.log"]
file_key = "file"
max_read_bytes = 10240

[transforms.nginx_access_log_parser]
type = "remap"
inputs = ["nginx_access_log"]
drop_on_error = true

// highlight-next-line
#nginx log_format upstream '$remote_addr "$time_local" $host "$request_method $request_uri $server_protocol" $status $bytes_sent "$http_referrer" "$http_user_agent" $remote_port $upstream_addr $scheme $gzip_ratio $request_length $request_time $ssl_protocol "$upstream_response_time"';

source = """
    parsed_log, err = parse_regex(.message, r'^(?P<remote_addr>\\S+) \
\"(?P<time_local>\\S+ \\S+)\" \
(?P<host>\\S+) \
\"(?P<request_method>\\S+) (?P<request_uri>.+) (?P<server_protocol>HTTP/\\S+)\" \
(?P<status>\\d+) \
(?P<bytes_sent>\\d+) \
\"(?P<http_referrer>.*)\" \
\"(?P<http_user_agent>.*)\" \
(?P<remote_port>\\d+) \
(?P<upstream_addr>.+) \
(?P<scheme>\\S+) \
(?P<gzip_ratio>\\S+) \
(?P<request_length>\\d+) \
(?P<request_time>\\S+) \
(?P<ssl_protocol>\\S+) \
\"(?P<upstream_response_time>.+)\"$')
    if err != null {
      log("无法解析访问日志: " + string!(.message), level: "warn")
      abort
    }
    . = merge(., parsed_log)
    .timestamp = parse_timestamp!(.time_local, format: "%d/%b/%Y:%H:%M:%S %z")
    .timestamp = format_timestamp!(.timestamp, format: "%F %X")

    # 字符串转整数
    .remote_port, err = to_int(.remote_port)
    if err != null {
      log("无法解析访问日志: " + string!(.remote_port), level: "warn")
      abort
    }

    # 字符串转整数
    .status, err  = to_int(.status)
    if err != null {
      log("无法解析访问日志: " + string!(.status), level: "warn")
      abort
    }

    # 字符串转整数
    .bytes_sent, err = to_int(.bytes_sent)
    if err != null {
      log("无法解析访问日志: " + string!(.bytes_sent), level: "warn")
      abort
    }

    # 字符串转整数
    .request_length, err = to_int(.request_length)
    if err != null {
      log("无法解析访问日志: " + string!(.request_length), level: "warn")
      abort
    }

    # 字符串转浮点数
    .request_time, err = to_float(.request_time)
    if err != null {
      log("无法解析访问日志: " + string!(.request_time), level: "warn")
      abort
    }
  """


[sinks.nginx_access_log_to_databend]
  type = "databend"
  inputs = ["nginx_access_log_parser"]
  // highlight-next-line
  database = "nginx" # 您的数据库
  // highlight-next-line
  table = "access_logs" # 您的表
  // highlight-next-line
  endpoint = "http://localhost:8000/"
  compression = "gzip"


[sinks.nginx_access_log_to_databend.auth]
  strategy = "basic"
  // highlight-next-line
  user = "user1" # Databend 用户名
  // highlight-next-line
  password = "abc123" # Databend 密码

[[tests]]
name = "extract fields from access log"

[[tests.inputs]]
insert_at = "nginx_access_log_parser"
type = "raw"
// highlight-next-line
value = '::1 "09/Apr/2022:11:13:39 +0800" localhost "GET /?xx HTTP/1.1" 304 189 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36" 50758 - http - 1202 0.000 - "-"'

[[tests.outputs]]
extract_from = "nginx_access_log_parser"

[[tests.outputs.conditions]]
type = "vrl"
source = """
        assert_eq!(.remote_addr, "::1")
        assert_eq!(.time_local, "09/Apr/2022:11:13:39 +0800")
        assert_eq!(.timestamp, "2022-04-09 03:13:39")
        assert_eq!(.request_method, "GET")
        assert_eq!(.request_uri, "/?xx")
        assert_eq!(.server_protocol, "HTTP/1.1")
        assert_eq!(.status, 304)
        assert_eq!(.bytes_sent, 189)
        assert_eq!(.http_referrer, "-")
        assert_eq!(.http_user_agent, "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36")
        assert_eq!(.remote_port, 50758)
        assert_eq!(.upstream_addr, "-")
        assert_eq!(.scheme, "http")
        assert_eq!(.gzip_ratio, "-")
        assert_eq!(.request_length, 1202)
        assert_eq!(.request_time, 0.000)
        assert_eq!(.ssl_protocol, "-")
        assert_eq!(.upstream_response_time, "-")
      """

[[tests]]
name = "no event from wrong access log"
no_outputs_from = ["nginx_access_log_parser"]

[[tests.inputs]]
insert_at = "nginx_access_log_parser"
type = "raw"
value = 'I am not access log'
```

#### 3.3 验证配置

检查 `nginx_access_log_parser` 转换功能：

```shell
vector test ./vector.toml
```

运行成功时输出：

```shell
Running tests
test extract fields from access log ... passed
2022-04-09T04:03:09.704557Z  WARN transform{component_kind="transform" component_id=nginx_access_log_parser component_type=remap component_name=nginx_access_log_parser}: vrl_stdlib::log: "无法解析访问日志: I am not access log" internal_log_rate_secs=1 vrl_position=479
test no event from wrong access log ... passed
```

#### 3.4 运行 Vector

```shell
vector -c ./vector.toml
```

### 步骤 4. 在 Databend 中分析 Nginx 日志

#### 4.1 生成日志

多次访问 `http://localhost/xx/yy?mm=nn`，或使用 [wrk](https://github.com/wg/wrk) 基准测试工具快速生成日志：

```shell
wrk -t12 -c400 -d30s http://localhost
```

#### 4.2 在 Databend 中分析访问日志

- __请求状态 TOP 10__

```sql
SELECT count() AS count, status FROM nginx.access_logs GROUP BY status LIMIT 10;

+-----------+--------+
| count     | status |
+-----------+--------+
| 106218701 |    404 |
+-----------+--------+
```

- __请求方法 TOP 10__

```sql
SELECT count() AS count, request_method FROM nginx.access_logs GROUP BY request_method LIMIT 10;

+-----------+----------------+
| count     | request_method |
+-----------+----------------+
| 106218701 |      GET       |
+-----------+----------------+
```

- __请求 IP TOP 10__

```sql
SELECT count(*) AS count, remote_addr AS client FROM nginx.access_logs GROUP BY client ORDER BY count DESC LIMIT 10;

+----------+-----------+
| count    | client    |
+----------+-----------+
| 98231357 | 127.0.0.1 |
|        2 | ::1       |
+----------+-----------+
```

- __请求页面 TOP 10__

```sql
SELECT count(*) AS count, request_uri AS uri FROM nginx.access_logs GROUP BY uri ORDER BY count DESC LIMIT 10;

+----------+--------------------+
| count    | uri                |
+----------+--------------------+
| 60645174 | /db/abc            |
| 41727953 | /a/b/c/d/e/f/d     |
|   199852 | /index.html        |
|        2 | /xx/yy             |
+----------+--------------------+
```

- __HTTP 404 页面 TOP 10__

```sql
SELECT count_if(status=404) AS count, request_uri AS uri FROM nginx.access_logs GROUP BY uri ORDER BY count DESC LIMIT 10;

+----------+--------------------+
| count    | uri                |
+----------+--------------------+
| 64290894 | /db/abc            |
| 41727953 | /a/b/c/d/e/f/d     |
|   199852 | /index.html        |
|        2 | /xx/yy             |
+----------+--------------------+
```

- __请求 TOP 10__

```sql
SELECT count(*) AS count, request_uri AS request FROM nginx.access_logs GROUP BY request ORDER BY count DESC LIMIT 10;

+--------+-----------------------------------------------------------------------------------------------------+
| count  | request                                                                                             |
+--------+-----------------------------------------------------------------------------------------------------+
| 199852 | /index.html HTTP/1.0                                                                                |
|   1000 | /db/abc?good=iphone&uuid=9329836906 HTTP/1.1                                                        |
|    900 | /miaosha/i/miaosha?goodsRandomName=0e67e331-c521-406a-b705-64e557c4c06c&mobile=17967444396 HTTP/1.1 |
|    900 | /miaosha/i/miaosha?goodsRandomName=0e67e331-c521-406a-b705-64e557c4c06c&mobile=16399821384 HTTP/1.1 |
|    900 | /miaosha/i/miaosha?goodsRandomName=0e67e331-c521-406a-b705-64e557c4c06c&mobile=17033481055 HTTP/1.1 |
|    900 | /miaosha/i/miaosha?goodsRandomName=0e67e331-c521-406a-b705-64e557c4c06c&mobile=17769945743 HTTP/1.1 |
|    900 | /miaosha/i/miaosha?goodsRandomName=0e67e331-c521-406a-b705-64e557c4c06c&mobile=15414263117 HTTP/1.1 |
|    900 | /miaosha/i/miaosha?goodsRandomName=0e67e331-c521-406a-b705-64e557c4c06c&mobile=18945218607 HTTP/1.1 |
|    900 | /miaosha/i/miaosha?goodsRandomName=0e67e331-c521-406a-b705-64e557c4c06c&mobile=19889051988 HTTP/1.1 |
|    900 | /miaosha/i/miaosha?goodsRandomName=0e67e331-c521-406a-b705-64e557c4c06c&mobile=15249667263 HTTP/1.1 |
+--------+-----------------------------------------------------------------------------------------------------+
```