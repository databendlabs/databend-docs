---
title: CREATE DATABASE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.339"/>

创建数据库。

## 语法

```sql
CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
```

## 访问控制要求

| 权限            | 对象类型 | 描述         |
|:----------------|:----------|:-------------|
| CREATE DATABASE | 全局      | 创建数据库。 |

要创建数据库，执行操作的用户或[当前角色（current_role）](/guides/security/access-control/roles)必须拥有 CREATE DATABASE [权限（privilege）](/guides/security/access-control/privileges)。

## 示例

以下示例创建一个名为 `test` 的数据库：

```sql
CREATE DATABASE test;
```