移除系统中指定的 role。

## 语法

```sql
DROP ROLE [ IF EXISTS ] <role_name>
```

## 使用说明
* 如果 role 已经授权给用户，Databend 无法自动删除 role 的授权。

## 示例

```sql
DROP ROLE role1;
```