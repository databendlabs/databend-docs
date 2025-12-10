---
title: SYSTEM FLUSH PRIVILEGES
---

`SYSTEM FLUSH PRIVILEGES` 会向每个查询节点广播刷新请求，使其立即从 Meta 服务重新加载角色与权限缓存。执行 `GRANT` 或 `REVOKE` 之后如果希望变更立刻在整个集群生效，可以使用该命令，而不用等待默认 15 秒的缓存刷新周期。

参见：

- [GRANT](../00-ddl/02-user/10-grant.md)
- [REVOKE](../00-ddl/02-user/11-revoke.md)

## 语法

```sql
SYSTEM FLUSH PRIVILEGES
```

## 使用说明

- 需要具备能够执行系统管理命令的角色，例如 `ACCOUNT ADMIN`。
- 该命令仅刷新节点本地缓存，不会修改角色或授权内容本身。
- 已经在运行的语句会继续沿用启动时解析到的权限，若要使用最新权限，请在刷新之后重新执行语句。

## 示例

下面的示例为角色授予数据库访问权限，并立即刷新缓存，使所有查询节点都能看到新的权限：

```sql
GRANT SELECT ON DATABASE marketing TO ROLE analyst;

SYSTEM FLUSH PRIVILEGES;
```


刷新完成后，继承 `analyst` 角色的新查询无需等待缓存失效即可获得更新后的权限。
