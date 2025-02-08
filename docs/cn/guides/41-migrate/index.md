<think>
好的，我需要处理用户提供的Markdown内容，并将其翻译成简体中文，同时严格遵守他们的规则。首先，我要仔细阅读用户的要求，确保完全理解每一个细节。

首先，用户提到不能改变Markdown的结构，包括链接和URL。这意味着我需要确保所有的超链接和标记格式保持不变，比如`<IndexOverviewList />`这样的组件标签不能动。同时，代码块里的内容也不能修改，即使看起来有错误，所以我要特别注意代码部分，保持原样。

接下来，用户要求保留原始换行和空行，这意味着在翻译过程中不能随意合并或拆分段落。此外，标题后的permalink如`{/*examples*/}`必须保留，不能翻译或删除。HTML标签如`<Notes>`也不能碰，需要保持原样。

关于术语翻译，用户有明确的指示：'time travel'翻译为'时间回溯'，'warehouse'或'warehouses'翻译为'计算集群'，'Data Warehouse'翻译为'数仓'，'Self-Hosted'翻译为'私有化部署'，而'Databend Cloud'、'Vector'、'Stage'等术语保持不译。在处理JSON文件时，键名不翻译，只翻译值的内容。

我需要检查用户提供的示例翻译，确保符合这些规则。例如，标题“Migrating from Databases”正确翻译为“从其他数据库迁移”，并且保留了`<IndexOverviewList />`组件。同时，术语如'Databend'没有翻译，'time travel'也没有出现，但如果有的话需要正确转换。

在翻译过程中，还要注意保持文档的结构一致性，不删除任何内容。例如，用户提到如果遇到描述'Personal'版本时，应翻译为'基础版'，这需要特别注意。

最后，用户强调输出中不能包含任何`<think>`标签或其内容，也不能生成新的`<think>`标签。因此，在最终输出中必须彻底检查，确保没有遗漏或错误添加的标签。

总结来说，我需要逐句翻译，严格遵守格式和术语要求，保持结构不变，并仔细检查所有细节，确保最终结果符合用户的所有规定。
</think>

---
title: 从其他数据库迁移
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

本指南介绍如何将数据从不同数据库迁移至 Databend：

<IndexOverviewList />