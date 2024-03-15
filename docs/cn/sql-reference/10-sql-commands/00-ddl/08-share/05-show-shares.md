---
title: 显示共享
sidebar_position: 4
---

显示您创建的共享以及与您共享的共享。

## 语法

```sql
SHOW SHARES;
```

## 示例

以下示例显示共享 `myshare` 将数据库 `db1` 共享给租户 `x` 和 `y`：

```sql
SHOW SHARES;

--结果中的 Kind 列指示数据共享的方向：
--OUTBOUND: 共享由您的组织创建并与其他组织共享。
--INBOUND: 共享由另一个组织创建并与您的组织共享。

---
| Created_on                        | Kind     | Name    | Database_name | From      | To  | Comment |
|-----------------------------------|----------|---------|---------------|-----------|-----|---------|
| 2022-09-06 17:46:16.686281294 UTC | OUTBOUND | myshare | default       | tn44grr46 | x,y |         |
```