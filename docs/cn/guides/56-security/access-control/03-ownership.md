---
title: 所有权
---

所有权赋予角色对 Databend 中数据对象的控制权。支持所有权的对象包括数据库、表、UDF、Stage、Connection 和 Sequence。

## 授予所有权

Databend 会将新对象的所有权授予创建时会话的当前角色。您可以使用 [GRANT](/sql/sql-commands/ddl/user/grant) 命令在角色之间转移所有权：

- 将对象的所有权授予新角色会将完全所有权转移给新角色，并从之前的角色中移除。例如，如果角色 A 最初拥有一个表，并且您将所有权授予角色 B，则角色 B 将成为新的所有者，并且角色 A 将不再拥有该表的所有权。
- 避免将所有权授予内置角色 `public`。如果用户创建对象时的当前角色是 `public`，该对象的所有权就属于 `public`。由于每个用户默认都拥有 `public` 角色，其他用户也可以通过它行使所有权。对于需要限制访问的对象，请使用自定义角色。更多信息请参阅 [内置角色](02-roles.md)。
- 无法为 `default` 数据库中的表授予所有权，因为它由内置角色 `account_admin` 拥有。

## 创建权限与当前角色

Databend 根据直接授予用户的权限和会话当前角色的权限检查创建权限，辅助角色不能授权创建。创建 Connection 和 Sequence 分别需要 `CREATE CONNECTION` 和 `CREATE SEQUENCE` 权限，仅有 `SUPER` 不代表拥有这两项权限。

当前角色同时会成为新对象的所有者。创建对象前，请通过 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 切换到拥有创建权限、并且应当拥有该对象的角色。也可以通过 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 或 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 设置 `DEFAULT_ROLE`，新会话开始时会使用该角色作为当前角色。如果当前角色是 `public`，只有 `public` 或用户本身直接拥有所需权限时才能创建，且新对象的所有权归 `public`。

对已存在的对象执行 `CREATE ... IF NOT EXISTS` 不会改变其所有者。`CREATE OR REPLACE` 会让当前角色成为替换后对象的所有者。

## 不允许撤销所有权

*不*支持撤销所有权，因为每个对象都必须有一个所有者。

- 如果删除一个对象，它将不会保留其原始角色的所有权。如果恢复该对象（如果可能），所有权将不会自动重新分配，并且 `account_admin` 需要手动将所有权重新分配给一个角色。
- 如果拥有一个对象的角色被删除，`account_admin` 可以将该对象的所有权转移给另一个角色。

## 示例

要将所有权授予一个角色，请使用 [GRANT](/sql/sql-commands/ddl/user/grant) 命令。这些示例演示了将不同数据库对象的所有权授予角色 'data_owner'：

```sql
-- 将 'finance_data' 数据库中所有表的所有权授予角色 'data_owner'
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- 将 'finance_data' 模式中表 'transactions' 的所有权授予角色 'data_owner'
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- 将 Stage 'ingestion_stage' 的所有权授予角色 'data_owner'
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- 将用户定义函数 'calculate_profit' 的所有权授予角色 'data_owner'
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```

此示例演示了在 Databend 中建立基于角色的所有权。管理员创建一个角色 'role1' 并将其分配给用户 'u1'。创建 'db' 模式中表的权限被授予 'role1'。因此，当 'u1' 登录时，他们拥有 'role1' 的权限，允许他们在 'db' 下创建和拥有表。但是，访问不属于 'role1' 的表受到限制，如对 'db.t_old_exists' 的查询失败所证明的那样。

```sql
-- 管理员创建角色并将角色分配给相应的用户
CREATE ROLE role1;
CREATE USER u1 IDENTIFIED BY '123' WITH DEFAULT_ROLE = 'role1';
GRANT CREATE ON db.* TO ROLE role1;
GRANT ROLE role1 TO u1;

-- 在 u1 登录 atabend 后，role1 已被授予 u1，因此 u1 可以在 db 下创建和拥有表：
u1> CREATE TABLE db.t(id INT);
u1> INSERT INTO db.t VALUES(1);
u1> SELECT * FROM db.t;
u1> SELECT * FROM db.t_old_exists; -- 失败，因为此表的所有者不是 role1
```

此示例展示如何让某个用户创建数据库，并且这些数据库仅由其角色拥有，其他用户除非显式授权否则不可见：

```sql
CREATE ROLE part1_role;
GRANT CREATE DATABASE ON *.* TO ROLE part1_role;
CREATE USER user1 IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'part1_role';
GRANT ROLE part1_role TO user1;

-- 当 user1 创建数据库时，所有权会被赋予 part1_role。
-- 其他用户无法查看或访问该数据库，除非其角色被授予权限或所有权。
```
