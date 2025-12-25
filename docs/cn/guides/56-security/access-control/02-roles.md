---
title: 角色
---

角色在 Databend 的权限管理中起着关键作用。当多个用户需要相同的权限时，逐一授权会非常繁琐。通过角色，我们可以将一组权限打包，然后轻松地将其分配给多个用户。

![Alt text](/img/guides/access-control-3.png)

## 继承角色 & 建立层级结构

角色授予允许一个角色继承另一个角色的权限。这有助于构建灵活的层级结构（类似于组织架构）。Databend 主要包含两个[内置角色](#built-in-roles)：最高层级的 `account-admin` 和最低层级的 `public`。

假设我们创建了三个角色：_manager_、_engineer_ 和 _intern_。如果我们把 _intern_ 角色授予 _engineer_，那么 _engineer_ 不仅拥有自己的权限，还会继承 _intern_ 的权限。以此类推，如果把 _engineer_ 角色授予 _manager_，那么 _manager_ 将同时获得 _engineer_ 和 _intern_ 的所有权限。

![Alt text](/img/guides/access-control-4.png)

## 内置角色

Databend 附带以下内置角色：

| 内置角色      | 描述                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| account-admin | 拥有所有权限，是所有其他角色的父角色，可以无缝切换为租户内的任何角色。 |
| public        | 不继承任何权限，所有其他角色都是它的父角色。任何角色都可以切换为 public 角色。 |

在 Databend Cloud 中，您可以在邀请用户时直接分配 `account-admin` 角色，或者在用户加入后进行分配。如果您使用的是 Databend 社区版或企业版，请在部署时先配置好 `account-admin` 用户，然后再按需分配给其他用户。关于管理员用户的配置详情，请参阅[配置管理员用户](../../20-self-hosted/04-references/admin-users.md)。

## 设置默认角色

当用户拥有多个角色时，可以使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 或 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令设置默认角色。默认角色是用户登录会话时自动生效的角色：

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

- 用户可以在会话中使用 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令灵活切换角色。
- 用户可以使用 [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) 命令查看当前的活跃角色以及所有被授予的角色。
- 如果未显式设置默认角色，Databend 将默认使用内置角色 `public`。

## 激活角色 & 辅助角色

在 Databend 中，用户可以被授予多个角色。这些角色分为激活角色（Active Role）和辅助角色（Secondary Roles）：

- **激活角色**：用户当前会话中正在使用的主角色，可通过 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令进行切换。

- **辅助角色**：提供额外权限的角色，默认处于激活状态。用户可以使用 [SET SECONDARY ROLES](/sql/sql-commands/ddl/user/user-set-2nd-roles) 命令来启用或禁用这些角色，从而临时调整权限范围。

## 账单角色

除了标准的内置角色，Databend Cloud 还支持创建名为 `billing` 的自定义角色，专为财务人员设计。`billing` 角色仅拥有账单信息的访问权限，确保财务人员在查看财务数据时，无法访问其他业务页面。

要设置和使用 `billing` 角色，可以使用以下命令创建：

```sql
CREATE ROLE billing;
```

角色名称不区分大小写，`billing` 和 `Billing` 视为相同。关于该角色的设置和分配步骤，请参阅[授予财务人员访问权限](/guides/cloud/administration/costs#granting-access-to-finance-personnel)。

## 使用示例

此示例展示了基于角色的权限管理。首先创建一个 `writer` 角色并授予权限，然后将这些权限授予用户 `eric`，使其继承这些权限。最后，撤销角色的权限，演示其对用户权限的影响。

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
