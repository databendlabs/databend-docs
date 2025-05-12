---
title: CREATE FILE FORMAT
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

创建一个命名文件格式。

## 语法

```sql
CREATE [ OR REPLACE ] FILE FORMAT [ IF NOT EXISTS ] <format_name> FileFormatOptions
```

有关 `FileFormatOptions` 的详细信息，请参见 [输入 & 输出文件格式](../../../00-sql-reference/50-file-format-options.md)。

## 示例

```sql
CREATE FILE FORMAT my_custom_csv TYPE=CSV  FIELD_DELIMITER='\t' 
```