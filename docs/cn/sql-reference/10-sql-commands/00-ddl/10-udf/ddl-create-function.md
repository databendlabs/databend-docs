---
title: CREATE SCALAR FUNCTION
sidebar_position: 0
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：SQL v1.2.799；Python/JavaScript v1.2.339"/>

创建标量用户自定义函数（Scalar UDF）。同一条 `CREATE FUNCTION` 语句既可以用 SQL 表达式来写逻辑，也可以用 Python / JavaScript 写代码，并通过 `HANDLER` 指定入口函数。

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

## 参数说明

- `<parameter_list>`：可选的逗号分隔参数列表及其类型（例如 `x INT, y FLOAT`）
- `<return_type>`：函数返回值的数据类型
- `<expression>`：仅 SQL 方式使用，用于定义函数逻辑的 SQL 表达式
- `<language>`：仅 Python/JavaScript 方式使用，取值为 `python` 或 `javascript`
- `<import_path>`：仅 Python/JavaScript 方式可选，用于导入 Stage 文件（例如 `@s_udf/your_file.zip`）
- `<package_name>`：仅 Python 方式可选，用于从 PyPI 安装依赖（例如 `numpy`）
- `<handler_name>`：仅 Python/JavaScript 方式使用，代码中作为入口的函数名
- `<function_code>`：仅 Python/JavaScript 方式使用，对应语言的实现代码

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
