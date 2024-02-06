---
title: ALTER TABLE COLUMN
sidebar_position: 4
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.327"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='掩码策略'/>

通过添加、转换、重命名、更改或移除列来修改表。

## 语法

```sql
-- 在表的末尾添加一列
ALTER TABLE [IF EXISTS] [database.]<table_name> 
ADD [COLUMN] <column_name> <data_type> [NOT NULL | NULL] [DEFAULT <constant_value>]

-- 在指定位置添加一列
ALTER TABLE [IF EXISTS] [database.]<table_name> 
ADD [COLUMN] <column_name> <data_type> [NOT NULL | NULL] [DEFAULT <constant_value>] [FIRST | AFTER <column_name>]

-- 添加一个虚拟计算列
ALTER TABLE [IF EXISTS] [database.]<table_name> 
ADD [COLUMN] <column_name> <data_type> AS (<expr>) VIRTUAL

-- 将存储的计算列转换为常规列
ALTER TABLE [IF EXISTS] [database.]<table_name> 
MODIFY [COLUMN] <column_name> DROP STORED

-- 重命名一列
ALTER TABLE [IF EXISTS] [database.]<table_name>
RENAME [COLUMN] <column_name> TO <new_column_name>

-- 更改一个或多个列的数据类型
ALTER TABLE [IF EXISTS] [database.]<table_name> 
MODIFY [COLUMN] <column_name> <new_data_type> [DEFAULT <constant_value>][, COLUMN <column_name> <new_data_type> [DEFAULT <constant_value>], ...]

-- 为列设置/取消设置掩码策略
ALTER TABLE [IF EXISTS] [database.]<table_name>
MODIFY [COLUMN] <column_name> SET MASKING POLICY <policy_name>

ALTER TABLE [IF EXISTS] [database.]<table_name>
MODIFY [COLUMN] <column_name> UNSET MASKING POLICY

-- 移除一列
ALTER TABLE [IF EXISTS] [database.]<table_name> 
DROP [COLUMN] <column_name>
```

:::note
- 当添加或修改列时，只能接受常量值作为默认值。如果使用非常量表达式，将会发生错误。
- 通过ALTER TABLE添加存储的计算列目前还不支持。
- 更改表列的数据类型时，存在转换错误的风险。例如，如果尝试将文本（String）列转换为数字（Float），可能会导致问题。
- 为列设置掩码策略时，请确保策略中定义的数据类型（参考[CREATE MASKING POLICY](../12-mask-policy/create-mask-policy.md)语法中的参数*arg_type_to_mask*）与列匹配。
:::

## 示例

### 示例 1：添加、重命名和移除列

此示例展示了创建一个名为"default.users"的表，包含'username'、'email'和'age'列。它展示了添加带有各种约束的'id'和'middle_name'列。该示例还演示了"age"列的重命名和随后的移除。

```sql
-- 创建表
CREATE TABLE default.users (
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  age INT
);

-- 在表的末尾添加一列
ALTER TABLE default.users
ADD COLUMN business_email VARCHAR(255) NOT NULL DEFAULT 'example@example.com';

DESC default.users;

Field         |Type   |Null|Default              |Extra|
--------------+-------+----+---------------------+-----+
username      |VARCHAR|NO  |''                   |     |
email         |VARCHAR|YES |NULL                 |     |
age           |INT    |YES |NULL                 |     |
business_email|VARCHAR|NO  |'example@example.com'|     |

-- 在表的开头添加一列
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

-- 在'username'列之后添加一列
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

-- 重命名一列
ALTER TABLE default.users
RENAME COLUMN age TO new_age;

DESC default.users;



### 示例 2：添加计算列

此示例演示了创建一个用于存储员工信息的表，向表中插入数据，并添加一个计算列来根据员工的出生年份计算每个员工的年龄。

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

-- 添加一个名为 Age 的计算列
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

此示例创建一个名为 "products" 的表，其中包含 ID、价格、数量和一个计算列 "total_price"。ALTER TABLE 语句移除了 "total_price" 列的计算功能，将其转换为一个常规列。

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

此示例创建一个名为 "students_info" 的表，其中包含 "id"、"name" 和 "age" 列，插入一些示例数据，然后修改 "age" 列的数据类型，从 INT 更改为 VARCHAR(10)。

```sql
CREATE TABLE students_info (
  id INT,
  name VARCHAR(50),
  age INT
);

INSERT INTO students_info VALUES
  (1, 'John Doe', 25),
  (2, 'Jane Smith', 28),
  (3, 'Michael Johnson', 22);

ALTER TABLE students_info MODIFY COLUMN age VARCHAR(10) DEFAULT '0';
INSERT INTO students_info (id, name) VALUES  (4, 'Eric McMond');

SELECT * FROM students_info;

id|name           |age|
--+---------------+---+
 4|Eric McMond    |0  |
 1|John Doe       |25 |
 2|Jane Smith     |28 |
 3|Michael Johnson|22 |
```

### 示例 5：设置列的掩码策略

此示例说明了根据用户角色选择性地显示或掩盖敏感数据的掩码策略设置过程。

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

-- 创建掩码策略
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

-- 将掩码策略与 'email' 列关联
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- 以 Root 用户查询
SELECT * FROM user_info;

id|email    |
--+---------+
 2|*********|
 1|*********|
```