---
title: CREATE EMBEDDED FUNCTION
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

使用编程语言（Python、JavaScript、WASM）创建嵌入式 UDF。为保持一致性，其语法与 SQL 函数统一使用 `$$` 语法。

## 语法

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

其中：
- `<parameter_list>`：以逗号分隔的参数及其类型列表（例如 `x INT, name VARCHAR`）
- `<return_type>`：函数返回值的数据类型
- `<language>`：编程语言（`python`、`javascript`、`wasm`）
- `<import_path>`：要导入的 Stage 文件（例如 `@s_udf/your_file.zip`）
- `<package_path>`：从 PyPI 安装的包（仅 Python）
- `<handler_name>`：代码中要调用的函数名称
- `<function_code>`：指定语言的实现代码

## 支持的语言

| 语言 | 描述 | 需要企业版 | 包支持 |
|----------|-------------|-------------------|-----------------|
| `python` | Python 3 及标准库 | 是 | 通过 PACKAGES 支持 PyPI 包 |
| `javascript` | 现代 JavaScript（ES6+） | 否 | 否 |
| `wasm` | WebAssembly（Rust 编译） | 否 | 否 |

## 数据类型映射

### Python
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

### JavaScript
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

## 访问控制要求

| 权限 | 对象类型 | 描述 |
|:----------|:--------------|:---------------|
| SUPER | Global, Table | 操作 UDF |

要创建嵌入式函数，执行操作的用户或 [current_role](/guides/security/access-control/roles) 必须拥有 SUPER [privilege](/guides/security/access-control/privileges)。

## 示例

### Python 函数

```sql
-- 简单的 Python 函数
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

-- 使用函数
SELECT calculate_age_py('1990-05-15') AS age;
```

### JavaScript 函数

```sql
-- 用于计算年龄的 JavaScript 函数
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

-- 使用函数
SELECT calculate_age_js('1990-05-15') AS age;
```

### 带包的 Python 函数

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

-- 使用函数
SELECT ml_model_score() AS accuracy;
```

### WASM 函数

首先，创建 Rust 项目并编译为 WASM：

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

构建并部署：

```bash
cargo build --release --target wasm32-wasip1
# 上传到 Stage
CREATE STAGE s_udf;
PUT fs:///target/wasm32-wasip1/release/arrow_udf_example.wasm @s_udf/;
```

```sql
-- 创建 WASM 函数
CREATE FUNCTION fib_wasm(INT)
RETURNS INT
LANGUAGE wasm HANDLER = 'fib'
AS $$@s_udf/arrow_udf_example.wasm$$;

-- 使用函数
SELECT fib_wasm(10) AS fibonacci_result;
```
