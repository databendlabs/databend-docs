---
title: 掩码策略（Masking Policy）
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

本页面提供了 Databend 中掩码策略（Masking Policy）操作的全面概述，按功能组织以便于参考。

## 掩码策略管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE MASKING POLICY](create-mask-policy.md) | 创建新的掩码策略用于数据混淆 |
| [DESCRIBE MASKING POLICY](desc-mask-policy.md) | 显示特定掩码策略的详细信息 |
| [DROP MASKING POLICY](drop-mask-policy.md) | 删除掩码策略 |

## 相关主题

- [掩码策略](/guides/security/masking-policy)

:::note
Databend 中的掩码策略允许您在用户没有适当权限查询时，动态转换或混淆敏感数据以保护数据。
:::