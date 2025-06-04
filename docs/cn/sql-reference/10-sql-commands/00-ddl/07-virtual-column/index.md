---
title: 虚拟列（Virtual Column）
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

本页全面概述了 Databend 中的虚拟列操作，按功能组织以便参考。

## 虚拟列管理

| 命令 | 描述 |
|---------|-------------|
| [REFRESH VIRTUAL COLUMN](refresh-virtual-column.md) | 使用最新数据更新虚拟列 |
| [SHOW VIRTUAL COLUMNS](show-virtual-columns.md) | 列出表中的所有虚拟列 |

## 相关主题

- [虚拟列](/guides/performance/virtual-column)

:::note
Databend 中的虚拟列是从表中其他列计算得出的派生列。它们不物理存储，而是在查询执行期间按需计算。
:::