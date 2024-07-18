---
title: 权限管理
---

权限是一种允许执行特定操作的许可。在 Databend 中，用户必须拥有特定的权限才能执行特定的操作。例如，查询表时，用户需要对该表拥有`SELECT`权限。同样，要读取 Stage 中的数据集，用户必须拥有`READ`权限。

在 Databend 中，用户可以通过两种方式获得权限。一种方法是直接将权限授予用户。另一种方法是将权限首先授予角色，然后将该角色分配给用户。

![Alt text](/img/guides/access-control-2.png)

## 管理权限

要管理用户或角色的权限，请使用以下命令：

- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)
- [SHOW GRANTS](/sql/sql-commands/ddl/user/show-grants)

### 向用户/角色授予权限

要授予权限，您有两种选择：可以直接将权限授予用户，或者先将权限授予角色，然后将该角色授予用户。在以下示例中，权限直接授予用户'david'。首先创建一个名为'david'的新用户，密码为'abc123'，然后将'default'模式中所有对象的所有权限直接授予'david'。最后，显示'david'被授予的权限。

```sql title='示例 1：'
-- 创建一个名为'david'的新用户，密码为'abc123'
CREATE USER david IDENTIFIED BY 'abc123';

-- 将'default'模式中所有对象的所有权限授予用户'david'
GRANT ALL ON default.* TO david;

-- 显示用户'david'被授予的权限
SHOW GRANTS FOR david;

┌───────────────────────────────────────────────────┐
│                       Grants                      │
├───────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'david'@'%' │
└───────────────────────────────────────────────────┘
```

在以下示例中，权限首先授予角色，然后将角色授予用户'eric'。首先创建一个名为'writer'的新角色，并将'default'模式中所有对象的所有权限授予该角色。随后，创建一个名为'eric'的新用户，密码为'abc123'，并将'writer'角色授予'eric'。最后，显示'eric'被授予的权限。

```sql title='示例 2：'
-- 创建一个名为'writer'的新角色
CREATE ROLE writer;

-- 将'default'模式中所有对象的所有权限授予角色'writer'
GRANT ALL ON default.* TO ROLE writer;

-- 创建一个名为'eric'的新用户，密码为'abc123'
CREATE USER eric IDENTIFIED BY 'abc123';

-- 将角色'writer'授予用户'eric'
GRANT ROLE writer TO eric;

-- 显示用户'eric'被授予的权限
SHOW GRANTS FOR eric;

┌──────────────────────────────────────────────────┐
│                      Grants                      │
├──────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'eric'@'%' │
└──────────────────────────────────────────────────┘
```

### 从用户/角色撤销权限

在访问控制中，可以从单个用户或角色中撤销权限。在以下示例中，我们从用户'david'撤销'default'模式中所有对象的所有权限，然后显示用户'david'被授予的权限：

```sql title='示例 1（续）：'
-- 从用户'david'撤销'default'模式中所有对象的所有权限
REVOKE ALL ON default.* FROM david;

-- 显示用户'david'被授予的权限
SHOW GRANTS FOR david;
```

在以下示例中，从角色'writer'撤销'default'模式中所有对象的所有权限。随后，显示用户'eric'被授予的权限。

```sql title='示例 2（续）：'
-- 从角色'writer'撤销'default'模式中所有对象的所有权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 显示用户'eric'被授予的权限
-- 由于权限已从角色中撤销，因此不会显示任何权限
SHOW GRANTS FOR eric;
```

## 访问控制权限

Databend 提供了一系列权限，允许您对数据库对象进行精细控制。Databend 的权限可以分为以下几类：

