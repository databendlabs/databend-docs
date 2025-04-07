---
title: "Databend Cloud 中的外部函数"
sidebar_label: "外部函数"
---

Databend 中的外部函数允许您使用 Python 等编程语言编写的外部服务器来定义用于处理数据的自定义操作。这些函数使您能够通过集成自定义逻辑、利用外部库和处理复杂的处理任务来扩展 Databend 的功能。外部函数的主要功能包括：

- **可扩展性**：非常适合复杂且资源密集型的数据操作。
- **外部库**：通过外部库和依赖项利用其他功能。
- **高级逻辑**：为复杂的场景实施复杂的数据处理逻辑。

## 支持的编程语言

下表列出了支持的语言以及在 Databend 中创建外部函数所需的库：

| 语言   | 必需的库                                  |
| ---- | ----------------------------------------- |
| Python | [databend-udf](https://pypi.org/project/databend-udf) |

## 管理外部函数

您可以使用 SQL 命令（例如 `CREATE FUNCTION`、`DROP FUNCTION` 和 `SHOW FUNCTIONS`）来管理外部函数。有关更多详细信息，请参见 [外部函数](/sql/sql-commands/ddl/external-function/)。

## 在 Databend Cloud 中配置外部函数

要在 Databend Cloud 中使用外部函数，您需要**将外部函数服务器的地址加入白名单**。外部函数服务器必须可以通过 HTTPS 上的域名访问。请联系 Databend Cloud 支持以添加您允许的 UDF 服务器地址：

1. 在 Databend Cloud 控制台中，导航至 **支持** > **创建新工单**。
2. 提供您希望加入白名单的外部服务器地址（带有 HTTPS 域名）。
3. 提交工单并等待支持团队的确认。

## 使用示例：在 Python 中创建外部函数

本节演示如何使用 Python 创建外部函数。

### 1. 安装所需的库

使用 `pip` 安装 [databend-udf](https://pypi.org/project/databend-udf) 库：

```bash
pip install databend-udf
```

### 2. 定义您的函数

创建一个 Python 文件（例如，`external_function.py`）并定义您的外部函数。以下示例在 Python 中定义了一个外部服务器，该服务器公开了一个自定义函数 `gcd`，用于计算两个整数的最大公约数：

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
    # Create an external server listening at '0.0.0.0:8815'
    server = UDFServer("0.0.0.0:8815")
    # Add the defined function
    server.add_function(gcd)
    # Start the external server
    server.serve()
```

**`@udf` 装饰器参数说明：**

| 参数            | 描述                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `input_types`   | 指定输入数据类型的字符串列表（例如，`["INT", "VARCHAR"]`）。                                                                           |
| `result_type`   | 指定返回值类型的字符串（例如，`"INT"`）。                                                                                             |
| `name`          | （可选）函数的自定义名称。如果未提供，则使用原始函数名称。                                                                                       |
| `io_threads`    | 每个数据块用于 I/O 绑定函数的 I/O 线程数。                                                                                             |
| `skip_null`     | 如果设置为 `True`，则不会将 NULL 值传递给函数，并且相应的返回值设置为 NULL。默认为 `False`。                                                       |

**Databend 和 Python 之间的数据类型映射：**

| Databend 类型      | Python 类型        |
| ------------------ | ------------------ |
| BOOLEAN            | `bool`             |
| TINYINT (UNSIGNED) | `int`              |
| SMALLINT (UNSIGNED)| `int`              |
| INT (UNSIGNED)     | `int`              |
| BIGINT (UNSIGNED)  | `int`              |
| FLOAT              | `float`            |
| DOUBLE             | `float`            |
| DECIMAL            | `decimal.Decimal`  |
| DATE               | `datetime.date`    |
| TIMESTAMP          | `datetime.datetime`|
| VARCHAR            | `str`              |
| VARIANT            | `any`              |
| MAP(K,V)           | `dict`             |
| ARRAY(T)           | `list[T]`          |
| TUPLE(T,...)       | `tuple(T,...)`     |

### 3. 运行外部服务器

运行 Python 文件以启动外部服务器：

```bash
python3 external_function.py
```

**注意：** 确保可以从 Databend Cloud 访问该服务器，并且该地址已加入白名单。如果尚未完成，请联系 Databend Cloud 支持以将服务器地址添加到白名单。

### 4. 在 Databend Cloud 中注册函数

使用 `CREATE FUNCTION` 语句在 Databend 中注册函数 `gcd`：

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = '<your-allowed-server-address>';
```

- 将 `<your-allowed-server-address>` 替换为您的外部服务器的实际地址，该地址已在 Databend Cloud 中加入白名单（必须是 HTTPS 域名）。
- `HANDLER` 指定在 Python 代码中定义的函数名称。
- `ADDRESS` 应与您的外部服务器正在运行的地址匹配，并且必须由 Databend Cloud 加入白名单。

**示例：**

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = 'https://your-server-address';
```

**重要提示：** 在执行此语句之前，请确保通过联系支持人员在 Databend Cloud 中将 `'https://your-server-address'` 加入白名单。

您现在可以在 SQL 查询中使用外部函数 `gcd`：

```sql
SELECT gcd(48, 18); -- 返回 6
```

## 负载均衡外部函数

在部署多个外部函数服务器时，您可以基于函数名称实施负载均衡。Databend 在每个 UDF 请求中包含一个 `X-DATABEND-FUNCTION` 标头，其中包含被调用函数的 小写名称。此标头可用于将请求路由到不同的后端服务器。

### 使用 Nginx 进行基于函数的路由

以下是如何配置 Nginx 以将不同的 UDF 请求路由到特定后端服务器的示例：

```nginx
# Define upstream servers for different UDF functions
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

# Map function names to backend servers
map $http_x_databend_function $udf_backend {
    default   "udf_default";
    gcd       "udf_math_functions";
    lcm       "udf_math_functions";
    string_*  "udf_string_functions";
    *_db     "udf_database_functions";
}

# Server configuration
server {
    listen 443 ssl;
    server_name udf.example.com;

    # SSL configuration
    ssl_certificate     /etc/nginx/ssl/udf.example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/udf.example.com.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://$udf_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

在 Databend 中注册函数时，请使用 Nginx 服务器的域名：

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = 'https://udf.example.com';
```

## 结论

Databend Cloud 中的外部函数提供了一种强大的方式来扩展数据处理管道的功能，方法是集成以 Python 等语言编写的自定义代码。通过按照上述步骤操作，您可以创建和使用外部函数来处理复杂的处理任务、利用外部库和实施高级逻辑。
