---
title: CREATE ROLE
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.703"/>

创建一个新角色。

创建角色后，您可以将对象权限授予该角色，从而为系统中的对象启用访问控制安全。

另请参阅：[GRANT](10-grant.md)

## 语法

```sql
CREATE ROLE [ IF NOT EXISTS ] <name> [ COMMENT = '<string_literal>' ]
```

- `<name>` 不能包含以下非法字符：
    - 单引号 (')
    - 双引号 (")
    - 退格符 (\b)
    - 换页符 (\f)

## 示例

```sql
CREATE ROLE role1;
```