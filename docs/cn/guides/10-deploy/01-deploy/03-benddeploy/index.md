---
title: BendDeploy
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

BendDeploy 是由 Databend 开发的基于 Kubernetes 的平台，旨在简化和标准化 Databend 集群的部署和管理。它提供了一个可视化的、用户友好的界面，用于多集群、多租户操作，从而显著提高运营效率、可靠性和控制力。

- 多租户管理：具有基于角色的用户访问控制的隔离租户环境。
- 一键集群部署：只需点击几下即可轻松启动和管理 Databend 集群。
- 生命周期操作：支持滚动升级、版本回滚、水平扩展和集群重启。
- 可视化监控和日志：集成视图，用于节点状态、日志（例如，查询/profile 日志）和外部 Prometheus 指标。
- 基于 Web 的 SQL 工作表：直接从 UI 执行 SQL 查询，定位到特定的租户集群。

## 下载 BendDeploy

BendDeploy 以一组 Helm charts 的形式分发，可以轻松地部署在任何 Kubernetes 环境中。您可以在 GitHub 上找到官方 charts 仓库：[https://github.com/databendcloud/benddeploy-charts](https://github.com/databendcloud/benddeploy-charts)。

这些 charts 分为两个主要组件：

- **BendDeploy Helm Chart**：核心 chart，用于安装 BendDeploy 控制面板、后端服务以及管理 Databend 集群和租户所需的相关组件。此 chart 是必需的。
- **BendDeploy Logging Helm Chart**：一个可选的 chart，可以使用 Vector 等工具从 Databend 查询节点集中收集日志。它提供了一种方便的方式，可以直接在 BendDeploy 界面中查看查询日志和 profile 日志等日志。

## BendDeploy 授权许可

BendDeploy 在安装后可免费试用 6 个月。试用期结束后，您可以联系 Databend 团队购买永久许可证，并继续不间断地使用该平台。

有关许可证咨询或支持，请联系：[hi@databend.com](mailto:hi@databend.com)

## BendDeploy 入门

<IndexOverviewList />