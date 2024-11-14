---
title: Databend 许可
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 代码根据两种许可类型进行分发：

| 类型                | 描述                                                                                                                                                                                                                                                                                         |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Apache 2.0 许可证  | 基于 Apache 许可证的核心功能可以免费使用，并且完全开源。                                                                                                                                                                                                                       |
| Elastic 2.0 许可证 | * Elastic (免费) 功能可以免费使用。源代码在 Elastic 2.0 许可证限制下可供查看和修改。 <br/> * Elastic (付费) 功能需要企业许可证密钥才能访问。源代码在 Elastic 2.0 许可证限制下可供查看和修改。 | 

Databend 的核心功能可以免费使用。大多数核心功能基于宽松的 Apache 许可证授权。然而，位于 src/query/ee 和 src/meta/ee 目录下的特定功能受更严格的 Elastic 许可证约束。

要访问 Databend 企业功能，需要从 Databend 购买付费许可证，这些功能也受 Elastic 许可证约束。如需更多自定义许可选项，请随时[联系我们](https://www.databend.com/contact-us)。

:::note
您可以通过查看 [Databend 仓库](https://github.com/datafuselabs/databend) 中代码文件的头部来找到功能的许可证
:::

以下主题涵盖如何获取、设置和验证企业或试用许可证以访问 [企业功能](10-enterprise-features.md)。

## 获取许可证

所有 Databend 代码都包含在同一个二进制文件中。访问 Apache 和 Elastic (免费) 功能不需要许可证密钥。要访问 Elastic (付费) 功能，用户有两种选择：
* **企业许可证** 使您能够长期（一年或更长时间）使用 Databend 企业功能。要升级到企业许可证，请[联系销售](https://www.databend.com/contact-us)。
* **试用许可证** 使您能够免费试用 Databend 15 天，[联系我们](https://www.databend.com/contact-us) 获取您的试用许可证。

:::note
Databend Labs 鼓励非商业学术研究涉及 Databend。对于此类项目，请[联系我们](https://www.databend.com/contact-us) 获取可能的长期许可证)
:::

## 设置许可证

在以下示例中，我们假设您是 `root` 用户。然后使用 `SET GLOBAL SETTING` 命令设置许可证密钥：

```sql
SET GLOBAL enterprise_license='you enterprise license key';
```

## 验证许可证

要验证许可证，您可以使用管理过程 `CALL` 命令检查组织名称和到期日期信息。

```sql
call admin$license_info();
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
| license_issuer | license_type | organization       | issued_at                  | expire_at                  | available_time_until_expiry           |
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
| databend       | enterprise   | databend           | 2023-05-10 09:13:21.000000 | 2024-05-09 09:13:20.000000 | 11months 30days 2h 3m 31s 802ms 872us |
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
```

## 许可证常见问题

如果您有以下未涵盖的其他问题，请随时[联系我们](https://www.databend.com/contact-us)。
<DetailsWrap>

<details open>
  <summary>我可以在组织内部将 Databend 作为服务托管使用吗？</summary>
   <p></p>
   是的，员工和承包商可以在 Elastic 许可证下使用您内部的 Databend 实例作为服务，因为它是为此创建的。
   使用企业功能将始终需要许可证。
</details>

<details>
  <summary>为什么 Databend 为企业功能选择 Elastic 许可证 2.0？</summary>
   <p></p>
   Elastic 许可证 2.0 在开源价值和商业利益之间提供了良好的平衡。
   与其他许可证（如商业源代码许可证、自定义社区许可证）相比，Elastic 许可证 2.0 简单、简短且清晰。
   仅应用了三个限制：<br/>
   1. 不能将软件作为具有对功能/功能的实质性访问的托管或管理服务提供。<br/>
   2. 不能修改或规避许可证密钥功能或删除/模糊受保护的功能。<br/>
   3. 不能更改/删除/许可、版权或软件中许可方的商标声明。
</details>

<details>
  <summary>我想在我的软件中重用 Databend 项目的一些组件，该软件使用 AGPL 或其他开源许可证，这可能吗？</summary>
   <p></p>
   Databend 团队致力于支持开源社区，并愿意考虑将特定有用的内部组件提取为单独的项目，并为其提供自己的许可证，例如 APL。
</details>

<details>
  <summary>你能提供一些关于“将软件作为托管或管理服务提供给第三方”或不提供的示例吗？</summary>
   <p></p>

**我在我的分析 SaaS 产品中使用 databend 进行数据仪表板**

这在 ELv2 下是允许的。<br/><br/>

**我是一名分析工程师，为我的组织内部设置 Databend**

这在 ELv2 下是允许的，因为您没有将软件作为管理服务提供。<br/><br/>

**我是一家托管服务提供商，为我的客户运行 Databend**

如果您的客户不访问 Databend，这在 ELv2 下是允许的。如果您的客户作为您服务的一部分访问 Databend 的大部分功能，这可能不被允许。
</details>

</DetailsWrap>