---
title: 'DBeaver 连接（Cloud）'
sidebar_label: 'DBeaver（Cloud）'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

本教程将指导你如何通过 DBeaver 连接 Databend Cloud。

<StepsWrap>
<StepContent number="1">

### 开始之前

- 请确保本地已安装 DBeaver 24.3.1 或更高版本。

</StepContent>
<StepContent number="2">

### 获取连接信息

在 DBeaver 建立连接前，需要先登录 Databend Cloud 获取连接详情。参见 [连接计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。本教程示例使用如下信息：

![alt text](@site/static/img/connect/dbeaver-connect-info.png)
> **注意**：
> 如果 `user` 或 `password` 中包含特殊字符，请在 DBeaver 的对应输入框（如 Username、Password）分别填写，Databend 会自动处理编码。如果你使用 `user:password` 这种组合形式，需要自行确保整段字符串已正确编码。

</StepContent>
<StepContent number="3">

### 建立连接

1. 在 DBeaver 中依次点击 **Database** > **New Database Connection** 打开连接向导，在 **Analytical** 分类下选择 **Databend**。

![alt text](@site/static/img/connect/dbeaver-analytical.png)

2. 在 **Main** 页签中，根据上一节的连接信息填写 **Host**、**Port**、**Username** 与 **Password**。

![alt text](@site/static/img/connect/dbeaver-main-tab.png)

3. 在 **Driver properties** 页签中，填写 **Warehouse** 名称。

![alt text](@site/static/img/connect/dbeaver-driver-properties.png)

4. 在 **SSL** 页签中勾选 **Use SSL**。

![alt text](@site/static/img/connect/dbeaver-use-ssl.png)

5. 点击 **Test Connection** 验证连接。如果是首次连接 Databend，系统会提示下载驱动，点击 **Download**。下载完成后应出现成功提示：

![alt text](@site/static/img/connect/dbeaver-cloud-success.png)

</StepContent>
</StepsWrap>
