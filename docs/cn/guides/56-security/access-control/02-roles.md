---
title: 角色
---

在 Databend 中，角色在简化权限管理方面扮演着关键角色。当多个用户需要相同的权限集时，逐个授予权限可能会很繁琐。角色提供了一个解决方案，允许将一组权限分配给一个角色，然后可以轻松地将该角色分配给多个用户。

:::note
目前，Databend 默认不对用户定义函数（UDFs）和阶段强制执行基于角色的访问控制（RBAC）检查。但是，如果您需要对这些对象进行 RBAC，可以选择通过手动设置 `SET GLOBAL enable_experimental_rbac_check=1` 来全局启用它。

如果未手动将 `enable_experimental_rbac_check` 设置为 `1`，UDFs 和阶段将不带 RBAC 限制运行。换句话说，用户将不受限制地执行 UDFs 和访问阶段中的数据，而无需经过 RBAC 权限检查。
:::

![Alt text](/img/guides/access-control-3.png)

## 继承角色与建立层级

角色授予使得一个角色可以继承另一个角色的权限和职责。这有助于创建一个灵活的层级结构，类似于组织结构，其中存在两个[内置角色](#内置角色)：最高的是 `account-admin`，最低的是 `public`。

考虑一个场景，创建了三个角色：*manager*、*engineer* 和 *intern*。在这个例子中，*intern* 角色被授予给 *engineer* 角色。因此，*engineer* 不仅拥有自己的权限集，还继承了与 *intern* 角色相关的权限。进一步扩展这个层级，如果 *engineer* 角色被授予给 *manager*，那么 *manager* 现在将获得 *engineer* 和 *intern* 角色的固有权限。

![Alt text](/img/guides/access-control-4.png)

## 内置角色

Databend 自带以下内置角色：

| 内置角色      | 描述                                                                                                                            |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------|
| account-admin | 拥有所有权限，作为所有其他角色的父角色，并允许在租户内无缝切换到任何角色。 |
| public        | 不继承任何权限，将所有角色视为其父角色，并允许任何角色切换到公共角色。                    |

要在 Databend Cloud 中将 `account-admin` 角色分配给用户，请在邀请用户时选择该角色。您也可以在用户加入后为其分配角色。如果您使用的是 Databend 社区版或企业版，请在部署期间首先配置一个 `account-admin` 用户，然后根据需要将角色分配给其他用户。有关配置管理员用户的更多信息，请参阅[配置管理员用户](../../10-deploy/04-references/01-admin-users.md)。

## 设置默认角色

当一个用户被授予多个角色时，您可以使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 或 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令为用户设置默认角色。默认角色决定了在会话开始时自动分配给用户的角色：

```sql title='示例:'
-- 显示系统中现有的角色
SHOW ROLES;

┌───────────────────────────────────────────────────────────┐
│      name     │ inherited_roles │ is_current │ is_default │
├───────────────┼─────────────────┼────────────┼────────────┤
│ account_admin │               0 │ true       │ true       │
│ public        │               0 │ false      │ false      │
│ writer        │               0 │ false      │ false      │
└───────────────────────────────────────────────────────────┘

-- 创建一个用户 'eric'，密码为 'abc123'，并将 'writer' 设置为默认角色
CREATE USER eric IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'writer';

-- 将 'account_admin' 角色授予用户 'eric'
GRANT ROLE account_admin TO eric;

-- 将 'account_admin' 设置为用户 'eric' 的默认角色
ALTER USER eric WITH DEFAULT_ROLE = 'account_admin';
```

- 用户可以在会话中灵活切换到其他角色，使用 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令。
- 用户可以通过使用 [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) 命令查看他们当前的角色并查看所有授予他们的角色。
- 如果您没有明确为用户设置默认角色，Databend 将默认使用内置角色 `public` 作为默认角色。

## 活动角色与次要角色

在 Databend 中，一个用户可以被授予多个角色。这些角色分为活动角色和次要角色：

- 活动角色是用户当前会话中的主要角色，可以使用 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令设置。

- 次要角色是提供额外权限的附加角色，默认情况下是活动的。用户可以使用 [SET SECONDARY ROLES](/sql/sql-commands/ddl/user/user-set-2nd-roles) 命令激活或停用次要角色，以临时调整其权限范围。

## 计费角色

除了标准的内置角色外，您可以在 Databend Cloud 中创建一个名为 `billing` 的自定义角色，专门满足财务人员的需求。角色 `billing` 仅提供对计费相关信息的访问权限，确保财务人员可以查看必要的财务数据，而不会暴露于其他业务相关页面。

要设置和使用角色 `billing`，可以使用以下命令创建它：

```sql
CREATE ROLE billing;
```
角色名称不区分大小写，因此 `billing` 和 `Billing` 被视为相同。有关设置和分配角色 `billing` 的详细步骤，请参阅[授予财务人员访问权限](/guides/cloud/manage/costs#granting-access-to-finance-personnel)。

## 使用示例

此示例展示了基于角色的权限管理。首先，创建一个 'writer' 角色并授予权限。随后，这些权限被分配给用户 'eric'，用户继承了这些权限。最后，从角色中撤销权限，展示了这对用户权限的影响。

```sql title='示例:'
-- 创建一个名为 'writer' 的新角色
CREATE ROLE writer;

-- 将 'default' 模式中所有对象的所有权限授予角色 'writer'
GRANT ALL ON default.* TO ROLE writer;

-- 创建一个名为 'eric' 的新用户，密码为 'abc123'
CREATE USER eric IDENTIFIED BY 'abc123';

-- 将角色 'writer' 授予用户 'eric'
GRANT ROLE writer TO eric;

-- 显示用户 'eric' 的授予权限
SHOW GRANTS FOR eric;

┌──────────────────────────────────────────────────┐
│                      Grants                      │
├──────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO 'eric'@'%' │
└──────────────────────────────────────────────────┘

-- 从角色 'writer' 撤销 'default' 模式中所有对象的所有权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 显示用户 'eric' 的授予权限
-- 没有权限显示，因为它们已从角色中撤销
SHOW GRANTS FOR eric;
```