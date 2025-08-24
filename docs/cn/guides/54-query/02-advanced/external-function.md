---
title: "Databend Cloud 中的外部函数"
sidebar_label: "外部函数"
sidebar_position: 2
---

Databend 中的外部函数（External Function）允许你使用 Python 等编程语言编写的外部服务器来定义处理数据的自定义操作。这些函数通过集成自定义逻辑、利用外部库和处理复杂任务，帮助你扩展 Databend 的能力。外部函数的主要特点包括：

- **可扩展性**：非常适合复杂且资源密集的数据操作。
- **外部库**：通过外部库和依赖项利用额外功能。
- **高级逻辑**：为复杂场景实现复杂的数据处理逻辑。

## 支持的编程语言

下表列出了在 Databend 中创建外部函数所支持的语言及所需库：

| 语言 | 所需库 |
| -------- | ----------------------------------------------------- |
| Python   | [databend-udf](https://pypi.org/project/databend-udf) |

## 管理外部函数

你可以使用 `CREATE FUNCTION`、`DROP FUNCTION` 和 `SHOW FUNCTIONS` 等 SQL 命令管理外部函数。更多详情，请参见 [外部函数](/sql/sql-commands/ddl/external-function/)。

## 在 Databend Cloud 中配置外部函数

要在 Databend Cloud 中使用外部函数，你需要**将外部函数服务器地址加入白名单**。外部函数服务器必须通过域名以 HTTPS 方式访问。请联系 Databend Cloud 支持团队，添加你允许的 UDF 服务器地址：

1. 在 Databend Cloud 控制台中，导航到 **支持** > **创建新工单**。
2. 提供你希望加入白名单的外部服务器地址（使用 HTTPS 域名）。
3. 提交工单并等待支持团队确认。

## 使用示例：用 Python 创建外部函数

本节演示如何使用 Python 创建外部函数。

### 1. 安装所需库

使用 `pip` 安装 [databend-udf](https://pypi.org/project/databend-udf) 库：

```bash
pip install databend-udf
```

### 2. 定义函数

创建 Python 文件（例如 `external_function.py`）并定义外部函数。以下示例定义了一个 Python 外部服务器，公开自定义函数 `gcd`，用于计算两个整数的最大公约数：

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
    # 创建监听 '0.0.0.0:8815' 的外部服务器
    server = UDFServer("0.0.0.0:8815")
    # 添加已定义函数
    server.add_function(gcd)
    # 启动外部服务器
    server.serve()
```

**`@udf` 装饰器参数说明：**

| 参数 | 描述 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `input_types` | 字符串列表，指定输入数据类型（例如 `["INT", "VARCHAR"]`）。 |
| `result_type` | 字符串，指定返回值类型（例如 `"INT"`）。 |
| `name`        | （可选）函数自定义名称。若未提供，则使用原始函数名。 |
| `io_threads`  | 每个数据块用于 I/O 密集型函数的 I/O 线程数。 |
| `skip_null`   | 若设为 `True`，NULL 值不会传递给函数，对应返回值设为 NULL。默认为 `False`。 |

**Databend 与 Python 的数据类型映射：**

| Databend 类型 | Python 类型 |
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

### 3. 运行外部服务器

运行 Python 文件启动外部服务器：

```bash
python3 external_function.py
```

**注意：** 确保服务器可从 Databend Cloud 访问且地址已加入白名单。若尚未完成，请联系 Databend Cloud 支持团队将服务器地址添加到白名单。

### 4. 在 Databend Cloud 中注册函数

使用 `CREATE FUNCTION` 语句在 Databend 中注册 `gcd` 函数：

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = '<your-allowed-server-address>';
```

- 将 `<your-allowed-server-address>` 替换为已在 Databend Cloud 白名单中的外部服务器实际地址（必须为 HTTPS 域名）。
- `HANDLER` 指定 Python 代码中定义的函数名称。
- `ADDRESS` 必须与外部服务器运行地址一致，且已被 Databend Cloud 加入白名单。

**示例：**

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = 'https://your-server-address';
```

**重要：** 执行此语句前，请确保通过联系支持团队将 `'https://your-server-address'` 加入 Databend Cloud 白名单。

现在你可以在 SQL 查询中使用外部函数 `gcd`：

```sql
SELECT gcd(48, 18); -- 返回 6
```

## 外部函数负载均衡

部署多个外部函数服务器时，可根据函数名称实现负载均衡。Databend 在每个 UDF 请求中包含 `X-DATABEND-FUNCTION` 标头，内容为被调用函数的小写名称。此标头可用于将请求路由到不同后端服务器。

### 使用 Nginx 进行基于函数的路由

以下示例展示如何配置 Nginx，将不同 UDF 请求路由到特定后端服务器：

```nginx
# 为不同 UDF 函数定义上游服务器
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

# 将函数名称映射到后端服务器
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

    # SSL 配置
    ssl_certificate     /etc/nginx/ssl/udf.example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/udf.example.com.key;

    # 安全标头
    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://$udf_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
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

## 总结

Databend Cloud 中的外部函数通过集成用 Python 等语言编写的自定义代码，为扩展数据处理 Pipeline 功能提供了强大方式。按照上述步骤，你可以创建并使用外部函数处理复杂任务、利用外部库并实现高级逻辑。