---
title: CREATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Creates an external function that calls a remote handler over Flight (typically Python or other services).

### Supported Languages

- Determined by the remote server (commonly Python, but any language can be used as long as it implements the Flight endpoint)

## Syntax

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name>
    ( <input_param_types> ) RETURNS <return_type> LANGUAGE <language_name>
    HANDLER = '<handler_name>' ADDRESS = '<udf_server_address>'
    [ EXTERNAL_ACCESS_INTEGRATIONS = (<integration_name>, ...) ]
    [ DESC = '<description>' ]
```

| Parameter | Description |
|---|---|
| `<function_name>` | The function name. |
| `<input_param_types>` | Comma-separated argument types. |
| `<return_type>` | The return type. It must match the remote schema. |
| `LANGUAGE` | The handler language, such as `python`. |
| `HANDLER` | The remote handler name. |
| `ADDRESS` | The HTTP(S) address of an Arrow Flight UDF server, not a REST endpoint. |
| `EXTERNAL_ACCESS_INTEGRATIONS` | Optional, nonempty list of integration identifiers. Supported only with a remote `ADDRESS`. |
| `DESC` | Optional function description. |

## Access Control

Creating a UDF requires global `SUPER`. If the definition names integrations, the author must also have `USAGE` on every integration. Databend checks these privileges before integration-bound policy and Flight schema validation.

Every named integration must exist and be enabled. The address must match at least one rule across them. A nonempty operator `udf_server_allow_list` is still an additional host limit. Without integrations, the existing config allow-list check applies, and an empty list rejects the address.

See [External Access Integrations](/guides/security/external-access-integration) for SQL-managed setup, privileges, and asynchronous policy propagation.

## Examples

This example walks through a complete end-to-end setup for an external function that calculates the greatest common divisor (GCD) of two integers.

### Step 1: Set Up the Python UDF Server

External functions communicate over Apache Arrow Flight (gRPC/HTTP2), not REST. Install the `databend-udf` package:

```bash
pip install databend-udf
```

Create a file `udf_server.py` with the following content:

```python
from databend_udf import udf, UDFServer

@udf(
    input_types=["INT", "INT"],
    result_type="INT NULL",
    skip_null=True,
)
def gcd(x: int, y: int) -> int:
    while y != 0:
        (x, y) = (y, x % y)
    return x

if __name__ == '__main__':
    server = UDFServer("0.0.0.0:8815")
    server.add_function(gcd)
    server.serve()
```

Start the server:

```bash
python udf_server.py
```

### Step 2: Configure Databend Access to the UDF Server

For local or self-hosted testing, configure every Databend query node:

```toml
[query]
enable_udf_server = true
udf_server_allow_insecure = true
udf_server_allow_list = ["http://127.0.0.1:8815"]
```

Use an address that is reachable from every Query node. This local example uses the legacy config allow list. To manage destinations through SQL, use [External Access Integrations](/guides/security/external-access-integration); a nonempty operator allow list remains an upper limit.

For Databend Cloud, expose the Flight server on HTTPS with gRPC/HTTP2 support. The service operator still controls whether remote UDFs are enabled and any config host limit. Contact **Support → Create New Ticket** if the operator settings reject the destination. An integration cannot bypass them.

### Step 3: Register the Function in Databend

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT NULL
    LANGUAGE python
    HANDLER = 'gcd'
    ADDRESS = 'http://127.0.0.1:8815';
```

### Step 4: Call the Function

```sql
SELECT gcd(48, 18);
-- Returns: 6

SELECT gcd(100, 75);
-- Returns: 25
```
