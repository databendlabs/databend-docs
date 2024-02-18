---
title: 删除共享端点
sidebar_position: 3
---

删除一个共享端点。

## 语法

```sql
DROP SHARE ENDPOINT [ IF NOT EXISTS ] <share_endpoint_name>
```

## 示例

以下示例删除名为 "to_share" 的共享端点：

```sql
DROP SHARE ENDPOINT to_share;
```