---
title: Databend 许可证
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 的代码根据两种许可证类型进行分发：

| 类型 | 描述 |
| --- | --- |
| Apache 2.0 许可证 (Apache 2.0 License) | Apache 许可证下的核心功能可免费使用且完全开源。 |
| Elastic 2.0 许可证 (Elastic 2.0 License) | _ Elastic（免费）功能可免费使用。源代码可在 Elastic 2.0 许可证的限制下查看和修改。<br/> _ Elastic（付费）功能需要企业版许可证密钥才能访问。源代码可在 Elastic 2.0 许可证的限制下查看和修改。 |

Databend 的核心功能可免费使用。大部分核心功能采用宽松的 Apache 许可证。然而，位于 `src/query/ee` 和 `src/meta/ee` 目录下的特定功能则受限制性更强的 Elastic 许可证管辖。

要访问 Databend 企业版（Enterprise）的功能，需要从 Databend 获取付费许可证，这些功能同样受 Elastic 许可证的约束。如需其他自定义许可证选项，请随时[联系我们](https://www.databend.com/contact-us)。

:::note
您可以通过查看 [Databend 仓库](https://github.com/databendlabs/databend) 中代码文件头部的许可证信息来确定具体功能的许可证类型。
:::

以下主题将介绍如何获取、设置和验证企业版或试用版许可证，以访问[企业版功能 (Enterprise Features)](10-enterprise-features.md)。

## 获取许可证

所有 Databend 代码都包含在同一个二进制文件中。访问 Apache 和 Elastic（免费）功能不需要许可证密钥。要访问 Elastic（付费）功能，用户有两种选择：

- **企业版许可证 (Enterprise License)**：使您能够长期（一年或更长时间）使用 Databend 企业版（Enterprise）的功能。要升级到企业版许可证，请[联系销售](https://www.databend.com/contact-us)。
- **试用版许可证 (Trial License)**：使您能够免费试用 Databend 15 天，请[联系我们](https://www.databend.com/contact-us)获取您的试用版许可证。

:::note
Databend Labs 鼓励涉及 Databend 的非商业性学术研究。对于此类项目，请[联系我们](https://www.databend.com/contact-us)以获取可能的长期许可证。
:::

## 设置许可证

在以下示例中，我们假设您是 `root` 用户。然后使用 `SET GLOBAL SETTING` 命令来设置许可证密钥：

```sql
SET GLOBAL enterprise_license='you enterprise license key';
```

## 验证许可证

要验证许可证，您可以使用管理过程 `CALL` 命令来检查组织名称和到期日期信息。

```sql
call admin$license_info();
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
| license_issuer | license_type | organization       | issued_at                  | expire_at                  | available_time_until_expiry           |
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
| databend       | enterprise   | databend           | 2023-05-10 09:13:21.000000 | 2024-05-09 09:13:20.000000 | 11months 30days 2h 3m 31s 802ms 872us |
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
```

## 许可证常见问题解答

如果您有以下未涵盖的其他问题，请随时[联系我们](https://www.databend.com/contact-us)。
<DetailsWrap>

<details open>
  <summary>我可以在我的组织内部将 Databend 作为服务托管以供内部使用吗？</summary>
   <p></p>
   可以，员工和承包商可以在 Elastic 许可证下将您的内部 Databend 实例作为服务使用。
使用企业版功能始终需要许可证。
</details>

<details>
  <summary>为什么 Databend 为企业版功能选择 Elastic License 2.0？</summary>
   <p></p>
   Elastic License 2.0 在开源价值和商业利益之间取得了良好的平衡。
与 Business Source License、Custom Community License 等其他许可证相比，Elastic License 2.0 简单、简短且清晰。
它仅有三个限制：<br/>
1. 不能将软件作为托管或管理服务提供，并让第三方实质性地访问其特性/功能。<br/>
2. 不能修改或规避许可证密钥功能，或移除/隐藏受保护的功能。<br/>
3. 不能更改/移除软件中许可方的许可、版权或商标声明。
</details>

<details>
  <summary>我想在我自己的软件中重用 Databend 项目的一些组件，而我的软件使用的是 AGPL 或其他开源许可证，这可能吗？</summary>
   <p></p>
   Databend 团队致力于支持开源社区，并愿意考虑将内部具有通用性的特定组件提取出来，作为一个拥有独立许可证（例如 APL）的独立项目。
</details>

<details>
  <summary>您能提供一些关于什么情况属于或不属于“将软件作为托管或管理服务提供给第三方”的例子吗？</summary>
   <p></p>

**我在我的分析型 SaaS 产品中使用 Databend 来构建数据仪表盘（Dashboard）**

这在 ELv2 下是允许的。<br/><br/>

**我是一名分析工程师，为我的组织搭建 Databend 供内部使用**

这在 ELv2 下是允许的，因为您没有将软件作为管理服务提供。<br/><br/>

**我是一家为客户运行 Databend 的托管服务提供商**

如果您的客户不直接访问 Databend，这在 ELv2 下是允许的。如果您的客户作为您服务的一部分，可以访问 Databend 的大部分功能，这可能是不被允许的。

</details>

</DetailsWrap>