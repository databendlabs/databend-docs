---
title: 所有权
---

所有权是一种特殊的权限，它表示一个角色对Databend中特定数据对象（目前包括数据库、表、UDF和阶段）拥有的专属权利和责任。对象的所有权自动授予创建它的用户的当前角色。

## 授予所有权

对象的所有权可以从一个角色转移到另一个角色。一旦所有权从一个角色转移到另一个角色，所有权就转移给了新的角色。

- 出于安全考虑，不建议将所有权授予内置角色`public`。如果用户在创建对象时处于`public`角色，那么所有用户都将拥有该对象的所有权，因为每个Databend用户默认都拥有`public`角色。Databend建议创建并分配定制角色给用户，而不是使用`public`角色，以便更清晰地管理所有权。有关内置角色的信息，请参阅[内置角色](02-roles.md)。
- 如果拥有某个对象所有权的角色被删除，账户管理员可以将该对象的所有权授予另一个角色。
- 不能为`default`数据库中的表授予所有权，因为它属于内置角色`account_admin`。

删除一个对象将从所有者角色撤销所有权。然而，恢复（UNDROP，如果可用）一个已删除的对象不会恢复所有权。在这种情况下，您需要一个`account_admin`再次将所有权授予一个角色。

## 示例

要授予角色所有权，请使用[GRANT](/sql/sql-commands/ddl/user/grant)命令。以下示例展示了将不同数据库对象的所有权授予角色'data_owner'：

```sql
-- 将'finance_data'数据库中所有表的所有权授予角色'data_owner'
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- 将'finance_data'架构中'transactions'表的所有权授予角色'data_owner'
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- 将'ingestion_stage'阶段的所有权授予角色'data_owner'
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- 将用户定义函数'calculate_profit'的所有权授予角色'data_owner'
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```

此示例展示了在Databend中基于角色的所有权的建立。管理员创建角色'role1'并将其分配给用户'u1'。授予'role1'在'db'架构中创建表的权限。因此，当'u1'登录时，他们拥有'role1'的权限，允许他们在'db'下创建和拥有表。然而，对不属于'role1'的表的访问受到限制，如对'db.t_old_exists'的查询失败所示。

```sql
-- 管理员创建角色并将角色分配给相应的用户
CREATE ROLE role1;
CREATE USER u1 IDENTIFIED BY '123' WITH DEFAULT ROLE 'role1';
GRANT CREATE ON db.* TO ROLE role1;
GRANT ROLE role1 TO u1;

-- 在u1登录Databend后，role1已被授予u1，因此u1可以在db下创建和拥有表：
u1> CREATE TABLE db.t(id INT);
u1> INSERT INTO db.t VALUES(1);
u1> SELECT * FROM db.t;
u1> SELECT * FROM db.t_old_exists; -- 失败，因为此表的所有者不是role1
```