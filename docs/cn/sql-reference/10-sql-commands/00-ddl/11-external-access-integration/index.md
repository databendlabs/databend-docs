---
title: 外部访问集成
---

External Access Integration 组合 Network Rule，并通过 `ENABLED` 开关控制远程标量 UDF 访问。在带有 `ADDRESS` 的函数定义中，使用 `EXTERNAL_ACCESS_INTEGRATIONS` 引用它。

管理 integration 需要全局 `SUPER` 权限。创建或修改 UDF 时，引用 integration 还需要该对象的 `USAGE` 权限。此功能不为内联脚本 UDF 提供网络访问能力。

| 命令 | 说明 |
|---|---|
| [CREATE EXTERNAL ACCESS INTEGRATION](ddl-create-external-access-integration.md) | 创建或替换 integration。 |
| [ALTER EXTERNAL ACCESS INTEGRATION](ddl-alter-external-access-integration.md) | 修改规则列表或启用状态。 |
| [DROP INTEGRATION](ddl-drop-integration.md) | 删除 integration。 |

## 相关主题

- [外部访问集成](/guides/security/external-access-integration)：配置与信任边界。
- [Network Rule 命令](../12-network-rule/index.md)。
- [CREATE FUNCTION](../11-external-function/ddl-create-function.md) 和 [ALTER FUNCTION](../11-external-function/ddl-alter-function.md)。
- [GRANT](../02-user/10-grant.md) 和 [REVOKE](../02-user/11-revoke.md)。
