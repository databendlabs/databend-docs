---
title: 数据共享故障排查
sidebar_label: 故障排查
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

在下表中查找错误信息。信息中的 `...` 是你的环境中的值。

## 提供方错误

| 信息 | 原因 | 处理方法 |
| --- | --- | --- |
| `requires Databend Enterprise Edition license` | 许可证不包含所需功能。 | 安装包含 `DataSharing` 功能的许可证。使用 Stream 时，许可证还必须包含 Stream 功能。 |
| `Share '...' has no connection` | Share 没有连接。 | 授权表或添加账号前设置连接。 |
| `Connection '...' does not exist` | 连接名不正确，或连接已被删除。 | 创建连接，或使用正确的名称。 |
| `Connection storage type '...' does not match provider table storage type '...'` | 存储类型不同。 | 使用与表存储类型相同的连接。 |
| `Data sharing connection credential override is not supported for storage type '...'` | 此存储类型不能从连接获取凭证。 | 使用 S3、Azure Blob、GCS 或 `fs` 存储。 |
| `Grant USAGE on a database to share '...' before granting tables` | Share 没有授权数据库。 | 先授予数据库的 `USAGE`。 |
| `Share '...' already has USAGE on another database` | Share 授权了其他数据库。 | 使用其他 Share，或撤销当前数据库授权。 |
| `Cannot grant table '...' from a different database to share '...'` | 表不在已授权的数据库中。 | 授权已授权数据库中的表。 |
| `Shared table only supports Fuse provider tables` | 表不是 FUSE 表。 | 只共享 FUSE 表。 |
| `Shared tables do not support provider row access or masking policies` | 表带有行访问策略或掩码策略。 | 移除策略，或共享其他表。 |
| `Cannot grant a shared database to a share` | 该数据库是共享数据库。 | 授权本地数据库。 |
| `Only USAGE ON DATABASE and SELECT ON TABLE can be granted to a share` | 不支持该授权类型。 | 使用 `USAGE ON DATABASE` 或 `SELECT ON TABLE`。 |
| `ALTER SHARE SET requires ACCOUNTS, CONNECTION or COMMENT` | `SET` 子句为空。 | 添加一个或多个属性。 |
| `SHOW SHARES only supports LIKE and LIMIT` | 语句包含 `WHERE`。 | 使用 `LIKE` 或 `LIMIT`。 |

## 消费方错误

| 信息 | 原因 | 处理方法 |
| --- | --- | --- |
| `CREATE DATABASE ... FROM SHARE requires <provider_tenant>.<share>` | 缺少提供方租户 ID。 | 使用 `<provider_tenant>.<share>`。 |
| `CREATE DATABASE ... FROM SHARE is only supported in the default catalog` | 语句使用了其他 catalog。 | 使用默认 catalog。 |
| `CREATE DATABASE ... FROM SHARE cannot specify ENGINE or OPTIONS` | 语句包含 `ENGINE` 或 `OPTIONS`。 | 移除 `ENGINE` 和 `OPTIONS`。 |
| `Unknown share '...'` | Share 不存在，或租户 ID、Share 名称不正确。 | 执行 `SHOW SHARES`，使用结果中的值。 |
| `Account '...' is not authorized for share` | 消费方租户不是该 Share 的消费方账号。 | 使用 `CURRENT_TENANT_ID()` 获取 ID，请提供方添加此 ID。 |
| `Table '...' is not granted by share '...'` | 提供方未授权该表，或表名已改变。 | 请提供方授权该表。使用当前表名。 |
| `Share '...' does not grant a database` | Share 没有数据库授权。 | 请提供方授权数据库和表。 |
| `Share '...' no longer grants a database` | 提供方撤销了数据库的 `USAGE`。 | 请提供方再次授权数据库和表。 |
| `Shared database binding is no longer valid` | 提供方删除后重新创建了 Share 或数据库。 | [重新创建共享数据库](03-manage-shares.md#lifecycle-and-recovery)。 |
| `Shared table binding is stale` | 提供方删除后重新创建了表。 | 请提供方授权新表。 |
| `Cannot resolve connection '...' for data sharing` | 提供方连接不存在或无效。 | 请提供方重新创建连接或设置其他连接。 |
| `Cannot modify shared table ...: table is READ ONLY` | 语句尝试修改共享表。 | 将数据写入本地表。 |

如果查询因存储错误失败，检查网络访问和提供方连接的权限。

## 并发变更

| 信息 | 原因 | 处理方法 |
| --- | --- | --- |
| `retry ALTER SHARE` | 其他操作同时修改了 Share。 | 再次执行该语句。 |
| `retry GRANT` | 其他操作同时修改了 Share 或表。 | 再次执行该语句。 |

## Stream 错误

| 信息 | 原因 | 处理方法 |
| --- | --- | --- |
| `Change tracking is not enabled on shared table ...` | 提供方未启用变更跟踪。 | 请提供方在源表上设置 `change_tracking = true`。 |
| `Create the stream in a local database, not in a shared database` | Stream 位于共享数据库中。 | 在本地数据库中创建 Stream。 |
| `Change tracking has been missing for the time range requested on table ...` | 变更跟踪中断了一段时间。 | 重新创建 Stream。 |
| `Cannot get base table '...' from stream ...` | 源表或共享数据库已被删除。 | 重新创建 Stream。 |

Stream 操作步骤参见[共享表上的 Stream](02-consumers.md#streams-on-shared-tables)。
