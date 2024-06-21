---
title: 显示授权
sidebar_position: 10
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.487"/>

列出明确授予给用户、角色或特定对象的权限。

相关内容:

- [SHOW_GRANTS](/sql/sql-functions/table-functions/show-grants)
- [GRANT](10-grant.md)
- [REVOKE](11-revoke.md)

## 语法

```sql
-- 列出授予给用户的权限
SHOW GRANTS FOR <user_name> [ LIKE '<pattern>' | WHERE <expr> | LIMIT <limit> ]

-- 列出授予给角色的权限
SHOW GRANTS FOR ROLE <role_name> [ LIKE '<pattern>' | WHERE <expr> | LIMIT <limit> ]

-- 列出授予给对象的权限
SHOW GRANTS ON { STAGE | TABLE | DATABASE | UDF } <object_name> [ LIKE '<pattern>' | WHERE <expr> | LIMIT <limit> ]
```

## 示例

本示例展示了如何列出授予给用户、角色以及特定对象的权限。

```sql
-- 创建新用户
CREATE USER 'user1' IDENTIFIED BY 'password';

-- 创建新角色
CREATE ROLE analyst;

-- 将分析员角色授予用户
GRANT ROLE analyst TO 'user1';

-- 创建数据库
CREATE DATABASE my_db;

-- 将数据库权限授予角色
GRANT OWNERSHIP ON my_db.* TO ROLE analyst;

-- 列出授予给用户的权限
SHOW GRANTS FOR user1;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │  name  │                         grants                        │
├────────────┼─────────────┼──────────────────┼──────────┼────────┼───────────────────────────────────────────────────────┤
│ OWNERSHIP  │ my_db       │               16 │ USER     │ user1  │ GRANT OWNERSHIP ON 'default'.'my_db'.* TO 'user1'@'%' │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 列出授予给角色的权限
SHOW GRANTS FOR ROLE analyst;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │   name  │                          grants                          │
├────────────┼─────────────┼──────────────────┼──────────┼─────────┼──────────────────────────────────────────────────────────┤
│ OWNERSHIP  │ my_db       │               16 │ ROLE     │ analyst │ GRANT OWNERSHIP ON 'default'.'my_db'.* TO ROLE `analyst` │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
-- 列出授予给数据库的权限
SHOW GRANTS ON DATABASE my_db;

┌─────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │   name  │      grants      ├────────────┼─────────────┼──────────────────┼──────────┼─────────┼──────────────────┤
│ OWNERSHIP  │ my_db       │               16 │ ROLE     │ analyst │                  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```
