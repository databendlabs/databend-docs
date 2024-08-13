---
title: 组织与成员
---

本主题解释了 Databend Cloud 中组织及其成员的概念。

## 理解组织

组织是 Databend Cloud 中的一个基本概念。Databend Cloud 中的所有用户、数据库、仓库和其他对象都与一个组织相关联。组织是一个用于管理用户及其资源的群组。

在 Databend Cloud 的组织中，数据和资源在所有用户之间共享。用户可以利用云原生功能相互协作，有效管理和分析组织的数据。

请注意，Databend Cloud 中的每个组织都有自己的定价计划和计费设置。数据不会在组织之间共享，如果您的公司在 Databend Cloud 中拥有多个组织，这些组织也不能合并。

### 创建组织

当您在注册过程中提供一个组织名称时，您将使用您的账户作为管理员账户在 Databend Cloud 中创建一个组织。您还需要为新组织选择一个定价计划、云提供商和区域。更多信息，请参阅[激活 Databend Cloud](../00-new-account.md)。

![](@site/static/img/documents/getting-started/01.jpg)

:::tip
如果您被已经是 Databend Cloud 中某个组织成员的用户邀请，文本框将显示该组织的名称。在这种情况下，您不能创建另一个组织。
:::

### 切换到另一个组织

如果您是 Databend Cloud 用户，并且接受了来自多个组织的邀请，您可以通过点击页面左上角的组织名称并选择要切换到的组织来在这些组织之间切换。

![Alt text](@site/static/img/documents/overview/switch-org.gif)

### 管理组织设置

您必须被分配为管理员角色才能管理组织设置。组织设置页面仅对组织的管理员用户可见。要进入组织设置页面，请点击左侧边栏中的设置图标，然后点击 **Organization**。

组织设置页面显示了组织的当前设置。您可以在该页面上更改以下设置：

- 组织的显示名称

- 组织的显示标识符（Slug）：当创建组织时，Databend Cloud 会生成并使用一个短的随机字符串作为组织标识符。最佳实践是将其更改为您公司的名称，以便识别您公司在 Databend Cloud 中的资源地址。例如，如果您将其设置为 `tpl`，您的数据库 URL 将是 `https://app.databend.com/tpl/data/databases/<database_name>`。

## 理解成员

要查看组织中的所有成员，请转到 **Manage** > **Members**。此页面提供所有成员的列表，包括他们的电子邮件地址、角色、加入时间和最后活动时间。如果您是 `account_admin`，您还可以更改成员的角色或将成员从您的组织中移除。

- 列出的角色显示了用户在被邀请时分配的角色。虽然这些角色可以在页面上更改，但不能使用 SQL 撤销。但是，您可以根据用户的电子邮件地址授予他们额外的角色或权限。这些由电子邮件地址标识的用户账户也可以作为 Databend Cloud 中的 SQL 用户。示例：

    ```sql
    GRANT ROLE writer to 'eric@databend.com';
    GRANT SELECT ON *.* TO 'eric@databend.com';
    ```

- 该页面不显示使用 SQL 创建的用户。要查看已创建的 SQL 用户，请使用 [SHOW USERS](/sql/sql-commands/ddl/user/user-show-users) 命令。

### 邀请新成员

要邀请新成员加入您的组织，请导航到 **Manage** > **Members** 页面并点击 **Invite New Member**。在出现的对话框中，输入用户的电子邮件地址并从列表中选择一个角色。该列表包括内置角色和为您的组织创建的任何角色。有关角色的更多信息，请参阅[角色](/guides/security/access-control/roles)。

邀请电子邮件将发送给被邀请的用户。在电子邮件中，将有一个链接，用户可以点击该链接来启动注册过程。

:::note
- 邀请新成员加入组织是仅限于 `account_admin` 角色的特权。

- 如果您的组织处于试用计划下，它最多允许一个用户。在这种情况下，您将无法邀请更多成员。
:::