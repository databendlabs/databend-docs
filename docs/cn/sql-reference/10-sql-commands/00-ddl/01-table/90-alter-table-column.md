---
title: ALTER TABLE COLUMN
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.415"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

通过添加、转换、重命名、更改或删除列来修改表。

## 语法

```sql
-- 将列添加到表的末尾
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
ADD [ COLUMN ] <column_name> <data_type> [ NOT NULL | NULL ] [ DEFAULT <constant_value> ]

-- 将列添加到指定位置
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
ADD [ COLUMN ] <column_name> <data_type> [ NOT NULL | NULL ] [ DEFAULT <constant_value> ] [ FIRST | AFTER <column_name> ]

-- 添加虚拟计算列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
ADD [ COLUMN ] <column_name> <data_type> AS (<expr>) VIRTUAL

-- 将存储的计算列转换为常规列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
MODIFY [ COLUMN ] <column_name> DROP STORED

-- 重命名列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name>
RENAME [ COLUMN ] <column_name> TO <new_column_name>

-- 更改数据类型和/或注释
-- 如果只想修改或添加列的注释，则仍必须在命令中指定该列的当前数据类型
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
MODIFY [ COLUMN ] <column_name> <new_data_type> [ DEFAULT <constant_value> ] [ COMMENT '<comment>' ]
       [ , [ COLUMN ] <column_name> <new_data_type> [ DEFAULT <constant_value> ] [ COMMENT '<comment>' ] ]
       ...

-- 为列设置/取消设置 MASKING POLICY
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name>
MODIFY [ COLUMN ] <column_name> SET MASKING POLICY <policy_name>

ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name>
MODIFY [ COLUMN ] <column_name> UNSET MASKING POLICY

-- 删除列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
DROP [ COLUMN ] <column_name>
```

:::note
- 添加或修改列时，只能接受常量值作为默认值。如果使用非常量表达式，则会发生错误。
- 尚不支持使用 ALTER TABLE 添加存储的计算列。
- 更改表列的数据类型时，存在转换错误的风险。例如，如果尝试将包含文本 (String) 的列转换为数字 (Float)，则可能会导致问题。
- 为列设置 masking policy 时，请确保策略中定义的数据类型（请参阅 [CREATE MASKING POLICY](../12-mask-policy/create-mask-policy.md) 语法中的参数 *arg_type_to_mask*）与列匹配。
:::

## 示例

### 示例 1：添加、重命名和删除列

此示例说明了如何创建名为 "default.users" 的表，其中包含列 'username'、'email' 和 'age'。它展示了如何添加具有各种约束的列 'id' 和 'middle_name'。该示例还演示了重命名和随后删除 "age" 列。

```sql
-- 创建表
CREATE TABLE default.users (
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  age INT
);

-- 将列添加到表的末尾
ALTER TABLE default.users
ADD COLUMN business_email VARCHAR(255) NOT NULL DEFAULT 'example@example.com';

DESC default.users;

Field         |Type   |Null|Default              |Extra|
--------------+-------+----+---------------------+-----+
username      |VARCHAR|NO  |''                   |     |
email         |VARCHAR|YES |NULL                 |     |
age           |INT    |YES |NULL                 |     |
business_email|VARCHAR|NO  |'example@example.com'|     |

-- 将列添加到表的开头
ALTER TABLE default.users
ADD COLUMN id int NOT NULL FIRST;

DESC default.users;

Field         |Type   |Null|Default              |Extra|
--------------+-------+----+---------------------+-----+
id            |INT    |NO  |0                    |     |
username      |VARCHAR|NO  |''                   |     |
email         |VARCHAR|YES |NULL                 |     |
age           |INT    |YES |NULL                 |     |
business_email|VARCHAR|NO  |'example@example.com'|     |

-- 在列 'username' 之后添加列
ALTER TABLE default.users
ADD COLUMN middle_name VARCHAR(50) NULL AFTER username;

DESC default.users;

Field         |Type   |Null|Default              |Extra|
--------------+-------+----+---------------------+-----+
id            |INT    |NO  |0                    |     |
username      |VARCHAR|NO  |''                   |     |
middle_name   |VARCHAR|YES |NULL                 |     |
email         |VARCHAR|YES |NULL                 |     |
age           |INT    |YES |NULL                 |     |
business_email|VARCHAR|NO  |'example@example.com'|     |

-- 重命名列
ALTER TABLE default.users
RENAME COLUMN age TO new_age;

DESC default.users;

Field         |Type   |Null|Default              |Extra|
--------------+-------+----+---------------------+-----+
id            |INT    |NO  |0                    |     |
username      |VARCHAR|NO  |''                   |     |
middle_name   |VARCHAR|YES |NULL                 |     |
email         |VARCHAR|YES |NULL                 |     |
new_age       |INT    |YES |NULL                 |     |
business_email|VARCHAR|NO  |'example@example.com'|     |

-- 删除列
ALTER TABLE default.users
DROP COLUMN new_age;

DESC default.users;

Field         |Type   |Null|Default              |Extra|
--------------+-------+----+---------------------+-----+
id            |INT    |NO  |0                    |     |
username      |VARCHAR|NO  |''                   |     |
middle_name   |VARCHAR|YES |NULL                 |     |
email         |VARCHAR|YES |NULL                 |     |
business_email|VARCHAR|NO  |'example@example.com'|     |
```

