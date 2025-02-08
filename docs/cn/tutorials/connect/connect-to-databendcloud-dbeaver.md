<think>
好的，我现在需要处理用户提供的Markdown内容，将其翻译成简体中文，同时严格遵守用户设定的规则。首先，我要仔细阅读用户的要求，确保理解每一个细节。

首先，用户提到不能改变Markdown的结构，包括链接和URL，这意味着我需要保留所有原有的格式和链接，不进行任何修改。同时，代码块的内容必须原封不动，即使有错误也不能调整。这一点需要特别注意，避免在翻译过程中误改代码部分。

接下来，用户要求保留原有的换行和空白行，这意味着在翻译时不能随意添加或删除段落之间的空行。此外，标题后的permalink（如{/*examples*/}）和HTML标签（如<Notes>）也不能触碰，需要保持原样。

关于术语翻译，用户给出了明确的指示：'time travel'译为'时间回溯'，'warehouse'或'warehouses'译为'计算集群'，'Data Warehouse'译为'数仓'，'Self-Hosted'译为'私有化部署'，而'Databend Cloud'、'Vector'、'Stage'等专有名词不翻译。在处理JSON文件时，键名不能翻译，只有值需要处理。此外，如果遇到描述'Personal'计划的情况，要翻译为'基础版'。

现在来看具体的文档内容。标题和侧边栏标签需要翻译，但保持简洁。步骤部分使用StepsWrap和StepContent组件，这些标签不能改动。图片的alt文本需要翻译，但图片路径保持不变。例如，“Before You Start”翻译为“开始之前”，而“Obtain Connection Information”翻译为“获取连接信息”。

在翻译过程中，要注意技术术语的正确转换，比如“Host”翻译为“主机”，“Port”翻译为“端口”，“Username”和“Password”分别译为“用户名”和“密码”。同时，确保“Driver properties”中的“Warehouse”名称正确填入，这部分在翻译时可能需要保留英文，但根据用户规则，“Warehouse”应译为“计算集群”，所以需要确认上下文是否适用。

SSL部分，“Use SSL”复选框翻译为“使用SSL”，保持术语一致。测试连接时的提示信息需要准确翻译，同时确保按钮名称如“Test Connection”翻译为“测试连接”，而下载驱动的部分也要清晰表达。

最后，要检查所有图片的引用路径是否正确，确保翻译后的文档在渲染时图片能正常显示。同时，验证所有步骤的编号和结构是否与原文档一致，没有遗漏或添加任何内容。

完成翻译后，还需要通读一遍，确保没有违反任何用户设定的规则，比如没有添加或删除任何内容，所有术语符合要求，格式保持原样。特别是检查是否有误用的翻译或格式错误，确保最终输出符合用户的预期。
</think>

---
title: '使用 DBeaver 连接 Databend Cloud'
sidebar_label: '连接 Databend Cloud（DBeaver）'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本教程将指导您使用 DBeaver 连接 Databend Cloud。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确保本地已安装 DBeaver 24.3.1 或更高版本。

</StepContent>
<StepContent number="2">

### 获取连接信息

在创建 Databend Cloud 连接前，您需要登录 Databend Cloud 获取连接信息。更多信息请参阅[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。本教程将使用以下连接信息：

![alt text](@site/static/img/connect/dbeaver-connect-info.png)

</StepContent>
<StepContent number="3">

### 配置连接

1. 在 DBeaver 中，进入 **Database** > **New Database Connection** 打开连接向导，选择 **Analytical** 分类下的 **Databend**。

![alt text](@site/static/img/connect/dbeaver-analytical.png)

2. 在 **Main** 标签页，根据上一步获取的连接信息填写 **Host**、**Port**、**Username** 和 **Password**。

![alt text](@site/static/img/connect/dbeaver-main-tab.png)

3. 在 **Driver properties** 标签页，根据连接信息填写 **Warehouse** 名称。

![alt text](@site/static/img/connect/dbeaver-driver-properties.png)

4. 在 **SSL** 标签页，勾选 **Use SSL** 复选框。

![alt text](@site/static/img/connect/dbeaver-use-ssl.png)

5. 点击 **Test Connection** 验证连接。首次连接 Databend 时会提示下载驱动，点击 **Download** 继续。下载完成后测试连接成功，如下图所示：

![alt text](@site/static/img/connect/dbeaver-cloud-success.png)

</StepContent>
</StepsWrap>