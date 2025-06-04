---
title: 网络策略（Network Policy）
---

本页面全面概述了 Databend 中的网络策略操作，按功能分类以便参考。

## 网络策略管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE NETWORK POLICY](ddl-create-policy.md) | 创建基于 IP 地址控制访问的新网络策略 |
| [ALTER NETWORK POLICY](ddl-alter-policy.md) | 修改现有网络策略 |
| [DROP NETWORK POLICY](ddl-drop-policy.md) | 删除网络策略 |

## 网络策略信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE NETWORK POLICY](ddl-desc-policy.md) | 显示指定网络策略的详细信息 |
| [SHOW NETWORK POLICIES](ddl-show-policy.md) | 列出所有网络策略 |

## 相关主题

- [网络策略](/guides/security/network-policy)

:::note
Databend 的网络策略允许通过指定允许或阻止的 IP 地址及范围来控制数据库访问。
:::