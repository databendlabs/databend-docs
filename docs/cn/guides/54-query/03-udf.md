---
title: 用户自定义函数
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

# Databend 中的用户自定义函数（UDF）

用户自定义函数（UDF）允许您根据特定的数据处理需求创建自定义操作。Databend 支持两种主要类型的 UDF：

| UDF 类型 | 描述 | 语言 | 使用场景 |
|----------|-------------|-----------|----------|
| [Lambda UDF (Lambda UDFs)](#lambda-udfs) | 使用 SQL 语法的简单表达式 | SQL | 快速转换和计算 |
| [嵌入式 UDF (Embedded UDF)](#embedded-udfs) | 完整的编程语言支持 | Python (企业版), JavaScript, WASM | 复杂逻辑和算法 |

## Lambda UDF

Lambda UDF 允许您直接在查询中使用 SQL 表达式定义自定义操作。它们非常适合可以用单个 SQL 表达式表示的简单转换。

### 语法

```sql
CREATE [OR REPLACE] FUNCTION <function_name> AS (<parameter_list>) -> <expression>;
```

### 参数

| 参数 | 描述 |
|-----------|-------------|
| `function_name` | 要创建的 Lambda UDF 的名称 |
| `parameter_list` | 以逗号分隔的参数名称列表 |
| `expression` | 定义函数逻辑的 SQL 表达式 |

### 使用说明

- Lambda UDF 使用 SQL 编写，并在 Databend 查询引擎（Query Engine）内部执行
- 它们可以接受多个参数，但必须返回单个值
- 参数类型在运行时根据输入数据推断
- 您可以使用显式类型转换（例如 `::FLOAT`）来确保正确的数据类型处理
- Lambda UDF 可用于 SELECT 语句、WHERE 子句和其他 SQL 表达式
- 它们存储在数据库中，可以使用 `SHOW USER FUNCTIONS` 命令查看
- 可以使用 `DROP FUNCTION` 命令删除 Lambda UDF

### 示例：计算年龄

```sql
-- Create a Lambda UDF to calculate age in years
CREATE OR REPLACE FUNCTION age AS (dt) ->
    date_diff(year, dt, now());

-- Create a table with birthdates
CREATE TABLE persons (
    id INT,
    name VARCHAR,
    birthdate DATE
);

-- Insert sample data
INSERT INTO persons VALUES
    (1, 'Alice', '1990-05-15'),
    (2, 'Bob', '2000-10-20');

-- Use the Lambda UDF to calculate ages
SELECT
    name,
    birthdate,
    age(birthdate) AS age_in_years
FROM persons;

-- Expected output (results will vary based on current date):
-- +-------+------------+-------------+
-- | name  | birthdate  | age_in_years|
-- +-------+------------+-------------+
-- | Alice | 1990-05-15 |          35 |
-- | Bob   | 2000-10-20 |          24 |
-- +-------+------------+-------------+
```


## 嵌入式 UDF (Embedded UDF)

嵌入式 UDF（Embedded UDF），也称为脚本 UDF，允许您使用完整的编程语言编写函数，比 Lambda UDF 具有更大的灵活性和更强的功能。

### 支持的语言

| 语言 | 描述 | 需要企业版 |
|----------|-------------|---------------------|
| [Python](#python) | 带有标准库的 Python 3 | 是 |
| [JavaScript](#javascript) | 现代 JavaScript (ES6+) | 否 |

### 语法

```sql
CREATE [OR REPLACE] FUNCTION <function_name>([<parameter_type>, ...])
RETURNS <return_type>
LANGUAGE <language_name>
(IMPORTS = ("<import_path>", ...))
(PACKAGES = ("<package_path>", ...))
HANDLER = '<handler_name>'
AS $$
<function_code>
$$;
```

### 参数

| 参数 | 描述 |
|-----------|-------------|
| `function_name` | UDF 的名称 |
| `parameter_type` | 每个输入参数的数据类型 |
| `return_type` | 函数返回值的数据类型 |
| `language_name` | 编程语言（python 或 javascript） |
| `imports` | 暂存区（Stage）文件列表，例如 `@s_udf/your_file.zip`。文件将从暂存区下载到路径 `sys._xoptions['databend_import_directory']`，您可以在 Python 代码中读取并解压它。 |
| `packages` | 要从 PyPI 安装的包列表，例如 `numpy`、`pandas` 等。 |
| `handler_name` | 代码中将被调用的函数的名称 |
| `function_code` | 实现函数的实际代码 |

### Python

Python UDF 允许您在 SQL 查询中利用 Python 丰富的标准库和语法。此功能需要 Databend 企业版（Enterprise）。

:::note
Python UDF 只能使用 Python 的标准库；不允许导入第三方库。
:::

#### 数据类型映射

| Databend 类型 | Python 类型 |
|--------------|-------------|
| NULL | None |
| BOOLEAN | bool |
| INT | int |
| FLOAT/DOUBLE | float |
| DECIMAL | decimal.Decimal |
| VARCHAR | str |
| BINARY | bytes |
| LIST | list |
| MAP | dict |
| STRUCT | object |
| JSON | dict/list |

#### 示例：计算年龄

```sql
-- Create a Python UDF to calculate age in years
CREATE OR REPLACE FUNCTION calculate_age_py(VARCHAR)
RETURNS INT
LANGUAGE python HANDLER = 'calculate_age'
AS $$
from datetime import datetime

def calculate_age(birth_date_str):
    # Parse the date string into a datetime object
    birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d')
    today = datetime.now()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age
$$;

-- Use the Python UDF
SELECT calculate_age_py('1990-05-15') AS age_result;

-- Expected output (will vary based on current date):
-- +------------+
-- | age_result |
-- +------------+
-- |         35 |
-- +------------+
```

#### 示例：在 Python UDF 中使用 imports/packages

```sql
CREATE OR REPLACE FUNCTION package_udf()
  RETURNS FLOAT
  LANGUAGE PYTHON
  IMPORTS = ('@s1/a.zip')
  PACKAGES = ('scikit-learn')
  HANDLER = 'udf'
  AS
$$
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

import fcntl
import os
import sys
import threading
import zipfile

 # File lock class for synchronizing write access to /tmp.
class FileLock:
    def __enter__(self):
        self._lock = threading.Lock()
        self._lock.acquire()
        self._fd = open('/tmp/lockfile.LOCK', 'w+')
        fcntl.lockf(self._fd, fcntl.LOCK_EX)

    def __exit__(self, type, value, traceback):
        self._fd.close()
        self._lock.release()

import_dir = sys._xoptions['databend_import_directory']

zip_file_path = import_dir + "/a.zip"
extracted = '/tmp'

# extract the zip to directory `/tmp/a`
with FileLock():
    if not os.path.isdir(extracted + '/a'):
        with zipfile.ZipFile(zip_file_path, 'r') as myzip:
            myzip.extractall(extracted)

def udf():
    X, y = load_iris(return_X_y=True)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    return model.score(X_test, y_test)
$$;

SELECT package_udf();

╭───────────────────╮
│   package_udf()   │
│ Nullable(Float32) │
├───────────────────┤
│                 1 │
╰───────────────────╯
```

### JavaScript

JavaScript UDF 允许您在 SQL 查询中使用现代 JavaScript (ES6+) 特性，为 Web 开发人员提供了熟悉的语法。

#### 数据类型映射

| Databend 类型 | JavaScript 类型 |
|--------------|----------------|
| NULL | null |
| BOOLEAN | Boolean |
| INT | Number |
| FLOAT/DOUBLE | Number |
| DECIMAL | BigDecimal |
| VARCHAR | String |
| BINARY | Uint8Array |
| DATE/TIMESTAMP | Date |
| ARRAY | Array |
| MAP | Object |
| STRUCT | Object |
| JSON | Object/Array |

#### 示例：计算年龄

```sql
-- Create a JavaScript UDF to calculate age in years
CREATE OR REPLACE FUNCTION calculate_age_js(VARCHAR)
RETURNS INT
LANGUAGE javascript HANDLER = 'calculateAge'
AS $$
export function calculateAge(birthDateStr) {
    // Parse the date string into a Date object
    const birthDate = new Date(birthDateStr);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if birthday hasn't occurred yet this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}
$$;

-- Use the JavaScript UDF
SELECT calculate_age_js('1990-05-15') AS age_result;

-- Expected output (will vary based on current date):
-- +------------+
-- | age_result |
-- +------------+
-- |         35 |
-- +------------+
```

## WASM UDF

WASM UDF 允许您使用 Rust 定义函数并将其构建为 WASM 模块，然后加载到 Databend 中。

#### 示例：斐波那契计算

1. 创建一个名为 `arrow-udf-example` 的新项目

```bash
cargo new arrow-udf-example
```

2. 将以下依赖项添加到 `Cargo.toml`

```toml
[package]
name = "arrow-udf-example"
version = "0.1.0"

[lib]
crate-type = ["cdylib"]

[dependencies]
arrow-udf = "0.8"
```

3. 在 `src/lib.rs` 中实现 UDF

```rust
use arrow_udf::function;

#[function("fib(int) -> int")]
fn fib(n: i32) -> i32 {
    let (mut a, mut b) = (0, 1);
    for _ in 0..n {
        let c = a + b;
        a = b;
        b = c;
    }
    a
}
```

4. 构建项目

```bash
cargo build --release --target wasm32-wasip1
```

5. 将 wasm 模块加载到 Databend

```bash
cp /target/wasm32-wasip1/release/arrow_udf_example.wasm  /tmp
```

并通过 bendsql 创建暂存区（Stage）并将 wasm 模块放入暂存区
```sql
🐳 root@default:) create stage s_udf;
🐳 root@default:) put fs:///tmp/arrow_udf_example.wasm @s_udf/;

🐳 root@default:) CREATE OR REPLACE FUNCTION fib_wasm (INT) RETURNS INT LANGUAGE wasm HANDLER = 'fib' AS $$@s_udf/arrow_udf_example.wasm$$;


🐳 root@default:) select fib_wasm(10::Int32);
╭─────────────────────╮
│ fib_wasm(10::Int32) │
│   Nullable(Int32)   │
├─────────────────────┤
│                  55 │
╰─────────────────────╯
```

## 管理 UDF

Databend 提供了几个命令来帮助您管理 UDF：

| 命令 | 描述 | 示例 |
|---------|-------------|--------|
| `SHOW USER FUNCTIONS` | 列出当前数据库中的所有 UDF | `SHOW USER FUNCTIONS;` |
| `DROP FUNCTION` | 删除一个 UDF | `DROP FUNCTION age;` |
| `ALTER FUNCTION` | 修改一个 UDF | `ALTER FUNCTION age RENAME TO calculate_age;` |

有关 UDF 管理命令的完整文档，请参阅[用户自定义函数](/sql/sql-commands/ddl/udf/)。