---
title: ALTER TABLE
sidebar_position: 4
slug: /sql-commands/ddl/table/alter-table
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.845"/>

import EEFeature from '@site/src/components/EEFeature';

`ALTER TABLE` 可用于修改现有表的列、注释、Fuse 引擎选项、外部连接等属性，甚至可以与另一张表互换所有元数据。下列小节按能力进行划分。

## 列操作 {#column-operations}

<EEFeature featureName='脱敏策略（MASKING POLICY）'/>

通过添加、转换、重命名、更改或删除列来修改表。

### 语法

```sql
-- 在表末尾添加一列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
ADD [ COLUMN ] <column_name> <data_type> [ NOT NULL | NULL ] [ DEFAULT <constant_value> ]

-- 在指定位置添加一列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
ADD [ COLUMN ] <column_name> <data_type> [ NOT NULL | NULL ] [ DEFAULT <constant_value> ] [ FIRST | AFTER <column_name> ]

-- 添加一个虚拟计算列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
ADD [ COLUMN ] <column_name> <data_type> AS (<expr>) VIRTUAL

-- 将存储计算列转换为常规列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
MODIFY [ COLUMN ] <column_name> DROP STORED

-- 重命名列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name>
RENAME [ COLUMN ] <column_name> TO <new_column_name>

-- 更改数据类型
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
MODIFY [ COLUMN ] <column_name> <new_data_type> [ DEFAULT <constant_value> ]
       [ , [ COLUMN ] <column_name> <new_data_type> [ DEFAULT <constant_value> ] ]
       ...

-- 更改注释
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name>
MODIFY [ COLUMN ] <column_name> [ COMMENT '<comment>' ]
[ , [ COLUMN ] <column_name> [ COMMENT '<comment>' ] ]
...
    
-- 为列设置/取消设置脱敏策略
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name>
MODIFY [ COLUMN ] <column_name> SET MASKING POLICY <policy_name>
       [ USING ( <column_reference> [ , <column_reference> ... ] ) ]

ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name>
MODIFY [ COLUMN ] <column_name> UNSET MASKING POLICY

-- 删除一列
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
DROP [ COLUMN ] <column_name>
```

:::note
- 在添加或修改列时，仅接受常量值作为默认值。如果使用非常量表达式，将会报错。
- 尚不支持使用 ALTER TABLE 添加存储计算列。
- 当更改表列的数据类型时，存在转换错误的风险。例如，如果尝试将文本（String）列转换为数字（Float）列，可能会引发问题。
- 当为列设置脱敏策略时，请确保策略中定义的数据类型（请参考 [CREATE MASKING POLICY](../12-mask-policy/create-mask-policy.md) 语法中的 *arg_type_to_mask* 参数）与列的数据类型相匹配。
- 如果策略需要额外的列，可结合 `USING` 子句使用，按照参数顺序列出对应的列；第一个参数始终代表正在脱敏的列。
- 当声明了 `USING (...)` 时，必须至少提供被脱敏的列以及策略所需的其他列，并确保 `USING` 中的第一个标识符与正在修改的列一致。
- 只有常规表支持绑定脱敏策略；视图、流表以及临时表均无法执行 `SET MASKING POLICY`。
- 单个列最多只能附加一个安全策略（无论是列脱敏还是行级策略）。在重新绑定之前，请先移除原有策略。
- 设置或取消设置脱敏策略需要拥有全局 `APPLY MASKING POLICY` 权限，或针对目标策略具有 APPLY/OWNERSHIP 权限，否则 `ALTER TABLE` 会被拒绝。
- 添加、移除、描述或删除 Row Access Policy 需要拥有全局 `APPLY ROW ACCESS POLICY` 权限，或针对目标策略具有 APPLY/OWNERSHIP 权限。
:::

:::caution
如果列已绑定脱敏策略，修改列定义或删除该列前必须先执行 `ALTER TABLE ... MODIFY COLUMN <col> UNSET MASKING POLICY`，否则操作会因安全策略仍然生效而失败。
:::

### 示例

#### 示例 1：添加、重命名和删除列

```sql
CREATE TABLE default.users (
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  age INT
);

ALTER TABLE default.users
ADD COLUMN business_email VARCHAR(255) NOT NULL DEFAULT 'example@example.com';

ALTER TABLE default.users
ADD COLUMN id int NOT NULL FIRST;

ALTER TABLE default.users
ADD COLUMN middle_name VARCHAR(50) NULL AFTER username;

ALTER TABLE default.users
RENAME COLUMN age TO new_age;

ALTER TABLE default.users
DROP COLUMN new_age;
```

#### 示例 2：修改列与脱敏策略

```sql
ALTER TABLE users
MODIFY COLUMN age BIGINT DEFAULT 18,
       COLUMN email VARCHAR(320) DEFAULT '';

ALTER TABLE users
MODIFY COLUMN email SET MASKING POLICY pii_email USING (email, username);

ALTER TABLE users
MODIFY COLUMN email UNSET MASKING POLICY;
```

## 表注释 {#table-comment}

用于修改表的注释。如果表尚未设置注释，该命令会为表添加指定的注释。

