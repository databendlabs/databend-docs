---
title: 行访问策略（Row Access Policy）
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ROW ACCESS POLICY'/>

本页面提供 Databend 中 Row Access Policy（行访问策略）相关命令的参考。

## 行访问策略管理

| 命令 | 描述 |
|------|------|
| [CREATE ROW ACCESS POLICY](create-row-access-policy.md) | 创建行级过滤策略 |
| [DESCRIBE ROW ACCESS POLICY](desc-row-access-policy.md) | 查看行访问策略详情 |
| [DROP ROW ACCESS POLICY](drop-row-access-policy.md) | 删除行访问策略 |

## 相关主题

- [行访问策略](/guides/security/row-access-policy)
- [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#row-access-policy-操作)
- [POLICY_REFERENCES](/sql/sql-functions/table-functions/policy-references)

:::note
Row Access Policy 在查询时过滤行。受保护的表只返回策略表达式计算结果为 `TRUE` 的行。
:::
