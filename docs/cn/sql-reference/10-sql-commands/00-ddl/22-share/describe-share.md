---
title: DESCRIBE SHARE
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="引入或更新于：v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

显示 Share 授权的数据库和表。`DESC SHARE` 是别名。

## 语法

```sql
DESC[RIBE] SHARE [ <provider_tenant>. ]<share_name>
```

- 查看当前租户的 Share 时，不要使用 `provider_tenant`。
- 查看其他提供方的 Share 时，使用其租户 ID。当前租户必须是该 Share 的消费方账号。

## 输出

| 列 | 描述 |
| --- | --- |
| `kind` | `DATABASE` 或 `TABLE`。 |
| `name` | 数据库名称；表使用 `<database>.<table>`。 |
| `shared_on` | 授权时间。 |

如果提供方删除了表，其授权可能显示不完整的名称。该授权不能访问同名的新表。

所需权限参见[访问控制](/guides/data-management/data-sharing#access-control)。

## 示例

```sql
-- Provider tenant
DESCRIBE SHARE sales_share;

-- Consumer tenant
DESC SHARE provider_acct.sales_share;
```
