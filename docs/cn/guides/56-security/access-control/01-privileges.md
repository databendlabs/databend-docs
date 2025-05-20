---
title: 权限
---

权限是执行操作的许可。用户必须具有特定的权限才能在 Databend 中执行特定的操作。例如，当查询表时，用户需要对该表具有 `SELECT` 权限。类似地，要在 Stage 中读取数据集，用户必须拥有 `READ` 权限。

在 Databend 中，用户可以通过两种方式获得权限。一种方法是直接将权限授予用户。另一种方法是先将权限授予角色，然后将该角色分配给用户。

![Alt text](/img/guides/access-control-2.png)

## 管理权限

要管理用户或角色的权限，请使用以下命令：

- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)
- [SHOW GRANTS](/sql/sql-commands/ddl/user/show-grants)

### 授予用户/角色权限

要授予权限，您有两种选择：您可以直接将权限授予用户，也可以先将权限授予角色，然后将该角色授予用户。在以下示例中，权限直接授予给用户 'david'。'david' 被创建为一个新用户，密码为 'abc123'，然后 'default' schema 中所有对象的权限都直接授予给 'david'。最后，显示 'david' 的已授予权限。

```sql title='Example-1:'
-- 创建一个名为 'david' 的新用户，密码为 'abc123'
CREATE USER david IDENTIFIED BY 'abc123';

-- 将 'default' schema 中所有对象的全部权限授予用户 'david'
GRANT ALL ON default.* TO david;

-- 显示用户 'david' 的已授予权限
SHOW GRANTS FOR david;

┌───────────────────────────────────────────────────┐
│                       Grants                      │
├───────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'david'@'%' │
└───────────────────────────────────────────────────┘
```

在以下示例中，权限首先授予给角色，然后将该角色授予给用户 'eric'。最初，创建一个名为 'writer' 的新角色，并授予其 'default' schema 中所有对象的全部权限。随后，'eric' 被创建为一个新用户，密码为 'abc123'，并将 'writer' 角色授予给 'eric'。最后，显示 'eric' 的已授予权限。

```sql title='Example-2:'
-- 创建一个名为 'writer' 的新角色
CREATE ROLE writer;

-- 将 'default' schema 中所有对象的全部权限授予角色 'writer'
GRANT ALL ON default.* TO ROLE writer;

-- 创建一个名为 'eric' 的新用户，密码为 'abc123'
CREATE USER eric IDENTIFIED BY 'abc123';

-- 将 'writer' 角色授予给用户 'eric'
GRANT ROLE writer TO eric;

-- 显示用户 'eric' 的已授予权限
SHOW GRANTS FOR eric;

┌──────────────────────────────────────────────────┐
│                      Grants                      │
├──────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'eric'@'%' │
└──────────────────────────────────────────────────┘
```

### 撤销用户/角色的权限

在访问控制的上下文中，可以从单个用户或角色撤销权限。在以下示例中，我们从用户 'david' 撤销 'default' schema 中所有对象的全部权限，然后显示用户 'david' 的已授予权限：

```sql title='Example-1(Continued):'
-- 从用户 'david' 撤销 'default' schema 中所有对象的全部权限
REVOKE ALL ON default.* FROM david;

-- 显示用户 'david' 的已授予权限
SHOW GRANTS FOR david;
```

在以下示例中，从角色 'writer' 撤销 'default' schema 中所有对象的权限。在此之后，显示用户 'eric' 的已授予权限。

```sql title='Example-2(Continued):'
-- 从角色 'writer' 撤销 'default' schema 中所有对象的全部权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 显示用户 'eric' 的已授予权限
-- 由于权限已从角色中撤销，因此不显示任何权限
SHOW GRANTS FOR eric;
```

## 访问控制权限

Databend 提供了一系列权限，允许您对数据库对象进行细粒度的控制。Databend 权限可以分为以下类型：

