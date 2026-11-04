---
title: CREATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

创建通过 Flight 调用远程 handler 的外部函数，通常使用 Python 或其他服务。

### 支持语言

- 由远程服务器决定。常见语言为 Python，只要实现 Flight 端点，也可以使用其他语言。

## 语法

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name>
    ( <input_param_types> ) RETURNS <return_type> LANGUAGE <language_name>
    HANDLER = '<handler_name>' ADDRESS = '<udf_server_address>'
    [ EXTERNAL_ACCESS_INTEGRATIONS = (<integration_name>, ...) ]
    [ DESC = '<description>' ]
```

| 参数 | 说明 |
|---|---|
| `<function_name>` | 函数名称。 |
| `<input_param_types>` | 以逗号分隔的参数类型。 |
| `<return_type>` | 返回类型，必须与远程 schema 匹配。 |
| `LANGUAGE` | Handler 使用的语言，例如 `python`。 |
| `HANDLER` | 远程 handler 名称。 |
| `ADDRESS` | Arrow Flight UDF 服务器的 HTTP(S) 地址，不是 REST 端点。 |
| `EXTERNAL_ACCESS_INTEGRATIONS` | 可选、非空的 integration 标识符列表，仅支持带远程 `ADDRESS` 的定义。 |
| `DESC` | 可选的函数描述。 |

## 访问控制

创建 UDF 需要全局 `SUPER`。如果定义引用了 integration，开发者还必须拥有每个 integration 的 `USAGE`。Databend 在 integration 绑定的策略和 Flight schema 校验之前检查这些权限。

所有被引用的 integration 都必须存在且已启用。地址至少需要匹配这些对象中的一个规则。非空的 operator `udf_server_allow_list` 仍是额外的主机上限。未引用 integration 时，使用原有的配置 allow-list 检查；列表为空时拒绝该地址。

SQL 管理的配置、权限与策略异步传播行为见[外部访问集成](/guides/security/external-access-integration)。

## 示例

以下示例演示如何配置计算两个整数最大公约数（GCD）的外部函数。

### 第一步：配置 Python UDF 服务器

外部函数通过 Apache Arrow Flight（gRPC/HTTP2）通信，而不是 REST。安装 `databend-udf`：

```bash
pip install databend-udf
```

创建文件 `udf_server.py`：

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

启动服务器：

```bash
python udf_server.py
```

### 第二步：配置 Databend 访问 UDF 服务器

本地或私有化测试时，在每个 Databend Query 节点配置：

```toml
[query]
enable_udf_server = true
udf_server_allow_insecure = true
udf_server_allow_list = ["http://127.0.0.1:8815"]
```

请使用每个 Query 节点都能访问的地址。此本地示例使用原有的配置 allow list。要通过 SQL 管理目标，请使用[外部访问集成](/guides/security/external-access-integration)；非空的 operator allow list 仍是上限。

在 Databend Cloud 中，请提供支持 gRPC/HTTP2 的 HTTPS Flight 端点。服务 operator 仍控制是否启用远程 UDF 以及配置中的主机限制。如果 operator 配置拒绝该目标，请通过 **Support → Create New Ticket** 联系支持团队。Integration 无法绕过这些配置。

### 第三步：在 Databend 中注册函数

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT NULL
    LANGUAGE python
    HANDLER = 'gcd'
    ADDRESS = 'http://127.0.0.1:8815';
```

### 第四步：调用函数

```sql
SELECT gcd(48, 18);
-- 返回：6

SELECT gcd(100, 75);
-- 返回：25
```
