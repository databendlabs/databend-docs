---
title: 组织与成员
---

本主题介绍了 Databend Cloud 中组织及其成员的概念。

## 理解组织

组织是 Databend Cloud 中的一个重要概念。Databend Cloud 中的所有用户、数据库、计算集群和其他对象都与某个组织相关联。组织是用于管理用户及其资源的群组。

在 Databend Cloud 的组织中，数据和资源在组织的所有用户之间共享。用户可以通过利用云原生特性相互协作，有效地管理和分析组织的数据。

请注意，数据不会在组织之间共享，如果您的公司在 Databend Cloud 中拥有多个组织，这些组织也无法合并。

### 创建组织

当您在注册过程中提供组织名称时，您就在 Databend Cloud 中创建了一个组织，您的账户将作为管理员账户。您还需要为新组织选择定价计划、云提供商和区域。更多信息请参见 [快速入门](../01-getting-started.md)。

![](@site/static/img/documents/getting-started/01.jpg)

:::tip
如果您被已经属于 Databend Cloud 中某个组织的用户邀请，文本框将显示该组织的名称。在这种情况下，您无法创建另一个组织。
:::

### 切换到其他组织

如果您是已接受来自多个组织邀请的 Databend Cloud 用户，您可以通过点击页面左上角的组织名称并选择要切换到的组织来在这些组织之间切换。

![Alt text](@site/static/img/documents/overview/switch-org.gif)

## 管理成员

要查看组织中的所有成员，请转到 **管理** > **用户 & 角色**。此页面提供所有成员的列表，包括他们的电子邮件地址、角色、加入时间和最后活跃时间。如果您是 `account_admin`，您还可以更改成员的角色或从组织中移除成员。

- 列出的角色显示用户被邀请时分配给他们的角色。虽然这些角色可以在页面上更改，但无法使用 SQL 撤销。但是，您可以授予额外的角色，或先将权限授予角色再将角色授予用户。这些由电子邮件地址标识的用户账户也可以在 Databend Cloud 中作为 SQL 用户使用。示例：

  ```sql
  GRANT SELECT ON *.* TO ROLE writer;
  GRANT ROLE writer to 'eric@databend.com';
  ```

- 该页面不显示使用 SQL 创建的用户。要查看已创建的 SQL 用户 ([**CREATE USER**](/sql/sql-commands/ddl/user/user-create-user)、[**CREATE ROLE**](/sql/sql-commands/ddl/user/user-create-role))，请使用 [SHOW USERS](/sql/sql-commands/ddl/user/user-show-users) 命令。

### 邀请新成员

要邀请新成员加入您的组织，请导航到 **管理** > **用户 & 角色** 页面并点击 **邀请新成员**。在出现的对话框中，输入用户的电子邮件地址并从列表中选择一个角色。此列表包括内置角色和为您的组织创建的任何自定义角色。有关角色的更多信息，请参见 [角色](/guides/security/access-control/roles)。

邀请邮件将发送给被邀请的用户。邮件中将包含一个链接，用户可以点击该链接启动注册流程。

![Alt text](@site/static/img/documents/overview/invitecn.png)

![Alt text](@site/static/img/documents/overview/invitecn2.png)

:::note

- 邀请新成员加入组织是仅限于 account_admin 角色的权限。

- 如果您的组织使用试用计划，最多允许一个用户。在这种情况下，您将无法邀请其他成员。
  :::