### 语法

```sql
ALTER TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> 
COMMENT = '<comment>'
```

### 示例

```sql
CREATE TABLE t(id INT) COMMENT ='original-comment';
ALTER TABLE t COMMENT = 'new-comment';

CREATE TABLE s(id INT);
ALTER TABLE s COMMENT = 'new-comment';
```

## Fuse 引擎选项 {#fuse-engine-options}

用于设置或取消设置表的 [Fuse 引擎选项](../../../00-sql-reference/30-table-engines/00-fuse.md#fuse-engine-options)。

### 语法

```sql
ALTER TABLE [ <database_name>. ]<table_name> SET OPTIONS (<options>)
ALTER TABLE [ <database_name>. ]<table_name> UNSET OPTIONS (<options>)
```

可以取消设置的 Fuse 引擎选项包括：

- `block_per_segment`
- `block_size_threshold`
- `data_retention_period_in_hours`
- `data_retention_num_snapshots_to_keep`
- `row_avg_depth_threshold`
- `row_per_block`
- `row_per_page`

### 示例

```sql
CREATE TABLE fuse_table (a int);
SET hide_options_in_show_create_table=0;
SHOW CREATE TABLE fuse_table;

ALTER TABLE fuse_table SET OPTIONS (block_per_segment = 500, data_retention_period_in_hours = 240);
SHOW CREATE TABLE fuse_table;
```

```sql
CREATE OR REPLACE TABLE t(c INT);
ALTER TABLE t SET OPTIONS(data_retention_num_snapshots_to_keep = 1);
SET enable_auto_vacuum = 1;
INSERT INTO t VALUES(1);
INSERT INTO t VALUES(2);
INSERT INTO t VALUES(3);

ALTER TABLE fuse_table UNSET OPTIONS (block_per_segment, data_retention_period_in_hours);
```

## 外部表连接 {#external-table-connection}

更新外部表的连接设置。执行命令时，仅凭证相关字段（`access_key_id`、`secret_access_key`、`role_arn`）会被应用，`bucket`、`region`、`root` 等其他属性保持不变。

### 语法

```sql
ALTER TABLE [ <database_name>. ]<table_name> CONNECTION = ( connection_name = '<connection_name>' )
```

| 参数 | 说明 | 是否必需 |
|------|------|----------|
| connection_name | 要用于该外部表的连接名称，必须是系统中已存在的连接。 | 是 |

该命令适用于凭证轮换或 IAM 角色变更场景。在执行之前，目标连接必须已经创建。

**安全最佳实践**

- 无需存储访问密钥，避免泄露风险。
- 自动轮换凭证，减少人工维护。
- 具备更细粒度的访问控制能力。

如需在 Databend Cloud 中使用 IAM 角色，请参阅 [Authenticate with AWS IAM Role](/guides/cloud/security/iam-role)。

### 示例

```sql
CREATE CONNECTION external_table_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE CONNECTION external_table_conn_new
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-new-access-key-id>'
    SECRET_ACCESS_KEY = '<your-new-secret-access-key>';

CREATE OR REPLACE TABLE external_table_test (
    id INT,
    name VARCHAR,
    age INT
)
's3://testbucket/13_fuse_external_table/'
CONNECTION=(connection_name = 'external_table_conn');

ALTER TABLE external_table_test CONNECTION=( connection_name = 'external_table_conn_new' );
```

```sql
CREATE CONNECTION s3_access_key_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE TABLE sales_data (
    order_id INT,
    product_name VARCHAR,
    quantity INT
)
's3://sales-bucket/data/'
CONNECTION=(connection_name = 's3_access_key_conn');

CREATE CONNECTION s3_role_conn
    STORAGE_TYPE = 's3'
    ROLE_ARN = 'arn:aws:iam::123456789012:role/databend-access';

ALTER TABLE sales_data CONNECTION=( connection_name = 's3_role_conn' );
```

## 交换表 {#swap-tables}

在同一个事务中交换两张表的所有元数据和数据，使双方的列、约束以及数据完全互换。

### 语法

```sql
ALTER TABLE [ IF EXISTS ] <source_table_name> SWAP WITH <target_table_name>
```

| 参数 | 说明 |
|------|------|
| `source_table_name` | 要交换的第一张表 |
| `target_table_name` | 要交换的第二张表 |

### 使用说明

- 仅支持 Fuse 引擎表，外部表、系统表等其他类型不支持。
- 临时表无法与永久表或瞬态表交换。
- 当前角色必须同时拥有两张表的所有权。
- 两张表必须位于同一个数据库，无法跨库交换。
- 操作为原子事务，要么全部成功，要么全部回滚。
- 操作不会丢失数据，双方的数据与元数据都会被完整保留。

### 示例

```sql
CREATE OR REPLACE TABLE t1(a1 INT, a2 VARCHAR, a3 DATE);
CREATE OR REPLACE TABLE t2(b1 VARCHAR);

DESC t1;
DESC t2;

ALTER TABLE t1 SWAP WITH t2;

DESC t1;
DESC t2;
```
