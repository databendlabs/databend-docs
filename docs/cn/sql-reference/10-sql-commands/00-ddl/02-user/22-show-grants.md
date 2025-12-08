---
title: SHOW GRANTS
sidebar_position: 10
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.845"/>

列出明确授予用户、角色或特定对象的权限。

参阅：

- [SHOW_GRANTS](/sql/sql-functions/table-functions/show-grants)
- [GRANT](10-grant.md)
- [REVOKE](11-revoke.md)

## 语法

```sql
-- 列出授予用户的权限
SHOW GRANTS FOR <user_name> [ LIKE '<pattern>' | WHERE <expr> | LIMIT <limit> ]

-- 列出授予角色的权限
SHOW GRANTS FOR ROLE <role_name> [ LIKE '<pattern>' | WHERE <expr> | LIMIT <limit> ]

SHOW GRANTS ON { STAGE | TABLE | DATABASE | UDF | MASKING POLICY | ROW ACCESS POLICY } <object_name> [ LIKE '<pattern>' | WHERE <expr> | LIMIT <limit> ]

-- 列出所有已直接授予 role_name 的用户和角色。
SHOW GRANTS OF ROLE <role_name>
     
```

## 示例

此示例说明如何列出授予用户、角色和特定对象的权限。

```sql
-- 创建新用户
CREATE USER 'user1' IDENTIFIED BY 'password';

-- 创建新角色
CREATE ROLE analyst;

-- 授予用户 analyst 角色
GRANT ROLE analyst TO 'user1';

-- 创建数据库
CREATE DATABASE my_db;

-- 授予角色数据库权限
GRANT OWNERSHIP ON my_db.* TO ROLE analyst;

-- 列出授予用户的权限
SHOW GRANTS FOR user1;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │  name  │                         grants                        │
├────────────┼─────────────┼──────────────────┼──────────┼────────┼───────────────────────────────────────────────────────┤
│ OWNERSHIP  │ my_db       │               16 │ USER     │ user1  │ GRANT OWNERSHIP ON 'default'.'my_db'.* TO 'user1'@'%' │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 列出授予角色的权限
SHOW GRANTS FOR ROLE analyst;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │   name  │                          grants                          │
├────────────┼─────────────┼──────────────────┼──────────┼─────────┼──────────────────────────────────────────────────────────┤
│ OWNERSHIP  │ my_db       │               16 │ ROLE     │ analyst │ GRANT OWNERSHIP ON 'default'.'my_db'.* TO ROLE `analyst` │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
-- 列出授予数据库的权限
SHOW GRANTS ON DATABASE my_db;

┌─────────────────────────────────────────────────────────────────────────────────────┐
│ privileges │ object_name │     object_id    │ grant_to │   name  │      grants      ├────────────┼─────────────┼──────────────────┼──────────┼─────────┼──────────────────┤
│ OWNERSHIP  │ my_db       │               16 │ ROLE     │ analyst │                  │
└─────────────────────────────────────────────────────────────────────────────────────┘

-- 列出所有已直接授予 role_name 的用户和角色。
-- 此命令仅显示 role_name 的直接被授权者。
-- 这意味着它列出了通过 GRANT ROLE role_name TO <user_or_role> 语句明确接收角色的用户和角色。
-- 它不显示通过角色层次结构或继承间接获取 role_name 的用户或角色。
SHOW GRANTS OF ROLE analyst

╭─────────────────────────────────────╮
│   role  │ granted_to │ grantee_name │
│  String │   String   │    String    │
├─────────┼────────────┼──────────────┤
│ analyst │ USER       │ user1        │
╰─────────────────────────────────────╯


SHOW GRANTS ON MASKING POLICY email_mask;

-- 查看 Row Access Policy 的授权
SHOW GRANTS ON ROW ACCESS POLICY rap_region;
```
