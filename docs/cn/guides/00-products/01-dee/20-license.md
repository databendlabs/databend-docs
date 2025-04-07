---
title: Databend 授权
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 代码通过两种许可类型分发：

| 类型                | 描述                                                                                                                                                                                                                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apache 2.0 许可  | Apache 许可下的核心功能可以免费使用，并且完全开源。                                                                                                                                                                                                                                                        |
| Elastic 2.0 许可 | _ Elastic (免费) 功能可以免费使用。源代码可以在 Elastic 2.0 许可限制下查看和修改。<br/> _ Elastic (付费) 功能需要企业许可密钥才能访问。源代码可以在 Elastic 2.0 许可限制下查看和修改。 |

Databend 的核心功能可以免费使用。大多数核心功能都获得了宽松的 Apache 许可。但是，位于 src/query/ee 和 src/meta/ee 目录中的特定功能受更严格的 Elastic 许可的约束。

要访问 Databend 企业版功能，需要从 Databend 购买付费许可，并且这些功能也受 Elastic 许可的约束。如需其他自定义许可选项，请随时[联系我们](https://www.databend.com/contact-us)。

:::note
您可以通过查看 [Databend 存储库](https://github.com/databendlabs/databend) 下的代码文件的标头来查找功能的许可证
:::

以下主题介绍了如何获取、设置和验证企业或试用许可证以访问 [企业功能](10-enterprise-features.md)。

## 获取许可证

所有 Databend 代码都包含在同一个二进制文件中。访问 Apache 和 Elastic (免费) 功能不需要许可证密钥。要访问 Elastic (付费) 功能，用户有两种选择：

- **企业许可证** 使您能够更长时间地使用 Databend 企业版功能（一年或更长时间）。要升级到企业许可证，请[联系销售](https://www.databend.com/contact-us)。
- **试用许可证** 使您可以免费试用 Databend 15 天，[联系我们](https://www.databend.com/contact-us) 以获取您的试用许可证。

:::note
Databend Labs 鼓励涉及 Databend 的非商业学术研究。对于此类项目，请[联系我们](https://www.databend.com/contact-us) 以获取可能的长期许可证）
:::

## 设置许可证

在以下示例中，我们假设您是 `root` 用户。然后使用 `SET GLOBAL SETTING` 命令设置许可证密钥：

```sql
SET GLOBAL enterprise_license='you enterprise license key';
```

## 验证许可证

要验证许可证，您可以使用 admin procedure `CALL` 命令来检查组织名称和到期日期信息。

```sql
call admin$license_info();
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
| license_issuer | license_type | organization       | issued_at                  | expire_at                  | available_time_until_expiry           |
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
| databend       | enterprise   | databend           | 2023-05-10 09:13:21.000000 | 2024-05-09 09:13:20.000000 | 11months 30days 2h 3m 31s 802ms 872us |
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
```

## 许可证常见问题解答

如果您有以下未涵盖的任何其他问题，请随时[联系我们](https://www.databend.com/contact-us)。
<DetailsWrap>

<details open>
  <summary>我可以在我的组织内部托管 Databend 作为服务吗？</summary>
   <p></p>
   可以，员工和承包商可以使用您的内部 Databend 实例作为 Elastic 许可下的服务，因为它已创建。
使用企业版功能始终需要许可证。
</details>

<details>
  <summary>为什么 Databend 为企业版功能选择 Elastic License 2.0？</summary>
   <p></p>
   Elastic License 2.0 在开源价值和商业利益之间提供了良好的平衡。
与其他许可证（如 Business Source License、Custom Community License）相比，Elastic License 2.0 简单、简短且清晰。
仅应用三个限制：<br/>
1. 不能提供软件作为托管或管理的服务，并能大量访问功能/特性。<br/>
2. 不能修改或规避许可证密钥功能，也不能删除/模糊受保护的功能。<br/>
3. 不能更改/删除/许可软件中许可方拥有的版权或商标声明。
</details>

<details>
  <summary>我想在我的软件中重用 Databend 项目中的一些组件，该软件使用 Agpl 或其他开源许可证，这可能吗？</summary>
   <p></p>
   Databend 团队致力于支持开源社区，并愿意考虑提取通常有用的特定内部组件，作为一个单独的项目，并使用自己的许可证，例如 APL。
</details>

<details>
  <summary>您能否提供一些关于什么符合“将软件作为托管或管理的服务提供给第三方”或不符合的示例？</summary>
   <p></p>

**我正在我的分析 SaaS 产品上使用 databend 进行数据仪表板**

ELv2 允许这样做。<br/><br/>

**我是一名分析工程师，正在为我的组织设置 Databend 以供内部使用**

ELv2 允许这样做，因为您没有将软件作为托管服务提供。<br/><br/>

**我是一家为客户运行 Databend 的管理服务提供商**

如果您的客户无法访问 Databend，则 ELv2 允许这样做。如果您的客户可以访问 Databend 的大部分功能作为您服务的一部分，则可能不允许这样做。

</details>

</DetailsWrap>