---
title: CREATE USER
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: Unreleased"/>

创建用于连接 Databend 的 SQL 用户。用户必须被授予适当权限，才能访问数据库并执行操作。

另请参阅：
- [GRANT](10-grant.md)
- [ALTER USER](03-user-alter-user.md)
- [DROP USER](02-user-drop-user.md)

## 语法

```sql
CREATE [ OR REPLACE ] USER <name> IDENTIFIED [ WITH <auth_type> ] BY '<password>' 
[ WITH MUST_CHANGE_PASSWORD = true | false ]
[ WITH SET PASSWORD POLICY = '<policy_name>' ]
[ WITH SET NETWORK POLICY = '<policy_name>' ]
[ WITH DEFAULT_ROLE = '<role_name>' ]
[ WITH DISABLED = true | false ]
```

**参数：**
- `<name>`：用户名（不能包含单引号、双引号、退格符或换页符）
- `<auth_type>`：认证类型 - `double_sha1_password`（默认）、`sha256_password` 或 `no_password`
- `MUST_CHANGE_PASSWORD`：为 `true` 时，用户首次登录必须修改密码
- `DEFAULT_ROLE`：设置默认角色。角色必须已经存在。非 `public` 角色会授予新用户；`public` 保持隐式可用。
- `DISABLED`：为 `true` 时，用户创建后即被禁用，无法登录

## 默认角色行为

指定 `DEFAULT_ROLE` 时，Databend 会检查角色是否存在。对于非 `public` 角色，还会将角色授予新用户，无需额外执行 `GRANT ROLE`。用户登录时会默认激活该角色。

创建用户需要全局 `CREATE USER` 权限。指定非 `public` 默认角色还需要全局 `GRANT` 权限。`DEFAULT_ROLE = public` 不需要额外的 `GRANT` 权限，也不会新增显式角色授权，因为 `public` 对所有用户隐式可用。如果角色不存在，语句会失败，不会创建或替换用户。

`CREATE USER IF NOT EXISTS` 不会修改已有用户的默认角色或角色授权。要修改已有用户的默认角色，请使用 [ALTER USER](03-user-alter-user.md)。该角色必须通过直接授权或角色继承对目标用户可用，或为隐式可用的 `public` 角色。

## 示例

### 示例 1：全库读写访问

创建拥有所有数据库读写权限的用户：

```sql
-- 创建全局访问角色
CREATE ROLE full_access_role;
GRANT ALL ON *.* TO ROLE full_access_role;

-- 创建用户并分配角色
CREATE USER admin_user IDENTIFIED BY 'SecurePass456!' WITH DEFAULT_ROLE = 'full_access_role';
```

### 示例 2：全库只读访问

创建仅能查询数据的用户，适用于仪表盘或 BI 工具：

```sql
-- 创建只读角色
CREATE ROLE readonly_role;
GRANT SELECT ON *.* TO ROLE readonly_role;

-- 创建用户
CREATE USER readonly_user IDENTIFIED BY 'ReadOnly789!' WITH DEFAULT_ROLE = 'readonly_role';
```

### 示例 3：单数据库访问

创建角色并授予数据库权限，然后将角色授予用户：

```sql
-- 创建角色并授予数据库权限
CREATE ROLE data_analyst_role;
GRANT SELECT, INSERT ON default.* TO ROLE data_analyst_role;

-- 创建用户并授予角色
CREATE USER data_analyst IDENTIFIED BY 'secure_password123' WITH DEFAULT_ROLE = 'data_analyst_role';
```

验证角色及权限：
```sql
SHOW GRANTS FOR ROLE data_analyst_role;
```

### 示例 4：创建不同认证类型的用户

```sql
-- 使用默认认证创建用户
CREATE USER user1 IDENTIFIED BY 'abc123';

-- 使用 SHA256 认证创建用户
CREATE USER user2 IDENTIFIED WITH sha256_password BY 'abc123';
```
