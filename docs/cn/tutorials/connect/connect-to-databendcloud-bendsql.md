<think>
好的，我需要将用户提供的关于如何使用BendSQL连接Databend Cloud的英文文档翻译成简体中文。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。

首先，用户强调必须保留Markdown的结构，不能添加或删除链接，也不能更改任何URL。这意味着我需要确保所有的标题、列表、代码块和图片链接都原封不动地保留下来，只对文本内容进行翻译。例如，图片的Alt文本和路径不能有任何改动。

接下来，用户提到不能更改代码块中的内容，即使看起来有错误。因此，在翻译过程中，我需要特别注意代码块中的SQL语句或其他命令，确保它们不被修改。例如，`SELECT NOW();`这样的语句必须保持原样。

保持原有的换行和空白行也是重要的，这有助于保持文档的结构和可读性。因此，在翻译时，我需要确保段落之间的换行与原文一致，不会因为翻译而增加或减少空行。

关于永久链接如`{/*examples*/}`，用户要求不能触碰这些部分。这些通常是用于文档内部链接或注释的，所以我会避免翻译或修改它们，保持原样。

对于HTML标签如`<Notes>`，同样需要保留原样，不进行任何改动。这意味着在翻译过程中，我需要识别这些标签并确保它们不被翻译或调整结构。

用户还提到了一些特定术语的翻译规则，例如将“time travel”翻译为“时间回溯”，“warehouse”翻译为“计算集群”，“Data Warehouse”翻译为“数仓”，“Self-Hosted”翻译为“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”等则保持不译。这需要我在翻译时特别注意这些术语，确保一致性。例如，在文档中出现的“warehouse”必须统一译为“计算集群”，而不是其他可能的翻译。

在处理JSON文件时，用户指出`_category_.json`中的键不需要翻译。因此，在遇到类似结构时，我会保留键的原文，仅翻译对应的值内容。

用户特别强调不要包含任何`<think>`标签或其内容在输出中，也不能生成新的`<think>`标签。因此，在翻译过程中，我需要确保最终的输出结果中没有任何此类标签，仅返回翻译后的内容。

现在，具体到用户提供的文档内容，我需要逐部分处理：

1. **标题和侧边栏标签**：标题“Connecting to Databend Cloud using BendSQL”需要翻译为“使用 BendSQL 连接 Databend Cloud”，侧边栏标签保持原结构，翻译为“连接 Databend Cloud（BendSQL）”。

2. **步骤部分**：每个步骤的标题和内容需要准确翻译，同时保留原有的`StepsWrap`和`StepContent`组件结构。例如，“Before You Start”翻译为“开始之前”，并确保其中的链接和格式不变。

3. **图片和示例**：图片的Alt文本和路径不能更改，例如`/img/connect/bendsql-4.gif`需要保留原样。示例中的代码块如连接字符串和SQL查询语句也需保持原样，不进行任何修改。

4. **特定术语处理**：例如，“warehouse”翻译为“计算集群”，“Self-Hosted”翻译为“私有化部署”，而“Databend Cloud”保持不译。需要在整个文档中统一这些术语的翻译。

5. **命令和提示**：例如，“quit”翻译为“quit”，保持原命令不变，同时在说明中正确翻译周围的文本。

最后，检查整个翻译后的文档，确保所有规则都被正确应用，没有遗漏任何Markdown结构或特定术语，同时保持语句通顺和自然，符合技术文档的专业性要求。
</think>

---
title: "使用 BendSQL 连接 Databend Cloud"
sidebar_label: "连接 Databend Cloud（BendSQL）"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本教程将指导您使用 BendSQL 连接 Databend Cloud。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保已安装 BendSQL。使用不同包管理器安装 BendSQL 的方法请参考[安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- 确保您已拥有 Databend Cloud 账户并可成功登录。

</StepContent>

<StepContent number="2">

### 获取连接信息

1. 登录 Databend Cloud，点击 **Connect**。

![Alt text](/img/connect/bendsql-4.gif)

2. 选择需要连接的数据库（例如"default"）；然后选择计算集群。若忘记密码请重置。

3. 在 **Examples** 区域可查看当前计算集群的 DSN 详细信息，以及通过 BendSQL 连接 Databend Cloud 的字符串。此步骤只需复制 **BendSQL** 标签页中的内容。

![Alt text](/img/connect/bendsql-5.png)

</StepContent>
<StepContent number="3">

### 启动 BendSQL

将复制内容粘贴至终端或命令提示符窗口以启动 BendSQL。若复制的密码显示为"**\*\***"，请替换为真实密码。

![Alt text](/img/connect/bendsql-6.png)

</StepContent>

<StepContent number="4">

### 执行查询

连接成功后即可在 BendSQL shell 中执行 SQL 查询。例如输入 `SELECT NOW();` 可返回当前时间。

![Alt text](/img/connect/bendsql-7.png)

</StepContent>
<StepContent number="5">

### 退出 BendSQL

输入 `quit` 即可退出 BendSQL。

</StepContent>
</StepsWrap>