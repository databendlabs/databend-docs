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
* 如果 role 已经授予给用户，Databend 无法自动删除 role 中的授权。

## Examples

```sql
DROP ROLE role1;
```