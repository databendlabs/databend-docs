---
title: 外部函数
---

Databend中的外部函数允许您定义用于处理数据的定制操作。这些函数使用Python等编程语言在外部服务器上实现。它们代表了定制操作的高级形式，依赖外部服务器来定义和执行定制的数据处理操作。外部函数的关键特性包括：

- 可扩展性：外部函数非常适合处理复杂且资源密集的数据操作，使其适用于要求高的处理任务。
- 外部库：它们可以利用外部库和依赖项，通过集成额外的功能来增强其能力和多功能性。
- 高级逻辑：外部函数可以实现高级和复杂的数据处理逻辑，使其非常适合复杂的数据处理场景。

## 支持的编程语言

下表列出了在Databend中创建外部函数所支持的语言及其所需的库：

| 语言   | 所需库                                      |
|--------|---------------------------------------------|
| Python | [databend-udf](https://pypi.org/project/databend-udf) |

## 管理外部函数

Databend提供了多种命令来管理外部函数。详情请参阅[外部函数](/sql/sql-commands/ddl/external-function/)。

## 外部函数服务器的Databend设置

Databend提供了以下设置来配置外部函数服务器的通信：

| 设置名称 | 默认值 | 描述                                    | 范围 |
|--------------|---------------|------------------------------------------------|-------|
| `external_server_connect_timeout_secs` | 10 | 连接外部服务器的超时时间 | 0 到 u64::MAX |
| `external_server_request_timeout_secs` | 180 | 请求外部服务器的超时时间    | 0 到 u64::MAX |
| `external_server_request_batch_rows` | 65536 | 请求外部服务器的批量行数 | 1 到 u64::MAX |

## 使用示例

本节演示如何在每种[支持的编程语言](#支持的编程语言)中创建外部函数。

### 在Python中创建外部函数

1. 在启动Databend之前，将以下参数添加到您的[databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)配置文件的[query]部分。

:::note
如果您在Databend Cloud上，请跳过此步骤，并通过在**支持** > **创建新工单**中创建工单，联系我们提供您允许的UDF服务器地址。
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

2. 使用pip安装[databend-udf](https://pypi.org/project/databend-udf)。如果您尚未安装pip，可以按照官方文档下载并安装：[安装pip](https://pip.pypa.io/en/stable/installation/)。

```bash
pip install databend-udf
```

3. 定义您的函数。此代码在Python中定义并运行一个外部服务器，该服务器公开了一个用于计算两个整数的最大公约数的自定义函数*gcd*，并允许远程执行此函数：

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

`@udf`是一个装饰器，用于在Databend中定义外部函数，支持以下参数：

| 参数       | 描述                                                                                         |
|--------------|-----------------------------------------------------------------------------------------------------|
| input_types  | 一个字符串列表或Arrow数据类型，指定输入数据类型。                          |
| result_type  | 一个字符串或Arrow数据类型，指定返回值类型。                                |
| name         | 一个可选的字符串，指定函数名称。如果未提供，将使用原始名称。 |
| io_threads   | 每个数据块用于I/O绑定函数的I/O线程数。                                    |
| skip_null    | 一个布尔值，指定是否跳过NULL值。如果设置为True，NULL值将不会传递给函数，相应的返回值将设置为NULL。默认值为False。 |

下表说明了Databend数据类型与其对应的Python类型的对应关系：

| Databend类型         | Python类型          |
|-----------------------|-----------------------|
| BOOLEAN               | bool                  |
| TINYINT (UNSIGNED)    | int                   |
| SMALLINT (UNSIGNED)   | int                   |
| INT (UNSIGNED)        | int                   |
| BIGINT (UNSIGNED)     | int                   |
| FLOAT                 | float                 |
| DOUBLE                | float                 |
| DECIMAL               | decimal.Decimal       |
| DATE                  | datetime.date         |
| TIMESTAMP             | datetime.datetime     |
| VARCHAR               | str                   |
| VARIANT               | any                   |
| MAP(K,V)              | dict                  |
| ARRAY(T)              | list[T]               |
| TUPLE(T...)           | tuple(T...)           |

4. 运行Python文件以启动外部服务器：

```shell
python3 external_function.py
```

5. 使用[CREATE FUNCTION](/sql/sql-commands/ddl/external-function/)在Databend中注册函数*gcd*：

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE python
HANDLER = 'gcd'
ADDRESS = 'http://0.0.0.0:8815';
```