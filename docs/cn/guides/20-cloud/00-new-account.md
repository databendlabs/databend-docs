---
title: 入门指南
---

<!-- #ifendef -->

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本主题概述了申请测试访问权限和注册 Databend Cloud 账号的步骤。

:::tip
Databend Cloud 完全支持各种流行的浏览器，包括 Chrome、Microsoft Edge、Firefox、Opera 和 Safari。

- Databend Cloud 建议将您的浏览器升级到最新版本。
- Databend Cloud 不支持 Internet Explorer。
  :::

## 申请测试访问权限

要申请 Databend Cloud 的测试访问权限，请访问 https://www.databend.com/apply 并提交申请表。一旦您的申请获得批准，您将收到一封包含注册链接的电子邮件。请检查您的收件箱，并使用电子邮件中的链接完成账号注册过程。

您还可以从 [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-6dvshjlbds7b6) 订阅 Databend Cloud。有关如何操作的说明，请观看以下视频教程：

<iframe width="853" height="505" className="iframe-video" src="https://www.youtube.com/embed/EqxEfzOXDYg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

## 创建 Databend Cloud 账号

当您被邀请加入 Databend Cloud 时，您会收到一封邀请电子邮件。点击电子邮件中的链接以开始注册过程。

<StepsWrap>
<StepContent number="1">

### 设置您的账号

- **组织名称**：如果组织名称文本框为空，请输入您的组织名称。通过这样做，您将使用您的账号作为管理员账号为您的组织注册。如果您被已经属于 Databend Cloud 中某个组织的用户邀请，文本框将显示该组织的名称，并且您无法编辑它。

![image](@site/static/img/documents/getting-started/01.jpg)
</StepContent>
<StepContent number="2">

### 选择云提供商和区域

请注意，此步骤仅对注册其组织的用户可见。完成设置后，点击 **创建** 以进入 Databend Cloud。

- **云提供商**：Databend Cloud 目前运行在 AWS 上，未来版本将支持 Microsoft Azure 和 Google Cloud Platform。Databend Cloud 在前端几乎在任何云上都以相同的方式工作。如果您已经在使用其中一个云，请选择该云。

- **区域**：区域决定了您的 Databend Cloud 将托管在何处。根据您的地理位置和业务需求选择区域。例如，如果您需要将 Databend Cloud 托管在亚洲，请选择亚洲的区域。请注意，可用区域因您选择的云提供商而异。
  :::

![image](@site/static/img/documents/getting-started/02.jpg)
</StepContent>
</StepsWrap>

<!-- #endendef -->

<!-- #ifcndef -->
要开通 Databend Cloud 服务，您需要先获取 Databend Cloud，然后创建一个 Databend Cloud 账号。

## 获取 Databend Cloud

您可以通过以下方式获取 Databend Cloud：

- 在 [Databend Cloud 官网](https://www.databend.cn/)直接注册
- 在[阿里云市场](https://www.aliyun.com/search?k=%E4%BA%91%E5%8E%9F%E7%94%9F%E6%95%B0%E6%8D%AE%E4%BB%93%E5%BA%93%20Databend%20Cloud&scene=market)购买 Databend Cloud
- 在[腾讯云市场](https://market.cloud.tencent.com/products/40683?keyword=databend)购买 Databend Cloud

需要注意的是，以上几种方式的付费方式略有差异，详情请参考[定价与计费](../00-overview/00-editions/02-dc/03-pricing.md)。

### 在 Databend Cloud 官网直接注册

请访问 [https://app.databend.cn/register](https://app.databend.cn/register)，并在如下注册页面输入您的电子邮件地址：

![Alt text](@site/static/img/documents_cn/getting-started/register.png)

您会收到一封包含注册账号链接的邮件。请留意您的信箱，并通过邮件中的链接开始创建 Databend Cloud 账号，创建过程请参考[创建 Databend Cloud 账号](#创建-databend-cloud-账号)。

### 在阿里云市场购买 Databend Cloud

您可以在阿里云市场免费开通 Databend Cloud。开通步骤如下：

1. 打开[阿里云市场](https://www.aliyun.com/search?k=%E4%BA%91%E5%8E%9F%E7%94%9F%E6%95%B0%E6%8D%AE%E4%BB%93%E5%BA%93%20Databend%20Cloud&scene=market)，并搜索关键字“databend cloud”。

2. 找到“云原生数据仓库 Databend Cloud”后，点击“立即开通”。

![Alt text](@site/static/img/documents/getting-started/aliyun-buy.png)

3. 选择同意相关协议，然后点击“开通”。

![Alt text](@site/static/img/documents/getting-started/aliyun-agree.png)

4. 点击“确定”。

![Alt text](@site/static/img/documents/getting-started/aliyun-ok.png)

5. 在“阿里云管控中心”>“云市场”>“已购买的服务”找到 Databend Cloud。

![Alt text](@site/static/img/documents/getting-started/activate-1.png)

6. 点击“免登”进入账号关联页面，选择“创建新的 Databend Cloud 账号”并输入您的邮箱后点击“发送”。

![Alt text](@site/static/img/documents/getting-started/activate-2.jpg)

7. 收到注册邮件后，点击注册链接开始创建 Databend Cloud 账号，创建过程请参考[创建 Databend Cloud 账号](#创建-databend-cloud-账号)。

:::tip
注册并完成绑定后，在阿里云后台点击“免登”可以自动连接到 Databend Cloud 平台。
:::

### 在腾讯云市场购买 Databend Cloud

您可以在腾讯云市场开通 Databend Cloud。开通步骤如下：

1. 打开[腾讯云市场](https://market.cloud.tencent.com/products/40683?keyword=databend)，并搜索关键字“databend cloud”。

2. 找到“Databend Cloud”后，点击“立即购买”，并根据指引完成支付（注册完成后，此处支付的 100 元将充值到您的 Databend Cloud 账户）。

![Alt text](@site/static/img/documents/getting-started/tencent-market.png)

3. 在腾讯云控制台，选择“已购买产品和服务”，找到 Databend Cloud，然后点击“管理”。

![Alt text](@site/static/img/documents/getting-started/tencent-manage.png)

4. 在打开的页面中，点击“免登地址”的链接开始创建 Databend Cloud 账号。创建过程请参考[创建 Databend Cloud 账号](#创建-databend-cloud-账号)。

![Alt text](@site/static/img/documents/getting-started/tencent-address.png)

## 创建 Databend Cloud 账号

根据不同的开通方式，创建 Databend Cloud 账号的步骤略有不同：

- 在阿里云市场开通服务的用户除以下步骤外，还需设置个人或企业主体信息，请根据指引操作。
- 请在 Databend Cloud 官网开通服务的用户在账号创建完成后，尽快根据指引完成认证，以获取更多权益。

创建 Databend Cloud 账号的步骤如下：

1. 按照屏幕上的指示来设置您的账号。

![Alt text](@site/static/img/documents_cn/getting-started/01.png)

2. 设置成功后，点击“登入”，然后输入您的邮箱和密码登录。

![Alt text](@site/static/img/documents_cn/getting-started/01-2.png)

3. 选择云提供商和地区。请注意，此步骤仅对注册其组织的用户可见。完成设置后，点击“创建”。

![Alt text](@site/static/img/documents_cn/getting-started/02.png)
<!-- #endcndef -->