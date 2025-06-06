---
title: Databend 许可证
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 代码通过两种许可证类型分发：

| 类型                      | 描述                                                                                                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apache 2.0 许可证 (Apache License 2.0) | Apache 许可证下的核心功能免费使用且完全开源。                                                                                                                                                       |
| Elastic 2.0 许可证 (Elastic License 2.0) | Elastic（免费）功能免费使用，源代码可在 Elastic 2.0 许可证限制下查看和修改。<br/>Elastic（付费）功能需要企业许可证密钥访问，源代码可在 Elastic 2.0 许可证限制下查看和修改。 |

Databend 的核心功能免费提供使用。大部分核心功能采用宽松的 Apache 许可证授权，但位于 `src/query/ee` 和 `src/meta/ee` 目录的特定功能受更严格的 Elastic 许可证约束。

要访问 Databend 企业版功能，需从 Databend 获取付费许可证，这些功能同样受 Elastic 许可证约束。如需其他自定义许可选项，请随时[联系我们](https://www.databend.com/contact-us)。

:::note
您可通过查看 [Databend 仓库](https://github.com/databendlabs/databend) 中代码文件的头部获取功能许可证信息。
:::

以下主题介绍如何获取、设置和验证企业或试用许可证以访问[企业功能](10-enterprise-features.md)。

## 获取许可证

所有 Databend 代码均包含在同一个二进制文件中。访问 Apache 和 Elastic（免费）功能无需许可证密钥。要访问 Elastic（付费）功能，用户有两种选择：

- **企业许可证**：支持长期使用 Databend 企业版功能（一年或更久）。升级请[联系销售](https://www.databend.com/contact-us)。
- **试用许可证**：提供 15 天免费试用，请[联系我们](https://www.databend.com/contact-us)获取。

:::note
Databend Labs 鼓励涉及 Databend 的非商业学术研究。此类项目请[联系我们](https://www.databend.com/contact-us)获取可能的长期许可证。
:::

## 设置许可证

以下示例假设您为 `root` 用户。使用 `SET GLOBAL SETTING` 命令设置许可证密钥：

```sql
SET GLOBAL enterprise_license='you enterprise license key';
```

## 验证许可证

通过管理程序 `CALL` 命令验证许可证，检查组织名称及到期日期信息：

```sql
call admin$license_info();
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
| license_issuer | license_type | organization       | issued_at                  | expire_at                  | available_time_until_expiry           |
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
| databend       | enterprise   | databend           | 2023-05-10 09:13:21.000000 | 2024-05-09 09:13:20.000000 | 11months 30days 2h 3m 31s 802ms 872us |
+----------------+--------------+--------------------+----------------------------+----------------------------+---------------------------------------+
```

## 许可证常见问题

如有其他未涵盖问题，请随时[联系我们](https://www.databend.com/contact-us)。
<DetailsWrap>

<details open>
  <summary>是否可在组织内部托管 Databend 作为服务供内部使用？</summary>
   <p></p>
   可以。自 Elastic 许可证创建以来，员工和承包商可将内部 Databend 实例用作服务。使用企业功能始终需许可证。
</details>

<details>
  <summary>为何 Databend 为企业功能选择 Elastic License 2.0？</summary>
   <p></p>
   Elastic License 2.0 在开源价值与商业利益间实现良好平衡。相较于 Business Source License 或 Custom Community License 等方案，其条款更简洁清晰，仅包含三项限制：<br/>
1. 不得将软件作为托管或管理服务提供，并开放核心功能访问权限。<br/>
2. 不得修改或绕过许可证密钥功能，或移除/隐藏受保护功能。<br/>
3. 不得篡改或删除软件中的许可方版权、商标声明。
</details>

<details>
  <summary>是否可在 AGPL 或其他开源许可的软件中复用 Databend 组件？</summary>
   <p></p>
   Databend 团队支持开源社区，并考虑将通用内部组件（如 APL）提取为独立许可项目。
</details>

<details>
  <summary>能否举例说明“向第三方提供托管或管理服务”的界定标准？</summary>
   <p></p>

**在分析 SaaS 产品中使用 Databend 构建数据仪表盘**

ELv2 允许此场景。<br/><br/>

**作为分析工程师为组织内部部署 Databend**

ELv2 允许此场景，因未提供托管服务。<br/><br/>

**作为托管服务提供商为客户运行 Databend**

若客户不直接访问 Databend，则 ELv2 允许；若客户通过服务访问 Databend 核心功能，则可能违反许可。

</details>

</DetailsWrap>