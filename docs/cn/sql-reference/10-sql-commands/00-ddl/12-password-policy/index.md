---
title: 密码策略（Password Policy）
---

本页面全面介绍了 Databend 中的密码策略操作，按功能分类整理以便参考。

## 密码策略管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE PASSWORD POLICY](create-password-policy.md) | 创建具有特定要求的新密码策略 |
| [ALTER PASSWORD POLICY](alter-password-policy.md) | 修改现有密码策略 |
| [DROP PASSWORD POLICY](drop-password-policy.md) | 删除密码策略 |

## 密码策略信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE PASSWORD POLICY](desc-password-policy.md) | 显示特定密码策略的详细信息 |
| [SHOW PASSWORD POLICIES](show-password-policies.md) | 列出所有密码策略 |

## 相关主题

- [密码策略](/guides/security/password-policy)

:::note
Databend 的密码策略允许您强制执行用户密码的安全要求，例如最小长度、复杂性和过期规则。
:::