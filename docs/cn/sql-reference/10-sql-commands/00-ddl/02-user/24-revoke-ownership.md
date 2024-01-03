---
title: 撤销所有权
sidebar_position: 14
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.275"/>

撤销指定角色对特定数据库对象（如表、阶段或用户定义的函数）的所有权。

另见：[授予所有权](23-grant-ownership.md)

## 语法

```sql
-- 撤销角色对数据库中特定表的所有权
REVOKE OWNERSHIP ON <database_name>.<table_name> FROM ROLE '<role_name>'

-- 撤销角色对阶段的所有权
REVOKE OWNERSHIP ON STAGE <stage_name> FROM ROLE '<role_name>'

-- 撤销角色对用户定义函数（UDF）的所有权
REVOKE OWNERSHIP ON UDF <udf_name> FROM ROLE '<role_name>'
```

## 示例

```sql
-- 撤销角色 'data_owner' 对 'finance_data' 数据库中所有表的所有权
REVOKE OWNERSHIP ON finance_data.* FROM ROLE 'data_owner';

-- 撤销角色 'data_owner' 对 'finance_data' 数据库中 'transactions' 表的所有权
REVOKE OWNERSHIP ON finance_data.transactions FROM ROLE 'data_owner';

-- 撤销角色 'data_owner' 对 'ingestion_stage' 阶段的所有权
REVOKE OWNERSHIP ON STAGE ingestion_stage FROM ROLE 'data_owner';

-- 撤销角色 'data_owner' 对用户定义函数 'calculate_profit' 的所有权
REVOKE OWNERSHIP ON UDF calculate_profit FROM ROLE 'data_owner';
```