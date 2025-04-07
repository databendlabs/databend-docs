---
title: SET SECONDARY ROLES
sidebar_position: 6
---

激活当前会话的所有二级角色。这意味着授予用户的所有二级角色都将处于活动状态，从而扩展用户的权限。有关活动角色和二级角色的更多信息，请参见 [活动角色和二级角色](/guides/security/access-control/roles#active-role--secondary-roles)。

另请参阅：[SET ROLE](04-user-set-role.md)

## 句法

```sql
SET SECONDARY ROLES { ALL | NONE }
```

| 参数 | 默认 | 描述                                                                                                               |
| ---- | ---- | ------------------------------------------------------------------------------------------------------------------ |
| ALL  | Yes  | 激活当前会话授予用户的所有二级角色，以及活动角色。这使用户能够利用与所有二级角色关联的权限。                       |
| NONE | No   | 停用当前会话的所有二级角色，这意味着只有活动角色的权限处于活动状态。这会将用户的权限限制为仅由活动角色授予的权限。 |

## 示例

本示例展示了二级角色如何工作以及如何激活/停用它们。

1. 以 root 用户身份创建角色。

首先，让我们创建两个角色 `admin` 和 `analyst`：

```sql
CREATE ROLE admin;

CREATE ROLE analyst;
```

2. 授予权限。

接下来，让我们授予每个角色一些权限。例如，我们将授予 `admin` 角色创建数据库的权限，并授予 `analyst` 角色从表中选择的权限：

```sql
GRANT CREATE DATABASE ON *.* TO ROLE admin;

GRANT SELECT ON *.* TO ROLE analyst;
```

3. 创建用户。

现在，让我们创建一个用户：

```sql
CREATE USER 'user1' IDENTIFIED BY 'password';
```

4. 分配角色。

将两个角色分配给用户：

```sql
GRANT ROLE admin TO 'user1';

GRANT ROLE analyst TO 'user1';
```

5. 设置活动角色。

现在，让我们以 `user1` 身份登录 Databend，并将活动角色设置为 `analyst`。

```sql
SET ROLE analyst;
```

默认情况下，所有二级角色都处于激活状态，因此我们可以创建一个新数据库：

```sql
CREATE DATABASE my_db;
```

6. 停用二级角色。

活动角色 `analyst` 没有 CREATE DATABASE 权限。当所有二级角色都被停用时，创建新数据库将失败。

```sql
SET SECONDARY ROLES NONE;

CREATE DATABASE my_db2;
error: APIError: ResponseError with 1063: Permission denied: privilege [CreateDatabase] is required on *.* for user 'user1'@'%' with roles [analyst,public]
```
