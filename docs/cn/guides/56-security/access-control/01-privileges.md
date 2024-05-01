---
title: 权限
---

权限是执行某项操作的许可。用户需要特定的权限才能在 Databend 中执行特定操作。例如，要查询表，用户至少需要具有对该表的 SELECT 权限，要读取 Stage 中的数据集，则最少需要对该 Stage 的 READ 权限。

在 Databend 中，用户可以通过两种方式获得权限。一种方法是直接将权限授予用户。另一种方法需要先将权限授予一个角色，然后再将该角色分配给用户。

![Alt text](/img/guides/access-control-2.png)

## 管理权限

要管理用户或角色的权限，请使用以下命令：

- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)
- [SHOW GRANTS](/sql/sql-commands/ddl/user/show-grants)


### 授予权限给用户 / 角色

要授予用户某个权限，有两种方式：您可以直接将权限授予特定用户，或者您可以先将权限授予某个角色，然后再将该角色授予给用户。

在下面的示例中，权限直接授予给了用户 'david'。先创建新用户 'david'，密码为 'abc123'，然后直接授予 'david' 处于 'default' 模式下的所有对象的所有权限。最后，显示了 'david' 被授予的权限。

```sql title='示例-1:'
-- 创建一个名为 'david' 的新用户，密码为 'abc123'
CREATE USER david IDENTIFIED BY 'abc123';

-- 将 'default' 模式下所有对象的所有权限授予用户 'david'
GRANT ALL ON default.* TO david;

-- 显示用户 'david' 被授予的权限
SHOW GRANTS FOR david;

┌───────────────────────────────────────────────────┐
│                       Grants                      │
├───────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'david'@'%' │
└───────────────────────────────────────────────────┘
```

在下面的示例中，权限首先授予给一个角色，然后将该角色授予给用户 'eric'。首先，创建一个名为 'writer' 的新角色，并授予其 'default' 模式下所有对象的所有权限。随后，创建一个名为 'eric' 的新用户，密码为 'abc123'，并将 'writer' 角色授予 'eric'。最后，显示了 'eric' 被授予的权限。

```sql title='示例-2:'
-- 创建一个名为 'writer' 的新角色
CREATE ROLE writer;

-- 将 'default' 模式下所有对象的所有权限授予角色 'writer'
GRANT ALL ON default.* TO ROLE writer;

-- 创建一个名为 'eric' 的新用户，密码为 'abc123'
CREATE USER eric IDENTIFIED BY 'abc123';

-- 将角色 'writer' 授予用户 'eric'
GRANT ROLE writer TO eric;

-- 显示用户 'eric' 被授予的权限
SHOW GRANTS FOR eric;

┌──────────────────────────────────────────────────┐
│                      Grants                      │
├──────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'eric'@'%' │
└──────────────────────────────────────────────────┘
```

### 撤销用户 / 角色的权限

在访问控制的上下文中，可以从个别用户或角色中撤销权限。在下面的示例中，我们撤销了用户 'david' 在 'default' 模式下所有对象的所有权限，然后显示用户 'david' 被授予的权限：

```sql title='示例-1(续):'
-- 从用户 'david' 撤销 'default' 模式下所有对象的所有权限
REVOKE ALL ON default.* FROM david;

-- 显示用户 'david' 被授予的权限
SHOW GRANTS FOR david;
```

在下面的示例中，撤销 'writer' 在 'default' 模式下所有对象的所有权限。此后，显示用户 'eric' 被授予的权限。

```sql title='示例-2(续):'
-- 从角色 'writer' 撤销 'default' 模式下所有对象的所有权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 显示用户 'eric' 被授予的权限
-- 由于权限已从角色中撤销，因此不显示任何权限
SHOW GRANTS FOR eric;
```

## 访问控制权限

Databend 提供了一系列权限，允许您对数据库对象进行细粒度控制。Databend 权限可以分为以下类型：

