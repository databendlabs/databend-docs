---
title: 创建数据库
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.339"/>

创建一个数据库。

请注意，从共享中创建数据库是 Databend Cloud 中共享功能的一部分。更多信息，请参见[共享](../08-share/index.md)。

## 语法

```sql
CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
```

## 示例

以下示例创建一个名为 `test` 的数据库：

```sql
CREATE DATABASE test;
```

以下示例从共享 `myshare` 中创建一个名为 `test` 的数据库：

```sql
CREATE DATABASE test FROM SHARE t;
```