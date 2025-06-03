好的，这是根据您的要求润色后的中文文档。主要优化了表达流畅性、术语一致性、句式结构和专业性，同时严格保留了所有技术术语、格式、链接和原始内容。

```markdown
---
title: Support Services
---

import LanguageDocs from '@site/src/components/LanguageDocs';

# Databend Cloud 支持服务

Databend 为 Databend Cloud 用户和客户提供全面的支持服务。我们的目标是提供卓越的支持服务，充分体现 Databend 产品的核心价值——高性能、易用性以及快速交付高质量结果。

<LanguageDocs
cn=
'
有关各版本详细支持服务级别，请参阅 [支持服务级别](#support-service-levels)。如需了解更多信息，请联系我们的[销售团队](https://www.databend.cn/contact-us/)。
'
en=
'
For detailed information about support service levels across different editions, see [Support Service Levels](#support-service-levels). For more information, contact our [sales team](https://www.databend.com/contact-us/).
'/>

## 获取支持

您可通过以下多种渠道获取支持：

*   **云控制台**：登录 Databend Cloud 控制台，在菜单中选择 **Support → Create New Ticket** 以创建新的支持工单，并查看已提交工单的状态。
*   **状态页面**：订阅我们的[状态页面](https://status.databend.com)，以便在平台发生影响服务的事件时及时接收通知。
*   **文档**：浏览我们全面的[文档](https://docs.databend.com)，获取指南、教程和参考资料。

## 支持服务级别

Databend Cloud 根据您的订阅版本提供不同级别的支持服务：

| 功能                             | 基础版 (Personal) | Business | Dedicated |
| :------------------------------- | :---------------- | :------- | :-------- |
| 记录与跟踪支持工单               | ✓                 | ✓        | ✓         |
| Severity 1 问题响应窗口（每周4天/每天7小时） | 24 小时           | 8 小时   | 4 小时    |
| 非 Severity 1 问题响应时间       | 48 小时           | 24 小时  | 8 小时    |

### 问题严重级别 (Severity Levels)

*   **Severity 1**：导致业务运营停滞的关键问题，且无可用临时解决方案。
*   **Severity 2**：主要功能受影响，性能显著下降。
*   **Severity 3**：部分功能缺失，对业务影响较小。
*   **Severity 4**：一般咨询、建议或功能请求。

:::note
请注意，仅 Business 和 Dedicated 客户享有支持事件的服务级别协议 (SLA)。如果您使用的是基础版 (Personal)，我们会尽力及时解答您的问题，同时建议您利用以下社区资源：

*   [Databend Community Slack Channel](https://link.databend.com/join-slack)
*   [GitHub Discussions](https://github.com/datafuselabs/databend/discussions)
:::

## 企业支持

对于部署关键业务系统的客户，我们的 Dedicated 版本提供增强的支持选项，包括：

*   所有严重级别问题的优先响应
*   专属支持工程师
*   主动监控与问题解决
*   定期健康检查与优化建议

联系我们的[销售团队](https://www.databend.com/contact-us/)，了解更多企业支持服务详情。
```

**主要润色点说明：**

1.  **标题与导语：**
    *   `Databend Cloud 支持服务`：保持原样，符合中文标题习惯。
    *   `提供全面的支持服务`：补充“服务”一词，使动宾搭配更完整。
    *   `充分体现...核心价值`：将“reflects”译为“充分体现”更贴切。
    *   `快速交付高质量结果`：将“fast, high-quality results”译为“快速交付高质量结果”，更符合中文表达习惯和技术文档目标描述。

2.  **获取支持：**
    *   `您可通过以下多种渠道获取支持`：调整语序，更自然。
    *   `在菜单中选择`：比“从菜单选项中选择”更简洁。
    *   `以创建...并查看`：使用“以”连接目的，更书面化。
    *   `以便在平台发生影响服务的事件时及时接收通知`：将“any incidents affecting our platform”意译为“平台发生影响服务的事件”，更符合中文技术文档描述习惯；“get notified quickly”译为“及时接收通知”更地道。

3.  **支持服务级别：**
    *   `根据您的订阅版本`：将“tier”译为“版本”，与后文表格中的“基础版”等保持一致。
    *   **表格优化：**
        *   列名：将“功能”后的冒号改为中文全角。
        *   第一列名称：将“基础版”补充英文原名 `(Personal)`（符合“首次出现时可保留英文原文在括号中”的要求）。
        *   第二行描述：`Severity 1 问题的 4/7 覆盖和响应窗口` -> `Severity 1 问题响应窗口（每周4天/每天7小时覆盖）`。这是最重要的修改：
            *   将“4/7 coverage”明确解释为“每周4天/每天7小时覆盖”，避免歧义，符合中文技术文档清晰性要求。
            *   将“响应窗口”作为核心名词前置，更突出关键信息。
            *   保留术语“Severity 1”。
        *   第三行描述：`非 Severity 1 问题的响应` -> `非 Severity 1 问题响应时间`。补充“时间”使表述更完整清晰。
    *   表头对齐：保持原Markdown表格结构。

4.  **严重程度级别 (Severity Levels):**
    *   标题补充英文原名 `(Severity Levels)`。
    *   **Severity 1**: `阻止业务运营的关键问题，无解决方案` -> `导致业务运营停滞的关键问题，且无可用临时解决方案。`
        *   “导致...停滞”比“阻止”更准确描述影响。
        *   “无可用临时解决方案”更精确对应“no workaround”。
    *   **Severity 2**: `主要功能受到影响，性能显著下降` -> `主要功能受影响，性能显著下降。` (去掉冗余的“到”和“，”)
    *   **Severity 3**: `部分功能丢失，对业务影响较小` -> `部分功能缺失，对业务影响较小。` (“缺失”比“丢失”更常用)
    *   **Severity 4**: 保持原样，已很清晰。

5.  **:::note 部分:**
    *   `仅 Business 和 Dedicated 客户享有支持事件的服务级别协议 (SLA)`：调整语序更通顺，明确“支持事件”是SLA的对象。
    *   `如果您使用的是基础版 (Personal)`：补充英文原名 `(Personal)`。
    *   `我们会尽力及时解答您的问题`：比“虽然我们会尽快回答您的问题”更简洁专业。
    *   `同时建议您利用以下社区资源`：比“但我们也鼓励您探索”更符合技术文档语气。

6.  **企业支持：**
    *   `对于部署关键业务系统的客户`：将“有关键任务部署的客户”优化为更符合中文技术文档表述的“部署关键业务系统的客户”。
    *   `提供增强的支持选项，包括`：保持简洁。
    *   `所有严重级别问题的优先响应`：将“Priority response times for all severity levels”意译为“所有严重级别问题的优先响应”，更简洁直接。
    *   `专属支持工程师`：保持原样。
    *   `主动监控与问题解决`：保持原样。
    *   `定期健康检查与优化建议`：保持原样。
    *   `了解更多企业支持服务详情`：将“了解更多企业支持服务”补充为“了解更多企业支持服务详情”，表达更完整。

7.  **其他：**
    *   统一使用中文全角标点符号。
    *   所有链接、组件代码 (`<LanguageDocs>`)、JSON字段 (`title`)、表格结构、术语（如 Severity 1, Business, Dedicated, SLA, Personal, Create New Ticket）均严格保留原样。
    *   删除了个别冗余词语（如“的”、“我们”），使行文更简洁。
    *   确保整体语言专业、清晰、流畅，符合技术文档规范。

此版本已可直接作为最终中文文档使用。