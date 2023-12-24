---
title: 组织信息
---

## 什么是组织？

组织是 Databend Cloud 中的一个基本概念。Databend Cloud 中的所有用户、数据库、计算集群和其他对象都与组织关联。组织是用于管理用户及其资源的组。

在 Databend Cloud 的组织中，数据和资源能够在组织的所有用户之间共享。用户可以相互协作，利用云原生特性高效地管理和分析组织中的数据。

需要注意的是，Databend Cloud 中的每个组织都有自己的定价计划和计费设置。数据不会在组织间共享，如果贵公司在 Databend Cloud 中拥有多个组织，组织之间也无法进行合并。

## 创建组织

在注册过程中，您需要提供组织名称，此时将会在 Databend Cloud 中创建一个组织并以您的账号作为管理员账号。同时，您还需要选择定价计划、云提供商和区域。了解更多相关信息，请参考[开通 Databend Cloud](../00-new-account.md)。

![](@site/static/img/documents/getting-started/01.png)

:::tip
如果您收到的邀请来自于某个 Databend Cloud 中现有组织中的用户，则文本框将会显示该组织的名称。在这种情况下，您不能创建其他组织。
:::

## 切换组织

作为 Databend Cloud 用户，如果您接受了来自多个组织的邀请，您可以通过点击页面左上角的组织名称，然后选择其他组织来在这些组织之间进行切换。

![Alt text](@site/static/img/documents_cn/org-and-users/switch-org-cn.gif)

## 管理组织信息

必须为您分配管理员角色才能管理组织设置。“组织信息”页面仅对组织的管理员用户可见。要转到“组织信息”页面，请单击左侧边栏中的“管理”图标，然后单击“组织信息”。

“组织信息”页面将会显示组织的当前信息。您可以在该页面上更改以下信息：

- 组织显示名称。

- 组织 slug : 创建组织时，Databend Cloud 生成并使用一个简短的随机字符串作为组织代码。最佳实践是将其更改为公司名称，以便在 Databend Cloud 中标识公司资源的地址。例如，如果将其设置为 `tpl` ，则数据库的 URL 将会是 `https://app.databend.cn/tpl/data/databases/<database_name>` 。
