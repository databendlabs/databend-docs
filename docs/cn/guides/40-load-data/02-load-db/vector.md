---
title: Vector
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.1.55"/>

[Vector](https://vector.dev/) 是一个高性能的可观测性数据管道，使组织能够控制他们的可观测性数据。收集、转换并将你的所有日志、指标和追踪信息路由到任何你想要的供应商那里，无论是今天想要的还是将来可能想要的供应商。Vector 使得成本大幅度降低、数据丰富和数据安全成为可能，这些都是根据你的需要而不是供应商最方便的地方来实现的。Vector 是开源的，并且比任何其他替代品快达10倍。

Vector 原生支持将数据作为[数据接收端传送到 Databend](https://vector.dev/docs/reference/configuration/sinks/databend/)，这意味着 Vector 可以将数据发送到 Databend 进行存储或进一步处理。Databend 作为收集和处理的数据的目的地。通过配置 Vector 使用 Databend 作为接收端，你可以无缝地将数据从 Vector 转移到 Databend，实现高效的数据分析、存储和检索。

## 与 Vector 集成

要将 Databend 与 Vector 集成，首先在 Databend 中创建一个 SQL 账户并分配适当的权限。这个账户将用于 Vector 和 Databend 之间的通信和数据传输。然后，在 Vector 配置中设置 Databend 作为接收端。

### 步骤 1：在 Databend 中创建 SQL 用户

有关如何在 Databend 中创建 SQL 用户并授予适当权限的说明，请参见[创建用户](/sql/sql-commands/ddl/user/user-create-user)。以下是创建名为 *user1* 的用户并设置密码 *abc123* 的示例：

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

CREATE DATABASE nginx;

GRANT INSERT ON nginx.* TO user1;
```

### 步骤 2：在 Vector 中配置 Databend 作为接收端

在此步骤中，通过指定必要的设置，如输入源、压缩、数据库、端点、表和 Databend 集成的认证凭据（用户名和密码）来配置 Databend 作为接收端。以下是配置 Databend 作为接收端的简单示例。有关配置参数的完整列表，请参考 Vector 文档 https://vector.dev/docs/reference/configuration/sinks/databend/

```toml title='vector.toml'
...

[sinks.databend_sink]
type = "databend"
inputs = [ "my-source-or-transform-id" ] # 输入源
compression = "none"
database = "nginx" #你的数据库
endpoint = "http://localhost:8000"
table = "mytable" #你的表

...

[sinks.databend_sink.auth]
strategy = "basic"
// highlight-next-line
user = "user1" #Databend 用户名
// highlight-next-line
password = "abc123" #Databend 密码

...
```

## Nginx 访问日志示例

### 步骤 1. 部署 Databend

#### 1.1 安装 Databend

按照 [Docker 和本地部署](../../10-deploy/01-deploy/01-non-production/00-deploying-local.md) 指南部署本地 Databend。

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

#### 1.3 为 Vector 认证创建用户

创建用户：

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

授予权限给用户：

```sql
GRANT INSERT ON nginx.* TO user1;
```

### 步骤 2. 部署 Nginx

#### 2.1 安装 Nginx

如果你还没有安装 Nginx，请参考[如何安装 Nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)。

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
这是日志消息的样子：
```text
::1 "09/Apr/2022:11:13:39 +0800" localhost "GET /?xx HTTP/1.1" 304 189 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36" 50758 - http - 1202 0.000 - "-"
```

使用新的 `nginx.conf` 替换你的 Nginx 配置并重启 Nginx 服务器。

### 步骤 3. 部署 Vector

#### 3.1 安装 Vector

你可以使用安装脚本[安装 Vector](https://vector.dev/docs/setup/installation/)：

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


```markdown
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

    # 将字符串转换为整数。
    .remote_port, err = to_int(.remote_port)
    if err != null {
      log("无法解析访问日志: " + string!(.remote_port), level: "warn")
      abort
    }

    # 将字符串转换为整数。
    .status, err  = to_int(.status)
    if err != null {
      log("无法解析访问日志: " + string!(.status), level: "warn")
      abort
    }

    # 将字符串转换为整数。
    .bytes_sent, err = to_int(.bytes_sent)
    if err != null {
      log("无法解析访问日志: " + string!(.bytes_sent), level: "warn")
      abort
    }

    # 将字符串转换为整数。
    .request_length, err = to_int(.request_length)
    if err != null {
      log("无法解析访问日志: " + string!(.request_length), level: "warn")
      abort
    }

    # 将字符串转换为浮点数。
    .request_time, err = to_float(.request_time)
    if err != null {
      log("无法解析访问日志: " + string!(.request_time), level: "warn")
      abort
    }
  


[sinks.nginx_access_log_to_databend]
  type = "databend"
  inputs = ["nginx_access_log_parser"]
  // highlight-next-line
  database = "nginx" #您的数据库
  // highlight-next-line
  table = "access_logs" #您的表
  // highlight-next-line
  endpoint = "http://localhost:8000/"
  compression = "gzip"


[sinks.nginx_access_log_to_databend.auth]
  strategy = "basic"
  // highlight-next-line
  user = "user1" #Databend用户名
  // highlight-next-line
  password = "abc123" #Databend密码

[[tests]]
name = "从访问日志中提取字段"

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
name = "错误访问日志无事件"
no_outputs_from = ["nginx_access_log_parser"]

[[tests.inputs]]
insert_at = "nginx_access_log_parser"
type = "raw"
value = 'I am not access log'

#### 3.3 验证配置

检查 `nginx_access_log_parser` 转换是否工作：

```shell
vector test ./vector.toml
```

如果工作，输出是：

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

多次重新加载 `http://localhost/xx/yy?mm=nn` 的主页，或使用 [wrk](https://github.com/wg/wrk) HTTP 压力测试工具快速生成大量 Nginx 日志：

```shell
wrk -t12 -c400 -d30s http://localhost
```
```

#### 4.2 在 Databend 中分析 Nginx 访问日志

- __请求状态前 10 名__

```sql
SELECT count() AS count, status FROM nginx.access_logs GROUP BY status LIMIT 10;

+-----------+--------+
| count     | status |
+-----------+--------+
| 106218701 |    404 |
+-----------+--------+
```

- __请求方法前 10 名__

```sql
SELECT count() AS count, request_method FROM nginx.access_logs GROUP BY request_method LIMIT 10;

+-----------+----------------+
| count     | request_method |
+-----------+----------------+
| 106218701 |      GET       |
+-----------+----------------+
```

- __请求 IP 前 10 名__

```sql
SELECT count(*) AS count, remote_addr AS client FROM nginx.access_logs GROUP BY client ORDER BY count DESC LIMIT 10;

+----------+-----------+
| count    | client    |
+----------+-----------+
| 98231357 | 127.0.0.1 |
|        2 | ::1       |
+----------+-----------+
```

- __请求页面前 10 名__

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


- __HTTP 404 页面前 10 名__

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

- __请求前 10 名__

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