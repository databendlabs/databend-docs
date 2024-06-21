---
title: 启用辅助角色
sidebar_position: 6
---

激活当前会话中的所有辅助角色。这意味着用户被授予的所有辅助角色都将处于活动状态，从而扩展用户的权限。关于活动角色和辅助角色的更多信息，请参阅[活动角色与辅助角色](/guides/security/access-control/roles#活动角色--辅助角色)。

另请参阅：[SET ROLE](04-user-set-role.md)

## 语法

```sql
SET SECONDARY ROLES { ALL | NONE }
```

| 参数 | 默认值 | 描述                                                                                                         |
| ---- | ------ | ------------------------------------------------------------------------------------------------------------ |
| ALL  | 是     | 激活当前会话中用户被授予的所有辅助角色，除了活动角色。这使得用户能够利用所有辅助角色关联的权限。             |
| NONE | 否     | 停用当前会话中的所有辅助角色，意味着只有活动角色的权限是活动的。这限制了用户的权限仅为活动角色所授予的权限。 |

## 示例

本示例展示了辅助角色的工作原理以及如何激活/停用它们。

1. 以 root 用户创建角色。

首先，创建两个角色，`admin` 和 `analyst`：

```sql
CREATE ROLE admin;

CREATE ROLE analyst;
```

2. 授予权限。

接下来，为每个角色授予一些权限。例如，我们将授予`admin`角色创建数据库的能力，以及`analyst`角色从表中选择的能力：

```sql
GRANT CREATE DATABASE ON *.* TO ROLE admin;

GRANT SELECT ON *.* TO ROLE analyst;
```

3. 创建用户。

现在，创建一个用户：

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

现在，以`user1`身份登录 Databend，并将活动角色设置为`analyst`。

```sql
SET ROLE analyst;
```

默认情况下，所有辅助角色都是激活的，因此我们可以创建一个新数据库：

```sql
CREATE DATABASE my_db;
```

6. 停用辅助角色。

活动角色`analyst`没有 CREATE DATABASE 权限。当所有辅助角色被停用时，创建新数据库将失败。

```sql
SET SECONDARY ROLES NONE;

CREATE DATABASE my_db2;
error: APIError: ResponseError with 1063: Permission denied: privilege [CreateDatabase] is required on *.* for user 'user1'@'%' with roles [analyst,public]
```
