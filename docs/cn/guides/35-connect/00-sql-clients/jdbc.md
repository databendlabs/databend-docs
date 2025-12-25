---
title: DBeaver
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

[DBeaver](https://dbeaver.com/) 支持通过内置驱动连接 Databend，该驱动归类在 **Analytical** 类别下，从 **24.3.1 版本**开始提供。

![](@site/static/img/connect/dbeaver.png)

## 前提条件

- 已安装 DBeaver 24.3.1 或更高版本
- 对于私有化部署的 Databend：已安装 [Docker](https://www.docker.com/) （如果使用 Docker 部署）

## 用户认证

如果您连接的是私有化部署的 Databend 实例，可以使用 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中指定的管理员用户，或者通过 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户进行连接。

对于连接 Databend Cloud，可以使用默认的 `cloudapp` 用户或通过 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户。请注意，用于登录 [Databend Cloud 控制台](https://app.databend.com/) 的用户账号不能用于连接 Databend Cloud。

## 连接私有化部署的 Databend

<StepsWrap>
<StepContent number="1">

### 启动 Databend (Docker)

运行以下命令启动 Databend 实例：

:::note
如果在启动容器时没有为 `QUERY_DEFAULT_USER` 或 `QUERY_DEFAULT_PASSWORD` 指定自定义值，将会创建一个默认的 `root` 用户且无密码。
:::

```bash
docker run -d --name databend \
  -p 3307:3307 -p 8000:8000 -p 8124:8124 -p 8900:8900 \
  datafuselabs/databend:nightly
```

</StepContent>
<StepContent number="2">

### 配置连接

1. 在 DBeaver 中，转到 **Database** > **New Database Connection** 打开连接向导，然后在 **Analytical** 类别下选择 **Databend**。

![alt text](@site/static/img/connect/dbeaver-analytical.png)

2. 在 **Username** 字段输入 `root` （或您配置的用户名）。

![alt text](@site/static/img/connect/dbeaver-user-root.png)

3. 点击 **Test Connection** 验证连接。如果是首次连接 Databend，会提示下载驱动。点击 **Download** 继续。

![alt text](@site/static/img/connect/dbeaver-download-driver.png)

下载完成后，测试连接应会成功：

![alt text](@site/static/img/connect/dbeaver-success.png)

</StepContent>
</StepsWrap>

## 连接 Databend Cloud

<StepsWrap>
<StepContent number="1">

### 获取连接信息

登录 Databend Cloud 获取连接信息。更多信息请参阅 [连接计算集群](/guides/cloud/resources/warehouses#connecting)。

![alt text](@site/static/img/connect/dbeaver-connect-info.png)

:::note
如果您的 `user` 或 `password` 包含特殊字符，需要分别在对应字段中提供（例如 DBeaver 中的 `Username` 和 `Password` 字段）。这种情况下 Databend 会为您处理必要的编码。但如果您将凭据一起提供（例如作为 `user:password`），则必须确保整个字符串在使用前已正确编码。
:::

</StepContent>
<StepContent number="2">

### 配置连接

1. 在 DBeaver 中，转到 **Database** > **New Database Connection** 打开连接向导，然后在 **Analytical** 类别下选择 **Databend**。

![alt text](@site/static/img/connect/dbeaver-analytical.png)

2. 在 **Main** 标签页中，根据上一步获取的连接信息输入 **Host**、**Port**、**Username** 和 **Password**。

![alt text](@site/static/img/connect/dbeaver-main-tab.png)

3. 在 **Driver properties** 标签页中，根据上一步获取的连接信息输入 **Warehouse** 名称。

![alt text](@site/static/img/connect/dbeaver-driver-properties.png)

4. 在 **SSL** 标签页中，勾选 **Use SSL** 复选框。

![alt text](@site/static/img/connect/dbeaver-use-ssl.png)

5. 点击 **Test Connection** 验证连接。如果是首次连接 Databend，会提示下载驱动。点击 **Download** 继续。下载完成后，测试连接应会成功：

![alt text](@site/static/img/connect/dbeaver-cloud-success.png)

</StepContent>
</StepsWrap>