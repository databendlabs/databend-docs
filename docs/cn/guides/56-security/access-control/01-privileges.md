---
title: 权限
---

权限（Privilege）是执行某项操作的许可。用户必须拥有特定权限才能在 Databend 中执行相应操作。例如，查询表时需要对该表拥有 `SELECT` 权限；读取 Stage 中的数据集则必须拥有 `READ` 权限。

在 Databend 中，权限授予角色，用户通过被授予的角色获得权限。

![Alt text](/img/guides/access-control-2.png)

## 管理权限

:::note 重要
创建 Ownership 对象的 CREATE 类权限不能直接授予用户，必须先授予角色，再将角色授予用户。这些权限包括：
- CREATE
- CREATE DATABASE
- CREATE WAREHOUSE
- CREATE CONNECTION
- CREATE SEQUENCE
- CREATE PROCEDURE
- CREATE MASKING POLICY
- CREATE ROW ACCESS POLICY

由于 `ALL` 包含上述 CREATE 权限，`GRANT ALL ... TO USER` 也会失败。例如，`GRANT ALL ON *.* TO USER u1` 或 `GRANT CREATE DATABASE ON *.* TO USER u1` 都会失败。正确做法：
```sql
GRANT ALL ON *.* TO ROLE r1;
GRANT ROLE r1 TO USER u1;
```
:::

使用以下命令管理角色权限：

- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)
- [SHOW GRANTS](/sql/sql-commands/ddl/user/show-grants)

### 向角色授予权限

授予权限时，先将权限授予角色，再将该角色授予用户。  
示例中，创建角色 writer 并授予其对 default 模式中所有对象的全部权限；然后创建密码为 abc123 的新用户 david 并设置默认角色为 writer；最后查看 writer 的权限。

```sql title='示例:'
-- 创建角色 writer
CREATE ROLE writer;

-- 将 default 模式中所有对象的全部权限授予 writer
GRANT ALL ON default.* TO ROLE writer;

-- 创建用户 david，密码 abc123，并设置默认角色
CREATE USER david IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'writer';

-- 将 writer 角色授予 david
GRANT ROLE writer TO david;

-- 查看 writer 的权限
SHOW GRANTS FOR ROLE writer;

┌────────────────────────────────────────────────────────┐
│                      Grants                            │
├────────────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO ROLE 'writer'    │
└────────────────────────────────────────────────────────┘
```

### 从角色撤销权限

在访问控制中，权限从角色撤销。  
示例（续）中，从角色 writer 撤销 default 模式中所有对象的全部权限，并查看 writer 的权限：

```sql title='示例（续）:'
-- 从 writer 撤销 default 模式中所有对象的全部权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 查看 writer 的权限
SHOW GRANTS FOR ROLE writer;
```

## 访问控制权限

Databend 提供多种权限，实现对数据库对象的细粒度控制，可分为以下两类：

