---
title: NOT LIKE
---

字符串不匹配 SQL 模式时返回 `true`，匹配时返回 `false`，任一参数为 `NULL` 时返回 `NULL`。

`<expr> NOT LIKE <pattern>` 等价于对 `<expr> LIKE <pattern>` 取反。通配符、转义和 `ESCAPE` 子句请参阅 [LIKE](like.md)。

## 语法

```sql
<expr> NOT LIKE <pattern> [ ESCAPE <escape> ]
```

## 示例

```sql
SELECT name, category FROM system.functions WHERE name LIKE 'tou%' AND name NOT LIKE '%64' ORDER BY name;
+----------+------------+
| name     | category   |
+----------+------------+
| touint16 | conversion |
| touint32 | conversion |
| touint8  | conversion |
+----------+------------+
```

`%` 和 `_` 是通配符，转义后可按字面匹配：

```sql
SELECT '50% off' NOT LIKE '50\\%%', '500 items' NOT LIKE '50\\%%', '500 items' NOT LIKE '50#%%' ESCAPE '#';
-- false, true, true
```
