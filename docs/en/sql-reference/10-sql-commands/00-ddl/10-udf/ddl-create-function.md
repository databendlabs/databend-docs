---
title: CREATE SCALAR FUNCTION
sidebar_position: 0
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: SQL v1.2.799; Python/JavaScript v1.2.339; WASM v1.2.936"/>

Creates a scalar user-defined function (Scalar UDF). The same `CREATE FUNCTION` statement supports three implementation styles:

- **SQL expression**: Logic expressed purely in SQL; no external runtime is required.
- **Python / JavaScript**: Write code and specify the entry point with `HANDLER`.
- **WebAssembly (WASM)**: Compile a Rust function into a WASM module, upload it to a stage, and specify its entry point with `HANDLER`.

If you need to call external systems (HTTP/services), see External Function commands.

## Syntax

### SQL (expression)

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS <return_type>
    AS $$ <expression> $$
    [ DESC='<description>' ]
```

### Python / JavaScript

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name> 
    ( [<parameter_list>] ) 
    RETURNS <return_type>
    LANGUAGE <language>
    [IMPORTS = ('<import_path>', ...)]
    [PACKAGES = ('<package_name>', ...)]
    HANDLER = '<handler_name>'
    AS $$ <function_code> $$
    [ DESC='<description>' ]
```

### WebAssembly (WASM)

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name>
    ( [<parameter_list>] )
    RETURNS <return_type>
    LANGUAGE wasm
    HANDLER = '<handler_name>'
    AS $$<stage_path>$$
    [ DESC='<description>' ]
```

## Parameters

- `<parameter_list>`: Optional comma-separated list of parameters with their types (e.g., `x INT, y FLOAT`)
- `<return_type>`: The data type of the function's return value
- `<language>`: `python`, `javascript`, or `wasm`
- `<import_path>`: Stage files to import for Python or JavaScript (e.g., `@s_udf/your_file.zip`)
- `<package_name>`: Packages to install from PyPI (Python only; e.g., `numpy`)
- `<handler_name>`: Name of the function to call. For WASM, use only the Rust entry-point name, not a full Arrow UDF signature.
- `<function_code>`: Python or JavaScript implementation code
- `<stage_path>`: Path to the compiled WASM module in a stage (e.g., `@wasm_udf_stage/wasm_udf_example.wasm`)

## Access control requirements

| Privilege | Object Type   | Description    |
|:----------|:--------------|:---------------|
| SUPER     | Global, Table | Operates a UDF |

To create a user-defined function, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the SUPER [privilege](/guides/security/access-control/privileges).

## SQL

```sql
-- Create a function to calculate area of a circle
CREATE OR REPLACE FUNCTION area_of_circle(radius FLOAT)
RETURNS FLOAT
AS $$
  pi() * radius * radius
$$;

-- Create a function to calculate age in years
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INT
AS $$
  date_diff('year', birth_date, now())
$$;

-- Create a function with multiple parameters
CREATE OR REPLACE FUNCTION calculate_bmi(weight_kg FLOAT, height_m FLOAT)
RETURNS FLOAT
AS $$
  weight_kg / (height_m * height_m)
$$;

-- Use the functions
SELECT area_of_circle(5.0) AS circle_area;
SELECT calculate_age(to_date('1990-05-15')) AS age;
SELECT calculate_bmi(70.0, 1.75) AS bmi;
```

## Python

Python runtime requires Databend Enterprise. You can install PyPI packages via `PACKAGES` and import stage files via `IMPORTS`.

### Data type mappings (Python)

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

### Examples

```sql
CREATE OR REPLACE FUNCTION calculate_age_py(VARCHAR)
RETURNS INT
LANGUAGE python
HANDLER = 'calculate_age'
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

SELECT calculate_age_py('1990-05-15') AS age;
```

```sql
CREATE OR REPLACE FUNCTION numpy_sqrt(FLOAT)
RETURNS FLOAT
LANGUAGE python
PACKAGES = ('numpy')
HANDLER = 'numpy_sqrt'
AS $$
import numpy as np

def numpy_sqrt(x):
    return float(np.sqrt(x))
$$;

