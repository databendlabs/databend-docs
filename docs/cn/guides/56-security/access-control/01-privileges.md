---
title: 权限
---

权限（Privilege）是执行特定操作的许可。用户必须拥有相应权限才能在 Databend 中执行特定操作。例如，查询表时需要对该表拥有 `SELECT` 权限；读取 Stage 内数据集时需具备 `READ` 权限。

在 Databend 中，用户可通过两种方式获取权限：直接授予用户，或先授予角色再将角色分配给用户。

![Alt text](/img/guides/access-control-2.png)

## 权限管理

使用以下命令管理用户或角色的权限：

- [GRANT](/sql/sql-commands/ddl/user/grant)
- [REVOKE](/sql/sql-commands/ddl/user/revoke)
- [SHOW GRANTS](/sql/sql-commands/ddl/user/show-grants)

### 授予用户/角色权限

权限可直接授予用户，或先授予角色再分配给用户。下例直接将权限授予用户 'david'：

```sql title='示例 -1：'
-- 创建用户 'david'，密码 'abc123'
CREATE USER david IDENTIFIED BY 'abc123';

-- 授予 'default' 模式所有对象权限
GRANT ALL ON default.* TO david;

-- 查看用户权限
SHOW GRANTS FOR david;

┌───────────────────────────────────────────────────┐
│                       Grants                      │
├───────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'david'@'%' │
└───────────────────────────────────────────────────┘
```

下例先将权限授予角色 'writer'，再将角色授予用户 'eric'：

```sql title='示例 -2：'
-- 创建角色 'writer'
CREATE ROLE writer;

-- 授予角色 'default' 模式所有对象权限
GRANT ALL ON default.* TO ROLE writer;

-- 创建用户 'eric'，密码 'abc123'
CREATE USER eric IDENTIFIED BY 'abc123';

-- 将角色授予用户
GRANT ROLE writer TO eric;

-- 查看用户权限
SHOW GRANTS FOR eric;

┌──────────────────────────────────────────────────┐
│                      Grants                      │
├──────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'eric'@'%' │
└──────────────────────────────────────────────────┘
```

### 撤销用户/角色权限

下例撤销用户 'david' 在 'default' 模式的所有权限：

```sql title='示例 -1(续)：'
-- 撤销用户权限
REVOKE ALL ON default.* FROM david;

-- 查看用户权限
SHOW GRANTS FOR david;
```

下例撤销角色 'writer' 在 'default' 模式的所有权限：

```sql title='示例 -2(续)：'
-- 撤销角色权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 查看用户权限（权限已撤销）
SHOW GRANTS FOR eric;
```

## 访问控制权限

Databend 提供细粒度权限控制，分为以下类型：

