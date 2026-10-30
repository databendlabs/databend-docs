---
title: 网络规则
---

Network Rule 定义远程 Arrow Flight UDF 服务器的允许目标。External Access Integration 组合这些规则，UDF 通过 `EXTERNAL_ACCESS_INTEGRATIONS` 引用 integration。

当前仅支持 `TYPE = HOST_PORT` 和 `MODE = EGRESS`。管理规则需要全局 `SUPER` 权限。

| 命令 | 说明 |
|---|---|
| [CREATE NETWORK RULE](ddl-create-network-rule.md) | 创建或替换主机/端口规则。 |
| [ALTER NETWORK RULE](ddl-alter-network-rule.md) | 替换允许的目标列表。 |
| [DROP NETWORK RULE](ddl-drop-network-rule.md) | 删除规则。 |

## 相关主题

- [外部访问集成](/guides/security/external-access-integration)：配置、operator 限制、权限和变更传播。
- [External Access Integration 命令](../11-external-access-integration/index.md)。
- [Network Policy](../12-network-policy/index.md)：控制客户端连接 Databend，不控制远程 UDF 目标。
