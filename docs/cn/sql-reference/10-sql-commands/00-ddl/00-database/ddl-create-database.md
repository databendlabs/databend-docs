---
title: 创建数据库
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.339"/>

创建一个数据库。

## 语法

```sql
CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
```

## 示例

以下示例创建一个名为 `test` 的数据库：

```sql
CREATE DATABASE test;
```