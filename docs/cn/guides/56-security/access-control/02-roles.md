---
title: 角色
---

在 Databend 中，角色对于简化权限管理起着至关重要的作用。当多个用户需要相同的权限集时，单独授予权限可能会变得繁琐。角色提供了一种解决方案，允许将一组权限分配给一个角色，然后可以轻松地将该角色分配给多个用户。

:::note
目前，Databend 默认不对用户定义函数（UDFs）和 Stage 执行基于角色的访问控制（RBAC）检查。但是，如果您需要对这些对象进行 RBAC，您可以选择通过手动设置`SET GLOBAL enable_experimental_rbac_check=1`来全局启用它。

如果未手动将`enable_experimental_rbac_check`设置为`1`，UDFs 和 Stage 将不受 RBAC 限制地运行。换句话说，用户将不受限制地执行 UDFs 和访问 Stage 内的数据，无需进行 RBAC 权限检查。
:::

![Alt text](/img/guides/access-control-3.png)

## 角色继承与建立层级

Databend 角色通过角色授予引入了一种强大的机制，使一个角色能够继承另一个角色的权限和责任。这有助于创建一个灵活的层级结构，类似于组织结构，其中存在两个[内置角色](#内置角色)：最高的是`account-admin`，最低的是`public`。

考虑这样一个场景，创建了三个角色：_经理_、*工程师*和*实习生*。在这个例子中，*实习生*角色被授予给*工程师*角色。因此，*工程师*不仅拥有自己的一组权限，还继承了与*实习生*角色相关的权限。进一步扩展这个层级，如果将*工程师*角色授予给*经理*，那么*经理*现在获得了*工程师*和*实习生*角色的固有权限。

![Alt text](/img/guides/access-control-4.png)

## 内置角色

Databend 附带以下内置角色：

| 内置角色      | 描述                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| account-admin | 拥有所有特权，作为所有其他角色的父角色，并允许在租户内无缝切换到任何角色。 |
| public        | 不继承任何权限，将所有角色视为其父角色，并允许任何角色切换到公共角色。     |

要在 Databend Cloud 中将`account-admin`角色分配给用户，请在邀请用户时选择该角色。您也可以在用户加入后分配该角色。如果您使用的是 Databend 社区版或企业版，请在部署期间首先配置`account-admin`用户，然后根据需要将角色分配给其他用户。有关配置管理用户的更多信息，请参阅[配置管理用户](../../10-deploy/04-references/01-admin-users.md)。

## 设置默认角色

当用户被授予多个角色时，您可以使用[CREATE USER](/sql/sql-commands/ddl/user/user-create-user)或[ALTER USER](/sql/sql-commands/ddl/user/user-alter-user)命令为用户设置默认角色。默认角色决定了会话开始时自动分配给用户的角色：

```sql title='示例：'
-- 显示系统中现有的角色
SHOW ROLES;

┌───────────────────────────────────────────────────────────┐
│      name     │ inherited_roles │ is_current │ is_default │
├───────────────┼─────────────────┼────────────┼────────────┤
│ account_admin │               0 │ true       │ true       │
│ public        │               0 │ false      │ false      │
│ writer        │               0 │ false      │ false      │
└───────────────────────────────────────────────────────────┘

-- 创建一个用户'eric'，密码为'abc123'，并将'writer'设置为默认角色
CREATE USER eric IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'writer';

-- 将'account_admin'角色授予用户'eric'
GRANT ROLE account_admin TO eric;

-- 将'account_admin'设置为用户'eric'的默认角色
ALTER USER eric WITH DEFAULT_ROLE = 'account_admin';
```

- 用户可以在会话中使用[SET ROLE](/sql/sql-commands/ddl/user/user-set-role)命令灵活切换到其他角色。
- 用户可以使用[SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles)命令检查其当前角色并查看授予他们的所有角色。
- 如果您没有明确为用户设置默认角色，Databend 将默认使用内置角色`public`作为默认角色。

## 活动角色与辅助角色

用户可以在 Databend 中被授予多个角色。这些角色分为活动角色和辅助角色：

- 活动角色是用户在会话中当前激活的主要角色，可以使用[SET ROLE](/sql/sql-commands/ddl/user/user-set-role)命令设置。

- 辅助角色是提供额外权限的附加角色，默认处于活动状态。用户可以使用[SET SECONDARY ROLES](/sql/sql-commands/ddl/user/user-set-2nd-roles)命令激活或停用辅助角色，以暂时调整其权限范围。

## 使用示例

此示例展示了基于角色的权限管理。最初，创建了一个'writer'角色并授予权限。随后，这些权限被分配给用户'eric'，他继承了这些权限。最后，从角色中撤销权限，展示了它们对用户权限的影响。

```sql title='示例：'
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

-- 从角色'writer'撤销'default'模式中所有对象的所有权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 显示用户'eric'被授予的权限
-- 没有显示权限，因为它们已从角色中撤销
SHOW GRANTS FOR eric;
```