- [全局权限](#全局权限)
- 对象权限：
  - [表权限](#table-privileges)
  - [视图权限](#view-privileges)
  - [数据库权限](#database-privileges)
  - [会话策略权限](#session-policy-privileges)
  - [Stage 权限](#stage-privileges)
  - [UDF 权限](#udf-privileges)
  - [Catalog 权限](#catalog-privileges)
  - [共享权限](#share-privileges)

### 所有权限

| 权限             | 对象类型            | 描述                                                          |
| :--------------- | :------------------ | :------------------------------------------------------------ |
| ALL              | 所有                | 授予指定对象类型的所有权限                                    |
| ALTER            | 全局/数据库/表/视图 | 修改数据库/表/用户/UDF                                        |
| CREATE           | 全局/表             | 创建表/UDF                                                    |
| CREATE DATABASE  | 全局                | 创建数据库/UDF                                                |
| CREATE WAREHOUSE | 全局                | 创建计算集群 (Warehouse)                                      |
| DELETE           | 表                  | 删除/清空表数据                                               |
| DROP             | 全局/数据库/表/视图 | 删除数据库/表/视图/UDF；恢复表                                |
| INSERT           | 表                  | 插入数据                                                      |
| SELECT           | 数据库/表           | 查询数据；查看/使用数据库                                     |
| UPDATE           | 表                  | 更新数据                                                      |
| GRANT            | 全局                | 授予/撤销权限                                                 |
| SUPER            | 全局/表             | 终止查询；配置全局参数；优化/分析表；管理 Stage/Catalog/Share |
| USAGE            | 全局                | "无权限"同义词                                                |
| CREATE ROLE      | 全局                | 创建角色                                                      |
| DROP ROLE        | 全局                | 删除角色                                                      |
| CREATE USER      | 全局                | 创建用户                                                      |
| DROP USER        | 全局                | 删除用户                                                      |
| WRITE            | Stage               | 写入 Stage                                                    |
| READ             | Stage               | 读取 Stage                                                    |
| USAGE            | UDF                 | 使用 UDF                                                      |

### 全局权限

| 权限             | 描述                                                              |
| :--------------- | :---------------------------------------------------------------- |
| ALL              | 授予所有权限                                                      |
| ALTER            | 增删表列；修改聚簇键 (Cluster Key)；重聚簇表                      |
| CREATEROLE       | 创建角色                                                          |
| CREATE DATABASE  | 创建数据库                                                        |
| CREATE WAREHOUSE | 创建计算集群 (Warehouse)                                          |
| DROPUSER         | 删除用户                                                          |
| CREATEUSER       | 创建用户                                                          |
| DROPROLE         | 删除角色                                                          |
| SUPER            | 终止查询；修改配置；管理 Stage/Catalog/Share；调用函数；COPY INTO |
| USAGE            | 仅连接 Databend 查询                                              |
| CREATE           | 创建 UDF                                                          |
| DROP             | 删除 UDF                                                          |
| ALTER            | 修改 UDF/SQL 用户                                                 |

### 表权限

| 权限      | 描述                              |
| :-------- | :-------------------------------- |
| ALL       | 授予所有权限                      |
| ALTER     | 增删表列；修改聚簇键；重聚簇表    |
| CREATE    | 创建表                            |
| DELETE    | 删除/清空表数据                   |
| DROP      | 删除/恢复表                       |
| INSERT    | 插入数据；COPY INTO 表            |
| SELECT    | 查询数据；SHOW CREATE/DESCRIBE 表 |
| UPDATE    | 更新数据                          |
| SUPER     | 优化/分析表                       |
| OWNERSHIP | 完全控制数据库（单角色独占）      |

### 视图权限

| 权限  | 描述                            |
| :---- | :------------------------------ |
| ALL   | 授予所有权限                    |
| ALTER | 创建/删除视图；修改视图查询语句 |
| DROP  | 删除视图                        |

### 数据库权限

| 权限      | 描述                                    |
| :-------- | :-------------------------------------- |
| ALTER     | 重命名数据库                            |
| DROP      | 删除/恢复数据库                         |
| SELECT    | SHOW CREATE 数据库                      |
| OWNERSHIP | 完全控制数据库（单角色独占）            |
| USAGE     | 允许 `USE <database>`（不授权对象访问） |

> 注意：
>
> 1. 角色拥有数据库即有权访问其所有表

### 会话策略权限

| 权限  | 描述               |
| :---- | :----------------- |
| SUPER | 终止查询；修改配置 |
| ALL   | 授予所有权限       |

### Stage 权限

| 权限      | 描述                                         |
| :-------- | :------------------------------------------- |
| WRITE     | 写入 Stage（COPY INTO/预签名上传/删除）      |
| READ      | 读取 Stage（列出/查询/COPY FROM/预签名下载） |
| ALL       | 授予 READ/WRITE 权限                         |
| OWNERSHIP | 完全控制 Stage（单角色独占）                 |

> 注意：
>
> 1. 不验证外部存储位置权限

### UDF 权限

| 权限      | 描述                       |
| :-------- | :------------------------- |
| USAGE     | 使用 UDF                   |
| ALL       | 授予所有权限               |
| OWNERSHIP | 完全控制 UDF（单角色独占） |

> 注意：
>
> 1. 常量折叠 UDF 不验证权限
> 2. INSERT 语句值内 UDF 不验证权限

### Catalog 权限

| 权限  | 描述                          |
| :---- | :---------------------------- |
| SUPER | SHOW CREATE/创建/删除 Catalog |
| ALL   | 授予所有权限                  |

### 共享权限

| 权限  | 描述         |
| :---- | :----------- |
| SUPER | 管理共享     |
| ALL   | 授予所有权限 |