### 示例 2：添加计算列

此示例演示了如何创建一个用于存储员工信息的表，将数据插入到表中，并添加一个计算列以根据每个员工的出生年份计算其年龄。

```sql
-- 创建表
CREATE TABLE Employees (
  ID INT,
  Name VARCHAR(50),
  BirthYear INT
);

-- 插入数据
INSERT INTO Employees (ID, Name, BirthYear)
VALUES
  (1, 'John Doe', 1990),
  (2, 'Jane Smith', 1985),
  (3, 'Robert Johnson', 1982);

-- 添加名为 Age 的计算列
ALTER TABLE Employees
ADD COLUMN Age INT64 AS (2023 - BirthYear) VIRTUAL;

SELECT * FROM Employees;

ID | Name          | BirthYear | Age
------------------------------------
1  | John Doe      | 1990      | 33
2  | Jane Smith    | 1985      | 38
3  | Robert Johnson| 1982      | 41
```

### 示例 3：转换计算列

此示例创建一个名为 "products" 的表，其中包含 ID、价格、数量和计算列 "total_price" 的列。ALTER TABLE 语句从 "total_price" 列中删除计算功能，将其转换为常规列。

```sql
CREATE TABLE IF NOT EXISTS products (
  id INT,
  price FLOAT64,
  quantity INT,
  total_price FLOAT64 AS (price * quantity) STORED
);

ALTER TABLE products
MODIFY COLUMN total_price DROP STORED;
```

### 示例 4：更改列的数据类型

此示例演示如何修改列的数据类型并向其添加注释。

```sql
CREATE TABLE students_info (
  id INT,
  name VARCHAR(50),
  age INT
);

-- 将 'age' 列的数据类型更改为 VARCHAR，默认值为 0
ALTER TABLE students_info MODIFY COLUMN age VARCHAR(10) DEFAULT '0';

SHOW CREATE TABLE students_info;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     Table     │                                                    Create Table                                                   │
├───────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ students_info │ CREATE TABLE students_info (\n  id INT NULL,\n  name VARCHAR NULL,\n  age VARCHAR NULL DEFAULT '0'\n) ENGINE=FUSE │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 向 'age' 列添加注释
ALTER TABLE students_info MODIFY COLUMN age VARCHAR(10) COMMENT 'abc';

SHOW CREATE TABLE students_info;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     Table     │                                                           Create Table                                                          │
├───────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ students_info │ CREATE TABLE students_info (\n  id INT NULL,\n  name VARCHAR NULL,\n  age VARCHAR NULL DEFAULT '0' COMMENT 'abc'\n) ENGINE=FUSE │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 示例 5：为列设置 Masking Policy

此示例说明了如何设置 masking policy 以根据用户角色选择性地显示或屏蔽敏感数据。

```sql
-- 创建表并插入示例数据
CREATE TABLE user_info (
    id INT,
    email STRING
);

INSERT INTO user_info (id, email) VALUES (1, 'sue@example.com');
INSERT INTO user_info (id, email) VALUES (2, 'eric@example.com');

-- 创建角色
CREATE ROLE 'MANAGERS';
GRANT ALL ON *.* TO ROLE 'MANAGERS';

-- 创建用户并将角色授予用户
CREATE USER manager_user IDENTIFIED BY 'databend';
GRANT ROLE 'MANAGERS' TO 'manager_user';

-- 创建 masking policy
CREATE MASKING POLICY email_mask
AS
  (val string)
  RETURNS string ->
  CASE
  WHEN current_role() IN ('MANAGERS') THEN
    val
  ELSE
    '*********'
  END
  COMMENT = 'hide_email';

-- 将 masking policy 与 'email' 列关联
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- 使用 Root 用户查询
SELECT * FROM user_info;

id|email    |
--+---------+
 2|*********|
 1|*********|
```