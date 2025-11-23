---
title: 安全与可靠性
---

Databend 提供**企业级的安全与可靠性功能**，在数据的整个生命周期内保护您的数据安全。从控制数据访问权限、防范网络威胁到从操作失误中恢复，Databend 的**多层安全方法**帮助您维护数据完整性、合规性和业务连续性。

| 安全功能 | 用途 | 使用场景 |
|-----------------|---------|------------|
| [**访问控制（Access Control）**](/guides/security/access-control) | 管理用户权限 | 当您需要通过基于角色的安全性和对象所有权来控制数据访问时 |
| [**审计追踪**](audit-trail.md) | 追踪数据库活动 | 当您需要全面的审计追踪来进行安全监控、合规性检查和性能分析时 |
| [**网络策略（Network Policy）**](/guides/security/network-policy) | 限制网络访问 | 当您希望即便拥有有效凭据，也只允许来自特定 IP 范围的连接时 |
| [**密码策略（Password Policy）**](/guides/security/password-policy) | 设置密码要求 | 当您需要强制执行密码复杂度、轮换和账户锁定规则时 |
| [**脱敏策略（Masking Policy）**](/guides/security/masking-policy) | 隐藏敏感数据 | 当您需要在保护机密数据的同时，仍然允许授权访问时 |
| [**故障保护（Fail-Safe）**](/guides/security/fail-safe) | 防止数据丢失 | 当您需要从兼容 S3 的存储中恢复意外删除的数据时 |
| [**从操作失误中恢复（Recovery from Errors）**](/guides/security/recovery-from-operational-errors) | 修复操作失误 | 当您需要从被删除的数据库/表或错误的数据修改中恢复时 |