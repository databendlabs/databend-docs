---
title: CREATE SCALAR FUNCTION
sidebar_position: 0
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：SQL v1.2.799；Python/JavaScript v1.2.339；WASM v1.2.936"/>

创建标量用户自定义函数（Scalar UDF）。同一条 `CREATE FUNCTION` 语句支持以下三种实现方式：

- **SQL 表达式**：完全使用 SQL 编写逻辑，不需要外部运行时。
- **Python / JavaScript**：编写代码，并通过 `HANDLER` 指定入口函数。
- **WebAssembly（WASM）**：将 Rust 函数编译为 WASM 模块、上传到 Stage，再通过 `HANDLER` 指定入口函数。

如果你要调用外部系统（HTTP/服务），请参考外部函数（External Function）相关命令。

## 语法

### SQL（表达式）

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

### WebAssembly（WASM）

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name>
    ( [<parameter_list>] )
    RETURNS <return_type>
    LANGUAGE wasm
    HANDLER = '<handler_name>'
    AS $$<stage_path>$$
    [ DESC='<description>' ]
```

## 参数说明

- `<parameter_list>`：可选的逗号分隔参数列表及其类型（例如 `x INT, y FLOAT`）
- `<return_type>`：函数返回值的数据类型
- `<expression>`：仅 SQL 方式使用，用于定义函数逻辑的 SQL 表达式
- `<language>`：取值为 `python`、`javascript` 或 `wasm`
- `<import_path>`：仅 Python/JavaScript 方式可选，用于导入 Stage 文件（例如 `@s_udf/your_file.zip`）
- `<package_name>`：仅 Python 方式可选，用于从 PyPI 安装依赖（例如 `numpy`）
- `<handler_name>`：要调用的函数名。WASM 方式只填写 Rust 入口函数名，不要填写完整的 Arrow UDF 签名
- `<function_code>`：仅 Python/JavaScript 方式使用，对应语言的实现代码
- `<stage_path>`：Stage 中已编译 WASM 模块的路径（例如 `@wasm_udf_stage/wasm_udf_example.wasm`）

## 访问控制要求

| 权限 | 对象类型   | 描述    |
|:----------|:--------------|:---------------|
| SUPER     | Global, Table | 操作 UDF |

要创建用户定义函数，执行操作的用户或 [current_role](/guides/security/access-control/roles) 必须拥有 SUPER [privilege](/guides/security/access-control/privileges)。

## SQL

```sql
-- 创建计算圆面积的函数
CREATE OR REPLACE FUNCTION area_of_circle(radius FLOAT)
RETURNS FLOAT
AS $$
  pi() * radius * radius
$$;

-- 创建计算年龄（年）的函数
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INT
AS $$
  date_diff('year', birth_date, now())
$$;

-- 创建带多个参数的函数
CREATE OR REPLACE FUNCTION calculate_bmi(weight_kg FLOAT, height_m FLOAT)
RETURNS FLOAT
AS $$
  weight_kg / (height_m * height_m)
$$;

-- 使用函数
SELECT area_of_circle(5.0) AS circle_area;
SELECT calculate_age(to_date('1990-05-15')) AS age;
SELECT calculate_bmi(70.0, 1.75) AS bmi;
```

## Python

Python 运行时需要企业版。你可以用 `PACKAGES` 安装 PyPI 包，用 `IMPORTS` 引入 Stage 文件（例如模型、依赖压缩包）。

### 数据类型映射（Python）

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

### 示例

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

### 数据类型映射（JavaScript）

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

### 示例

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

## WebAssembly（WASM）

WASM UDF 支持使用 Rust 实现标量函数，并在 Databend 中直接运行编译后的模块。模块使用的 Arrow UDF 版本必须与 Databend 版本兼容。

以下示例将构建并注册一个计算最大公约数的函数。

### 1. 创建 Rust 项目

安装 WASI Preview 1 编译目标，并创建一个库 crate：

```bash
rustup target add wasm32-wasip1
cargo new --lib wasm-udf-example
cd wasm-udf-example
```

`wasm32-wasip1` 是 Rust 对原 `wasm32-wasi` 编译目标的现用名称。

将 `Cargo.toml` 替换为以下配置。锁定的 Arrow UDF revision 与 Databend v1.2.936 匹配：

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

### 2. 实现函数

将 `src/lib.rs` 替换为：

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

### 3. 构建并上传模块

```bash
cargo build --release --target wasm32-wasip1
```

编译后的模块位于 `target/wasm32-wasip1/release/wasm_udf_example.wasm`。使用绝对本地路径将其上传到 Databend Stage：

```sql
CREATE STAGE IF NOT EXISTS wasm_udf_stage;
PUT fs:///absolute/path/to/wasm_udf_example.wasm @wasm_udf_stage/;
```

### 4. 注册并使用函数

`HANDLER` 填写 Rust 入口函数名（`wasm_gcd`），而不是 `#[function(...)]` 属性中的完整签名。

```sql
CREATE OR REPLACE FUNCTION wasm_gcd(INT, INT)
RETURNS INT
LANGUAGE wasm
HANDLER = 'wasm_gcd'
AS $$@wasm_udf_stage/wasm_udf_example.wasm$$;

SELECT wasm_gcd(18, 24) AS result;
```

查询返回 `6`。

:::note 迁移旧版 WASM UDF
旧版 WASM UDF 使用完整导出签名，例如 `HANDLER = 'wasm_gcd(int4,int4)->int4'`。当前 Databend 版本只接受入口函数名：`HANDLER = 'wasm_gcd'`。

迁移时，请使用兼容的 Arrow UDF 版本重新构建模块、上传新模块，并通过裸入口函数名执行 `CREATE OR REPLACE FUNCTION`。仅替换 Stage 中的文件并不足够，因为已有的函数元数据不会自动改写。
:::
