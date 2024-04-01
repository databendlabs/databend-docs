---
title: 所有权
---

所有权是一种特殊的权限，表示角色完全拥有 Databend 内的特定数据对象（目前包括数据库、表、UDF 和 stage）。对象的所有权会自动授予创建该对象的用户的当前角色。

## 授予所有权

对象的所有权可以从一个角色授予给另一个角色。一旦所有权从一个角色转移给另一个角色，新角色就拥有了所有权。

- 出于安全考虑，不建议将所有权授予内置角色 `public`。如果用户在创建对象时处于 `public` 角色，那么所有用户都将拥有该对象的所有权，因为每个 Databend 用户默认都拥有 `public` 角色。Databend 建议创建并分配自定义角色给用户，而不是使用 `public` 角色，以便更清晰地管理所有权。有关内置角色的信息，请参阅[内置角色](02-roles.md)。
- 如果拥有对象所有权的角色被删除，`account_admin` 可以将该对象的所有权授予另一个角色。
- 不能为 `default` 数据库中的表授予所有权，因为它由内置角色 `account_admin` 所拥有。

删除数据对象将从所有者角色中撤销对该数据对象的所有权。恢复（如果可用的话，UNDROP）被删除的数据对象将 **不会** 恢复所有权。在这种情况下，您将需要一个 `account_admin` 角色再次将所有权授予所有者角色。

## 示例

要将所有权授予一个角色，请使用 [GRANT](/sql/sql-commands/ddl/user/grant) 命令。以下示例演示了将不同数据库对象的所有权授予 `data_owner` 角色：

```sql
-- 将 'finance_data' 数据库中所有表的所有权授予 'data_owner' 角色
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- 将 'finance_data' 中的 'transactions' 表的所有权授予 'data_owner' 角色
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- 将 'ingestion_stage' Stage 的所有权授予 'data_owner' 角色
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- 将用户定义函数 'calculate_profit' 的所有权授予 'data_owner' 角色
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```

此示例演示了在 Databend 中如何建立基于角色的所有权。管理员创建一个角色 'role1' 并将其分配给用户 'u1'。将在 'db' 架构中创建表的权限授予 'role1'。因此，当 'u1' 登录时，他将会拥有 'role1' 的权限，这允许他在 'db' 下创建和拥有表。从对 'db.t_old_exists' 的查询失败中可以看出，该用户对不属于 'role1' 所有的表的访问会受到角色的限制。

```sql
-- 管理员创建角色并将角色分配给相应用户
CREATE ROLE role1;
CREATE USER u1 IDENTIFIED BY '123' WITH DEFAULT ROLE 'role1';
GRANT CREATE ON db.* TO ROLE role1;
GRANT ROLE role1 TO u1;

-- 用户 u1 登录到 Databend 后，role1 已经授予给 u1，所以 u1 可以在 db 下创建并拥有表：
u1> CREATE TABLE db.t(id INT);
u1> INSERT INTO db.t VALUES(1);
u1> SELECT * FROM db.t;
u1> SELECT * FROM db.t_old_exists; -- 失败，因为这个表的所有者不是 role1
```