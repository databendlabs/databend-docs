---
title: BendDeploy
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

BendDeploy is a Kubernetes-based platform developed by Databend to simplify and standardize the deployment and management of Databend clusters. It provides a visual, user-friendly interface for multi-cluster, multi-tenant operations, significantly improving operational efficiency, reliability, and control.

- Multi-Tenant Management: Isolated tenant environments with role-based user access controls.
- One-Click Cluster Deployment: Easily launch and manage Databend clusters with a few clicks.
- Lifecycle Operations: Supports rolling upgrades, version rollbacks, horizontal scaling, and cluster restarts.
- Visual Monitoring & Logs: Integrated views for node status, logs (e.g., query/profile logs), and external Prometheus metrics.
- Web-Based SQL Worksheet: Execute SQL queries directly from the UI, targeting specific tenant clusters.

## Downloading BendDeploy

BendDeploy is distributed as a set of Helm charts, making it easy to deploy on any Kubernetes environment. You can find the official charts repository on GitHub: [https://github.com/databendcloud/benddeploy-charts](https://github.com/databendcloud/benddeploy-charts).

The charts are organized into two main components:

- **BendDeploy Helm Chart**: The core chart that installs the BendDeploy control panel, backend services, and related components required to manage Databend clusters and tenants. This chart is required.
- **BendDeploy Logging Helm Chart**: An optional chart that enables centralized log collection from Databend query nodes using tools like Vector. It provides a convenient way to view logs such as query logs and profile logs directly in the BendDeploy interface.

## Licensing BendDeploy

BendDeploy is free to use for a 6-month trial period after installation. Once the trial expires, you can contact the Databend team to purchase a permanent license and continue using the platform without interruption.

For license inquiries or support, please reach out to: [hi@databend.com](mailto:hi@databend.com)

## Getting Started with BendDeploy

<IndexOverviewList />
