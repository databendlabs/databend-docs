---
title: 变量（Variable）
---

本文档全面介绍 Databend 中的变量操作，按功能分类以便查阅。

## 变量管理

| 命令 | 描述 |
|---------|-------------|
| [SET](set-variable.md) | 创建或修改会话/用户变量 |
| [UNSET](unset-variable.md) | 删除用户定义变量 |

## 变量信息

| 命令 | 描述 |
|---------|-------------|
| [SHOW VARIABLES](show-variables.md) | 显示系统及用户变量的当前值 |

:::note
Databend 的变量支持在会话内或跨会话存储和重用值，使脚本更具动态性与可重用性。
:::