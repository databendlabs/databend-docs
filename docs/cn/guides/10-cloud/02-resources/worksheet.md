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

## 共享工作区（Worksheet）

你可以与组织中的所有人或特定个人共享工作区（Worksheet）。为此，在目标工作区（Worksheet）中单击 **Share**，或单击 **Share this Folder** 共享整个文件夹。

![分享工作区](@site/static/img/documents/worksheet/share.png)

在出现的对话框中，选择共享范围。复制链接分享给目标接收者，他们将收到邮件通知。请注意：如果选择 **Designated Members** 范围，接收者必须单击分享链接才能成功完成共享。

- 查看他人共享的工作区（Worksheet）：单击侧边栏的 **Worksheets**，然后选择右侧的 **Shared with Me** 选项卡。
- 共享工作区（Worksheet）后，具备权限的接收者可执行其中 SQL 语句，但无法编辑这些语句。

## 导出查询结果

Databend Cloud 提供导出查询结果的功能。但此功能需要组织 Owner 为团队成员授予 **EXPORT** 权限。出于数据安全考虑，该功能默认处于禁用状态。

![导出按钮](@site/static/img/documents/worksheet/download.png)

如需使用此功能，请联系组织 Owner 开启相应权限 (**管理** > **用户和角色**)：

![导出权限设置](@site/static/img/documents/worksheet/export.png)
