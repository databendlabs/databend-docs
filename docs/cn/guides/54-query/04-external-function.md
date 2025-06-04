---
title: "Databend Cloud 中的外部函数"
sidebar_label: "外部函数"
---

Databend 的外部函数允许您使用 Python 等编程语言编写的外部服务器定义数据处理的自定义操作。这些函数通过集成自定义逻辑、利用外部库和处理复杂任务来扩展 Databend 的能力。外部函数的主要特性包括：

- **可扩展性**：适用于复杂且资源密集型的数据操作
- **外部库支持**：通过外部库和依赖项扩展功能
- **高级逻辑**：实现复杂场景下的数据处理逻辑

## 支持的编程语言

下表列出了在 Databend 中创建外部函数支持的语言及所需库：

| 语言   | 所需库                                                |
| ------ | ----------------------------------------------------- |
| Python | [databend-udf](https://pypi.org/project/databend-udf) |

## 管理外部函数

您可以使用 `CREATE FUNCTION`、`DROP FUNCTION` 和 `SHOW FUNCTIONS` 等 SQL 命令管理外部函数。详见[外部函数文档](/sql/sql-commands/ddl/external-function/)。

## 在 Databend Cloud 中配置外部函数

在 Databend Cloud 中使用外部函数需**将外部函数服务器地址加入允许列表**。外部服务器必须通过 HTTPS 域名访问。请联系 Databend Cloud 技术支持添加 UDF 服务器地址：

1. 在控制台进入 **支持** > **新建工单**
2. 提供需加入允许列表的 HTTPS 域名地址
3. 提交工单并等待支持团队确认

## 使用示例：创建 Python 外部函数

本节演示如何使用 Python 创建外部函数。

### 1. 安装所需库

通过 `pip` 安装依赖库：

```bash
pip install databend-udf
```

### 2. 定义函数

创建 Python 文件（如 `external_function.py`）并定义函数。以下示例实现计算两整数最大公约数的 `gcd` 函数：

```python
from databend_udf import udf, UDFServer

@udf(
    input_types=["INT", "INT"],
    result_type="INT",
    skip_null=True,
)
def gcd(x: int, y: int) -> int:
    while y != 0:
        x, y = y, x % y
    return x

if __name__ == '__main__':
    server = UDFServer("0.0.0.0:8815")
    server.add_function(gcd)
    server.serve()
```

**`@udf` 装饰器参数说明：**

| 参数          | 描述                                                            |
| ------------- | --------------------------------------------------------------- |
| `input_types` | 输入数据类型列表（如 `["INT", "VARCHAR"]`）                     |
| `result_type` | 返回值类型（如 `"INT"`）                                        |
| `name`        | （可选）函数自定义名称，默认使用原函数名                        |
| `io_threads`  | I/O 密集型函数中每个数据块使用的 I/O 线程数                     |
| `skip_null`   | 设为 `True` 时跳过 NULL 值，返回值自动设为 NULL（默认 `False`） |

**Databend 与 Python 数据类型映射：**

| Databend 类型       | Python 类型         |
| ------------------- | ------------------- |
| BOOLEAN             | `bool`              |
| TINYINT (UNSIGNED)  | `int`               |
| SMALLINT (UNSIGNED) | `int`               |
| INT (UNSIGNED)      | `int`               |
| BIGINT (UNSIGNED)   | `int`               |
| FLOAT               | `float`             |
| DOUBLE              | `float`             |
| DECIMAL             | `decimal.Decimal`   |
| DATE                | `datetime.date`     |
| TIMESTAMP           | `datetime.datetime` |
| VARCHAR             | `str`               |
| VARIANT             | `any`               |
| MAP(K,V)            | `dict`              |
| ARRAY(T)            | `list[T]`           |
| TUPLE(T,...)        | `tuple(T,...)`      |

### 3. 启动外部服务器

运行 Python 文件启动服务：

```bash
python3 external_function.py
```

**注意**：确保服务器可通过 HTTPS 域名访问且地址已加入允许列表。

### 4. 在 Databend Cloud 注册函数

使用 SQL 语句注册函数：

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = '<your-allowed-server-address>';
```

- 替换 `<your-allowed-server-address>` 为已加入允许列表的 HTTPS 地址
- `HANDLER` 对应 Python 代码中的函数名
- `ADDRESS` 需与运行地址一致且已加入允许列表

**示例：**

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = 'https://your-server-address';
```

**重要**：执行前需确认地址已加入允许列表。

在 SQL 查询中使用函数：

```sql
SELECT gcd(48, 18); -- 返回 6
```

## 外部函数负载均衡

部署多台外部服务器时，可通过函数名实现负载均衡。Databend 会在 UDF 请求头 `X-DATABEND-FUNCTION` 中包含小写的函数名，用于请求路由。

### 使用 Nginx 实现函数路由

配置 Nginx 将不同函数请求路由至指定后端：

```nginx
# 定义不同函数的上游服务器
upstream udf_default {
    server 10.0.0.1:8080;
    server 10.0.0.2:8080 backup;
}

upstream udf_math_functions {
    server 10.0.1.1:8080;
    server 10.0.1.2:8080 backup;
}

upstream udf_string_functions {
    server 10.0.2.1:8080;
    server 10.0.2.2:8080 backup;
}

upstream udf_database_functions {
    server 10.0.3.1:8080;
    server 10.0.3.2:8080 backup;
}

# 函数名到后端映射
map $http_x_databend_function $udf_backend {
    default   "udf_default";
    gcd       "udf_math_functions";
    lcm       "udf_math_functions";
    string_*  "udf_string_functions";
    *_db     "udf_database_functions";
}

# 服务器配置
server {
    listen 443 ssl;
    server_name udf.example.com;

    ssl_certificate     /etc/nginx/ssl/udf.example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/udf.example.com.key;

    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://$udf_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

在 Databend 中注册时使用 Nginx 域名：

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = 'https://udf.example.com';
```

## 结论

Databend Cloud 的外部函数通过集成 Python 等语言的自定义代码，为数据处理管道提供了强大的扩展能力。遵循上述步骤可创建处理复杂任务、利用外部库并实现高级逻辑的外部函数。
