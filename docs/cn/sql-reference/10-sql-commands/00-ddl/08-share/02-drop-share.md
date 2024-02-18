---
title: 删除共享
sidebar_position: 5
---

删除一个共享。当你删除一个共享时，被添加到该共享的组织将不再能够访问从该共享创建的数据库。

## 语法

```sql
DROP SHARE [ IF EXISTS ] <share_name>;
```

## 示例

以下示例删除名为 `myshare` 的共享：

```sql
DROP SHARE myshare;
```