<think>
好的，我现在需要处理用户提供的Markdown内容，并将其翻译成简体中文，同时遵循用户设定的规则。首先，我要仔细阅读用户的要求，确保完全理解每一个细节。

用户提到，他们正在翻译Databend的文档，特别是关于使用DBeaver连接自托管Databend的部分。我需要确保翻译准确，同时保持原有的Markdown结构不变。特别要注意的是，不能修改任何链接、代码块或HTML标签，比如<Notes>和<StepsWrap>等。此外，还有一些特定的术语需要保留不译，如“Self-Hosted”翻译为“私有化部署”，“Databend Cloud”、“Vector”、“Stage”保持原文。还有，如果遇到“Personal”计划，要翻译成“基础版”。

接下来，我会逐段处理提供的Markdown内容。首先检查标题和侧边栏标签，确保正确翻译。例如，“Connecting to Self-Hosted Databend using DBeaver”应翻译为“使用 DBeaver 连接私有化部署的 Databend”，并保持sidebar_label的结构。

在“Before You Start”部分，需要确保Docker和DBeaver的版本信息正确无误，同时保留项目符号列表的格式。注意用户提到的注意事项，比如默认用户root没有密码的情况，要准确翻译并保留原有的:::note块结构。

启动Databend的命令部分，保持代码块不变，不进行任何修改。同时，注意命令中的端口映射是否正确，确保用户能够顺利运行Docker命令。

设置连接的部分，步骤说明需要清晰，图片链接保持不变。翻译按钮名称如“Test Connection”为“测试连接”，但图片的alt文本可能需要保留原文，或者根据用户要求处理。这里用户没有特别说明，所以保持图片路径不变，仅翻译周围的文字。

在测试连接成功后，确保提示信息正确翻译，同时图片路径正确。最后，检查整个文档的结构，确保没有遗漏任何部分，如StepsWrap组件和其中的StepContent顺序是否正确。

还要特别注意用户强调的不要添加或删除任何空行，保持原有的换行符。因此，在翻译过程中，需要保持段落的原有格式，即使中文翻译可能更紧凑，也要保留原文档的换行结构。

最后，通读整个翻译后的文档，检查是否符合所有规则，特别是术语的一致性和格式的正确性。确保没有误删或修改任何Markdown标记，所有链接和图片路径正确无误，代码块和HTML标签完整保留。这样用户在使用翻译后的文档时，能够顺利按照步骤操作，不会因为格式错误或术语不一致而产生困惑。
</think>

---
title: "使用 DBeaver 连接私有化部署的 Databend"
sidebar_label: "连接私有化部署的 Databend（DBeaver）"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本教程将指导您如何使用 DBeaver 连接到私有化部署的 Databend 实例。

<StepsWrap>
<StepContent number="1">

### 准备工作

- 确保本地已安装 [Docker](https://www.docker.com/)，用于启动 Databend。
- 确认本地已安装 DBeaver 24.3.1 或更高版本。

</StepContent>
<StepContent number="2">

### 启动 Databend

在终端运行以下命令启动 Databend 实例：

:::note
如果在启动容器时未指定 `QUERY_DEFAULT_USER` 或 `QUERY_DEFAULT_PASSWORD` 的自定义值，系统将自动创建默认的 `root` 用户且无密码。
:::

```bash
docker run -d --name databend \
  -p 3307:3307 -p 8000:8000 -p 8124:8124 -p 8900:8900 \
  datafuselabs/databend:nightly
```

</StepContent>
<StepContent number="3">

### 配置连接

1. 在 DBeaver 中，导航至 **Database** > **New Database Connection** 打开连接向导，然后在 **Analytical** 分类下选择 **Databend**。

![alt text](@site/static/img/connect/dbeaver-analytical.png)

2. 在 **Username** 字段输入 `root`。

![alt text](@site/static/img/connect/dbeaver-user-root.png)

3. 点击 **Test Connection** 验证连接。首次连接 Databend 时会提示下载驱动，点击 **Download** 继续。

![alt text](@site/static/img/connect/dbeaver-download-driver.png)

驱动下载完成后，连接测试将显示成功，如下图所示：

![alt text](../../../../static/img/connect/dbeaver-success.png)

</StepContent>
</StepsWrap>