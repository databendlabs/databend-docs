---
title: 角色
---

Databend 中的角色在简化权限管理方面起着关键作用。当多个用户需要相同的权限集时，单独授予权限可能很麻烦。角色提供了一种解决方案，允许将一组权限分配给一个角色，然后可以轻松地将该角色分配给多个用户。

![Alt text](/img/guides/access-control-3.png)

## 继承角色 & 建立层级结构

角色授予使一个角色能够继承另一个角色的权限和职责。这有助于创建灵活的层级结构，类似于组织结构，其中存在两个 [内置角色](#built-in-roles)：最高的是 `account-admin`，最低的是 `public`。

考虑创建三个角色的场景：_manager_、_engineer_ 和 _intern_。在此示例中，_intern_ 角色被授予给 _engineer_ 角色。因此，_engineer_ 不仅拥有自己的权限集，还继承了与 _intern_ 角色相关的权限。进一步扩展此层级结构，如果将 _engineer_ 角色授予给 _manager_，则 _manager_ 现在获得 _engineer_ 和 _intern_ 角色的固有权限。

![Alt text](/img/guides/access-control-4.png)

## 内置角色

Databend 附带以下内置角色：

| 内置角色      | 描述                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| account-admin | 拥有所有权限，充当所有其他角色的父角色，并能够无缝切换到租户中的任何角色。 |
| public        | 不继承任何权限，将所有角色视为其父角色，并允许任何角色切换到 public 角色。 |

要在 Databend Cloud 中将 `account-admin` 角色分配给用户，请在邀请用户时选择该角色。您也可以在用户加入后将该角色分配给用户。如果您使用的是 Databend Community Edition 或 Enterprise Edition，请首先在部署期间配置 `account-admin` 用户，然后根据需要将该角色分配给其他用户。有关配置管理员用户的更多信息，请参阅 [配置管理员用户](../../10-deploy/04-references/01-admin-users.md)。

## 设置默认角色

当用户被授予多个角色时，您可以使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 或 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令为该用户设置默认角色。默认角色确定在会话开始时自动分配给用户的角色：

```sql title='Example:'
-- 显示系统中现有的角色
SHOW ROLES;

┌───────────────────────────────────────────────────────────┐
│      name     │ inherited_roles │ is_current │ is_default │
├───────────────┼─────────────────┼────────────┼────────────┤
│ account_admin │               0 │ true       │ true       │
│ public        │               0 │ false      │ false      │
│ writer        │               0 │ false      │ false      │
└───────────────────────────────────────────────────────────┘

-- 创建一个密码为 'abc123' 的用户 'eric'，并将 'writer' 设置为默认角色
CREATE USER eric IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'writer';

-- 将 'account_admin' 角色授予给用户 'eric'
GRANT ROLE account_admin TO eric;

-- 将 'account_admin' 设置为用户 'eric' 的默认角色
ALTER USER eric WITH DEFAULT_ROLE = 'account_admin';
```

- 用户可以使用 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令灵活地在会话中切换到其他角色。
- 用户可以使用 [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) 命令检查其当前角色并查看授予给他们的所有角色。
- 如果您没有为用户显式设置默认角色，Databend 将默认使用内置角色 `public` 作为默认角色。

## 激活角色 & 辅助角色

可以向用户授予 Databend 中的多个角色。这些角色分为激活角色和辅助角色：

- 激活角色是用户当前会话的激活主角色，可以使用 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令进行设置。

- 辅助角色是提供额外权限的其他角色，默认情况下处于激活状态。用户可以使用 [SET SECONDARY ROLES](/sql/sql-commands/ddl/user/user-set-2nd-roles) 命令激活或停用辅助角色，以临时调整其权限范围。

## 账单角色

除了标准的内置角色之外，您还可以在 Databend Cloud 中创建一个名为 `billing` 的自定义角色，专门满足财务人员的需求。角色 `billing` 仅提供对与账单相关的信息的访问权限，确保财务人员可以查看必要的财务数据，而无需访问其他与业务相关的页面。

要设置和使用角色 `billing`，您可以使用以下命令创建它：

```sql
CREATE ROLE billing;
```

角色名称不区分大小写，因此 `billing` 和 `Billing` 被认为是相同的。有关设置和分配角色 `billing` 的详细步骤，请参阅 [授予财务人员访问权限](/guides/cloud/manage/costs#granting-access-to-finance-personnel)。

## 使用示例

此示例展示了基于角色的权限管理。最初，创建一个“writer”角色并授予权限。随后，这些权限被分配给用户“eric”，他继承了这些权限。最后，从角色中撤销权限，展示了它们对用户权限的影响。

```sql title='Example:'
-- 创建一个名为 'writer' 的新角色
CREATE ROLE writer;

-- 将 'default' schema 中所有对象的所有权限授予给角色 'writer'
GRANT ALL ON default.* TO ROLE writer;

-- 创建一个密码为 'abc123' 的新用户 'eric'
CREATE USER eric IDENTIFIED BY 'abc123';

-- 将角色 'writer' 授予给用户 'eric'
GRANT ROLE writer TO eric;

-- 显示授予给用户 'eric' 的权限
SHOW GRANTS FOR eric;

┌──────────────────────────────────────────────────┐
│                      Grants                      │
├──────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'eric'@'%' │
└──────────────────────────────────────────────────┘

-- 从角色 'writer' 中撤销 'default' schema 中所有对象的所有权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 显示授予给用户 'eric' 的权限
-- 由于已从角色中撤销权限，因此不显示任何权限
SHOW GRANTS FOR eric;
```
