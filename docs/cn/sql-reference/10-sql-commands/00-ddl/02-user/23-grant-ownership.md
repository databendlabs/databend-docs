---
title: 授予所有权
sidebar_position: 13
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.275"/>

授予特定数据库对象（如表、Stage 或用户定义的函数）的所有权给指定的角色。有关管理所有权的更多信息，请参阅[管理所有权](/guides/security/access-control#managing-ownership)。

另见：[撤销所有权](24-revoke-ownership.md)

## 语法

```sql
-- 授予某个数据库中特定表的所有权给一个角色
GRANT OWNERSHIP ON <database_name>.<table_name> TO ROLE '<role_name>'

-- 授予一个Stage的所有权给一个角色
GRANT OWNERSHIP ON STAGE <stage_name> TO ROLE '<role_name>'

-- 授予一个用户定义函数（UDF）的所有权给一个角色
GRANT OWNERSHIP ON UDF <udf_name> TO ROLE '<role_name>'
```

## 示例

```sql
-- 授予 'finance_data' 数据库中所有表的所有权给角色 'data_owner'
GRANT OWNERSHIP ON finance_data.* TO ROLE 'data_owner';

-- 授予 'finance_data' 数据库模式中的 'transactions' 表的所有权给角色 'data_owner'
GRANT OWNERSHIP ON finance_data.transactions TO ROLE 'data_owner';

-- 授予 Stage 'ingestion_stage' 的所有权给角色 'data_owner'
GRANT OWNERSHIP ON STAGE ingestion_stage TO ROLE 'data_owner';

-- 授予用户定义函数 'calculate_profit' 的所有权给角色 'data_owner'
GRANT OWNERSHIP ON UDF calculate_profit TO ROLE 'data_owner';
```
