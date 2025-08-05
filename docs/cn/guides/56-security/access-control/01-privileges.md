---
title: 权限
---

权限（Privilege）是执行某项操作的许可。在 Databend 中，用户必须拥有特定权限才能执行相应操作。例如，查询表时需要对该表拥有 `SELECT` 权限；读取 Stage 中的数据集则必须拥有 `READ` 权限。

在 Databend 中，用户可通过两种方式获得权限：一是直接将权限授予用户；二是先将权限授予角色，再将该角色授予用户。

![Alt text](/img/guides/access-control-2.png)

## 管理权限

使用以下命令管理用户或角色的权限：

- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)
- [SHOW GRANTS](/sql/sql-commands/ddl/user/show-grants)

### 向用户/角色授予权限

授予权限有两种方式：直接授予用户，或先授予角色再授予用户。  
下例将权限直接授予用户 david：先创建密码为 abc123 的新用户 david，再将 default 数据库中所有对象的全部权限直接授予 david，最后查看 david 的权限。

```sql title='示例 1：'
-- 创建用户 david，密码 abc123
CREATE USER david IDENTIFIED BY 'abc123';

-- 将 default.* 的所有权限授予 david
GRANT ALL ON default.* TO david;

-- 查看 david 的权限
SHOW GRANTS FOR david;

┌───────────────────────────────────────────────────┐
│                      Grants                       │
├───────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'david'@'%' │
└───────────────────────────────────────────────────┘
```

下例先将权限授予角色，再将角色授予用户 eric：先创建角色 writer 并授予 default.* 的全部权限，再创建用户 eric（密码 abc123），然后将 writer 角色授予 eric，最后查看 eric 的权限。

```sql title='示例 2：'
-- 创建角色 writer
CREATE ROLE writer;

-- 将 default.* 的所有权限授予角色 writer
GRANT ALL ON default.* TO ROLE writer;

-- 创建用户 eric，密码 abc123
CREATE USER eric IDENTIFIED BY 'abc123';

-- 将角色 writer 授予 eric
GRANT ROLE writer TO eric;

-- 查看 eric 的权限
SHOW GRANTS FOR eric;

┌──────────────────────────────────────────────────┐
│                     Grants                       │
├──────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'eric'@'%' │
└──────────────────────────────────────────────────┘
```

### 从用户/角色撤销权限

在访问控制中，可从用户或角色撤销权限。  
下例从用户 david 撤销 default.* 的所有权限，并查看 david 的权限：

```sql title='示例 1（续）：'
-- 从 david 撤销 default.* 的所有权限
REVOKE ALL ON default.* FROM david;

-- 查看 david 的权限
SHOW GRANTS FOR david;
```

下例从角色 writer 撤销 default.* 的所有权限，随后查看 eric 的权限（因权限已从角色撤销，结果为空）。

```sql title='示例 2（续）：'
-- 从角色 writer 撤销 default.* 的所有权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 查看 eric 的权限
-- 无结果显示，权限已被撤销
SHOW GRANTS FOR eric;
```

## 访问控制权限

Databend 提供多种权限，实现对数据库对象的细粒度控制，可分为以下两类：

