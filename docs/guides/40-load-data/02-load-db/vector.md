---
title: Vector
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.55"/>

[Vector](https://vector.dev/) is a high-performance observability data pipeline that puts organizations in control of their observability data. Collect, transform, and route all your logs, metrics, and traces to any vendors you want today and any other vendors you may want tomorrow. Vector enables dramatic cost reduction, novel data enrichment, and data security where you need it, not where is most convenient for your vendors. Open source and up to 10x faster than every alternative.

Vector natively supports delivering data to [Databend as a sink](https://vector.dev/docs/reference/configuration/sinks/databend/), this means that Vector can send data to Databend for storage or further processing. Databend acts as the destination for the data collected and processed by Vector. By configuring Vector to use Databend as a sink, you can seamlessly transfer data from Vector to Databend, enabling efficient data analysis, storage, and retrieval. 

## Integrating with Vector

To integrate Databend with Vector, start by creating an SQL account in Databend and assigning appropriate permissions. This account will be used for communication and data transfer between Vector and Databend. Then, in the Vector configuration, set up Databend as a Sink.

### Step 1: Creating an SQL User in Databend

For instructions on how to create a SQL user in Databend and grant appropriate privileges, see [Create User](/sql/sql-commands/ddl/user/user-create-user). Here's an example of creating a user named *user1* with the password *abc123*:

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';

CREATE DATABASE nginx;

GRANT INSERT ON nginx.* TO user1;
```

### Step 2: Configure Databend as a Sink in Vector

In this step, configure Databend as a sink in Vector by specifying the necessary settings such as the input source, compression, database, endpoint, table, and authentication credentials (username and password) for Databend integration. The following is a simple example of configuring Databend as a sink. For a comprehensive list of configuration parameters, refer to the Vector documentation at https://vector.dev/docs/reference/configuration/sinks/databend/

```toml title='vector.toml'
...

[sinks.databend_sink]
type = "databend"
inputs = [ "my-source-or-transform-id" ] # input source
compression = "none"
database = "nginx" #Your database
endpoint = "http://localhost:8000"
table = "mytable" #Your table

...

[sinks.databend_sink.auth]
strategy = "basic"
// highlight-next-line
user = "user1" #Databend username
// highlight-next-line
password = "abc123" #Databend password

...
```

## Nginx Access Log Example

### Step 1. Deploy Databend

#### 1.1 Install Databend

Follow the [Docker and Local Deployments](../../10-deploy/03-deploying-local.md) guide to deploy a local Databend.

#### 1.2 Create a Database and a Table

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

#### 1.3 Create a User for Vector Auth

Create a user:

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
```

Grant privileges for the user:

```sql
GRANT INSERT ON nginx.* TO user1;
```

### Step 2. Deploy Nginx

#### 2.1 Install Nginx

If you haven't install Nginx, please refer to [How to Install Nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/).

#### 2.2 Configure Nginx

```shell title='nginx.conf'
user www-data;
worker_processes 4;
pid /var/run/nginx.pid;

events {
        worker_connections 768;
}

http {
        ##
        # Logging Settings
        ##
	    log_format upstream '$remote_addr "$time_local" $host "$request_method $request_uri $server_protocol" $status $bytes_sent "$http_referrer" "$http_user_agent" $remote_port $upstream_addr $scheme $gzip_ratio $request_length $request_time $ssl_protocol "$upstream_response_time"';

        access_log /var/log/nginx/access.log upstream;
        error_log /var/log/nginx/error.log;

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
}
```
This is how the log message looks:
```text
::1 "09/Apr/2022:11:13:39 +0800" localhost "GET /?xx HTTP/1.1" 304 189 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36" 50758 - http - 1202 0.000 - "-"
```

Use the new `nginx.conf` replace your Nginx configuration and restart the Nginx server.

### Step 3. Deploy Vector

#### 3.1 Install Vector

You can [install Vector](https://vector.dev/docs/setup/installation/) with the installation script:

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.vector.dev | bash
```

#### 3.2 Configure Vector

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
      log("Unable to parse access log: " + string!(.message), level: "warn")
      abort
    }
    . = merge(., parsed_log)
    .timestamp = parse_timestamp!(.time_local, format: "%d/%b/%Y:%H:%M:%S %z")
    .timestamp = format_timestamp!(.timestamp, format: "%F %X")

    # Convert from string into integer.
    .remote_port, err = to_int(.remote_port)
    if err != null {
      log("Unable to parse access log: " + string!(.remote_port), level: "warn")
      abort
    }

    # Convert from string into integer.
    .status, err  = to_int(.status)
    if err != null {
      log("Unable to parse access log: " + string!(.status), level: "warn")
      abort
    }

    # Convert from string into integer.
    .bytes_sent, err = to_int(.bytes_sent)
    if err != null {
      log("Unable to parse access log: " + string!(.bytes_sent), level: "warn")
      abort
    }

    # Convert from string into integer.
    .request_length, err = to_int(.request_length)
    if err != null {
      log("Unable to parse access log: " + string!(.request_length), level: "warn")
      abort
    }

    # Convert from string into float.
    .request_time, err = to_float(.request_time)
    if err != null {
      log("Unable to parse access log: " + string!(.request_time), level: "warn")
      abort
    }
  """


[sinks.nginx_access_log_to_databend]
  type = "databend"
  inputs = ["nginx_access_log_parser"]
  // highlight-next-line
  database = "nginx" #Your database
  // highlight-next-line
  table = "access_logs" #Your table
  // highlight-next-line
  endpoint = "http://localhost:8000/"
  compression = "gzip"


[sinks.nginx_access_log_to_databend.auth]
  strategy = "basic"
  // highlight-next-line
  user = "user1" #Databend username
  // highlight-next-line
  password = "abc123" #Databend password

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

#### 3.3 Validate Configuration

Check the `nginx_access_log_parser` transform works or not:

```shell
vector test ./vector.toml
```

If it works, the output is:

```shell
Running tests
test extract fields from access log ... passed
2022-04-09T04:03:09.704557Z  WARN transform{component_kind="transform" component_id=nginx_access_log_parser component_type=remap component_name=nginx_access_log_parser}: vrl_stdlib::log: "Unable to parse access log: I am not access log" internal_log_rate_secs=1 vrl_position=479
test no event from wrong access log ... passed
```

#### 3.4 Run Vector

```shell
vector -c ./vector.toml
```

### Step 4. Analyze Nginx Log in Databend

#### 4.1 Generate logs

Reload the home page at `http://localhost/xx/yy?mm=nn` many times, or using the [wrk](https://github.com/wg/wrk) HTTP benchmarking tool to generate a large amount Nginx logs quickly:

```shell
wrk -t12 -c400 -d30s http://localhost
```

#### 4.2 Analyze Nginx Access Logs in Databend

- __Top 10 Request Status__

```sql
SELECT count() AS count, status FROM nginx.access_logs GROUP BY status LIMIT 10;

+-----------+--------+
| count     | status |
+-----------+--------+
| 106218701 |    404 |
+-----------+--------+
```

- __Top 10 Request Methods__

```sql
SELECT count() AS count, request_method FROM nginx.access_logs GROUP BY request_method LIMIT 10;

+-----------+----------------+
| count     | request_method |
+-----------+----------------+
| 106218701 |      GET       |
+-----------+----------------+
```

- __Top 10 Request IPs__

```sql
SELECT count(*) AS count, remote_addr AS client FROM nginx.access_logs GROUP BY client ORDER BY count DESC LIMIT 10;

+----------+-----------+
| count    | client    |
+----------+-----------+
| 98231357 | 127.0.0.1 |
|        2 | ::1       |
+----------+-----------+
```

- __Top 10 Request Pages__

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


- __Top 10 HTTP 404 Pages__

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

- __Top 10 Requests__

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
