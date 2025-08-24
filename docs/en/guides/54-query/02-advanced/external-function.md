---
title: "External Functions in Databend Cloud"
sidebar_label: "External Function"
sidebar_position: 2
---

External functions in Databend allow you to define custom operations for processing data using external servers written in programming languages like Python. These functions enable you to extend Databend's capabilities by integrating custom logic, leveraging external libraries, and handling complex processing tasks. Key features of external functions include:

- **Scalability**: Ideal for complex and resource-intensive data operations.
- **External Libraries**: Leverage additional functionality through external libraries and dependencies.
- **Advanced Logic**: Implement sophisticated data processing logic for complex scenarios.

## Supported Programming Languages

The following table lists the supported languages and the required libraries for creating external functions in Databend:

| Language | Required Library                                      |
| -------- | ----------------------------------------------------- |
| Python   | [databend-udf](https://pypi.org/project/databend-udf) |

## Managing External Functions

You can manage external functions using SQL commands such as `CREATE FUNCTION`, `DROP FUNCTION`, and `SHOW FUNCTIONS`. For more details, see [External Function](/sql/sql-commands/ddl/external-function/).

## Configuring External Functions in Databend Cloud

To use external functions in Databend Cloud, you need to **allowlist the addresses of your external function servers**. The external function server must be accessible via a domain name over HTTPS. Please contact Databend Cloud support to add your allowed UDF server addresses:

1. Navigate to **Support** > **Create New Ticket** in the Databend Cloud console.
2. Provide the external server addresses (with HTTPS domain names) you wish to allowlist.
3. Submit the ticket and await confirmation from the support team.

## Usage Example: Creating an External Function in Python

This section demonstrates how to create an external function using Python.

### 1. Install the Required Library

Install the [databend-udf](https://pypi.org/project/databend-udf) library using `pip`:

```bash
pip install databend-udf
```

### 2. Define Your Function

Create a Python file (e.g., `external_function.py`) and define your external function. The following example defines an external server in Python that exposes a custom function `gcd` for calculating the greatest common divisor of two integers:

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

**Explanation of `@udf` Decorator Parameters:**

| Parameter     | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `input_types` | A list of strings specifying the input data types (e.g., `["INT", "VARCHAR"]`).                                                      |
| `result_type` | A string specifying the return value type (e.g., `"INT"`).                                                                           |
| `name`        | (Optional) Custom name for the function. If not provided, the original function name is used.                                        |
| `io_threads`  | Number of I/O threads used per data chunk for I/O-bound functions.                                                                   |
| `skip_null`   | If set to `True`, NULL values are not passed to the function, and the corresponding return value is set to NULL. Default is `False`. |

**Data Type Mappings Between Databend and Python:**

| Databend Type       | Python Type         |
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

### 3. Run the External Server

Run the Python file to start the external server:

```bash
python3 external_function.py
```

**Note:** Ensure that the server is accessible from Databend Cloud and that the address is allowlisted. If not already done, contact Databend Cloud support to add the server address to the allowlist.

### 4. Register the Function in Databend Cloud

Register the function `gcd` in Databend using the `CREATE FUNCTION` statement:

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = '<your-allowed-server-address>';
```

- Replace `<your-allowed-server-address>` with the actual address of your external server that has been allowlisted in Databend Cloud (must be an HTTPS domain).
- The `HANDLER` specifies the name of the function as defined in your Python code.
- The `ADDRESS` should match the address where your external server is running and must be allowlisted by Databend Cloud.

**Example:**

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = 'https://your-server-address';
```

**Important:** Before executing this statement, ensure that `'https://your-server-address'` is allowlisted in Databend Cloud by contacting support.

You can now use the external function `gcd` in your SQL queries:

```sql
SELECT gcd(48, 18); -- Returns 6
```

## Load Balancing External Functions

When deploying multiple external function servers, you can implement load balancing based on function names. Databend includes a `X-DATABEND-FUNCTION` header in each UDF request, which contains the lowercased function name being called. This header can be used to route requests to different backend servers.

### Using Nginx for Function-Based Routing

Here's an example of how to configure Nginx to route different UDF requests to specific backend servers:

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

When registering your functions in Databend, use the Nginx server's domain:

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = 'https://udf.example.com';
```

## Conclusion

External functions in Databend Cloud provide a powerful way to extend the functionality of your data processing pipelines by integrating custom code written in languages like Python. By following the steps outlined above, you can create and use external functions to handle complex processing tasks, leverage external libraries, and implement advanced logic.
