<think>
好的，我现在需要处理用户提供的这个Markdown文档的翻译任务。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。用户特别强调了一些技术术语的翻译方式，比如“Self-Hosted”要翻译为“私有化部署”，“warehouse”要翻译成“计算集群”等。同时，不能改变Markdown的结构，包括链接和代码块的内容，也不能添加或删除空行。

接下来，我会通读整个英文文档，理解每个部分的内容。文档是关于如何使用BendSQL连接到私有化部署的Databend实例的教程，分为四个步骤：准备工作、启动BendSQL、执行查询和退出。每个步骤都有详细的说明和注意事项，还有一些代码示例和GIF演示。

在翻译过程中，我需要特别注意术语的一致性。例如，“Self-Hosted Databend”要翻译为“私有化部署的Databend”，“root”用户可能不需要翻译，保持原样。代码块中的内容绝对不能改动，比如配置文件中的SQL语句部分，必须保留原样。同时，注意保留所有的Markdown标记，如标题的`###`，链接的`[]()`结构，以及图片的`![Alt text]`部分。

对于注意事项部分，比如`:::note`标签内的内容，需要确保不改变结构，同时准确传达原文的意思。例如，关于使用不同用户连接Databend的命令示例，要正确翻译说明，但保留命令中的参数不变。

在处理步骤部分时，保持步骤编号和结构不变，使用用户提供的组件`<StepsWrap>`和`<StepContent>`，确保翻译后的文档结构与原文一致。同时，注意保留所有的HTML标签和注释，如`{/*examples*/}`，这些都不能被修改或删除。

在翻译过程中，还要注意保持原文的格式，比如代码块的高亮标记`sql title="databend-query.toml"`，确保翻译后的标题部分正确无误。此外，图片路径和GIF文件名不需要翻译，保持原样。

最后，检查整个翻译后的文档，确保没有遗漏任何部分，所有术语符合用户的要求，Markdown结构完整，代码块和链接正确无误。确认没有添加或删除任何内容，特别是确保没有引入任何`note`标签或其他未允许的格式。完成后，再次对照用户提供的规则，逐项检查，确保完全符合要求。
</think>

---
title: "使用 BendSQL 连接私有化部署的 Databend"
sidebar_label: "连接私有化部署的 Databend（BendSQL）"
slug: /

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本教程将指导您使用 BendSQL 以 `root` 用户身份连接到私有化部署的 Databend 实例。

<StepsWrap>
<StepContent number="1">

### 准备工作

- 确保 BendSQL 已安装在本地机器。关于使用不同包管理器安装 BendSQL 的说明，请参阅[安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql)。
- 确保您的 Databend 实例已成功启动。
- 在本教程中，您将使用 `root` 账户连接 Databend。部署时，请取消 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中以下行的注释以选择该账户：

  ```sql title="databend-query.toml"
  [[query.users]]
  name = "root"
  auth_type = "no_password"
  ```

</StepContent>
<StepContent number="2">

### 启动 BendSQL

在终端或命令提示符中直接输入 `bendsql` 即可启动 BendSQL。

:::note
命令 `bendsql` 会启动 BendSQL 并使用无需密码的 `root` 用户连接到本地 Databend（127.0.0.1）。若需以其他用户（例如密码为 'abc123' 的 'eric'）连接本地 Databend，请使用命令 `bendsql --user eric --password abc123`。要查看所有可用参数及其默认值，请输入 `bendsql --help`。
:::

![Alt text](/img/connect/bendsql-1.gif)

</StepContent>
<StepContent number="3">

### 执行查询

连接成功后，您可以在 BendSQL shell 中执行 SQL 查询。例如输入 `SELECT NOW();` 可返回当前时间：

![Alt text](/img/connect/bendsql-2.gif)

</StepContent>
<StepContent number="4">

### 退出 BendSQL

输入 `quit` 即可退出 BendSQL。

![Alt text](/img/connect/bendsql-3.gif)

</StepContent>
</StepsWrap>