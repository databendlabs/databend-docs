---
title: DROP ROLE
sidebar_position: 8
---

从系统中删除指定的 role。

## Syntax

```sql
DROP ROLE [ IF EXISTS ] <role_name>
```

## Usage Notes
* 如果 role 授予给了用户，Databend 无法自动从 role 中删除授权。

## Examples

```sql
DROP ROLE role1;
```