---
title: SHOW_GRANTS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.704"/>

列出授予角色的权限、授予用户的角色，以及特定对象的权限。

另请参阅：[SHOW GRANTS](/sql/sql-commands/ddl/user/show-grants)

## 语法

```sql
SHOW_GRANTS('role', '<role_name>')
SHOW_GRANTS('user', '<user_name>')
SHOW_GRANTS('stage', '<stage_name>')
SHOW_GRANTS('udf', '<udf_name>')
SHOW_GRANTS('table', '<table_name>', '<catalog_name>', '<db_name>')
SHOW_GRANTS('database', '<db_name>', '<catalog_name>')
```

## 配置 `enable_expand_roles` 设置

`enable_expand_roles` 设置控制 SHOW_GRANTS 函数在显示权限时是否展开角色继承。

- `enable_expand_roles=1`（默认）：

    - SHOW_GRANTS 递归展开继承的权限，这意味着如果一个角色被授予了另一个角色，它将显示所有继承的权限。
    - 用户还将看到通过其分配的角色授予的所有权限。

- `enable_expand_roles=0`：

    - SHOW_GRANTS 仅显示直接分配给指定角色或用户的权限。
    - 但是，结果仍将包括 GRANT ROLE 语句以指示角色继承。

例如，角色 `a` 在 `t1` 上具有 `SELECT` 权限，角色 `b` 在 `t2` 上具有 `SELECT` 权限：

```sql
SELECT grants FROM show_grants('role', 'a') ORDER BY object_id;

┌──────────────────────────────────────────────────────┐
│                        grants                        │
├──────────────────────────────────────────────────────┤
│ GRANT SELECT ON 'default'.'default'.'t1' TO ROLE `a` │
└──────────────────────────────────────────────────────┘

SELECT grants FROM show_grants('role', 'b') ORDER BY object_id;

┌──────────────────────────────────────────────────────┐
│                        grants                        │
├──────────────────────────────────────────────────────┤
│ GRANT SELECT ON 'default'.'default'.'t2' TO ROLE `b` │
└──────────────────────────────────────────────────────┘
```

如果将角色 `b` 授予角色 `a` 并再次检查角色 `a` 的权限，可以看到角色 `a` 现在包含了在 `t2` 上的 `SELECT` 权限：

```sql
GRANT ROLE b TO ROLE a;
```

```sql
SELECT grants FROM show_grants('role', 'a') ORDER BY object_id;

┌──────────────────────────────────────────────────────┐
│                        grants                        │
├──────────────────────────────────────────────────────┤
│ GRANT SELECT ON 'default'.'default'.'t1' TO ROLE `a` │
│ GRANT SELECT ON 'default'.'default'.'t2' TO ROLE `a` │
└──────────────────────────────────────────────────────┘
```

如果将 `enable_expand_roles` 设置为 `0` 并再次检查角色 `a` 的权限，结果将显示 `GRANT ROLE` 语句，而不是列出从角色 `b` 继承的具体权限：

```sql
SET enable_expand_roles=0;
```

```sql
SELECT grants FROM show_grants('role', 'a') ORDER BY object_id;

┌──────────────────────────────────────────────────────┐
│                        grants                        │
├──────────────────────────────────────────────────────┤
│ GRANT SELECT ON 'default'.'default'.'t1' TO ROLE `a` │
│ GRANT ROLE b to ROLE `a`                             │
│ GRANT ROLE public to ROLE `a`                        │
└──────────────────────────────────────────────────────┘
```

## 示例

此示例展示了如何列出用户的角色授权、角色权限以及特定对象的权限。

```sql
-- 创建新用户
CREATE USER 'user1' IDENTIFIED BY 'password';

-- 创建新角色
CREATE ROLE analyst;

-- 将 analyst 角色授予用户
GRANT ROLE analyst TO 'user1';

-- 创建 stage
CREATE STAGE my_stage;

-- 将 stage 上的权限授予角色
GRANT READ ON STAGE my_stage TO ROLE analyst;

-- 列出用户的授权
SELECT * FROM SHOW_GRANTS('user', 'user1');

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │  name  │                    grants                   │
├────────────┼─────────────┼──────────────────┼──────────┼────────┼─────────────────────────────────────────────┤
│ Read       │ my_stage    │             NULL │ USER     │ user1  │ GRANT Read ON STAGE my_stage TO 'user1'@'%' │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 列出授予角色的权限
SELECT * FROM SHOW_GRANTS('role', 'analyst');

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │   name  │                     grants                     │
├────────────┼─────────────┼──────────────────┼──────────┼─────────┼────────────────────────────────────────────────┤
│ Read       │ my_stage    │             NULL │ ROLE     │ analyst │ GRANT Read ON STAGE my_stage TO ROLE `analyst` │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 列出授予 stage 的权限
SELECT * FROM SHOW_GRANTS('stage', 'my_stage');

┌─────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │   name  │      grants      │
├────────────┼─────────────┼──────────────────┼──────────┼─────────┼──────────────────┤
│ Read       │ my_stage    │             NULL │ ROLE     │ analyst │                  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```
