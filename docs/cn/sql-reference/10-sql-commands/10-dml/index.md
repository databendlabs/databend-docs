---
title: DML（数据操作语言）命令
---

本页面提供 Databend 中 DML（数据操作语言）命令的参考信息。

## 数据修改

| 命令 | 描述 |
|---------|-------------|
| **[INSERT](dml-insert)** | 向表中添加新行 |
| **[INSERT MULTI](dml-insert-multi)** | 在一个语句中向多个表插入数据 |
| **[UPDATE](dml-update)** | 修改表中的现有行 |
| **[DELETE](dml-delete-from)** | 从表中删除行 |
| **[REPLACE](dml-replace)** | 插入新行或更新现有行 |
| **[MERGE](dml-merge)** | 根据条件执行 upsert（更新插入）操作 |

## 数据加载与导出

| 命令 | 描述 |
|---------|-------------|
| **[COPY INTO Table](dml-copy-into-table)** | 将数据从文件加载到表中 |
| **[COPY INTO Location](dml-copy-into-location)** | 将表数据导出到文件 |