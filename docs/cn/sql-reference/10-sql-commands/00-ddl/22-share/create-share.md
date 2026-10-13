---
title: CREATE SHARE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

在提供方租户中创建 Share。

## 语法

```sql
CREATE [ OR REPLACE ] SHARE [ IF NOT EXISTS ] <share_name>
    [ CONNECTION = <connection_name> ]
    [ COMMENT = '<comment>' ]
```

| 参数 | 描述 |
| --- | --- |
| `share_name` | Share 名称。名称在租户中必须唯一。 |
| `CONNECTION` | 提供方租户中的连接。其存储类型必须与要授权的表的存储类型相同。 |
| `COMMENT` | Share 的描述。 |

## 使用说明

- 新 Share 不包含对象授权或消费方账号。使用 [GRANT TO SHARE](grant-share.md) 和 [ALTER SHARE](alter-share.md) 进行配置。
- 可以创建不带连接的 Share。授权表或添加消费方账号前，必须设置连接。
- 不能在同一语句中同时使用 `OR REPLACE` 和 `IF NOT EXISTS`。

:::caution
`OR REPLACE` 会创建新的 Share，消费方的共享数据库会停止工作。不要使用 `OR REPLACE` 更换凭证，请使用 `ALTER SHARE ... SET CONNECTION`。
:::

所需权限参见[访问控制](/guides/data-management/data-sharing#access-control)。

## 示例

```sql
CREATE SHARE sales_share
    CONNECTION = share_conn
    COMMENT = 'Shared order data';
```
