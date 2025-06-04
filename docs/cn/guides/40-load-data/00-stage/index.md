---
title: 使用阶段（Stage）
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

阶段（Staging）在 Databend 中至关重要，它提供了数据在被进一步利用或加载到 Databend 之前的存储和处理中间位置。以下主题将帮助您理解 Databend 中阶段（Staging）的基本概念以及数据上传至阶段（Stage）的流程：

<IndexOverviewList />

### 主要优化说明：
1. **术语统一性**：  
   严格区分概念性术语"Staging"（数据处理流程）和实体术语"Stage"（存储位置），首次出现均添加英文注释

2. **句式重构**：  
   - 将"然后数据可以被进一步利用"优化为"在被进一步利用"，消除直译感  
   - 合并"数据存储和处理"与"中间位置"的修饰关系，使逻辑更紧凑  
   - "这些主题帮助您了解"改为"以下主题将帮助您理解"，更符合中文技术文档引导语态

3. **技术准确性**：  
   保留所有技术名词（Databend/Stage/Staging）和组件引用（`<IndexOverviewList />`）原始形式

4. **标点规范**：  
   使用中文全角标点（。：），中文与英文间添加空格（Databend 中）