- 全局权限：这组权限包括适用于整个数据库管理系统而非系统内特定对象的权限。全局权限授予影响数据库整体功能和管理的行为，如创建或删除数据库、管理用户和角色以及修改系统级设置。有关包括哪些权限，请参阅[全局权限](#global-privileges)。

- 对象特定权限：对象特定权限具有不同的集合，每个集合适用于特定的数据库对象。这包括：
  - [表权限](#table-privileges)
  - [视图权限](#view-privileges)
  - [数据库权限](#database-privileges)
  - [会话策略权限](#session-policy-privileges)
  - [Stage 权限](#stage-privileges)
  - [UDF 权限](#udf-privileges)
  - [Catalog 权限](#catalog-privileges)
  - [Share 权限](#share-privileges)

### 所有权限

| 权限        | 对象类型               | 描述                                                                                                   |
| :---------- | :--------------------- | :----------------------------------------------------------------------------------------------------- |
| ALL         | 所有                   | 授予指定对象类型的所有权限。                                                                           |
| ALTER       | 全局、数据库、表、视图 | 修改数据库、表、用户或 UDF。                                                                           |
| CREATE      | 全局、数据库、表       | 创建数据库、表或 UDF。                                                                                 |
| DELETE      | 表                     | 删除或截断表中的行。                                                                                   |
| DROP        | 全局、数据库、表、视图 | 删除数据库、表、视图或 UDF。恢复表。                                                                   |
| INSERT      | 表                     | 向表中插入行。                                                                                         |
| SELECT      | 数据库、表             | 从表中选择行。显示或使用数据库。                                                                       |
| UPDATE      | 表                     | 更新表中的行。                                                                                         |
| GRANT       | 全局                   | 授予/撤销用户或角色的权限。                                                                            |
| SUPER       | 全局、表               | 终止查询。设置全局配置。优化表。分析表。操作 Stage（列出 Stage。创建、删除 Stage）、Catalog 或 Share。 |
| USAGE       | 全局                   | “无权限”的同义词。                                                                                     |
| CREATE ROLE | 全局                   | 创建角色。                                                                                             |
| DROP ROLE   | 全局                   | 删除角色。                                                                                             |
| CREATE USER | 全局                   | 创建 SQL 用户。                                                                                        |
| DROP USER   | 全局                   | 删除 SQL 用户。                                                                                        |
| WRITE       | Stage                  | 写入 Stage。                                                                                           |
| READ        | Stage                  | 读取 Stage。                                                                                           |
| USAGE       | UDF                    | 使用 UDF。                                                                                             |

### 全局权限

| 权限       | 描述                                                                                |
| :--------- | :---------------------------------------------------------------------------------- |
| ALL        | 授予指定对象类型的所有权限。                                                        |
| ALTER      | 添加或删除表列。更改集群键。重新聚簇表。                                            |
| CREATEROLE | 创建角色。                                                                          |
| DROPUSER   | 删除用户。                                                                          |
| CREATEUSER | 创建用户。                                                                          |
| DROPROLE   | 删除角色。                                                                          |
| SUPER      | 终止查询。设置或取消设置。操作 Stage、Catalog 或 Share。调用函数。COPY INTO Stage。 |
| USAGE      | 仅连接到 Databend 查询。                                                            |
| CREATE     | 创建 UDF。                                                                          |
| DROP       | 删除 UDF。                                                                          |
| ALTER      | 更改 UDF。更改 SQL 用户。                                                           |

### 表权限

| 权限      | 描述                                                                   |
| :-------- | :--------------------------------------------------------------------- |
| ALL       | 授予指定对象类型的所有权限。                                           |
| ALTER     | 添加或删除表列。更改集群键。重新聚簇表。                               |
| CREATE    | 创建表。                                                               |
| DELETE    | 删除表中的行。截断表。                                                 |
| DROP      | 删除或恢复表。恢复最近版本的已删除表。                                 |
| INSERT    | 向表中插入行。COPY INTO 表。                                           |
| SELECT    | 从表中选择行。SHOW CREATE 表。DESCRIBE 表。                            |
| UPDATE    | 更新表中的行。                                                         |
| SUPER     | 优化或分析表。                                                         |
| OWNERSHIP | 授予对数据库的完全控制。同一时间只有一个角色可以对特定对象持有此权限。 |

### 视图权限

| 权限  | 描述                                         |
| :---- | :------------------------------------------- |
| ALL   | 授予指定对象类型的所有权限。                 |
| ALTER | 创建或删除视图。使用另一个查询更改现有视图。 |
| DROP  | 删除视图。                                   |

### 数据库权限

请注意，如果您拥有以下任何数据库权限或数据库中任何表的权限，您可以使用 [USE DATABASE](/sql/sql-commands/ddl/database/ddl-use-database) 命令指定数据库。

| 权限      | 描述                                                                   |
| :-------- | :--------------------------------------------------------------------- |
| Alter     | 重命名数据库。                                                         |
| CREATE    | 创建数据库。                                                           |
| DROP      | 删除或恢复数据库。恢复最近版本的已删除数据库。                         |
| SELECT    | SHOW CREATE 数据库。                                                   |
| OWNERSHIP | 授予对数据库的完全控制。同一时间只有一个角色可以对特定对象持有此权限。 |

> 注意：
>
> 1. 如果一个角色拥有一个数据库，该角色可以访问该数据库下的所有表。

### 会话策略权限

| 权限  | 描述                         |
| :---- | :--------------------------- |
| SUPER | 终止查询。设置或取消设置。   |
| ALL   | 授予指定对象类型的所有权限。 |

### Stage 权限

| 权限      | 描述                                                                          |
| :-------- | :---------------------------------------------------------------------------- |
| WRITE     | 写入 Stage。例如，COPY INTO Stage，预签名上传或删除 Stage。                   |
| READ      | 读取 Stage。例如，列出 Stage，查询 Stage，从 Stage COPY INTO 表，预签名下载。 |
| ALL       | 授予指定对象类型的 READ, WRITE 权限。                                         |
| OWNERSHIP | 授予对 Stage 的完全控制。同一时间只有一个角色可以对特定对象持有此权限。       |

> 注意：
>
> 1. 不检查外部位置认证。

### UDF 权限

| 权限      | 描述                                                                  |
| :-------- | :-------------------------------------------------------------------- |
| USAGE     | 可以使用 UDF。例如，COPY INTO Stage，预签名上传。                     |
| ALL       | 授予指定对象类型的 READ, WRITE 权限。                                 |
| OWNERSHIP | 授予对 UDF 的完全控制。同一时间只有一个角色可以对特定对象持有此权限。 |

> 注意：
>
> 1. 如果 UDF 已经常折叠，则不检查 UDF 认证。
> 2. 如果 UDF 是插入中的值，则不检查 UDF 认证。

### Catalog 权限

| 权限  | 描述                                      |
| :---- | :---------------------------------------- |
| SUPER | SHOW CREATE Catalog。创建或删除 Catalog。 |
| ALL   | 授予指定对象类型的所有权限。              |

### Share 权限

| 权限  | 描述                                 |
| :---- | :----------------------------------- |
| SUPER | 创建、删除或描述 Share。显示 Share。 |
| ALL   | 授予指定对象类型的所有权限。         |
