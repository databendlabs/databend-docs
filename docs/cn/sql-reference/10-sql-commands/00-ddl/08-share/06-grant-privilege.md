---
title: 授予共享权限
sidebar_position: 6
---

将数据库对象的权限授予某个共享。

## 语法

```sql
GRANT { USAGE | SELECT | REFERENCE_USAGE } ON <object_name> TO SHARE <share_name>;
```

其中：

- **USAGE**：授予你想要共享的对象所属数据库的 USAGE 权限。
- **SELECT**：授予你想要共享的对象的 SELECT 权限。
- **REFERENCE_USAGE**：如果你想共享一个引用了多个数据库对象的安全视图，请为每个数据库授予 REFERENCE_USAGE 权限。

## 示例

以下示例将数据库 `db1` 的 USAGE 权限和表 `table1` 的 SELECT 权限授予共享 `myshare`：

```sql
GRANT USAGE ON DATABASE db1 TO SHARE myshare;
GRANT SELECT ON TABLE db1.table1 TO SHARE myshare;
```