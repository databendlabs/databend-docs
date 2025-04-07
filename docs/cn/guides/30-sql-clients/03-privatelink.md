```md
---
title: "通过 AWS PrivateLink 连接到 Databend Cloud"
sidebar_label: "AWS PrivateLink"
---

# 为什么选择 PrivateLink

通过 AWS PrivateLink 连接到 Databend Cloud 提供了一种安全且私密的方式来访问 Databend Cloud 服务，而无需经过公共互联网。

通过利用 AWS PrivateLink，您可以在您的 Virtual Private Cloud (VPC) 和 Databend Cloud 之间建立私有连接，确保您的数据保留在您的 VPC 边界内，并且不会暴露于互联网。此设置增强了数据的安全性，并最大限度地降低了未经授权访问的风险。

要使用 AWS PrivateLink 连接到 Databend Cloud，您需要在 VPC 中配置一个 VPC 终端节点。此终端节点充当代理，允许流量在您的 VPC 和 Databend Cloud 之间安全地流动。VPC 终端节点在您的 VPC 中具有私有 IP 地址，并有助于与 Databend Cloud 服务进行直接通信。

建立 VPC 终端节点后，您可以使用私有 IP 地址安全地访问 Databend Cloud 服务，例如数据存储、数据处理和分析工具。这确保了您的数据保留在 VPC 的安全边界内，从而提供额外的保护层。

# 如何设置 AWS PrivateLink

1. 提供您计划连接到 Databend Cloud 的 AWS 账户 ID：

   例如：`952853449216`

2. 验证您的 VPC 设置

   ![VPC 设置](/img/cloud/privatelink/vpc-settings.png)

   确保选中 `启用 DNS 解析` 和 `启用 DNS 主机名`。

3. 等待云管理员将您的帐户添加到白名单，并获取要连接的集群的服务名称：

   - `com.amazonaws.vpce.us-east-2.vpce-svc-0e494364a37d35445` (aws, us-east-2, white)
   - `com.amazonaws.vpce.us-east-1.vpce-svc-0d9cd5a4a7c19796f` (aws, us-east-1, ivory)

4. 准备一个打开 tcp 443 端口的安全组：

   ![安全组](/img/cloud/privatelink/security-group.png)

5. 转到 AWS 控制台：

   https://us-east-2.console.aws.amazon.com/vpcconsole/home?region=us-east-2#Endpoints:

   单击 `创建终端节点`：

   ![创建终端节点按钮](/img/cloud/privatelink/create-endpoint-1.png)

   ![创建终端节点表单](/img/cloud/privatelink/create-endpoint-2.png)

   选择先前创建的安全组 `HTTPS`

   ![创建终端节点 SG](/img/cloud/privatelink/create-endpoint-3.png)

   ![创建终端节点完成](/img/cloud/privatelink/create-endpoint-4.png)

6. 等待云管理员批准您的连接请求：

   ![请求](/img/cloud/privatelink/request.png)

7. 等待 PrivateLink 创建：

   ![创建](/img/cloud/privatelink/creation.png)

8. 修改私有 DNS 名称设置：

   ![DNS 菜单](/img/cloud/privatelink/dns-1.png)

   启用私有 DNS 名称：

   ![DNS 表单](/img/cloud/privatelink/dns-2.png)

   等待更改生效。

9. 验证通过 PrivateLink 访问 Databend Cloud：

   ![验证 DNS](/img/cloud/privatelink/verify-1.png)

   ![验证响应](/img/cloud/privatelink/verify-2.png)

   网关域名已解析为 VPC 内部 IP 地址。

:::info
恭喜！您已成功通过 AWS PrivateLink 连接到 Databend Cloud。
:::
```