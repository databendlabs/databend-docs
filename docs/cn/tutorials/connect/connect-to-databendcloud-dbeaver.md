---
title: "连接 Databend Cloud (DBeaver)"
sidebar_label: "Cloud (DBeaver)"
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

在本教程中，我们将指导您完成使用 DBeaver 连接到 Databend Cloud 的过程。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 确认您的本地机器上已安装 DBeaver 24.3.1 或更高版本。

</StepContent>
<StepContent number="2">

### 获取连接信息

在创建与 Databend Cloud 的连接之前，您需要登录到 Databend Cloud 以获取连接信息。有关更多信息，请参见 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。在本教程中，我们将使用以下连接信息：

![alt text](@site/static/img/connect/dbeaver-connect-info.png)
> **Note**:
> 如果您的 `user` 或 `password` 包含特殊字符，您需要在相应的字段中单独提供它们（例如，DBeaver 中的 `Username` 和 `Password` 字段）。在这种情况下，Databend 将为您处理必要的编码。但是，如果您将凭据一起提供（例如，作为 `user:password`），则必须确保在使用前对整个字符串进行正确编码。

</StepContent>
<StepContent number="3">

### 设置连接

1. 在 DBeaver 中，转到 **Database** > **New Database Connection** 以打开连接向导，然后在 **Analytical** 类别下选择 **Databend**。

![alt text](@site/static/img/connect/dbeaver-analytical.png)

2. 在 **Main** 选项卡中，根据上一步中获得的连接信息输入 **Host**、**Port**、**Username** 和 **Password**。

![alt text](@site/static/img/connect/dbeaver-main-tab.png)

3. 在 **Driver properties** 选项卡中，根据上一步中获得的连接信息输入 **Warehouse** 名称。

![alt text](@site/static/img/connect/dbeaver-driver-properties.png)

4. 在 **SSL** 选项卡中，选中 **Use SSL** 复选框。

![alt text](@site/static/img/connect/dbeaver-use-ssl.png)

5. 单击 **Test Connection** 以验证连接。如果这是您第一次连接到 Databend，系统将提示您下载驱动程序。单击 **Download** 继续。下载完成后，测试连接应该成功，如下所示：

![alt text](@site/static/img/connect/dbeaver-cloud-success.png)

</StepContent>
</StepsWrap>