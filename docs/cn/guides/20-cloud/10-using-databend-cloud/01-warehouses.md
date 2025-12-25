---
title: 计算集群
---

import PlaySVG from '@site/static/img/icon/play.svg'
import SuspendSVG from '@site/static/img/icon/suspend.svg'
import CheckboxSVG from '@site/static/img/icon/checkbox.svg'
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg'
import { Button } from 'antd'

计算集群（Warehouse）是 Databend Cloud 的核心组件。它代表了一组计算资源，包含 CPU、内存以及本地缓存。您需要启动计算集群来执行各类 SQL 任务，例如：

- 使用 SELECT 语句查询数据
- 使用 INSERT、UPDATE 或 DELETE 修改数据
- 使用 COPY INTO 将数据加载到表中

使用计算集群会产生费用。更多详情请参阅 [计算集群定价](/guides/products/dc/pricing#warehouse-pricing)。

## 计算集群规格

Databend Cloud 提供多种规格的计算集群，不同规格决定了其能够处理的最大并发查询数。在创建计算集群时，您可以选择以下规格：

| 规格 | 推荐使用场景 |
| :--- | :--- |
| XSmall | 适用于简单的测试任务或轻量级查询。适合小型数据集（约 50GB）。 |
| Small | 适合运行常规报表和中等负载的任务。适合中型数据集（约 200GB）。 |
| Medium | 适合团队进行复杂查询和较高并发的操作。适合较大数据集（约 1TB）。 |
| Large | 适合需要处理大量并发查询的组织。适合大型数据集（约 5TB）。 |
| XLarge | 专为具有超高并发的企业级工作负载设计。适合超大型数据集（超过 10TB）。 |
| nXLarge | n=2,3,4,5,6 [联系我们](https://www.databend.cn/contact-us/) |
| Multi-Cluster Scaling | 根据工作负载自动进行扩缩容（Scale Out/In），提供最具成本效益的高并发支持。 |

建议从较小的规格开始尝试。较小的计算集群执行 SQL 任务的时间可能会比中型或大型集群稍长。如果发现查询耗时过长（例如数分钟），可以考虑升级到 Medium 或 Large 规格以获得更快的结果。

## 管理计算集群 {#managing}

一个组织可以按需创建多个计算集群。**计算集群** 页面展示了您组织下的所有计算集群，并提供管理功能。请注意，只有 `account_admin` 权限的用户才能创建或删除计算集群。

### 暂停 / 恢复计算集群

处于暂停状态的计算集群不会消耗积分（Credits）。您可以通过点击计算集群上的 <SuspendSVG/> 或 <PlaySVG/> 按钮来手动暂停或恢复。此外，计算集群在以下情况会自动变更状态：

- **自动暂停**：如果在设定时间内没有活动，计算集群将根据自动暂停设置自动停止。
- **自动恢复**：当您选择一个已暂停的计算集群执行 SQL 任务时，它会自动启动。

### 批量操作

您可以对计算集群执行批量操作，包括批量启动、暂停、恢复和删除。在计算集群列表中勾选复选框 <CheckboxSVG/> 选中目标集群，然后点击省略号按钮 <EllipsisSVG/> 选择相应的操作即可。

![alt text](@site/static/img/cloud/bulk.gif)

### 最佳实践

为了高效管理计算集群并确保最佳的性能与成本效益，请参考以下建议。这些原则将帮助您针对不同的工作负载和环境调整、组织和优化计算集群：

- **选择合适的规格**
  - **开发与测试**：使用较小的规格（XSmall, Small）。
  - **生产环境**：选择较大的规格（Medium, Large, XLarge）。

- **资源隔离**
  - **读写分离**：为 **数据加载** 和 **查询执行** 使用独立的计算集群。
  - **环境隔离**：为 **开发**、**测试** 和 **生产** 环境创建不同的计算集群。

- **数据加载建议**
  - 较小的计算集群（Small, Medium）通常足以处理数据加载任务。
  - 通过优化文件大小和文件数量来提升性能。

- **优化成本与性能**
  - 避免运行如 `SELECT 1` 这样简单的查询，以减少不必要的积分消耗。
  - 使用批量加载 (`COPY`) 而非单条 `INSERT` 语句。
  - 监控长耗时查询并进行优化。

- **自动暂停**
  - 启用自动暂停功能，在计算集群空闲时节省成本。

- **高频查询禁用自动暂停**
  - 对于频繁或重复执行的查询，保持计算集群处于活跃状态，以利用缓存并避免启动延迟。

- **使用自动扩展（仅限商业版和专用版）**
  - 利用 Multi-Cluster Scaling 根据工作负载需求自动调整资源。

- **监控与调整**
  - 定期审查计算集群的使用情况，并根据需要调整规格，以在成本和性能之间找到平衡。

## 计算集群访问控制

Databend Cloud 支持基于角色的访问控制（RBAC）。您可以为计算集群分配特定角色，只有拥有该角色的用户才能访问。

:::note
计算集群访问控制默认**未启用**。如需开启，请前往 **Support** > **Create New Ticket** 提交申请。
:::

在创建或修改计算集群时，您可以在 **Advanced Options** 中选择需要分配的角色：

![alt text](@site/static/img/documents/warehouses/warehouse-role.png)

- 您可以选择两个 [内置角色](../../56-security/access-control/02-roles.md#built-in-roles)，也可以使用 [CREATE ROLE](/sql/sql-commands/ddl/user/user-create-role) 命令创建自定义角色。更多信息请参阅 [角色](../../56-security/access-control/02-roles.md)。
- 未分配角色的计算集群默认为 `public` 角色，允许所有用户访问。
- 您可以使用 [GRANT](/sql/sql-commands/ddl/user/grant) 命令将角色授予用户（Databend Cloud 登录邮箱或 SQL 用户），或者在邀请用户加入组织时直接分配角色。详情请参阅 [邀请新成员](00-organization.md#inviting-new-members)。以下示例将 `manager` 角色授予邮箱 `name@example.com`，使其能够访问所有分配给 `manager` 角色的计算集群：

  ```sql title='示例：'
  GRANT ROLE manager to 'name@example.com';
  ```

## 多集群计算集群 (Multi-Cluster Warehouses)

多集群计算集群能够根据工作负载需求，通过增加或减少集群数量来自动调整计算资源。它在确保高并发和高性能的同时，通过按需扩缩容来优化成本。

:::note
多集群功能仅对 Databend Cloud **商业版 (Business)** 和 **专用版 (Dedicated)** 用户开放。
:::

### 工作原理

默认情况下，一个计算集群由单个计算资源集群组成，其处理并发查询的能力受限于其规格大小。当启用多集群功能后，系统可以动态添加多个集群（数量上限由 **Max Clusters** 设置），以应对超出单个集群处理能力的工作负载。

当并发查询数超过当前容量时，系统会自动增加一个集群来分担负载。如果需求持续增长，集群将逐个增加。随着查询需求减少，闲置时间超过 **Auto Suspend** 设定时长的集群将自动关闭。

![alt text](@site/static/img/cloud/multi-cluster-how-it-works.png)

### 启用多集群

您可以在创建计算集群时启用多集群功能，并设置最大集群数（Max Clusters）。请注意，如果启用了多集群功能，**自动暂停（Auto Suspend）** 时间必须至少设置为 15 分钟。

![alt text](@site/static/img/cloud/multi-cluster.png)

### 费用计算

多集群计算集群的计费基于特定时间段内实际使用的活跃集群数量。

例如，对于一个价格为每小时 $1 的 XSmall 计算集群：如果 13:00 到 14:00 期间有一个集群活跃，而 14:00 到 15:00 期间有两个集群活跃，则 13:00 到 15:00 的总费用为 $3（(1 集群 × 1 小时 × $1) + (2 集群 × 1 小时 × $1)）。

## 连接计算集群 {#connecting}

连接到计算集群是运行查询和分析数据的前提。当您通过应用程序或 SQL 客户端访问 Databend Cloud 时，需要建立此连接。

### 连接方式

Databend Cloud 支持多种连接方式以满足不同需求。详细说明请参阅 [SQL 客户端文档](/guides/connect/)。

#### SQL 客户端与工具

| 客户端 | 类型 | 适用场景 | 主要特点 |
| :--- | :--- | :--- | :--- |
| **[BendSQL](/guides/connect/sql-clients/bendsql)** | 命令行 | 开发人员、脚本自动化 | 原生 CLI，丰富的格式化支持，多种安装选项 |
| **[DBeaver](/guides/connect/sql-clients/jdbc)** | GUI 应用 | 数据分析、可视化查询 | 内置驱动，跨平台，图形化查询构建器 |

#### 开发者驱动 (Drivers)

| 语言 | 驱动程序 | 用例 | 文档 |
| :--- | :--- | :--- | :--- |
| **Go** | Golang Driver | 后端应用 | [Golang 开发指南](/guides/connect/drivers/golang) |
| **Python** | Python Connector | 数据科学、分析 | [Python 开发指南](/guides/connect/drivers/python) |
| **Node.js** | JavaScript Driver | Web 应用 | [Node.js 开发指南](/guides/connect/drivers/nodejs) |
| **Java** | JDBC Driver | 企业级应用 | [JDBC 开发指南](/guides/connect/drivers/java) |
| **Rust** | Rust Driver | 系统编程 | [Rust 开发指南](/guides/connect/drivers/rust) |

### 获取连接信息

获取计算集群连接信息的步骤如下：

1. 在 **Overview**（概览）页面点击 **Connect**（连接）。
2. 选择您要连接的 Database（数据库）和 Warehouse（计算集群）。连接信息将根据您的选择自动更新。
3. 连接详情包含一个名为 `cloudapp` 的系统生成 SQL 用户及其随机密码。Databend Cloud 不会存储此密码，请务必复制并妥善保存。如遗忘，可点击 **Reset** 生成新密码。

![alt text](@site/static/img/documents_cn/warehouses/databend_cloud_dsn.gif)

### 连接字符串格式

点击 **Connect** 时，Databend Cloud 会自动生成连接字符串：

```
databend://<username>:<password>@<tenant>.gw.<region>.default.databend.com:443/<database>?warehouse=<warehouse_name>
```

其中：

- `<username>`：默认为 `cloudapp`。
- `<password>`：点击 **重置** 查看或更改。
- `<tenant>`、`<region>`：您的账户信息（显示在连接详情中）。
- `<database>`：已选的数据库。
- `<warehouse_name>`：已选的计算集群。

### 创建 SQL 用户

除默认的 `cloudapp` 用户外，您可以创建额外的 SQL 用户以实现更细粒度的安全管控：

```sql
-- 创建新的 SQL 用户
CREATE USER warehouse_user1 IDENTIFIED BY 'StrongPassword123';

-- 授予数据库所有权限
-- 该用户将可以访问 my_database 中的所有表
GRANT ALL ON my_database.* TO warehouse_user1;
```

更多详情请参阅 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 和 [GRANT](/sql/sql-commands/ddl/user/grant) 文档。

### 连接安全性

默认情况下，所有连接到 Databend Cloud 计算集群的流量均使用 TLS 加密。对于安全性要求更高的企业用户，可以使用 [AWS PrivateLink](/guides/cloud/advanced/private-link) 在您的 VPC 和 Databend Cloud 之间建立私有连接。