- 全局权限：这组权限包括应用于整个数据库管理系统的权限，而不是系统中的特定对象。全局权限授予影响数据库整体功能和管理的动作，例如创建或删除数据库、管理用户和角色以及修改系统级设置。有关包含哪些权限，请参见 [全局权限](#global-privileges)。

- 对象特定权限：对象特定权限带有不同的集合，每个集合都应用于特定的数据库对象。这包括：
  - [表权限](#table-privileges)
  - [视图权限](#view-privileges)
  - [数据库权限](#database-privileges)
  - [会话策略权限](#session-policy-privileges)
  - [Stage 权限](#stage-privileges)
  - [UDF 权限](#udf-privileges)
  - [Catalog 权限](#catalog-privileges)
  - [共享权限](#share-privileges)

### 所有权限


| 权限        | 对象类型                   | 描述                                                                                                                                        |
|:-----------------|:------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| ALL              | 全部                           | 授予指定对象类型的所有权限。                                                                                                                          |
| ALTER            | 全局, 数据库, 表, 视图 | 更改数据库、表、用户或 UDF。                                                                                                             |
| CREATE           | 全局, 表                 | 创建表或 UDF。                                                                                                                            |
| CREATE DATABASE  | 全局                        | 创建数据库、表或 UDF。                                                                                                                  |
| CREATE WAREHOUSE | 全局                        | 创建计算集群。                                                                                                                               |
| DELETE           | 表                         | 删除或截断表中的行。                                                                                                                          |
| DROP             | 全局, 数据库, 表, 视图 | 删除数据库、表、视图或 UDF。恢复删除表。                                                                                             |
| INSERT           | 表                         | 将行插入到表中。                                                                                                                         |
| SELECT           | 数据库, 表               | 从表中选择行。显示或使用数据库。                                                                                               |
| UPDATE           | 表                         | 更新表中的行。                                                                                                                           |
| GRANT            | 全局                        | 授予/撤销用户或角色的权限。                                                                                              |
| SUPER            | 全局, 表                 | 终止查询。设置全局配置。优化表。分析表。操作 Stage（列出 Stage。创建、删除 Stage）、catalog 或 share。 |
| USAGE            | 全局                        | “无权限”的同义词。                                                                                                                       |
| CREATE ROLE      | 全局                        | 创建角色。                                                                                                                                    |
| DROP ROLE        | 全局                        | 删除角色。                                                                                                                                      |
| CREATE USER      | 全局                        | 创建 SQL 用户。                                                                                                                                |
| DROP USER        | 全局                        | 删除 SQL 用户。                                                                                                                                  |
| WRITE            | Stage                         | 写入 Stage。                                                                                                                                |
| READ             | Stage                         | 读取 Stage。                                                                                                                                      |
| USAGE            | UDF                           | 使用 UDF。                                                                                                                                           |

### 全局权限

| 权限        | 描述                                                                                                       |
|:-----------------|:------------------------------------------------------------------------------------------------------------------|
| ALL              | 授予指定对象类型的所有权限。                                                          |
| ALTER            | 添加或删除表列。更改聚簇键。重新聚簇表。                                          |
| CREATEROLE       | 创建角色。                                                                                                   |
| CREAT DATABASE   | 创建 DATABASE。                                                                                               |
| CREATE WAREHOUSE | 创建 WAREHOUSE。                                                                                              |
| DROPUSER         | 删除用户。                                                                                                     |
| CREATEUSER       | 创建用户。                                                                                                   |
| DROPROLE         | 删除角色。                                                                                                     |
| SUPER            | 终止查询。设置或取消设置。操作 Stage、Catalog 或 Share。调用函数。COPY INTO Stage。 |
| USAGE            | 仅连接到 Databend 查询。                                                                                |
| CREATE           | 创建 UDF。                                                                                                    |
| DROP             | 删除 UDF。                                                                                                      |
| ALTER            | 更改 UDF。更改 SQL 用户。                                                                                  |

### 表权限

| 权限 | 描述                                                                                                      |
|:----------|:-----------------------------------------------------------------------------------------------------------------|
| ALL       | 授予指定对象类型的所有权限。                                                         |
| ALTER     | 添加或删除表列。更改聚簇键。重新聚簇表。                                         |
| CREATE    | 创建表。                                                                                                 |
| DELETE    | 删除表中的行。截断表。                                                                      |
| DROP      | 删除或取消删除表。恢复已删除表的最新版本。                                        |
| INSERT    | 将行插入到表中。COPY INTO 表。                                                                    |
| SELECT    | 从表中选择行。SHOW CREATE 表。DESCRIBE 表。                                                |
| UPDATE    | 更新表中的行。                                                                                         |
| SUPER     | 优化或分析表。                                                                                   |
| OWNERSHIP | 授予对数据库的完全控制权。一次只能有一个角色拥有对特定对象的此权限。 |

### 视图权限

| 权限 | 描述                                                            |
|:----------|:-----------------------------------------------------------------------|
| ALL       | 授予指定对象类型的所有权限                |
| ALTER     | 创建或删除视图。使用另一个 QUERY 更改现有视图。 |
| DROP      | 删除视图。                                                          |

### 数据库权限

请注意，一旦您拥有以下任何数据库权限或数据库中任何表的权限，您就可以使用 [USE DATABASE](/sql/sql-commands/ddl/database/ddl-use-database) 命令来指定数据库。

| 权限 | 描述                                                                                                      |
|:----------|:-----------------------------------------------------------------------------------------------------------------|
| ALTER     | 重命名数据库。                                                                                              |
| DROP      | 删除或取消删除数据库。恢复已删除数据库的最新版本。                                  |
| SELECT    | SHOW CREATE 数据库。                                                                                          |
| OWNERSHIP | 授予对数据库的完全控制权。一次只能有一个角色拥有对特定对象的此权限。 |
| USAGE     | 允许使用 `USE <database>` 进入数据库，而无需授予对任何包含对象的访问权限。             |

> 注意：
>
> 1. 如果一个角色拥有一个数据库，该角色可以访问数据库中的所有表。
 

### 会话策略权限

| 权限 | 描述 |
| :--                 | :--                  |
| SUPER       |    终止查询。设置或取消设置。 |
| ALL   |  授予指定对象类型的所有权限。 |

### Stage 权限

| 权限 | 描述                                                                                                   |
|:----------|:--------------------------------------------------------------------------------------------------------------|
| WRITE     | 写入到 Stage。例如，copy into a stage，presign upload 或删除一个 Stage                         |
| READ      | 读取 Stage。例如，list stage，query stage，copy into table from stage，presign download              |
| ALL       | 授予指定对象类型的 READ、WRITE 权限。                                                  |
| OWNERSHIP | 授予对 Stage 的完全控制权。一次只能有一个角色拥有对特定对象的此权限。 |

> 注意：
>
> 1. 不要检查外部位置的身份验证。

### UDF 权限

| 权限 | 描述                                                                                                 |
|:----------|:------------------------------------------------------------------------------------------------------------|
| USAGE     | 可以使用 UDF。例如，copy into a stage，presign upload                                                 |
| ALL       | 授予指定对象类型的 READ、WRITE 权限。                                                |
| OWNERSHIP | 授予对 UDF 的完全控制权。一次只能有一个角色拥有对特定对象的此权限。 |

> 注意：
> 
> 1. 如果 UDF 已经被持续折叠，则不检查 UDF 身份验证。
> 2. 如果 UDF 是插入中的一个值，则不检查 UDF 身份验证。

### Catalog 权限

| 权限      | 描述                                                         |
|:----------|:-------------------------------------------------------------|
| SUPER     | SHOW CREATE catalog. 创建或删除 catalog。                       |
| ALL       | 授予指定对象类型的所有权限。                                           |