SELECT numpy_sqrt(9.0) AS sqrt_val;
```

## JavaScript

### Data type mappings (JavaScript)

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

### Example

```sql
CREATE OR REPLACE FUNCTION calculate_age_js(VARCHAR)
RETURNS INT
LANGUAGE javascript
HANDLER = 'calculateAge'
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
```

## WebAssembly (WASM)

WASM UDFs let you implement scalar functions in Rust and run the compiled module directly in Databend. The module must use an Arrow UDF version compatible with your Databend release.

The following example builds and registers a greatest common divisor function.

### 1. Create the Rust project

Install the WASI Preview 1 target and create a library crate:

```bash
rustup target add wasm32-wasip1
cargo new --lib wasm-udf-example
cd wasm-udf-example
```

`wasm32-wasip1` is the current name of the Rust target previously called `wasm32-wasi`.

Replace `Cargo.toml` with the following configuration. The pinned Arrow UDF revision matches Databend v1.2.936:

```toml
[package]
name = "wasm-udf-example"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
arrow-udf = { git = "https://github.com/datafuse-extras/arrow-udf.git", rev = "c1de708add62ecd1afa2721b2e5c639f29be1f9d" }
```

### 2. Implement the function

Replace `src/lib.rs` with:

```rust
use arrow_udf::function;

#[function("wasm_gcd(int, int) -> int")]
fn wasm_gcd(mut a: i32, mut b: i32) -> i32 {
    while b != 0 {
        (a, b) = (b, a % b);
    }
    a
}
```

### 3. Build and upload the module

```bash
cargo build --release --target wasm32-wasip1
```

The compiled module is created at `target/wasm32-wasip1/release/wasm_udf_example.wasm`. Upload it to a Databend stage with an absolute local path:

```sql
CREATE STAGE IF NOT EXISTS wasm_udf_stage;
PUT fs:///absolute/path/to/wasm_udf_example.wasm @wasm_udf_stage/;
```

### 4. Register and use the function

`HANDLER` is the Rust entry-point name (`wasm_gcd`), not the complete signature in the `#[function(...)]` attribute.

```sql
CREATE OR REPLACE FUNCTION wasm_gcd(INT, INT)
RETURNS INT
LANGUAGE wasm
HANDLER = 'wasm_gcd'
AS $$@wasm_udf_stage/wasm_udf_example.wasm$$;

SELECT wasm_gcd(18, 24) AS result;
```

The query returns `6`.

:::note Migrating an older WASM UDF
Legacy WASM UDFs used a full exported signature such as `HANDLER = 'wasm_gcd(int4,int4)->int4'`. Current Databend versions require only the entry-point name: `HANDLER = 'wasm_gcd'`.

To migrate, rebuild the module with a compatible Arrow UDF version, upload the rebuilt module, and run `CREATE OR REPLACE FUNCTION` with the bare handler name. Updating only the staged file is insufficient because existing function metadata is not rewritten automatically.
:::

## Worker Management for UDFs

In Databend Cloud, each UDF has an associated **Worker** that manages its execution environment in the sandbox. After creating a UDF, you may need to manage its worker for optimal performance and resource utilization.

### Creating a Worker for Your UDF

```sql
-- Create a worker for your UDF (worker name should match UDF name)
CREATE WORKER calculate_age_js WITH
    size='small',
    auto_suspend='300',
    auto_resume='true';
```

### Managing Worker Resources

```sql
-- View all workers
SHOW WORKERS;

-- Adjust worker settings
ALTER WORKER calculate_age_js SET size='medium', auto_suspend='600';

-- Add tags for organization
ALTER WORKER calculate_age_js SET TAG 
    environment='production',
    team='analytics',
    purpose='age-calculation';
```

### Worker Lifecycle

```sql
-- Suspend worker when not in use
ALTER WORKER calculate_age_js SUSPEND;

-- Resume worker when needed
ALTER WORKER calculate_age_js RESUME;

-- Remove worker when UDF is no longer needed
DROP WORKER calculate_age_js;
```

### Environment Variables

For security reasons, environment variables for UDFs are managed separately in the cloud console. After creating a UDF and its worker, configure any required environment variables through the Databend Cloud interface.

For more information, see [Worker Management](../20-worker/index.md).
```
