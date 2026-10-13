---
title: 数据共享 (Share)
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Share 向其他租户提供指定 FUSE 表的只读访问。Databend 不复制数据。

要求、操作步骤和权限参见[数据共享指南](/guides/data-management/data-sharing)。

## 语句

| 语句 | 描述 |
| --- | --- |
| [CREATE SHARE](create-share.md) | 创建 Share。 |
| [ALTER SHARE](alter-share.md) | 修改 Share 的消费方账号、连接或注释。 |
| [DROP SHARE](drop-share.md) | 删除 Share。 |
| [SHOW SHARES](show-shares.md) | 显示本租户的 Share 和授权给本租户的 Share。 |
| [DESCRIBE SHARE](describe-share.md) | 显示 Share 授权的对象。 |
| [GRANT TO SHARE](grant-share.md) | 将数据库或表授权给 Share。 |
| [REVOKE FROM SHARE](revoke-share.md) | 从 Share 撤销数据库或表。 |
| [CREATE DATABASE ... FROM SHARE](../00-database/ddl-create-database.md#from-share) | 基于 Share 创建共享数据库。 |
