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
