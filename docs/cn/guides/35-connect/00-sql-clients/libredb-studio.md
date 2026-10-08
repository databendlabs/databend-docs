---
title: LibreDB Studio
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

[LibreDB Studio](https://github.com/libredb/libredb-studio) 是一款开源、可自托管、基于浏览器的 SQL 编辑器。它的 **Databend** 连接类型通过 Databend 的 [HTTP 处理程序](/developer/apis/http) 与 Databend 通信，与 BendSQL 使用相同的 API，因此无需 MySQL 处理程序或驱动程序即可连接 Databend Cloud 和私有化部署的 Databend。

LibreDB Studio 免费且采用 MIT 许可证。使用它，您可以浏览数据库、表、视图和物化视图，在编辑器中运行 SQL，分页查看大型结果，查看查询计划，绘制 ER 图，比较库表结构，并将结果导出为 CSV、JSON 或 SQL `INSERT` 语句。64 位整数在结果表格和导出中保持精确，AI 助手还可以起草 SQL，供您检查后运行。

在 Databend Cloud 上，LibreDB Studio 不会自行恢复已暂停的计算集群：它不会向设置了计算集群的连接发送后台健康检查，因此计算资源只在您使用时运行。

![](@site/static/img/connect/libredb-studio-object-browser.png)

## 前提条件

- 已安装 [Node.js](https://nodejs.org/) 24 或更高版本，用于通过 `npx` 启动 LibreDB Studio
- 对于 Databend Cloud：一个计算集群和一个 SQL 用户（参见 [用户认证](#用户认证)）
- 对于私有化部署的 Databend：运行 LibreDB Studio 的机器可以访问查询节点的 HTTP 处理程序端口（默认为 `8000`）

## 用户认证

LibreDB Studio 使用 SQL 用户和密码登录 Databend，每个请求都以 HTTP Basic 认证的方式发送。Databend 拒绝某个密码后，LibreDB Studio 在 15 分钟内或密码更改之前不会再次发送该密码，因此错误的密码不会在 [密码策略](/guides/security/password-policy) 下锁定该用户。

如果您连接的是私有化部署的 Databend 实例，可以使用 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中指定的管理员用户，或者通过 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户进行连接。

对于连接 Databend Cloud，可以使用默认的 `cloudapp` 用户或通过 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户。请注意，用于登录 [Databend Cloud 控制台](https://app.databend.com) 的用户账号不能用于连接 Databend Cloud。

LibreDB Studio 有独立的登录账号，与 Databend 用户无关。首次启动时，它会生成一个管理员账号，并在终端中打印邮箱和密码。

## 启动 LibreDB Studio

1. 运行以下命令。首次运行时会下载 LibreDB Studio，然后在 `http://127.0.0.1:3000` 上启动：

```bash
npx @libredb/studio
```

首次启动会打印生成的管理员凭据：

```text
 LibreDB Studio first run: generated admin credentials
 Email:    admin@libredb.org
 Password: <generated password>
```

2. 在浏览器中打开 `http://127.0.0.1:3000`，使用这些凭据登录。登录后会打开 **Admin Dashboard**，点击 **Editor** 进入 SQL 编辑器。

## 连接 Databend Cloud

<StepsWrap>
<StepContent number="1">

### 获取连接信息

登录 Databend Cloud，在 **Home** 页面点击 **Connect**，然后选择数据库和计算集群。**Connect** 对话框会显示一个包含主机、用户、数据库和计算集群的 DSN：

```text
databend://cloudapp:<password>@<tenant>.gw.<region>.default.databend.com:443/<database>?warehouse=<warehouse>
```

更多信息，请参见 [获取连接信息](/guides/cloud/resources/warehouses#obtaining-connection-information)。

</StepContent>
<StepContent number="2">

### 配置连接

1. 在 LibreDB Studio 左侧边栏中，点击 **+**（**New connection**）按钮。输入 **Connection Name**，例如 `Databend Cloud`，并选择 **Databend** 作为连接类型。

2. 点击 **Paste URL**，粘贴 **Connect** 对话框中的 DSN，LibreDB Studio 会据此填写各字段。您也可以手动填写：

| 字段            | 值                                                       |
|-----------------|----------------------------------------------------------|
| Host & Instance | DSN 中的主机，端口为 `443`                               |
| Username        | `cloudapp`，或通过 `CREATE USER` 创建的 SQL 用户         |
| Password        | 该用户的密码                                             |
| Database Name   | 语句中未限定名称时使用的数据库，例如 `default`。仅被授予单个数据库的用户请填写该数据库 |
| Warehouse       | DSN 中 `warehouse=` 的值                                 |

3. 展开 **SSL / TLS**，如果 **SSL Mode** 尚未设置为 `verify-system`，请将其设置为 `verify-system`。Databend Cloud 在 443 端口上提供使用公共证书的 HTTPS 服务。

![](@site/static/img/connect/libredb-studio-new-connection.png)

4. 点击 **Test Connection**，然后点击 **Establish Connection** 保存连接。

![](@site/static/img/connect/libredb-studio-connection.png)

</StepContent>
<StepContent number="3">

### 浏览对象并运行查询

1. 左侧的对象浏览器列出该用户可见的数据库及其表、视图和物化视图。展开表可查看其列，点击表会打开一个新标签页，对该表运行 `SELECT *`，最多返回 50 行。

2. 在编辑器中编写语句并运行。LibreDB Studio 会运行光标所在的语句：

```sql
SELECT number, number * 2 AS doubled FROM numbers(1200);
```

结果表格显示前 500 行。点击 **load 500 more** 获取后续行。

![](@site/static/img/connect/libredb-studio-query.png)

3. 点击 **Explain** 查看 Databend 为 `SELECT` 语句返回的查询计划。

![](@site/static/img/connect/libredb-studio-explain.png)

</StepContent>
</StepsWrap>

:::note
已暂停的计算集群会在收到第一个请求时恢复运行，并在运行期间计费。设置了 **Warehouse**，或主机属于 Databend Cloud 时，LibreDB Studio 不会向该连接发送后台健康检查，登录时也不会自动打开该连接。计算集群会在您打开连接、加载其对象或运行语句时恢复。如果恢复时间超过 10 秒，LibreDB Studio 会提示计算集群可能正在恢复，请一分钟后重试。
:::

## 连接私有化部署的 Databend

<StepsWrap>
<StepContent number="1">

### 启动 Databend (Docker)

运行以下命令启动 Databend 实例，HTTP 处理程序监听 `8000` 端口。请同时设置 `QUERY_DEFAULT_USER` 和 `QUERY_DEFAULT_PASSWORD`：只有两者都提供时才会创建该用户。

:::note
如果在启动容器时没有为 `QUERY_DEFAULT_USER` 或 `QUERY_DEFAULT_PASSWORD` 指定自定义值，将会创建一个默认的 `root` 用户且无密码。
:::

```bash
docker run -d --name databend \
  -p 8000:8000 \
  -e QUERY_DEFAULT_USER=databend \
  -e QUERY_DEFAULT_PASSWORD=databend \
  datafuselabs/databend:latest
```

</StepContent>
<StepContent number="2">

### 配置连接

1. 在 LibreDB Studio 左侧边栏中，点击 **+**（**New connection**）按钮，并选择 **Databend** 作为连接类型。

2. 输入连接信息：

| 字段            | 值                             |
|-----------------|--------------------------------|
| Host & Instance | `127.0.0.1`，端口为 `8000`     |
| Username        | `databend`                     |
| Password        | `databend`                     |
| Database Name   | 留空，或 `default`             |
| Warehouse       | 留空                           |

将 **SSL Mode** 保持为 `disable`，这是未启用 TLS 的私有化部署服务器的默认设置。

3. 点击 **Test Connection**，然后点击 **Establish Connection**。

</StepContent>
</StepsWrap>

:::tip
LibreDB Studio 不会在没有 TLS 的情况下向本机以外的主机发送密码。当 LibreDB Studio 运行在 Docker 容器中时也是如此，因为此时 Databend 不在 `127.0.0.1`。这种情况下，请为 Databend 的 HTTP 处理程序启用 TLS，并在 **SSL / TLS** 下选择 `verify-ca` 或 `verify-full`，或者通过 SSH 隧道连接；在您信任的网络中，也可以为该连接勾选 **Send the password without TLS**。
:::

## 限制

- **每个请求一条语句。** 包含多条语句的文本会被拒绝。编辑器运行光标所在的语句，选中多条语句时会逐条发送。
- **每条语句在独立的会话中运行。** `USE`、`SET`、`SET VARIABLE`、`SET ROLE`、由 `BEGIN` 开始的事务以及临时表仅在其所在语句内有效；LibreDB Studio 会回滚未结束的事务并给出提示。请在连接上设置 **Database Name**、使用限定名称，或使用 `SET GLOBAL`。
- **仅支持 SQL 用户和密码。** 不支持访问令牌、密钥对、MySQL 处理程序和 Flight SQL。
- **结果上限。** 一条语句最多读取 16 MiB、250,000 个单元格或 100,000 行；因达到上限而被截断的结果会说明达到了哪个上限。
- **Databend 连接不支持的功能：** 行内编辑、建表对话框、数据导入、Stage 列表以及 AI 代理模式。Stage 和 `COPY INTO` 语句可在编辑器中按您编写的内容运行。
- 建议使用 Databend v1.2.881 或更高版本。
