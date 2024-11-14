---
title: Getting Started
---

<!-- #ifendef -->

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

This topic outlines the steps for applying for beta access and signing up for a Databend Cloud account.

:::tip
Databend Cloud fully supports various popular browsers, including Chrome, Microsoft Edge, Firefox, Opera, and Safari.

- Databend Cloud recommends upgrading your browser to the latest version.
- Databend Cloud does not support Internet Explorer.
  :::

## Applying for Beta Access

To apply for beta access to Databend Cloud, please visit https://www.databend.com/apply and submit the application form. Once your application has been approved, you will receive an email containing a registration link. Please check your inbox and use the link in the email to complete the account registration process.

You can also subscribe Databend Cloud from the [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-6dvshjlbds7b6). For instructions on how to do so, please watch the video tutorial below:

<iframe width="853" height="505" className="iframe-video" src="https://www.youtube.com/embed/EqxEfzOXDYg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

## Creating Databend Cloud Account

When you're invited to Databend Cloud, you receive an invitation email. Click the link in the email to start the signup process.

<StepsWrap>
<StepContent number="1">

### Set up your account

- **Organization name**: If the organization name textbox is empty, enter your organization name. By doing so, you're signing up for your organization with your account as an Admin account. If you're invited by a user who already belongs to an organization in Databand Cloud, the textbox will show that organization's name and you cannot edit it.

![image](@site/static/img/documents/getting-started/01.jpg)
</StepContent>
<StepContent number="2">

### Select cloud provider and region

Please note that this step is visible only to users who sign up for their organization. After you complete the setup, click **Create** to enter Databend Cloud.

- **Cloud provider**: Databend Cloud currently runs on AWS, and will support Microsoft Azure and Google Cloud Platform in a future release. Databend Cloud works almost the same from the front end on any of the clouds. If you already have been using one of the clouds, select that one.

- **Region**: The region decides where your Databend Cloud will be hosted. Select the region based on your locality and business needs. For example, if you have a requirement to have your Databend Cloud hosted in Asia, select a region of Asia. Please note that the available regions vary depending on the cloud provider you select.
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
