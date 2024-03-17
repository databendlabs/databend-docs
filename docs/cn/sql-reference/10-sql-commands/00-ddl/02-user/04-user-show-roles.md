---
title: 显示角色
sidebar_position: 6
---

列出分配给当前用户的所有角色。

## 语法

```sql
SHOW ROLES
```

## 输出

该命令返回一个表格，包含以下列：

| Column          | Description                      |
| --------------- | -------------------------------- |
| name            | 角色名称。                       |
| inherited_roles | 当前角色继承的角色数量。         |
| is_current      | 指示该角色是否当前处于激活状态。 |
| is_default      | 指示该角色是否为用户的默认角色。 |

## 示例

```sql
SHOW ROLES;

┌───────────────────────────────────────────────────────┐
│    name   │ inherited_roles │ is_current │ is_default │
├───────────┼─────────────────┼────────────┼────────────┤
│ developer │               0 │ false      │ false      │
│ public    │               0 │ false      │ false      │
│ writer    │               0 │ true       │ true       │
└───────────────────────────────────────────────────────┘
```
