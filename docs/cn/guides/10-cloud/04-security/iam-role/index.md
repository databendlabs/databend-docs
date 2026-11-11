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

对于 AWS，在 Databend Cloud 控制台的**连接**对话框中复制 **Role ARN**。Databend Cloud 会为您的组织创建这个主体。标准配置流程不需要提交支持工单，也不需要 Databend Cloud 支持团队人工审批。如果未显示 ARN，请联系支持团队。

在您自己的 AWS 账户中创建一个独立的 IAM 角色。附加仅允许所需存储操作的权限策略。在信任策略中指定 Databend Cloud 主体，并使用外部 ID。然后在 Databend Connection 中填写您自己的角色 ARN 和相同的外部 ID。

Databend Cloud 在访问存储时会代入您的角色。AWS STS 为该角色签发临时凭证。

## 选择下一步任务

| 任务 | 从这里开始 |
|------|------------|
| 从 Amazon S3 导入文件 | [从存储桶导入数据](/guides/load-data/load/s3)是主教程，统一介绍认证选择、Connection 和 Stage 创建、访问验证及数据导入。 |
| 配置 AWS 角色权限和信任关系 | [使用 AWS IAM 角色进行认证](aws.md)负责 AWS 授权。创建角色后，请返回导入教程。 |
| 查询 Stage 语法 | [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage)提供 SQL 语法和简短示例。 |

<IndexOverviewList />
