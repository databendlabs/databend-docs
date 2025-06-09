---
title: 用户自定义函数
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

# Databend 中的用户自定义函数（UDF）

用户自定义函数（UDF）允许您创建针对特定数据处理需求的自定义操作。Databend 支持两种主要类型的 UDF：

| UDF 类型 | 描述 | 语言 | 使用场景 |
|----------|-------------|-----------|----------|
| [Lambda UDF](#lambda-udf) | 使用 SQL 语法的简单表达式 | SQL | 快速转换和计算 |
| [嵌入式 UDF](#嵌入式-udf) | 完整的编程语言支持 | Python（企业版）、JavaScript | 复杂逻辑和算法 |

## Lambda UDF

Lambda UDF 允许您直接在查询中使用 SQL 表达式定义自定义操作。这适用于可通过单个 SQL 表达式表示的简单转换。

### 语法

```sql
CREATE [OR REPLACE] FUNCTION <function_name> AS (<parameter_list>) -> <expression>;
```

### 参数

| 参数 | 描述 |
|-----------|-------------|
| `function_name` | 要创建的 Lambda UDF 名称 |
| `parameter_list` | 逗号分隔的参数名称列表 |
| `expression` | 定义函数逻辑的 SQL 表达式 |

### 使用说明

- Lambda UDF 使用 SQL 编写，并在 Databend 查询引擎（Query Engine）内执行
- 可接受多个参数，但必须返回单个值
- 参数类型在运行时根据输入数据推断
- 可使用显式类型转换（如 `::FLOAT`）确保正确的数据类型处理
- 可在 SELECT 语句、WHERE 子句和其他 SQL 表达式中使用
- 存储在数据库中，可通过 `SHOW USER FUNCTIONS` 命令查看
- 可使用 `DROP FUNCTION` 命令删除

### 示例：年龄计算

```sql
-- 创建计算年龄（年）的 Lambda UDF
CREATE OR REPLACE FUNCTION age AS (dt) -> 
    date_diff(year, dt, now());

-- 创建包含生日的表
CREATE TABLE persons (
    id INT,
    name VARCHAR,
    birthdate DATE
);

-- 插入示例数据
INSERT INTO persons VALUES
    (1, 'Alice', '1990-05-15'),
    (2, 'Bob', '2000-10-20');

-- 使用 Lambda UDF 计算年龄
SELECT
    name,
    birthdate,
    age(birthdate) AS age_in_years
FROM persons;

-- 预期输出（结果因当前日期而异）：
-- +-------+------------+-------------+
-- | name  | birthdate  | age_in_years|
-- +-------+------------+-------------+
-- | Alice | 1990-05-15 |          35 |
-- | Bob   | 2000-10-20 |          24 |
-- +-------+------------+-------------+
```

## 嵌入式 UDF

嵌入式 UDF 允许您使用完整的编程语言编写函数，提供比 Lambda UDF 更强的灵活性和功能。

### 支持的语言

| 语言 | 描述 | 需要企业版 |
|----------|-------------|---------------------|
| [Python](#python) | Python 3 标准库 | 是 |
| [JavaScript](#javascript) | 现代 JavaScript (ES6+) | 否 |

### 语法

```sql
CREATE [OR REPLACE] FUNCTION <function_name>([<parameter_type>, ...])
RETURNS <return_type>
LANGUAGE <language_name> HANDLER = '<handler_name>'
AS $$
<function_code>
$$;
```

### 参数

| 参数 | 描述 |
|-----------|-------------|
| `function_name` | UDF 名称 |
| `parameter_type` | 输入参数的数据类型 |
| `return_type` | 返回值的数据类型 |
| `language_name` | 编程语言（python 或 javascript） |
| `handler_name` | 被调用函数的代码名称 |
| `function_code` | 函数实现代码 |

### Python

Python UDF 允许您在 SQL 查询中使用 Python 丰富的标准库和语法。此功能需要 Databend 企业版（Enterprise）。

:::note
Python UDF 仅能使用 Python 标准库，不支持第三方导入。
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

#### 示例：年龄计算

```sql
-- 创建计算年龄（年）的 Python UDF
CREATE OR REPLACE FUNCTION calculate_age_py(VARCHAR)
RETURNS INT
LANGUAGE python HANDLER = 'calculate_age'
AS $$
from datetime import datetime

def calculate_age(birth_date_str):
    # 将日期字符串解析为 datetime 对象
    birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d')
    today = datetime.now()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age
$$;

-- 使用 Python UDF
SELECT calculate_age_py('1990-05-15') AS age_result;

-- 预期输出（结果因当前日期而异）：
-- +------------+
-- | age_result |
-- +------------+
-- |         35 |
-- +------------+
```

### JavaScript

JavaScript UDF 允许您在 SQL 查询中使用现代 JavaScript (ES6+) 特性，为 Web 开发人员提供熟悉的语法。

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
| LIST | Array |
| MAP | Object |
| STRUCT | Object |
| JSON | Object/Array |

#### 示例：年龄计算

```sql
-- 创建计算年龄（年）的 JavaScript UDF
CREATE OR REPLACE FUNCTION calculate_age_js(VARCHAR)
RETURNS INT
LANGUAGE javascript HANDLER = 'calculateAge'
AS $$
export function calculateAge(birthDateStr) {
    // 将日期字符串解析为 Date 对象
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // 若今年生日未到，调整年龄
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}
$$;

-- 使用 JavaScript UDF
SELECT calculate_age_js('1990-05-15') AS age_result;

-- 预期输出（结果因当前日期而异）：
-- +------------+
-- | age_result |
-- +------------+
-- |         35 |
-- +------------+
```

## 管理 UDF

Databend 提供以下命令管理 UDF：

| 命令 | 描述 | 示例 |
|---------|-------------|--------|
| `SHOW USER FUNCTIONS` | 列出当前数据库所有 UDF | `SHOW USER FUNCTIONS;` |
| `DROP FUNCTION` | 删除 UDF | `DROP FUNCTION age;` |
| `ALTER FUNCTION` | 修改 UDF | `ALTER FUNCTION age RENAME TO calculate_age;` |

完整 UDF 管理命令文档请参阅 [用户自定义函数](https://docs.databend.cn/sql/sql-commands/ddl/udf/)。