- 全局权限：这组权限包括适用于整个数据库管理系统的权限，而不是系统内特定对象的权限。全局权限授予影响数据库整体功能和管理的操作，例如创建或删除数据库、管理用户和角色以及修改系统级设置。有关包含哪些权限，请参见 [全局权限](#global-privileges)。

- 特定对象权限：特定对象权限具有不同的集合，每个集合适用于特定的数据库对象。这包括：
  - [表权限](#table-privileges)
  - [视图权限](#view-privileges)
  - [数据库权限](#database-privileges)
  - [会话策略权限](#session-policy-privileges)
  - [ Stage 权限](#stage-privileges)
  - [UDF 权限](#udf-privileges)
  - [目录权限](#catalog-privileges)
  - [共享权限](#share-privileges)

### 所有权限

| 权限        | 对象类型               | 描述                                                                                             |
| :---------- | :--------------------- | :----------------------------------------------------------------------------------------------- |
| ALL         | 所有                   | 授予指定对象类型的所有权限。                                                                     |
| ALTER       | 全局, 数据库, 表, 视图 | 修改数据库、表、用户或 UDF。                                                                     |
| CREATE      | 全局, 数据库, 表       | 创建数据库、表或 UDF。                                                                           |
| DELETE      | 表                     | 删除或截断表中的行。                                                                             |
| DROP        | 全局, 数据库, 表, 视图 | 删除数据库、表、视图或 UDF。恢复已删除的表。                                                     |
| INSERT      | 表                     | 向表中插入行。                                                                                   |
| SELECT      | 数据库, 表             | 从表中选择行。显示或使用数据库。                                                                 |
| UPDATE      | 表                     | 更新表中的行。                                                                                   |
| GRANT       | 全局                   | 授予/撤销用户或角色的权限。                                                                      |
| SUPER       | 全局, 表               | 终止查询。设置全局配置。优化表。分析表。操作 Stage（列出 Stage。创建、删除 Stage）、目录或共享。 |
| USAGE       | 全局                   | “无权限”的同义词。                                                                               |
| CREATE ROLE | 全局                   | 创建角色。                                                                                       |
| DROP ROLE   | 全局                   | 删除角色。                                                                                       |
| CREATE USER | 全局                   | 创建 SQL 用户。                                                                                  |
| DROP USER   | 全局                   | 删除 SQL 用户。                                                                                  |
| WRITE       | Stage                  | 写入 Stage。                                                                                     |
| READ        | Stage                  | 读取 Stage。                                                                                     |
| USAGE       | UDF                    | 使用 UDF。                                                                                       |

### 全局权限

| 权限       | 描述                                                                          |
| :--------- | :---------------------------------------------------------------------------- |
| ALL        | 授予指定对象类型的所有权限。                                                  |
| ALTER      | 添加或删除表列。更改聚类键。重聚类表。                                        |
| CREATEROLE | 创建角色。                                                                    |
| DROPUSER   | 删除用户。                                                                    |
| CREATEUSER | 创建用户。                                                                    |
| DROPROLE   | 删除角色。                                                                    |
| SUPER      | 终止查询。设置或取消设置。操作 Stage、目录或共享。调用函数。COPY INTO Stage。 |
| USAGE      | 仅连接到 databend 查询。                                                      |
| CREATE     | 创建 UDF（用户定义函数）。                                                    |
| DROP       | 删除 UDF。                                                                    |
| ALTER      | 更改 UDF。更改 SQL 用户。                                                     |

### 表权限

| 权限   | 描述                                        |
| :----- | :------------------------------------------ |
| ALL    | 授予指定对象类型的所有权限。                |
| ALTER  | 添加或删除表列。更改聚类键。重聚类表。      |
| CREATE | 创建表。                                    |
| DELETE | 删除表中的行。截断表。                      |
| DROP   | 删除或取消删除表。恢复被删除表的最近版本。  |
| INSERT | 向表中插入行。COPY INTO 表。                |
| SELECT | 从表中选择行。SHOW CREATE 表。DESCRIBE 表。 |
| UPDATE | 更新表中的行。                              |
| SUPER  | 优化或分析表。                              |

### 视图权限

| 权限  | 描述                                            |
| :---- | :---------------------------------------------- |
| ALL   | 授予指定对象类型的所有权限                      |
| ALTER | 创建或删除视图。使用另一个 QUERY 更改现有视图。 |
| DROP  | 删除视图。                                      |

### 数据库权限 {#database-privileges}

请注意，一旦您拥有对数据库的以下任何权限或对数据库中的表的任何权限，您就可以使用 [USE DATABASE](/sql/sql-commands/ddl/database/ddl-use-database) 命令来指定数据库。

| 权限      | 描述                                                                 |
| :-------- | :------------------------------------------------------------------- |
| Alter     | 重命名数据库。                                                       |
| CREATE    | 创建数据库。                                                         |
| DROP      | 删除或取消删除数据库。恢复已删除数据库的最新版本。                   |
| SELECT    | SHOW CREATE 数据库。                                                 |
| OWNERSHIP | 对数据库拥有完全控制权。特定对象上的这一权限一次只能由一个角色持有。 |

### 会话策略权限 {#session-policy-privileges}

| 权限  | 描述                           |
| :---- | :----------------------------- |
| SUPER | 终止查询。设置或取消设置设置。 |
| ALL   | 授予指定对象类型的所有权限。   |

### Stage 权限 {#stage-privileges}

| 权限      | 描述                                                                    |
| :-------- | :---------------------------------------------------------------------- |
| WRITE     | 写入 Stage。例如，复制到 Stage，预签名上传或删除 Stage                  |
| READ      | 读取 Stage。例如，列出 Stage，查询 Stage，从 Stage 复制到表，预签名下载 |
| ALL       | 授予指定对象类型的 READ, WRITE 权限。                                   |
| OWNERSHIP | 对 Stage 拥有完全控制权。特定对象上一次只能有一个角色持有此权限。       |

> 注意：
>
> 不检查外部位置授权。

### UDF 权限 {#udf-privileges}

| 权限      | 描述                                                            |
| :-------- | :-------------------------------------------------------------- |
| USAGE     | 可以使用 UDF。例如，复制到 Stage，预签名上传                    |
| ALL       | 授予指定对象类型的 READ, WRITE 权限。                           |
| OWNERSHIP | 对 UDF 拥有完全控制权。特定对象上一次只能有一个角色持有此权限。 |

> 注意：
>
> 1. 如果 UDF 已经被常量折叠，不检查 UDF 授权。
> 2. 如果 UDF 是插入中的一个值，不检查 UDF 授权。

### 目录权限 {#catalog-privileges}

| 权限  | 描述                           |
| :---- | :----------------------------- |
| SUPER | 显示创建目录。创建或删除目录。 |
| ALL   | 授予指定对象类型的所有权限。   |

## 共享权限 {#share-privileges}

| 权限  | 描述                                 |
| :---- | :----------------------------------- |
| SUPER | 创建、删除或描述一个共享。显示共享。 |
| ALL   | 授予指定对象类型的所有权限。         |
