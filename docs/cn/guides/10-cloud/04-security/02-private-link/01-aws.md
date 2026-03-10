---
title: "通过 AWS PrivateLink 连接到 Databend Cloud"
sidebar_label: "AWS PrivateLink"
---

# 如何设置 AWS PrivateLink

1. 提供您计划连接到 Databend Cloud 的 AWS 账户 ID：

   例如：`123456789012`

2. 验证您的 VPC 设置

   ![VPC 设置](/img/cloud/privatelink/aws/vpc-settings.png)

   确保选中 `启用 DNS 解析` 和 `启用 DNS 主机名`。

3. 等待云管理员将您的账户添加到白名单，并获取要连接的集群服务名称：

   例如：`com.amazonaws.vpce.us-east-2.vpce-svc-0123456789abcdef0`

4. 准备一个打开 tcp 443 端口的安全组：

   ![安全组](/img/cloud/privatelink/aws/security-group.png)

5. 转到 AWS 控制台：

   https://us-east-2.console.aws.amazon.com/vpcconsole/home?region=us-east-2#Endpoints:

   单击 `创建终端节点`：

   ![创建终端节点按钮](/img/cloud/privatelink/aws/create-endpoint-1.png)

   ![创建终端节点表单](/img/cloud/privatelink/aws/create-endpoint-2.png)

   选择先前创建的安全组 `HTTPS`

   ![创建终端节点 SG](/img/cloud/privatelink/aws/create-endpoint-3.png)

   ![创建终端节点完成](/img/cloud/privatelink/aws/create-endpoint-4.png)

6. 等待云管理员批准您的连接请求：

   ![请求](/img/cloud/privatelink/aws/request.png)

7. 等待 PrivateLink 创建：

   ![创建](/img/cloud/privatelink/aws/creation.png)

8. 修改私有 DNS 名称设置：

   ![DNS 菜单](/img/cloud/privatelink/aws/dns-1.png)

   启用私有 DNS 名称：

   ![DNS 表单](/img/cloud/privatelink/aws/dns-2.png)

   等待更改生效。

9. 验证通过 PrivateLink 访问 Databend Cloud：

   ![验证 DNS](/img/cloud/privatelink/aws/verify-1.png)

   ![验证响应](/img/cloud/privatelink/aws/verify-2.png)

   网关域名已解析为 VPC 内部 IP 地址。

:::info
恭喜！您已成功通过 AWS PrivateLink 连接到 Databend Cloud。
:::
