---
title: SET SECONDARY ROLES
sidebar_position: 6
---

激活当前会话的所有辅助角色。这意味着用户被授予的所有辅助角色都将处于活动状态，扩展用户的权限。有关活动角色和辅助角色的更多信息，请参阅[活动角色与辅助角色](/guides/security/access-control/roles#active-role--secondary-roles)。

另请参阅：[SET ROLE](04-user-set-role.md)

## 语法

```sql
SET SECONDARY ROLES { ALL | NONE }
```

| 参数    | 默认值 | 描述                                                                                                                                                                                     |
|---------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ALL     | 是     | 激活用户在当前会话中被授予的所有辅助角色，除了活动角色。这使得用户能够利用所有辅助角色关联的权限。                                                                                     |
| NONE    | 否     | 停用当前会话的所有辅助角色，意味着只有活动角色的权限是活动的。这将用户的权限限制为仅由活动角色授予的权限。                                                                               |

## 示例

此示例展示了辅助角色如何工作以及如何激活/停用它们。

1. 以用户 root 创建角色。

首先，让我们创建两个角色，`admin` 和 `analyst`：

```sql
CREATE ROLE admin;

CREATE ROLE analyst;
```

2. 授予权限。

接下来，让我们为每个角色授予一些权限。例如，我们将授予 `admin` 角色创建数据库的能力，以及 `analyst` 角色从表中选择的能力：

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

所有辅助角色默认情况下都是激活的，因此我们可以创建一个新的数据库：

```sql
CREATE DATABASE my_db;
```

6. 停用辅助角色。

活动角色 `analyst` 没有 CREATE DATABASE 权限。当所有辅助角色被停用时，创建新数据库将失败。

```sql
SET SECONDARY ROLES NONE;

CREATE DATABASE my_db2;
error: APIError: ResponseError with 1063: Permission denied: privilege [CreateDatabase] is required on *.* for user 'user1'@'%' with roles [analyst,public]
```