- 全局权限（Global Privileges）：作用于整个数据库管理系统，而非特定对象，涵盖创建/删除数据库、管理用户与角色、修改系统级设置等操作。详见[全局权限](#global-privileges)。
- 对象级权限（Object-specific Privileges）：按对象类型划分，包括：
  - [表权限](#table-privileges)
  - [视图权限](#view-privileges)
  - [数据库权限](#database-privileges)
  - [会话策略权限](#session-policy-privileges)
  - [Stage 权限](#stage-privileges)
  - [UDF 权限](#udf-privileges)
  - [Catalog 权限](#catalog-privileges)
  - [共享权限](#share-privileges)

### 所有权限

| 权限              | 对象类型                      | 描述                                                                                   |
|:------------------|:------------------------------|:---------------------------------------------------------------------------------------|
| ALL               | 所有                          | 授予指定对象类型的全部权限。                                                           |
| ALTER             | Global、Database、Table、View | 修改数据库、表、用户或 UDF。                                                           |
| CREATE            | Global、Table                 | 创建表或 UDF。                                                                         |
| CREATE DATABASE   | Global                        | 创建数据库或 UDF。                                                                     |
| CREATE WAREHOUSE  | Global                        | 创建 Warehouse。                                                                       |
| CREATE CONNECTION | Global                        | 创建 Connection。                                                                      |
| CREATE SEQUENCE   | Global                        | 创建 Sequence。                                                                        |
| DELETE            | Table                         | 删除或截断表中的行。                                                                   |
| DROP              | Global、Database、Table、View | 删除数据库、表、视图或 UDF；恢复已删除的表。                                           |
| INSERT            | Table                         | 向表插入行。                                                                           |
| SELECT            | Database、Table               | 从表查询行；显示或使用数据库。                                                         |
| UPDATE            | Table                         | 更新表中的行。                                                                         |
| GRANT             | Global                        | 向用户或角色授予/撤销权限。                                                            |
| SUPER             | Global、Table                 | 终止查询；设置全局配置；优化表；分析表；操作 Stage（列出、创建、删除）、Catalog 或 Share。 |
| USAGE             | Global                        | 等同于“无权限”。                                                                       |
| CREATE ROLE       | Global                        | 创建角色。                                                                             |
| DROP ROLE         | Global                        | 删除角色。                                                                             |
| CREATE USER       | Global                        | 创建 SQL 用户。                                                                        |
| DROP USER         | Global                        | 删除 SQL 用户。                                                                        |
| WRITE             | Stage                         | 写入 Stage。                                                                           |
| READ              | Stage                         | 读取 Stage。                                                                           |
| USAGE             | UDF                           | 使用 UDF。                                                                             |
| ACCESS CONNECTION | CONNECTION                    | 访问 Connection。                                                                      |
| ACCESS SEQUENCE   | SEQUENCE                      | 访问 Sequence。                                                                        |

### 全局权限

| 权限              | 描述                                                                                           |
|:------------------|:-----------------------------------------------------------------------------------------------|
| ALL               | 授予指定对象类型的全部权限。                                                                   |
| ALTER             | 添加或删除表列；修改 Cluster Key；重新聚簇表。                                                 |
| CREATEROLE        | 创建角色。                                                                                     |
| CREAT DATABASE    | 创建 DATABASE。                                                                                |
| CREATE WAREHOUSE  | 创建 WAREHOUSE。                                                                               |
| CREATE CONNECTION | 创建 CONNECTION。                                                                              |
| DROPUSER          | 删除用户。                                                                                     |
| CREATEUSER        | 创建用户。                                                                                     |
| DROPROLE          | 删除角色。                                                                                     |
| SUPER             | 终止查询；设置或取消设置；操作 Stage、Catalog 或 Share；调用函数；COPY INTO Stage。            |
| USAGE             | 仅用于连接 Databend 查询。                                                                     |
| CREATE            | 创建 UDF。                                                                                     |
| DROP              | 删除 UDF。                                                                                     |
| ALTER             | 修改 UDF；修改 SQL 用户。                                                                      |

### 表权限

| 权限      | 描述                                                                                   |
|:----------|:---------------------------------------------------------------------------------------|
| ALL       | 授予指定对象类型的全部权限。                                                           |
| ALTER     | 添加或删除表列；修改 Cluster Key；重新聚簇表。                                         |
| CREATE    | 创建表。                                                                               |
| DELETE    | 删除表中的行；截断表。                                                                 |
| DROP      | 删除或恢复表；恢复最近删除的表版本。                                                   |
| INSERT    | 向表插入行；COPY INTO 表。                                                             |
| SELECT    | 查询表；SHOW CREATE 表；DESCRIBE 表。                                                  |
| UPDATE    | 更新表中的行。                                                                         |
| SUPER     | 优化或分析表。                                                                         |
| OWNERSHIP | 授予对数据库的完全控制权；同一对象一次只能有一个角色拥有此权限。                       |

### 视图权限

| 权限      | 描述                                                   |
|:----------|:-------------------------------------------------------|
| ALL       | 授予指定对象类型的全部权限。                           |
| ALTER     | 创建或删除视图；使用另一条 Query 修改现有视图。        |
| DROP      | 删除视图。                                             |

### 数据库权限

拥有以下任一数据库权限或数据库中任一表的任何权限后，即可使用 [USE DATABASE](/sql/sql-commands/ddl/database/ddl-use-database) 指定数据库。

| 权限      | 描述                                                                                   |
|:----------|:---------------------------------------------------------------------------------------|
| ALTER     | 重命名数据库。                                                                         |
| DROP      | 删除或恢复数据库；恢复最近删除的数据库版本。                                           |
| SELECT    | SHOW CREATE 数据库。                                                                   |
| OWNERSHIP | 授予对数据库的完全控制权；同一对象一次只能有一个角色拥有此权限。                       |
| USAGE     | 允许使用 `USE <database>` 进入数据库，但不授予其中任何对象的访问权限。                 |

> 注意：
>
> 1. 若某角色拥有数据库，则该角色可访问库内所有表。

### 会话策略权限

| 权限  | 描述                           |
| :--   | :--                            |
| SUPER | 终止查询；设置或取消设置。     |
| ALL   | 授予指定对象类型的全部权限。   |

### Stage 权限

| 权限      | 描述                                                                                   |
|:----------|:---------------------------------------------------------------------------------------|
| WRITE     | 写入 Stage，例如 COPY INTO Stage、预签名上传或删除 Stage。                             |
| READ      | 读取 Stage，例如列出 Stage、查询 Stage、从 Stage COPY INTO 表、预签名下载。            |
| ALL       | 授予指定对象类型的 READ、WRITE 权限。                                                  |
| OWNERSHIP | 授予对 Stage 的完全控制权；同一对象一次只能有一个角色拥有此权限。                      |

> 注意：
>
> 1. 不检查外部位置的认证。

### UDF 权限

| 权限      | 描述                                                                                   |
|:----------|:---------------------------------------------------------------------------------------|
| USAGE     | 可使用 UDF，例如 COPY INTO Stage、预签名上传。                                         |
| ALL       | 授予指定对象类型的 READ、WRITE 权限。                                                  |
| OWNERSHIP | 授予对 UDF 的完全控制权；同一对象一次只能有一个角色拥有此权限。                        |

> 注意：
>
> 1. 若 UDF 已被常量折叠，则不检查其认证。  
> 2. 若 UDF 是 INSERT 中的值，则不检查其认证。

### Catalog 权限

| 权限  | 描述                                           |
|:------|:-----------------------------------------------|
| SUPER | SHOW CREATE catalog；创建或删除 catalog。      |
| ALL   | 授予指定对象类型的全部权限。                   |

### Connection 权限

| 权限              | 描述                                                                                   |
|:------------------|:---------------------------------------------------------------------------------------|
| Access Connection | 可访问 Connection。                                                                    |
| ALL               | 授予指定对象类型的 Access Connection 权限。                                            |
| OWNERSHIP         | 授予对 Connection 的完全控制权；同一对象一次只能有一个角色拥有此权限。                 |

### Sequence 权限

| 权限            | 描述                                                                                   |
|:----------------|:---------------------------------------------------------------------------------------|
| Access Sequence | 可访问 Sequence（如 Drop、Desc）。                                                     |
| ALL             | 授予指定对象类型的 Access Sequence 权限。                                              |
| OWNERSHIP       | 授予对 Sequence 的完全控制权；同一对象一次只能有一个角色拥有此权限。                   |