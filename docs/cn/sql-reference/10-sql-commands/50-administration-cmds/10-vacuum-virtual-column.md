---
title: VACUUM VIRTUAL COLUMN
---

删除某张表过期的虚拟列文件。

:::note
此命令需要虚拟列企业版功能。
:::

## 语法

```sql
VACUUM VIRTUAL COLUMN FROM [ <catalog_name>. ][ <database_name>. ]<table_name>
```

## 输出

返回被删除文件的数量。
