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
