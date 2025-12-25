---
title: AI 驱动的功能
---

import SearchSVG from '@site/static/img/icon/search.svg'
import LanguageFileParse from '@site/src/components/LanguageDocs/file-parse'
import AITip from '@site/docs/fragment/ai-tip.md'

<LanguageFileParse
cn={<AITip />}
/>

通过包含 AI 驱动的功能，Databend Cloud 允许您进行自然语言对话，以获得帮助、协助和解决方案。这些 AI 驱动的功能默认启用，但如果需要，您可以通过导航到 **管理** > **设置** 来禁用它们。

### 用于辅助的 AI 聊天

AI 聊天支持自然语言交互，从而实现直观的信息检索和简化的故障排除。

要启动 AI 聊天：

1. 单击位于侧边栏中的放大镜图标 <SearchSVG/> 以打开搜索框。

2. 切换到 **聊天** 选项卡。

3. 输入您的问题。

![Alt text](@site/static/img/documents/worksheet/ai-chat.gif)

### AI 驱动的 SQL 助手

AI 辅助功能可用于在工作表中编辑 SQL 语句。您无需从头开始编写 SQL，AI 可以为您生成。

要在编辑 SQL 语句时使用 AI，只需在新行的开头键入“/”并输入您的查询，例如“返回当前时间”：

![Alt text](@site/static/img/documents/worksheet/ai-worksheet-1.gif)

您还可以获得 AI 对现有 SQL 语句的帮助。为此，请突出显示您的 SQL 并单击 **编辑** 以指定您想要的更改或请求进一步的帮助。或者，单击 **聊天** 以与 AI 进行对话以获得更全面的支持。

![Alt text](@site/static/img/documents/worksheet/ai-worksheet-2.gif)