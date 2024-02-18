---
title: ALTER SHARE
sidebar_position: 3
---

通过其租户 ID 向共享添加/删除一个或多个组织。

## 语法

```sql
ALTER SHARE [ IF EXISTS ] <share_name> { ADD | REMOVE } TENANTS = <tenant_id> [ , <tenant_id>, ... ]
```

## 示例

以下示例将租户 ID 为 `x` 和 `y` 的组织添加到共享 `myshare` 中：

```sql
ALTER SHARE myshare ADD TENANTS = x, y;
```