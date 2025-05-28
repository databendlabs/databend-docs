---
title: 计算集群
---

import PlaySVG from '@site/static/img/icon/play.svg'
import SuspendSVG from '@site/static/img/icon/suspend.svg'
import CheckboxSVG from '@site/static/img/icon/checkbox.svg'
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg'
import { Button } from 'antd'

计算集群是 Databend Cloud 的重要组成部分。计算集群代表一组计算资源，包括 CPU、内存和本地缓存。您必须运行计算集群来执行 SQL 任务，例如：

- 使用 SELECT 语句查询数据
- 使用 INSERT、UPDATE 或 DELETE 语句修改数据
- 使用 COPY INTO 命令将数据加载到表中

运行计算集群会产生费用。更多信息请参见 [计算集群定价](/guides/products/dc/pricing#warehouse-pricing)。

## 计算集群规格

在 Databend Cloud 中，计算集群有多种规格可供选择，每种规格都由其能处理的最大并发查询数量定义。创建计算集群时，您可以从以下规格中选择：

| 规格                  | 推荐使用场景                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| XSmall                | 最适合简单任务，如测试或运行轻量级查询。适用于小型数据集 (约 50GB)。                                          |
| Small                 | 非常适合运行常规报告和中等工作负载。适用于中等规模数据集 (约 200GB)。                                     |
| Medium                | 非常适合处理更复杂查询和更高并发的团队。适用于较大数据集 (约 1TB)。                                 |
| Large                 | 非常适合运行大量并发查询的组织。适用于大型数据集 (约 5TB)。                                             |
| XLarge                | 专为具有高并发的企业级工作负载而构建。适用于超大型数据集 (超过 10TB)。                                        |
| Multi-Cluster Scaling | 自动扩展和收缩以匹配您的工作负载，提供最具成本效益的方式来根据您的需求提高并发性。 |

为了选择合适的计算集群规格，Databend 建议从较小的规格开始。较小的计算集群执行 SQL 任务可能比中型或大型计算集群需要更长时间。如果您发现查询执行时间过长 (例如几分钟)，请考虑扩展到中型或大型计算集群以获得更快的结果。

## 管理计算集群 {#managing}

一个组织可以拥有任意数量的计算集群。**计算集群** 页面显示您组织中的所有计算集群，并允许您管理它们。请注意，只有 `account_admin` 可以创建或删除计算集群。

### 暂停 / 恢复计算集群

暂停的计算集群不会消耗任何积分。您可以通过点击计算集群上的 <SuspendSVG/> 或 <PlaySVG/> 按钮手动暂停或恢复计算集群。但是，计算集群可以在以下场景中自动暂停或恢复：

- 如果没有活动，计算集群可以根据其自动暂停设置自动暂停。
- 当您选择暂停的计算集群来执行 SQL 任务时，计算集群将自动恢复。

### 执行批量操作

您可以对计算集群执行批量操作，包括批量重启、批量暂停、批量恢复和批量删除。为此，请通过勾选计算集群列表中的复选框 <CheckboxSVG/> 来选择要进行批量操作的计算集群，然后点击省略号按钮 <EllipsisSVG/> 进行所需的操作。

![alt text](../../../../../static/img/cloud/bulk.gif)

### 最佳实践

为了有效管理您的计算集群并确保最佳性能和成本效益，请考虑以下最佳实践。这些指导原则将帮助您为各种工作负载和环境调整、组织和优化您的计算集群：

- **选择合适的规格**

  - 对于 **开发和测试**，使用较小的计算集群 (XSmall、Small)。
  - 对于 **生产环境**，选择较大的计算集群 (Medium、Large、XLarge)。

- **分离计算集群**

  - 为 **数据加载** 和 **查询执行** 使用单独的计算集群。
  - 为 **开发**、**测试** 和 **生产** 环境创建不同的计算集群。

- **数据加载提示**

  - 较小的计算集群 (Small、Medium) 适用于数据加载。
  - 优化文件大小和文件数量以提高性能。

- **优化成本和性能**

  - 避免运行简单查询如 `SELECT 1` 以最小化积分使用。
  - 使用批量加载 (`COPY`) 而不是单独的 `INSERT` 语句。
  - 监控长时间运行的查询并优化它们以提高性能。

- **自动暂停**

  - 启用自动暂停以在计算集群空闲时节省积分。

- **对频繁查询禁用自动暂停**

  - 对于频繁或重复查询，保持计算集群活跃以维护缓存并避免延迟。

- **使用自动扩展 (仅限商业版和专用版计划)**

  - Multi-cluster scaling 根据工作负载需求自动调整资源。

- **监控和调整使用情况**
  - 定期检查计算集群使用情况，并根据需要调整规格以平衡成本和性能。

## 计算集群访问控制

Databend Cloud 允许您通过为计算集群分配特定角色来使用基于角色的控制管理计算集群访问，这样只有具有该角色的用户才能访问计算集群。

:::note
计算集群访问控制默认 _未_ 启用。要启用它，请转到 **Support** > **Create New Ticket** 并提交请求。
:::

要为计算集群分配角色，请在计算集群创建或修改过程中的 **Advanced Options** 中选择所需的角色：

![alt text](@site/static/img/documents/warehouses/warehouse-role.png)

- 两个 [内置角色](../../56-security/access-control/02-roles.md#built-in-roles) 可供选择，您也可以使用 [CREATE ROLE](/sql/sql-commands/ddl/user/user-create-role) 命令创建其他角色。有关 Databend 角色的更多信息，请参见 [角色](../../56-security/access-control/02-roles.md)。
- 没有分配角色的计算集群默认为 `public` 角色，允许所有用户访问。
- 您可以使用 [GRANT](/sql/sql-commands/ddl/user/grant) 命令将角色授予用户 (Databend Cloud 登录邮箱或 SQL 用户)，或者在邀请用户加入您的组织时分配角色。更多信息请参见 [邀请新成员](00-organization.md#inviting-new-members)。此示例将角色 `manager` 授予邮箱为 `name@example.com` 的用户，允许访问分配给 `manager` 角色的任何计算集群：

  ```sql title='示例：'
  GRANT ROLE manager to 'name@example.com';
  ```

## Multi-Cluster 计算集群

Multi-cluster 计算集群根据工作负载需求通过添加或删除集群来自动调整计算资源。它确保高并发和性能，同时通过根据需要扩展或收缩来优化成本。

:::note
多集群功能仅适用于 Databend Cloud 商业版和专用版用户。
:::

### 工作原理

默认情况下，计算集群由单个计算资源集群组成，根据其大小可以处理最大数量的并发查询。当为计算集群启用多集群功能时，它允许动态添加多个集群 (由 **最大集群数** 设置定义) 来处理超出单个集群容量的工作负载。

当并发查询数量超过计算集群的容量时，会添加额外的集群来处理额外的负载。如果需求持续增长，会逐个添加更多集群。随着查询需求的减少，超过 **自动暂停** 持续时间且无活动的集群会自动关闭。

![alt text](@site/static/img/cloud/multi-cluster-how-it-works.png)

### 启用多集群

您可以在创建计算集群时启用多集群功能，并设置计算集群可以扩展到的最大集群数量。请注意，如果为计算集群启用了多集群功能，**自动暂停** 持续时间必须设置为至少 15 分钟。

![alt text](@site/static/img/cloud/multi-cluster.png)

### 费用计算

多集群计算集群根据特定时间间隔内使用的活跃集群数量进行计费。

例如，对于价格为每小时 $1 的 XSmall 计算集群，如果从 13:00 到 14:00 活跃使用一个集群，从 14:00 到 15:00 活跃使用两个集群，那么从 13:00 到 15:00 产生的总费用为 $3 ((1 个集群 × 1 小时 × $1) + (2 个集群 × 1 小时 × $1))。

## 连接到计算集群 {#connecting}

连接到计算集群提供了在 Databend Cloud 中运行查询和分析数据所需的计算资源。当从应用程序或 SQL 客户端访问 Databend Cloud 时，此连接是必需的。

### 连接方法

Databend Cloud 支持多种连接方法以满足您的特定需求。有关详细的连接说明，请参阅 [SQL 客户端文档](/guides/sql-clients/)。

#### SQL 客户端和工具

| 客户端 | 类型 | 最适用于 | 主要功能 |
|--------|------|----------|------------|
| **[BendSQL](/guides/sql-clients/bendsql)** | 命令行 | 开发者、脚本 | 原生 CLI、丰富格式化、多种安装选项 |
| **[DBeaver](/guides/sql-clients/jdbc)** | GUI 应用程序 | 数据分析、可视化查询 | 内置驱动程序、跨平台、查询构建器 |

#### 开发者驱动程序

| 语言 | 驱动程序 | 使用场景 | 文档 |
|----------|--------|----------|---------------|
| **Go** | Golang Driver | 后端应用程序 | [Golang 指南](/guides/sql-clients/developers/golang) |
| **Python** | Python Connector | 数据科学、分析 | [Python 指南](/guides/sql-clients/developers/python) |
| **Node.js** | JavaScript Driver | Web 应用程序 | [Node.js 指南](/guides/sql-clients/developers/nodejs) |
| **Java** | JDBC Driver | 企业应用程序 | [JDBC 指南](/guides/sql-clients/developers/jdbc) |
| **Rust** | Rust Driver | 系统编程 | [Rust 指南](/guides/sql-clients/developers/rust) |

### 获取连接信息

要获取计算集群的连接信息：

1. 在 **概览** 页面上点击 **连接**。
2. 选择您希望连接的数据库和计算集群。连接信息将根据您的选择进行更新。
3. 连接详细信息包括一个名为 `cloudapp` 的 SQL 用户和一个随机生成的密码。Databend Cloud 不存储此密码。请务必复制并安全保存。如果您忘记了密码，请点击 **重置** 生成新密码。

{/* LANG_REPLACE: 
   type=image
   en=@site/static/img/documents/warehouses/databend_cloud_dsn.gif
   cn=@site/static/img/documents_cn/warehouses/databend_cloud_dsn.gif
*/}
![alt text](@site/static/img/documents_cn/warehouses/databend_cloud_dsn.gif)

### 连接字符串格式

当您点击 **连接** 时，Databend Cloud 会自动生成您的连接字符串：

```
databend://<username>:<password>@<tenant>.gw.<region>.default.databend.com:443/<database>?warehouse=<warehouse_name>
```

其中：
- `<username>`：默认为 `cloudapp`
- `<password>`：点击 **重置** 查看或更改
- `<tenant>`、`<region>`：您的账户信息 (显示在连接详细信息中)
- `<database>`：选定的数据库 (显示在连接详细信息中)
- `<warehouse_name>`：选定的计算集群 (显示在连接详细信息中)

### 为计算集群访问创建 SQL 用户

除了默认的 `cloudapp` 用户外，您还可以创建额外的 SQL 用户以获得更好的安全性和访问控制：

```sql
-- 创建新的 SQL 用户
CREATE USER warehouse_user1 IDENTIFIED BY 'StrongPassword123';

-- 授予数据库的所有权限
-- 此用户可以访问数据库中的所有表
GRANT ALL ON my_database.* TO warehouse_user1;
```

有关更多详细信息，请参阅 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 和 [GRANT](/sql/sql-commands/ddl/user/grant) 文档。

### 连接安全性

默认情况下，所有到 Databend Cloud 计算集群的连接都使用 TLS 加密。对于需要额外安全性的企业用户，可以使用 [AWS PrivateLink](/guides/sql-clients/privatelink) 在您的 VPC 和 Databend Cloud 之间建立私有连接。