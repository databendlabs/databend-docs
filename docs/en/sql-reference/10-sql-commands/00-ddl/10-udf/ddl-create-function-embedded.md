---
title: CREATE EMBEDDED FUNCTION
sidebar_position: 2
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

Creates an Embedded UDF using programming languages (Python, JavaScript, WASM). Uses the same unified `$$` syntax as SQL functions for consistency.

## Syntax

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS <return_type>
    LANGUAGE <language>
    [IMPORTS = ('<import_path>', ...)]
    [PACKAGES = ('<package_path>', ...)]
    HANDLER = '<handler_name>'
    AS $$ <function_code> $$
    [ DESC='<description>' ]
```

Where:
- `<parameter_list>`: Comma-separated list of parameters with their types (e.g., `x INT, name VARCHAR`)
- `<return_type>`: The data type of the function's return value
- `<language>`: Programming language (`python`, `javascript`, `wasm`)
- `<import_path>`: Stage files to import (e.g., `@s_udf/your_file.zip`)
- `<package_path>`: Packages to install from pypi (Python only)
- `<handler_name>`: Name of the function in the code to call
- `<function_code>`: The implementation code in the specified language

## Supported Languages

| Language | Description | Enterprise Required | Package Support |
|----------|-------------|-------------------|-----------------|
| `python` | Python 3 with standard library | Yes | PyPI packages via PACKAGES |
| `javascript` | Modern JavaScript (ES6+) | No | No |
| `wasm` | WebAssembly (Rust compiled) | No | No |

## Data Type Mappings

### Python
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

### JavaScript
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

## Access Control Requirements

| Privilege | Object Type   | Description    |
|:----------|:--------------|:---------------|
| SUPER     | Global, Table | Operates a UDF |

To create an embedded function, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the SUPER [privilege](/guides/security/access-control/privileges).

## Examples

### Python Function

```sql
-- Simple Python function
CREATE FUNCTION calculate_age_py(VARCHAR)
RETURNS INT
LANGUAGE python HANDLER = 'calculate_age'
AS $$
from datetime import datetime

def calculate_age(birth_date_str):
    birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d')
    today = datetime.now()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age
$$;

-- Use the function
SELECT calculate_age_py('1990-05-15') AS age;
```

### JavaScript Function

```sql
-- JavaScript function for age calculation
CREATE FUNCTION calculate_age_js(VARCHAR)
RETURNS INT
LANGUAGE javascript HANDLER = 'calculateAge'
AS $$
export function calculateAge(birthDateStr) {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}
$$;

-- Use the function
SELECT calculate_age_js('1990-05-15') AS age;
```

### Python Function with Packages

```sql
CREATE FUNCTION ml_model_score()
RETURNS FLOAT
LANGUAGE python IMPORTS = ('@s1/model.zip') PACKAGES = ('scikit-learn') HANDLER = 'model_score'
AS $$
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

def model_score():
    X, y = load_iris(return_X_y=True)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
    
    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    return model.score(X_test, y_test)
$$;

-- Use the function
SELECT ml_model_score() AS accuracy;
```

### WASM Function

First, create a Rust project and compile to WASM:

```toml
# Cargo.toml
[package]
name = "arrow-udf-example"
version = "0.1.0"

[lib]
crate-type = ["cdylib"]

[dependencies]
arrow-udf = "0.8"
```

```rust
// src/lib.rs
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

Build and deploy:

```bash
cargo build --release --target wasm32-wasip1
# Upload to stage
CREATE STAGE s_udf;
PUT fs:///target/wasm32-wasip1/release/arrow_udf_example.wasm @s_udf/;
```

```sql
-- Create WASM function
CREATE FUNCTION fib_wasm(INT)
RETURNS INT
LANGUAGE wasm HANDLER = 'fib'
AS $$@s_udf/arrow_udf_example.wasm$$;

-- Use the function
SELECT fib_wasm(10) AS fibonacci_result;
```
