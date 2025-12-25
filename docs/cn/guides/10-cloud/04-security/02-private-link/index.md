---
title: Private Link
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

# 为什么选择 PrivateLink

各大云厂商提供的 PrivateLink/Private Endpoint（AWS PrivateLink、Azure Private Link、Google Private Service Connect 等）允许您在自己的网络边界内通过私有 IP 访问 Databend Cloud，整个链路无需穿越公网。这能让数据集、凭据和管理操作都留在云厂商骨干网上，并遵循您现有的网络策略。

## 优势

- 网络隔离：流量始终停留在 VPC/VPN 内，避免暴露到公网上。
- 合规友好：更容易满足禁止公网出口的内审或行业规范。
- 性能稳定：走云厂商骨干而不是不可控的互联网线路。
- 简化管控：沿用既有的安全组、路由表和监控手段。

## 工作原理

当 Databend Cloud 审批了您计划接入的云账户或项目后，您即可创建指向所在区域 Databend 服务的私有终端节点。启用私有 DNS 后，Databend Cloud 域名会解析到这些私有 IP，所有会话都会自动通过安全的私有链路传输。

<IndexOverviewList />
