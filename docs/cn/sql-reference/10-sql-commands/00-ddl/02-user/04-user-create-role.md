---
title: CREATE ROLE
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.703"/>

创建一个新的角色（Role）用于访问控制。角色（Role）用于对权限进行分组，可以分配给用户或其他角色（Role），为在 Databend 中管理权限提供了一种灵活的方式。

## 语法

```sql
CREATE ROLE [ IF NOT EXISTS ] <name>
```

**参数：**

- `IF NOT EXISTS`：仅在角色（Role）不存在时创建（推荐使用以避免错误）。
- `<name>`：角色（Role）名称（不能包含单引号、双引号、退格符或换页符）。

## 示例

```sql
-- 创建一个基本角色（Role）
CREATE ROLE analyst;

-- 仅在角色（Role）不存在时创建（推荐）
CREATE ROLE IF NOT EXISTS data_viewer;
```

## 常用模式

### 只读分析师角色（Role）

为需要读取销售数据权限的数据分析师创建一个角色（Role）：

```sql
-- 创建分析师角色（Role）
CREATE ROLE sales_analyst;

-- 授予读取权限
GRANT SELECT ON sales_db.* TO ROLE sales_analyst;

-- 分配给用户
GRANT ROLE sales_analyst TO 'alice';
GRANT ROLE sales_analyst TO 'bob';
```

### 数据库管理员角色（Role）

为需要完全控制权限的管理员创建一个角色（Role）：

```sql
-- 创建管理员角色（Role）
CREATE ROLE sales_admin;

-- 授予数据库的完全权限
GRANT ALL ON sales_db.* TO ROLE sales_admin;

-- 授予用户管理权限
GRANT CREATE USER, CREATE ROLE ON *.* TO ROLE sales_admin;

-- 分配给管理员用户
GRANT ROLE sales_admin TO 'admin_user';
```

### 验证

```sql
-- 检查每个角色（Role）可以执行的操作
SHOW GRANTS FOR ROLE sales_analyst;
SHOW GRANTS FOR ROLE sales_admin;

-- 检查用户权限
SHOW GRANTS FOR 'alice';
SHOW GRANTS FOR 'admin_user';
```

## 另请参阅

- [GRANT](10-grant.md) - 授予权限和角色（Role）
- [SHOW GRANTS](22-show-grants.md) - 查看已授予的权限
- [DROP ROLE](05-user-drop-role.md) - 删除角色（Role）