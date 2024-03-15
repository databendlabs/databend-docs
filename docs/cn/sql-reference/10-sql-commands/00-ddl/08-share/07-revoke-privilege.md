---
title: 从共享中撤销<privilege>
sidebar_position: 7
---

从共享中撤销对数据库对象的权限。

## 语法

```sql
REVOKE { USAGE | SELECT | REFERENCE_USAGE } ON <object_name> FROM SHARE <share_name>;
```

有关您可以从共享中撤销的权限的信息，请参见[授予`<privilege>`给共享](06-grant-privilege.md)。

## 示例

以下示例从共享`myshare`中撤销对表`table1`的SELECT权限：

```sql
REVOKE SELECT ON db1.table1 FROM SHARE myshare;
```