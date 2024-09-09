---
title: 入门指南
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本主题概述了申请测试访问权限和注册 Databend Cloud 账户的步骤。

:::tip
Databend Cloud 完全支持各种流行的浏览器，包括 Chrome、Microsoft Edge、Firefox、Opera 和 Safari。

- Databend Cloud 建议将您的浏览器升级到最新版本。
- Databend Cloud 不支持 Internet Explorer。
:::

## 申请测试访问权限

要申请 Databend Cloud 的测试访问权限，请访问 https://www.databend.com/apply 并提交申请表。一旦您的申请获得批准，您将收到一封包含注册链接的电子邮件。请检查您的收件箱，并使用电子邮件中的链接完成账户注册过程。

您还可以从 [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-6dvshjlbds7b6) 订阅 Databend Cloud。有关如何操作的说明，请观看以下视频教程：

<iframe width="853" height="505" className="iframe-video" src="https://www.youtube.com/embed/EqxEfzOXDYg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

## 创建 Databend Cloud 账户

当您被邀请加入 Databend Cloud 时，您会收到一封邀请电子邮件。点击电子邮件中的链接以开始注册过程。

<StepsWrap>
<StepContent number="1">

### 设置您的账户

- **组织名称**：如果组织名称文本框为空，请输入您的组织名称。通过这样做，您将以管理员账户的身份为您的组织注册。如果您被已经是 Databend Cloud 中某个组织成员的用户邀请，文本框将显示该组织的名称，并且您无法编辑它。

![image](@site/static/img/documents/getting-started/01.jpg)
</StepContent>
<StepContent number="2">

### 选择云提供商和区域

请注意，此步骤仅对为组织注册的用户可见。完成设置后，点击 **创建** 以进入 Databend Cloud。

- **云提供商**：Databend Cloud 目前运行在 AWS 上，并将在未来的版本中支持 Microsoft Azure 和 Google Cloud Platform。Databend Cloud 在前端几乎在任何云上都以相同的方式工作。如果您已经在使用其中一个云，请选择该云。

- **区域**：区域决定了您的 Databend Cloud 将托管在何处。根据您的地理位置和业务需求选择区域。例如，如果您有在亚洲托管 Databend Cloud 的要求，请选择亚洲的区域。请注意，可用的区域因您选择的云提供商而异。

![image](@site/static/img/documents/getting-started/02.jpg)
</StepContent>
</StepsWrap>