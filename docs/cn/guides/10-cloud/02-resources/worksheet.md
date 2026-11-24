---
title: 工作区（Worksheet）
---

import DbSVG from '@site/static/img/icon/database.svg'
import RoleSVG from '@site/static/img/icon/role.svg'
import WarehouseSVG from '@site/static/img/icon/warehouse.svg'
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg'

Databend Cloud 中的工作区（Worksheet）用于组织、运行和保存 SQL 语句，也可以与组织中的其他人共享。

## 创建工作区（Worksheet）

要创建新的工作区（Worksheet），请单击侧边栏中的 **Worksheets**，然后选择 **New Worksheet**。

如果你的 SQL 语句已经保存在 SQL 文件中，你可以直接从文件创建工作区（Worksheet）。为此，请单击 **New Worksheet** 右侧的省略号图标 <EllipsisSVG/>，然后选择 **Create from SQL File**。

## 编辑和运行 SQL 语句

要编辑和运行 SQL 语句：

1. 单击 SQL 编辑器上方的数据库图标 <DbSVG/>，然后选择要查询的数据库。
2. 单击 SQL 编辑器上方的用户图标 <RoleSVG/>，然后选择要使用的角色。下拉列表将显示已授予你的所有角色，以及这些角色在层次结构中的任何子角色。有关角色层次结构的更多信息，请参阅[继承角色和建立层次结构](/guides/security/access-control/roles#inheriting-roles--establishing-hierarchy)。
3. 在 SQL 编辑器中编辑 SQL 语句。
4. 单击 SQL 编辑器下方的计算集群图标 <WarehouseSVG/>，然后从列表中选择一个计算集群（Warehouse）。
5. 单击 **Run Script**。

查询结果显示在输出区域。你可以单击 **Export** 将整个结果保存为 CSV 文件，或者在输出区域中选择一个或多个单元格，然后按 Command + C（在 Mac 上）或 Ctrl + C（在 Windows 上）将其复制到剪贴板。

:::tip

- 单个 API 调用不支持多条 SQL 语句。请确保工作区（Worksheet）中的每个 SQL 查询都以单个分号（;）结尾。
- 为了方便你编辑 SQL 语句，可以在数据库列表中选择表，然后单击其旁边的"..."按钮。按照菜单提示，可一键将表名或所有列名复制到右侧的 SQL 输入区域。

- 如果在 SQL 输入区域输入多条语句，Databend Cloud 仅执行光标所在的语句。移动光标可执行其他语句。也可使用快捷键：Ctrl + Enter（Windows）或 Command + Enter（Mac）执行当前语句，Ctrl + Shift + Enter（Windows）或 Command + Shift + Enter（Mac）执行所有语句。
  :::

## 查询结果配置

点击结果区右下角的设置图标，打开**结果配置**（Result Configs），可以调整工作区如何显示和返回查询结果：

| 配置项 | 默认值 | 可选值 | 说明 |
|---|---|---|---|
| 单元格最大显示长度 | 3,000 字符 | 3K 至无限制 | 超出部分在显示时被截断。 |
| 最大显示行数 | 10,000 行 | 5,000 或 10,000 | 结果表格中最多显示的行数。只影响显示，不影响查询结果和导出。 |
| 最大结果行数（`max_result_rows`） | 10,000 行 | 10,000、100,000、1,000,000 或 10,000,000 | 查询返回的行数达到该值后即停止执行，导出时使用同一份结果。每次运行时作为 [`max_result_rows`](/sql/sql-reference/system-tables/system-settings) 设置发送。 |

以下情况最大结果行数不生效：

- SQL 自带 `LIMIT`：返回的行数由 `LIMIT` 决定。
- 工作区会话中用 [`SET`](/sql/sql-commands/administration-cmds/set-global) 设置了 `max_result_rows`：之后在这个会话中运行的查询都按该值执行，与最大结果行数的配置无关。

表格旁的结果详情会显示**结果行数**（查询返回的行数）和**显示行数**（表格中显示的行数）。

结果配置按组织保存在当前浏览器中，从下一次运行开始生效。结果最多显示前 200 列，这个限制是固定的。

:::note
单元格最大显示长度设置过大或选择**无限制**，或者最大结果行数设置过大时，如果结果集数据量较大，可能导致浏览器卡顿甚至无响应。
:::

## 共享工作区（Worksheet）

你可以与组织中的所有人或特定个人共享工作区（Worksheet）。为此，在目标工作区（Worksheet）中单击 **Share**，或单击 **Share this Folder** 共享整个文件夹。

![分享工作区](@site/static/img/documents/worksheet/share.png)

在出现的对话框中，选择共享范围。复制链接分享给目标接收者，他们将收到邮件通知。请注意：如果选择 **Designated Members** 范围，接收者必须单击分享链接才能成功完成共享。

- 查看他人共享的工作区（Worksheet）：单击侧边栏的 **Worksheets**，然后选择右侧的 **Shared with Me** 选项卡。
- 共享工作区（Worksheet）后，具备权限的接收者可执行其中 SQL 语句，但无法编辑这些语句。

## 导出查询结果

:::tip[大结果集下载]

通过工作区页面下载大结果集时，可能出现超时或下载失败。建议先将结果导出到 Stage 或外部存储，再直接下载结果文件。具体操作请参阅[下载导出的文件](/guides/unload-data/download-files)。

:::

Databend Cloud 提供导出查询结果的功能。但此功能需要组织 Owner 为团队成员授予 **EXPORT** 权限。出于数据安全考虑，该功能默认处于禁用状态。

![导出按钮](@site/static/img/documents/worksheet/download.png)

如需使用此功能，请联系组织 Owner 开启相应权限 (**管理** > **用户和角色**)：

![导出权限设置](@site/static/img/documents/worksheet/export.png)
