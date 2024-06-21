---
title: 外部函数
---

在 Databend 中，外部函数允许您定义自定义操作来处理数据。这些函数使用 Python 等编程语言在外部服务器上实现。它们代表了自定义操作的高级形式，依赖外部服务器来定义和执行自定义数据处理操作。外部函数的关键特性包括：

- 可扩展性：外部函数非常适合处理复杂且资源密集型的数据操作，使其适用于要求苛刻的处理任务。

- 外部库：它们可以利用外部库和依赖项，通过集成额外的功能增强其能力和多功能性。

- 高级逻辑：外部函数可以实现先进且复杂的数据处理逻辑，使其成为复杂数据处理场景的理想选择。

## 支持的编程语言

下表列出了在 Databend 中创建外部函数所支持的语言及其所需的库：

| 语言   | 所需库                                                |
| ------ | ----------------------------------------------------- |
| Python | [databend-udf](https://pypi.org/project/databend-udf) |

## 管理外部函数

Databend 提供了多种命令来管理外部函数。详细信息请参见[外部函数](/sql/sql-commands/ddl/external-function/)。

## 外部函数服务器配置

Databend 提供了以下设置来配置与外部函数服务器的通信：

| 设置名称                               | 默认值 | 描述                           | 范围          |
| -------------------------------------- | ------ | ------------------------------ | ------------- |
| `external_server_connect_timeout_secs` | 10     | 与外部服务器的连接超时时间     | 0 到 u64::MAX |
| `external_server_request_timeout_secs` | 180    | 与外部服务器的请求超时时间     | 0 到 u64::MAX |
| `external_server_request_batch_rows`   | 65536  | 发送到外部服务器的请求批次行数 | 1 到 u64::MAX |

## 使用示例

本节展示了如何在[支持的编程语言](#支持的编程语言)中创建外部函数。

### 在 Python 中创建外部函数

1. 在启动 Databend 之前，将以下参数添加到您的[databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)配置文件的[query]部分。

:::note
如果您使用的是 Databend Cloud，请跳过此步骤，并通过在**支持** > **创建新工单**中创建工单，与我们联系以获取允许的 UDF 服务器地址。
:::

```toml title='databend-query.toml'
[query]
...
enable_udf_server = true
# 列出允许的服务器地址，多个地址用逗号分隔。
# 例如，['http://0.0.0.0:8815', 'http://example.com']
udf_server_allow_list = ['http://0.0.0.0:8815']
...
```

2. 使用 pip 安装[databend-udf](https://pypi.org/project/databend-udf)。如果您尚未安装 pip，可以按照官方文档的说明下载并安装：[安装 pip](https://pip.pypa.io/en/stable/installation/)。

```bash
pip install databend-udf
```

3. 定义您的函数。以下代码定义并运行一个 Python 中的外部服务器，该服务器公开了一个名为*gcd*的自定义函数，用于计算两个整数的最大公约数，并允许远程执行此函数：

```python title='external_function.py'
from databend_udf import *

@udf(
    input_types=["INT", "INT"],
    result_type="INT",
    skip_null=True,
)
def gcd(x: int, y: int) -> int:
    while y != 0:
        (x, y) = (y, x % y)
    return x

if __name__ == '__main__':
    # 创建一个监听在'0.0.0.0:8815'的外部服务器
    server = UDFServer("0.0.0.0:8815")
    # 添加定义的函数
    server.add_function(gcd)
    # 启动外部服务器
    server.serve()
```

`@udf`是一个用于在 Databend 中定义外部函数的装饰器，支持以下参数：

| 参数        | 描述                                                                                                                 |
| ----------- | -------------------------------------------------------------------------------------------------------------------- |
| input_types | 指定输入数据类型的字符串列表或 Arrow 数据类型。                                                                      |
| result_type | 指定返回值类型的字符串或 Arrow 数据类型。                                                                            |
| name        | 可选的字符串，指定函数名称。如果未提供，将使用原始名称。                                                             |
| io_threads  | 每个数据块用于 I/O 绑定函数的 I/O 线程数。                                                                           |
| skip_null   | 指定是否跳过 NULL 值的布尔值。如果设置为 True，则不会将 NULL 值传递给函数，相应的返回值设置为 NULL。默认值为 False。 |

下表说明了 Databend 数据类型与其对应的 Python 类型之间的对应关系：

| Databend 类型       | Python 类型       |
| ------------------- | ----------------- |
| BOOLEAN             | bool              |
| TINYINT (UNSIGNED)  | int               |
| SMALLINT (UNSIGNED) | int               |
| INT (UNSIGNED)      | int               |
| BIGINT (UNSIGNED)   | int               |
| FLOAT               | float             |
| DOUBLE              | float             |
| DECIMAL             | decimal.Decimal   |
| DATE                | datetime.date     |
| TIMESTAMP           | datetime.datetime |
| VARCHAR             | str               |
| VARIANT             | any               |
| MAP(K,V)            | dict              |
| ARRAY(T)            | list[T]           |
| TUPLE(T...)         | tuple(T...)       |

4. 运行 Python 文件以启动外部服务器：

```shell
python3 external_function.py
```

5. 在 Databend 中使用[CREATE FUNCTION](/sql/sql-commands/ddl/external-function/)注册函数*gcd*：

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE python
HANDLER = 'gcd'
ADDRESS = 'http://0.0.0.0:8815';
```
