---
title: 授予所有权
sidebar_position: 13
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

授予特定数据库对象（如表、Stage 或用户定义的函数）的所有权给指定角色。

- 不能为`default`数据库中的表授予所有权，因为它由内置角色`account_admin`拥有。
- 出于安全原因，不支持将所有权授予内置角色`public`。

另见：[撤销所有权](24-revoke-ownership.md)

## 语法

```sql
-- 授予数据库中特定表的所有权给一个角色
GRANT OWNERSHIP ON <database_name>.<table_name> TO ROLE '<role_name>'

-- 授予Stage的所有权给一个角色
GRANT OWNERSHIP ON STAGE <stage_name> TO ROLE '<role_name>'

-- 授予用户定义函数（UDF）的所有权给一个角色
GRANT OWNERSHIP ON UDF <udf_name> TO ROLE '<role_name>'
```

## 示例

```sql
-- 授予'finance_data'数据库中所有表的所有权给角色'data_owner'
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- 授予'finance_data'模式中的表'transactions'的所有权给角色'data_owner'
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- 授予Stage'ingestion_stage'的所有权给角色'data_owner'
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- 授予用户定义函数'calculate_profit'的所有权给角色'data_owner'
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```
