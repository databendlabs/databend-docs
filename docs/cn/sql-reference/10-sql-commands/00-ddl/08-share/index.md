---
title: 共享（SHARE）
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

在 Databend 中，共享（`SHARE`）功能允许跨不同租户共享各种类型的数据库对象，如表、视图和用户定义函数（UDFs）。

:::note
通过 SHARE 共享数据不涉及物理复制或将数据传输给接收租户。相反，共享的数据对于接收租户保持只读状态。属于这些租户的用户只能对共享的数据执行查询操作；他们不允许对共享的数据进行更新、插入或删除操作。
:::

## 开始使用共享

本节描述如何利用 SHARE 共享数据以及如何跨租户访问共享数据：

### 步骤 1. 创建共享 {#step-1-creating-a-share}

下述步骤创建一个共享，用于与另一个租户共享数据，并为共享的数据授予权限。在要共享数据的租户内执行这些步骤。

1. 使用 [CREATE SHARE](01-create-share.md) 命令创建一个空的共享。

```sql
-- 创建一个名为 "myshare" 的共享
CREATE SHARE myshare;
```

2. 使用 [GRANT `<privilege>` to SHARE](06-grant-privilege.md) 命令为您创建的共享授予权限。在授予想要分享的对象权限之前，您必须为包含这些对象的数据库授予权限。

```sql
-- 授予数据库 "db1" 的 USAGE 权限
GRANT USAGE ON DATABASE db1 TO SHARE myshare;

-- 授予数据库 "db1" 中表 "table1" 的 SELECT 权限
GRANT SELECT ON TABLE db1.table1 TO SHARE myshare;
```

3. 使用 [ALTER SHARE](03-alter-share.md) 命令将您想要分享的租户添加到共享中。当与另一个组织共享数据时，您可以通过其租户 ID 指定该组织。

```sql
-- 将租户 B 添加到共享 "myshare"
ALTER SHARE myshare ADD TENANTS = B;
```

### 步骤 2. 访问共享数据

这些步骤创建一个共享端点（`SHARE ENDPOINT`）和一个使用 [步骤 1](#step-1-creating-a-share) 中创建的共享的数据库。在您打算访问共享数据的租户内执行这些步骤。

1. 创建一个 [SHARE ENDPOINT](../08-share-endpoint/index.md)。

```sql
-- 创建一个名为 "to_share" 的共享端点
CREATE SHARE ENDPOINT to_share URL = 'http://<shared-tenant-endpoint>:<port>' TENANT = <shared-tenant-name>;
```

2. 使用 [CREATE DATABASE](../00-database/ddl-create-database.md) 命令，利用共享创建数据库。

```sql
-- 使用共享 "myshare" 创建一个名为 "db2" 的数据库
CREATE DATABASE db2 FROM SHARE myshare;
```

3. 要访问共享的数据，请执行像这样的 SELECT 语句：

```sql
SELECT * FROM db2.table1 ...
```

## 管理共享

要在租户上管理共享，请使用以下命令：

<IndexOverviewList />