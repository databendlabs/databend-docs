---
title: 'Databend Cloud 中的外部函数'
sidebar_label: '外部函数'
---

Databend 中的外部函数允许您使用 Python 等编程语言编写的外部服务器定义自定义操作来处理数据。这些函数使您能够通过集成自定义逻辑、利用外部库和处理复杂的处理任务来扩展 Databend 的功能。外部函数的关键特性包括：

- **可扩展性**：适用于复杂且资源密集型的数据操作。
- **外部库**：通过外部库和依赖项利用额外的功能。
- **高级逻辑**：为复杂场景实现复杂的数据处理逻辑。

## 支持的编程语言

下表列出了在 Databend 中创建外部函数时支持的语言及其所需的库：

| 语言   | 所需库                                      |
|--------|-------------------------------------------|
| Python | [databend-udf](https://pypi.org/project/databend-udf) |

## 管理外部函数

您可以使用 SQL 命令（如 `CREATE FUNCTION`、`DROP FUNCTION` 和 `SHOW FUNCTIONS`）来管理外部函数。有关更多详细信息，请参阅 [外部函数](/sql/sql-commands/ddl/external-function/)。

## 在 Databend Cloud 中配置外部函数

要在 Databend Cloud 中使用外部函数，您需要**将外部函数服务器的地址加入白名单**。外部函数服务器必须通过 HTTPS 域名访问。请联系 Databend Cloud 支持团队以添加您允许的 UDF 服务器地址：

1. 在 Databend Cloud 控制台中导航到 **Support** > **Create New Ticket**。
2. 提供您希望加入白名单的外部服务器地址（带有 HTTPS 域名）。
3. 提交工单并等待支持团队的确认。

## 使用示例：在 Python 中创建外部函数

本节演示如何使用 Python 创建外部函数。

### 1. 安装所需库

使用 `pip` 安装 [databend-udf](https://pypi.org/project/databend-udf) 库：

```bash
pip install databend-udf
```

### 2. 定义您的函数

创建一个 Python 文件（例如 `external_function.py`）并定义您的外部函数。以下示例定义了一个 Python 中的外部服务器，该服务器公开了一个自定义函数 `gcd`，用于计算两个整数的最大公约数：

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
    # 创建一个监听 '0.0.0.0:8815' 的外部服务器
    server = UDFServer("0.0.0.0:8815")
    # 添加定义的函数
    server.add_function(gcd)
    # 启动外部服务器
    server.serve()
```

**`@udf` 装饰器参数说明：**

| 参数         | 描述                                                                                                                                          |
|--------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `input_types`  | 指定输入数据类型的字符串列表（例如 `["INT", "VARCHAR"]`）。                                                                                   |
| `result_type`  | 指定返回值的类型的字符串（例如 `"INT"`）。                                                                                                    |
| `name`         | （可选）函数的自定义名称。如果未提供，则使用原始函数名称。                                                                                     |
| `io_threads`   | 用于每个数据块的 I/O 线程数，适用于 I/O 密集型函数。                                                                                          |
| `skip_null`    | 如果设置为 `True`，则 NULL 值不会传递给函数，并且相应的返回值设置为 NULL。默认值为 `False`。                                                   |

**Databend 与 Python 之间的数据类型映射：**

| Databend 类型         | Python 类型          |
|-----------------------|----------------------|
| BOOLEAN               | `bool`               |
| TINYINT (UNSIGNED)    | `int`                |
| SMALLINT (UNSIGNED)   | `int`                |
| INT (UNSIGNED)        | `int`                |
| BIGINT (UNSIGNED)     | `int`                |
| FLOAT                 | `float`              |
| DOUBLE                | `float`              |
| DECIMAL               | `decimal.Decimal`    |
| DATE                  | `datetime.date`      |
| TIMESTAMP             | `datetime.datetime`  |
| VARCHAR               | `str`                |
| VARIANT               | `any`                |
| MAP(K,V)              | `dict`               |
| ARRAY(T)              | `list[T]`            |
| TUPLE(T,...)          | `tuple(T,...)`       |

### 3. 运行外部服务器

运行 Python 文件以启动外部服务器：

```bash
python3 external_function.py
```

**注意：** 确保服务器可以从 Databend Cloud 访问，并且地址已加入白名单。如果尚未完成，请联系 Databend Cloud 支持团队将服务器地址加入白名单。

### 4. 在 Databend Cloud 中注册函数

使用 `CREATE FUNCTION` 语句在 Databend 中注册函数 `gcd`：

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = '<your-allowed-server-address>';
```

- 将 `<your-allowed-server-address>` 替换为已在 Databend Cloud 中白名单的外部服务器的实际地址（必须是 HTTPS 域名）。
- `HANDLER` 指定 Python 代码中定义的函数名称。
- `ADDRESS` 应与外部服务器运行的地址匹配，并且必须由 Databend Cloud 白名单。

**示例：**

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT
    LANGUAGE PYTHON
    HANDLER = 'gcd'
    ADDRESS = 'https://your-server-address';
```

**重要提示：** 在执行此语句之前，请确保 `'https://your-server-address'` 已通过联系支持团队加入 Databend Cloud 的白名单。

您现在可以在 SQL 查询中使用外部函数 `gcd`：

```sql
SELECT gcd(48, 18); -- 返回 6
```

## 结论

Databend Cloud 中的外部函数提供了一种强大的方式来扩展数据处理管道的功能，通过集成使用 Python 等语言编写的自定义代码。通过遵循上述步骤，您可以创建和使用外部函数来处理复杂的处理任务、利用外部库并实现高级逻辑。