- 全局权限（Global Privileges）：作用于整个数据库管理系统，而非特定对象，涵盖创建/删除数据库、管理用户与角色、修改系统级设置等操作。详见[全局权限](#global-privileges)。
- 对象级权限（Object-Specific Privileges）：针对特定数据库对象，包括：
  - [表权限](#table-privileges)
  - [视图权限](#view-privileges)
  - [数据库权限](#database-privileges)
  - [会话策略权限](#session-policy-privileges)
  - [Stage 权限](#stage-privileges)
  - [UDF 权限](#udf-privileges)
  - [序列权限](#sequence-privileges)
  - [连接权限](#connection-privileges)
  - [过程权限](#procedure-privileges)
  - [目录权限](#catalog-privileges)
  - [共享权限](#share-privileges)

### 所有权限

| 权限              | 对象类型                      | 描述                                                                                                                                        |
|:------------------|:------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------|
| ALL               | 所有                          | 授予指定对象类型的全部权限。                                                                                                                |
| APPLY MASKING POLICY | Global, Masking Policy     | 附加/解除、描述或删除脱敏策略。授予 `*.*` 时，可在整个账号范围管理所有脱敏策略。                                                           |
| APPLY ROW ACCESS POLICY | Global, Row Access Policy | 将行访问策略（Row Access Policy）附加/解除到表，并允许执行 DESCRIBE/DROP 操作。授予 `*.*` 时，可管理账号内所有 Row Access Policy。 |
| ALTER             | Global, Database, Table, View | 修改数据库、表、用户或 UDF。                                                                                                                |
| CREATE            | Global, Table                 | 创建表或 UDF。                                                                                                                              |
| CREATE DATABASE   | Global                        | 创建数据库或 UDF。                                                                                                                          |
| CREATE WAREHOUSE  | Global                        | 创建 Warehouse。                                                                                                                            |
| CREATE CONNECTION | Global                        | 创建 Connection。                                                                                                                           |
| CREATE SEQUENCE   | Global                        | 创建 Sequence。                                                                                                                             |
| CREATE PROCEDURE  | PROCEDURE                     | 创建 Procedure。                                                                                                                            |
| CREATE MASKING POLICY | Global                    | 创建脱敏策略。                                                                                                                              |
| CREATE ROW ACCESS POLICY | Global                 | 创建 Row Access Policy。                                                                                                                    |
| DELETE            | Table                         | 删除或截断表中的行。                                                                                                                               |
| DROP              | Global, Database, Table, View | 删除数据库、表、View 或 UDF；恢复已删除的表。                                                                                                      |
| INSERT            | Table                         | 向表插入行。                                                                                                                                       |
| SELECT            | Database, Table               | 从表选择行；显示或使用数据库。                                                                                                                     |
| UPDATE            | Table                         | 更新表中的行。                                                                                                                                     |
| GRANT             | Global                        | 向角色授予/撤销权限。                                                                                                                               |
| SUPER             | Global, Table                 | 终止查询；设置全局配置；优化表；分析表；操作 Stage（列出、创建、删除 Stage）、Catalog 或 Share。 |
| USAGE             | Global                        | “无权限”的同义词。                                                                                                                                 |
| CREATE ROLE       | Global                        | 创建角色。                                                                                                                                         |
| DROP ROLE         | Global                        | 删除角色。                                                                                                                                         |
| CREATE USER       | Global                        | 创建 SQL 用户。                                                                                                                                    |
| DROP USER         | Global                        | 删除 SQL 用户。                                                                                                                                    |
| WRITE             | Stage                         | 写入 Stage。                                                                                                                                       |
| READ              | Stage                         | 读取 Stage。                                                                                                                                       |
| USAGE             | UDF                           | 使用 UDF。                                                                                                                                         |
| ACCESS CONNECTION | CONNECTION                    | 访问 Connection。                                                                                                                                  |
| ACCESS SEQUENCE   | SEQUENCE                      | 访问 Sequence。                                                                                                                                    |
| ACCESS PROCEDURE  | PROCEDURE                     | 访问 Procedure。                                                                                                                                   |

### 全局权限

| 权限              | 描述                                                                                                       |
|:------------------|:-----------------------------------------------------------------------------------------------------------|
| ALL               | 授予指定对象类型的全部权限。                                                                               |
| ALTER             | 添加或删除表列；修改 Cluster Key；重新聚簇表。                                                             |
| CREATEROLE        | 创建角色。                                                                                                 |
| CREAT DATABASE    | 创建 DATABASE。                                                                                            |
| CREATE WAREHOUSE  | 创建 WAREHOUSE。                                                                                           |
| CREATE CONNECTION | 创建 CONNECTION。                                                                                          |
| DROPUSER          | 删除用户。                                                                                                 |
| CREATEUSER        | 创建用户。                                                                                                 |
| DROPROLE          | 删除角色。                                                                                                 |
| SUPER             | 终止查询；设置或取消设置；操作 Stage、Catalog 或 Share；调用函数；COPY INTO Stage。 |
| USAGE             | 仅连接到 Databend 查询。                                                                                   |
| CREATE            | 创建 UDF。                                                                                                 |
| DROP              | 删除 UDF。                                                                                                 |
| ALTER             | 修改 UDF；修改 SQL 用户。                                                                                  |

### 表权限

| 权限      | 描述                                                                                                      |
|:----------|:----------------------------------------------------------------------------------------------------------|
| ALL       | 授予指定对象类型的全部权限。                                                                              |
| ALTER     | 添加或删除表列；修改 Cluster Key；重新聚簇表。                                                            |
| CREATE    | 创建表。                                                                                                  |
| DELETE    | 删除表中的行；截断表。                                                                                    |
| DROP      | 删除或恢复表；恢复最近删除的表版本。                                                                      |
| INSERT    | 向表插入行；COPY INTO 表。                                                                                |
| SELECT    | 从表选择行；SHOW CREATE 表；DESCRIBE 表。                                                                 |
| UPDATE    | 更新表中的行。                                                                                            |
| SUPER     | 优化或分析表。                                                                                            |
| OWNERSHIP | 授予对数据库的完全控制权；在特定对象上一次只能有一个角色持有此权限。                                      |

### 视图权限

| 权限      | 描述                                                            |
|:----------|:----------------------------------------------------------------|
| ALL       | 授予指定对象类型的全部权限。                                    |
| ALTER     | 创建或删除 View；使用另一个 Query 修改现有 View。               |
| DROP      | 删除 View。                                                     |

### 数据库权限

拥有以下任一数据库权限或数据库中任一表的任何权限后，即可使用 [USE DATABASE](/sql/sql-commands/ddl/database/ddl-use-database) 指定数据库。

| 权限      | 描述                                                                                                      |
|:----------|:----------------------------------------------------------------------------------------------------------|
| ALTER     | 重命名数据库。                                                                                            |
| DROP      | 删除或恢复数据库；恢复最近删除的数据库版本。                                                              |
| SELECT    | SHOW CREATE 数据库。                                                                                      |
| OWNERSHIP | 授予对数据库的完全控制权；在特定对象上一次只能有一个角色持有此权限。                                      |
| USAGE     | 允许使用 `USE <database>` 进入数据库，但不授予其中任何对象的访问权限。                                    |

> 注意：
>
> 1. 若角色拥有数据库，则该角色可访问数据库中的所有表。

### 会话策略权限

| 权限      | 描述                                                |
| :--       | :--                                                 |
| SUPER     | 终止查询；设置或取消设置。                          |
| ALL       | 授予指定对象类型的全部权限。                        |

### Stage 权限

| 权限      | 描述                                                                                                   |
|:----------|:-------------------------------------------------------------------------------------------------------|
| WRITE     | 写入 Stage，例如 COPY INTO Stage、预签名上传或删除 Stage。                                             |
| READ      | 读取 Stage，例如列出 Stage、查询 Stage、从 Stage COPY INTO 表、预签名下载。                            |
| ALL       | 授予指定对象类型的 READ、WRITE 权限。                                                                  |
| OWNERSHIP | 授予对 Stage 的完全控制权；在特定对象上一次只能有一个角色持有此权限。                                  |

> 注意：
>
> 1. 不检查外部位置认证。

### UDF 权限

| 权限      | 描述                                                                                   |
|:----------|:---------------------------------------------------------------------------------------|
| USAGE     | 可使用 UDF，例如 COPY INTO Stage、预签名上传。                                         |
| ALL       | 授予指定对象类型的 READ、WRITE 权限。                                                  |
| OWNERSHIP | 授予对 UDF 的完全控制权；在特定对象上一次只能有一个角色持有此权限。                    |

> 注意：
>
> 1. 若 UDF 已被常量折叠，则不检查 UDF 认证。
> 2. 若 UDF 是 INSERT 中的值，则不检查 UDF 认证。

### 目录权限

| 权限      | 描述                                              |
|:----------|:--------------------------------------------------|
| SUPER     | SHOW CREATE Catalog；创建或删除 Catalog。         |
| ALL       | 授予指定对象类型的全部权限。                      |

### 连接权限

| 权限              | 描述                                                                                 |
|:------------------|:-------------------------------------------------------------------------------------|
| Access Connection | 可访问 Connection。                                                                  |
| ALL               | 授予指定对象类型的 Access Connection 权限。                                          |
| OWNERSHIP         | 授予对 Connection 的完全控制权；在特定对象上一次只能有一个角色持有此权限。           |

### 序列权限

| 权限            | 描述                                                                                 |
|:----------------|:-------------------------------------------------------------------------------------|
| Access Sequence | 可访问 Sequence（如 Drop、Desc）。                                                   |
| ALL             | 授予指定对象类型的 Access Sequence 权限。                                            |
| OWNERSHIP       | 授予对 Sequence 的完全控制权；在特定对象上一次只能有一个角色持有此权限。             |

### 过程权限

| 权限             | 描述                                                                                  |
|:-----------------|:--------------------------------------------------------------------------------------|
| Access Procedure | 可访问 Procedure（如 Drop、Call、Desc）。                                             |
| ALL              | 授予指定对象类型的 Access Procedure 权限。                                            |
| OWNERSHIP        | 授予对 Procedure 的完全控制权；在特定对象上一次只能有一个角色持有此权限。             |

### 脱敏策略权限

除 `CREATE MASKING POLICY` 与 `APPLY MASKING POLICY` 全局权限外，还可以针对单个脱敏策略授予权限：

| 权限  | 描述                                                                                                   |
|:------|:--------------------------------------------------------------------------------------------------------|
| APPLY | 将脱敏策略绑定/解绑到列，同时允许执行 DESC/DROP 操作。                                                  |
| OWNERSHIP | 授予对脱敏策略的完全控制权。Databend 会在策略创建时自动将 OWNERSHIP 授予当前角色，并在策略被删除时自动回收。 |

### Row Access Policy 权限

Row Access Policy（行访问策略）沿用相同的权限模型。除了全局 `CREATE ROW ACCESS POLICY` 和 `APPLY ROW ACCESS POLICY` 外，还可以针对单个策略授予权限：

| 权限  | 描述                                                                                                          |
|:------|:---------------------------------------------------------------------------------------------------------------|
| APPLY | 将 Row Access Policy 绑定/解绑到表，并允许执行 DESC/DROP 操作。                                                |
| OWNERSHIP | 授予对 Row Access Policy 的完全控制权。Databend 会在策略创建时自动将 OWNERSHIP 授予当前角色，并在策略被删除时自动回收。 |
