---
title: CREATE SCALAR FUNCTION
sidebar_position: 0
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: SQL v1.2.799; Python/JavaScript v1.2.339; WASM v1.2.936; Python scalar workers v1.2.955; Sandbox/resource limits v1.2.957"/>

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

### Worker 沙箱与依赖

从 v1.2.955 开始，本地 Python 标量 UDF 在查询专属的 Worker 进程中运行，不再共享 Query 进程的 Python 解释器。每个本地运行时按需创建 Worker，并在一次 SQL 执行内复用，不跨查询复用。并发调用遵循 SQL `max_threads`，同时受节点和租户容量约束。额外的空闲 Worker 默认在 300 秒后回收；每个运行时保留一个最低 Worker。这些进程边界与 v1.2.957 引入的 OS 沙箱不同。

从 v1.2.957 开始，本地 Python Worker 必须先进入 OS 沙箱，再执行用户代码。Linux 要求内核版本不低于 5.13，活动 LSM 列表中启用 Landlock，支持 seccomp，并使用 x86_64 或 aarch64。容器的 seccomp 配置必须允许 `landlock_*` 系统调用。沙箱设置失败时，执行会报错 `Python UDF sandbox is unavailable, refusing to run user code`。本地沙箱没有绕过开关。

- Worker 只接收允许列表中的环境变量，不会继承 Query 节点的完整环境。每个 Worker 都有私有可写目录，用于临时文件、依赖和 Stage 导入。
- Python 安装目录和所需系统库只读。禁止读取 Query 配置/数据文件和其他进程的环境文件。路径元数据查询仍可能暴露路径是否存在。
- 用户代码不能打开原生网络 Socket、启动子程序/子进程，或向 Query 进程发送信号。通过 integration 访问 HTTP(S) 的方法见[受控 HTTP(S) 访问](#受控-https-访问)。
- macOS Worker 不使用 OS 沙箱，并会记录警告。macOS 仅适用于本地开发，不适合执行不可信 UDF。其他非 Linux 平台拒绝本地 Python 执行。

依赖安装在 Query 节点上执行，不在 Worker 沙箱中。依赖必须使用包名称及可选的 extras/版本约束，例如 `numpy>=1.26`。pip 选项、URL、直接引用、本地路径和环境标记会被拒绝。运维配置的 pip 镜像/代理和 CA 设置仍通过允许列表获得支持。

`python_udf_pip_only_binary = true` 是默认值，只安装 wheel 包。将它设为 `false` 会允许源码分发包在 Query 节点上执行构建脚本。不要认为 Worker 沙箱能够防护依赖安装代码。

本地 Python 标量和聚合函数共用 Worker 准入、排队和请求超时控制。Worker 属于一次查询执行，不会跨查询复用。Python Worker 内存不计入查询分配器，进程数量限制也不能约束 Worker 总内存。请使用 OS 资源控制实现内存隔离。配置方法和超时范围请参阅[脚本 UDF 资源](/guides/self-hosted/references/node-config/query-config#script-udf-resources)。

### 受控 HTTP(S) 访问

<FunctionDescription description="Introduced or updated: Unreleased"/>

对于本地 Python 函数，在 `CREATE FUNCTION` 或替换式 `ALTER FUNCTION` 定义的结束 `$$` 后添加 `EXTERNAL_ACCESS_INTEGRATIONS = (<integration_name>, ...)`。Operator 必须在每个执行节点启用 `query.enable_python_udf_external_access`。开发者除满足原有 CREATE/ALTER 权限要求外，还需每个被引用 integration 的 `USAGE`。

仅支持通过可使用代理的同步客户端访问获准的 HTTP(S) 目标。强制执行的 Linux worker 沙箱仍会拒绝原生 socket。远程标量沙箱执行、JavaScript 和 WASM 不支持此绑定。完整配置、示例及安全边界见[本地 Python UDF 访问](/guides/security/external-access-integration#本地-python-udf-访问)。

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

从 v1.2.957 开始，每个进程内 JavaScript 运行时的默认堆限制为 1024 MiB，操作截止时间为 300 秒。该期限覆盖参数/结果转换、异步延续和模块顶层代码。这些限制不会为 Python Worker 设置内存上限。请参阅[脚本 UDF 资源](/guides/self-hosted/references/node-config/query-config#script-udf-resources)。

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

WASM UDF 支持使用 Rust 实现标量函数，并在 Databend 中直接运行编译后的模块。

从 v1.2.957 开始，每个 WASM 实例的默认线性内存限制为 1024 MiB。`udf_script_execution_timeout_secs` 仅适用于 JavaScript；WASM 尚无执行超时。这两个进程内引擎都不会在运行中的调用内响应查询取消。不要认为这些控制可以中断 WASM 无限循环。

WASM 模块必须使用 Arrow UDF ABI 3.0，可通过导出的 `ARROWUDF_VERSION_3_0` 标识确认。ABI 3.0 从 `arrow-udf` 0.3.0 开始引入，并使用 `int32` 等 Arrow 类型名。更早的模块使用 `int4` 等旧类型名，与当前的类型化函数查找不兼容；高于 3 的 ABI 版本也不受当前运行时支持。

以下示例将构建并注册一个计算最大公约数的函数。

### 1. 创建 Rust 项目

安装 WASI Preview 1 编译目标，并创建一个库 crate：

```bash
rustup target add wasm32-wasip1
cargo new --lib wasm-udf-example
cd wasm-udf-example
```

`wasm32-wasip1` 是 Rust 对原 `wasm32-wasi` 编译目标的现用名称。

将 `Cargo.toml` 替换为以下配置：

```toml
[package]
name = "wasm-udf-example"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
arrow-udf = "0.6.2"
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

编译后的模块位于 `target/wasm32-wasip1/release/wasm_udf_example.wasm`。使用绝对本地路径上传时，请在本地 BendSQL 会话中执行以下命令。Databend Cloud SQL 编辑器无法通过 `PUT fs://...` 读取你电脑上的文件：

```sql
CREATE STAGE IF NOT EXISTS wasm_udf_stage;
PUT fs:///absolute/path/to/wasm_udf_example.wasm @wasm_udf_stage/;
```

也可以在 Databend Cloud SQL 编辑器中执行上述 `CREATE STAGE` 语句创建 Stage，然后生成预签名上传 URL，而不执行 `PUT`：

```sql
PRESIGN UPLOAD @wasm_udf_stage/wasm_udf_example.wasm EXPIRE = 600;
```

使用返回的 HTTP `method`、`headers` 和 `url` 上传本地模块，上传完成后再注册函数。上传方法请参阅 [PRESIGN](../03-stage/presign.md)。

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

查询结果：

```text
+--------+
| result |
+--------+
|      6 |
+--------+
```
