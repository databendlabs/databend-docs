---
title: IAM 角色
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

# 为什么选择 IAM 角色

云原生的身份委托能力（如 AWS IAM Role、Azure Managed Identity、Google Service Account Federation 等）可以让 Databend Cloud 获取短期凭证，而无需接触长期 Access Key。这样既能把数据平面访问留在您的云账户内，又能让您始终掌控权限。

## 优势

- 无需长期密钥：短期凭证消除了泄露或轮换长期密钥的风险。
- 最小权限：精细化策略可确保 Databend Cloud 只访问您授权的桶和操作。
- 集中治理：继续通过既有 IAM 工作流进行审计、吊销和审批。
- 自动轮换：云厂商负责刷新令牌，团队变动也不会中断访问。

## 工作原理

当 Databend Cloud 支持团队提供您组织的受信主体信息后，您需要在自己的云账户中创建 IAM 角色或身份，授予访问对象存储所需的最小权限，并在信任策略中指定只允许 Databend Cloud 使用唯一的 External ID 来扮演该角色。此后 Databend Cloud 会按需假设该角色，使用短期凭证访问存储，并在会话结束后自动退出。

<IndexOverviewList />
