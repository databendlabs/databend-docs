---
title: 删除文件格式
sidebar_position: 3
---

移除一个文件格式。

## 语法

```sql
DROP FILE FORMAT [ IF EXISTS ] <format_name>;
```

## 示例

```sql
DROP FILE FORMAT IF EXISTS my_custom_csv;
```