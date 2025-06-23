---
title: User-Defined Function
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

# User-Defined Functions (UDFs) in Databend

User-Defined Functions (UDFs) allow you to create custom operations tailored to your specific data processing needs. Databend supports two main types of UDFs:

| UDF Type | Description | Languages | Use Case |
|----------|-------------|-----------|----------|
| [Lambda UDFs](#lambda-udfs) | Simple expressions using SQL syntax | SQL | Quick transformations and calculations |
| [Embedded UDFs](#embedded-udfs) | Full programming language support | Python (Enterprise), JavaScript, WASM | Complex logic and algorithms |

## Lambda UDFs

Lambda UDFs let you define custom operations using SQL expressions directly within your queries. These are ideal for simple transformations that can be expressed in a single SQL expression.

### Syntax

```sql
CREATE [OR REPLACE] FUNCTION <function_name> AS (<parameter_list>) -> <expression>;
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `function_name` | Name of the Lambda UDF to be created |
| `parameter_list` | Comma-separated list of parameter names |
| `expression` | SQL expression that defines the function logic |

### Usage Notes

- Lambda UDFs are written in SQL and executed within the Databend query engine
- They can accept multiple parameters but must return a single value
- Parameter types are inferred at runtime based on the input data
- You can use explicit type casting (e.g., `::FLOAT`) to ensure proper data type handling
- Lambda UDFs can be used in SELECT statements, WHERE clauses, and other SQL expressions
- They are stored in the database and can be viewed using the `SHOW USER FUNCTIONS` command
- Lambda UDFs can be dropped using the `DROP FUNCTION` command

### Example: Age Calculation

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


## Embedded UDFs

AKA Script UDFs, Embedded UDFs allow you to write functions using full programming languages, giving you more flexibility and power than Lambda UDFs.

### Supported Languages

| Language | Description | Enterprise Required |
|----------|-------------|---------------------|
| [Python](#python) | Python 3 with standard library | Yes |
| [JavaScript](#javascript) | Modern JavaScript (ES6+) | No |

### Syntax

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

### Parameters

| Parameter | Description |
|-----------|-------------|
| `function_name` | Name of the UDF |
| `parameter_type` | Data type of each input parameter |
| `return_type` | Data type of the function's return value |
| `language_name` | Programming language (python or javascript) |
| `imports` | List of stage files, such as `@s_udf/your_file.zip`, files will be downloaded from stage into path `sys._xoptions['databend_import_directory']`, you can read it and unzip it in your python codes |
| `packages` | List of packages to be installed from pypi, such as `numpy`, `pandas` etc. |
| `handler_name` | Name of the function in the code that will be called |
| `function_code` | The actual code implementing the function |

### Python

Python UDFs allow you to leverage Python's rich standard library and syntax within your SQL queries. This feature requires Databend Enterprise.

:::note
Python UDFs can only use Python's standard library; third-party imports are not allowed.
:::

#### Data Type Mappings

| Databend Type | Python Type |
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

#### Example: Age Calculation

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

#### Example: use imports/packages in python udf

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

JavaScript UDFs allow you to use modern JavaScript (ES6+) features within your SQL queries, providing a familiar syntax for web developers.

#### Data Type Mappings

| Databend Type | JavaScript Type |
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

#### Example: Age Calculation

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

WASM UDFs allow you to use rust to define the functions and build it into wasm module, then load it into Databend.

#### Example: Fibonacci Calculation

1. Create a new project name `arrow-udf-example`

```bash
cargo new arrow-udf-example
```

2. Add the following dependencies to `Cargo.toml`

```toml
[package]
name = "arrow-udf-example"
version = "0.1.0"

[lib]
crate-type = ["cdylib"]

[dependencies]
arrow-udf = "0.8"
```

3. Implement the UDF in `src/lib.rs`

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

4. Build the project

```bash
cargo build --release --target wasm32-wasip1
```

5. Load the wasm module into Databend

```bash
cp /target/wasm32-wasip1/release/arrow_udf_example.wasm  /tmp
```

And create stage and put the wasm module into stage via bendsql
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

## Managing UDFs

Databend provides several commands to help you manage your UDFs:

| Command | Description | Example |
|---------|-------------|--------|
| `SHOW USER FUNCTIONS` | Lists all UDFs in the current database | `SHOW USER FUNCTIONS;` |
| `DROP FUNCTION` | Removes a UDF | `DROP FUNCTION age;` |
| `ALTER FUNCTION` | Modifies a UDF | `ALTER FUNCTION age RENAME TO calculate_age;` |

For complete documentation on UDF management commands, see [User-Defined Function](/sql/sql-commands/ddl/udf/).
