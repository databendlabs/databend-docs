---
title: 所有权
---

所有权是一种特殊的权限，表示一个角色对Databend中特定数据对象（目前包括数据库、表、UDF和Stage）拥有的专属权利和责任。

## 授予所有权

对象的所有权自动授予创建该对象的用户的角色，并且可以使用[GRANT](/sql/sql-commands/ddl/user/grant)命令在角色之间转移：

- 将对象的所有权授予新角色会将完全所有权转移给新角色，并从先前的角色中移除。例如，如果角色A最初拥有一个表，并且你将所有权授予角色B，角色B将成为新的所有者，而角色A将不再对该表拥有所有权。
- 出于安全原因，不建议将所有权授予内置角色`public`。如果用户在创建对象时处于`public`角色，那么所有用户都将拥有该对象的所有权，因为每个用户默认都具有`public`角色。Databend建议创建并分配自定义角色给用户，而不是使用`public`角色以明确所有权管理。有关内置角色的信息，请参阅[内置角色](02-roles.md)。
- 无法授予`default`数据库中表的所有权，因为它由内置角色`account_admin`拥有。

## 不允许撤销所有权

不支持撤销所有权，因为每个对象都必须有一个所有者。

- 如果一个对象被删除，它不会保留其原始角色的所有权。如果对象被恢复（如果可能），所有权不会自动重新分配，`account_admin`需要手动将所有权重新分配给一个角色。
- 如果拥有对象的角色被删除，`account_admin`可以将对象的所有权转移给另一个角色。

## 示例

要向角色授予所有权，请使用[GRANT](/sql/sql-commands/ddl/user/grant)命令。以下示例演示了将不同数据库对象的所有权授予角色'data_owner'：

```sql
-- 将'finance_data'数据库中所有表的所有权授予角色'data_owner'
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- 将'finance_data'模式中表'transactions'的所有权授予角色'data_owner'
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- 将Stage 'ingestion_stage'的所有权授予角色'data_owner'
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- 将用户定义函数'calculate_profit'的所有权授予角色'data_owner'
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```

此示例演示了在Databend中基于角色的所有权建立。管理员创建角色'role1'并将其分配给用户'u1'。向'role1'授予在'db'模式中创建表的权限。因此，当'u1'登录时，他们拥有'role1'的权限，允许他们在'db'下创建和拥有表。然而，对不属于'role1'拥有的表的访问是受限的，如对'db.t_old_exists'的查询失败所示。

```sql
-- 管理员创建角色并将其分配给相应的用户
CREATE ROLE role1;
CREATE USER u1 IDENTIFIED BY '123' WITH DEFAULT ROLE 'role1';
GRANT CREATE ON db.* TO ROLE role1;
GRANT ROLE role1 TO u1;

-- 当u1登录到Databend时，role1已授予u1，因此u1可以在db下创建和拥有表：
u1> CREATE TABLE db.t(id INT);
u1> INSERT INTO db.t VALUES(1);
u1> SELECT * FROM db.t;
u1> SELECT * FROM db.t_old_exists; -- 失败，因为此表的所有者不是role1
```