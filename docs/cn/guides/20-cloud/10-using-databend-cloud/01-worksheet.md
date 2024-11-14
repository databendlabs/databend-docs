---
title: 工作表
---
import DbSVG from '@site/static/img/icon/database.svg'
import RoleSVG from '@site/static/img/icon/role.svg'
import WarehouseSVG from '@site/static/img/icon/warehouse.svg'
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg'

Databend Cloud 中的工作表用于组织、运行和保存 SQL 语句。它们还可以与组织中的其他人共享。

## 创建工作表

要创建新的工作表，请点击侧边栏中的 **Worksheets**，然后选择 **New Worksheet**。

如果你的 SQL 语句已经保存在 SQL 文件中，你也可以直接从文件创建工作表。为此，请点击 **New Worksheet** 右侧的省略号图标 <EllipsisSVG/>，然后选择 **Create from SQL File**。

## 编辑和运行 SQL 语句

要编辑和运行 SQL 语句：

1. 点击 SQL 编辑器上方的数据库图标 <DbSVG/>，然后选择你要查询的数据库。
2. 点击 SQL 编辑器上方的用户图标 <RoleSVG/>，然后选择要使用的角色。下拉列表将显示你已被授予的所有角色，以及你在层次结构中的任何子角色。有关角色层次结构的更多信息，请参阅[继承角色与建立层次结构](/guides/security/access-control/roles#inheriting-roles--establishing-hierarchy)。

3. 在 SQL 编辑器中编辑 SQL 语句。
4. 点击 SQL 编辑器下方的计算集群图标 <WarehouseSVG/>，然后从列表中选择一个计算集群。
4. 点击 **Run Script**。

查询结果显示在输出区域。你可以点击 **Export** 将整个结果保存为 CSV 文件，或者在输出区域中选择一个或多个单元格，然后按 Command + C（在 Mac 上）或 Ctrl + C（在 Windows 上）将其复制到剪贴板。

:::tip
- 为了让你更容易编辑 SQL 语句，你可以在数据库列表中选择一个表，然后点击它旁边的“...”按钮。然后，按照菜单提示选择一键复制表名或所有列名到右侧的 SQL 输入区域。

- 如果你在 SQL 输入区域中输入了多个语句，Databend Cloud 只会执行光标所在位置的语句。你可以移动光标来执行其他语句。此外，你可以使用键盘快捷键：Ctrl + Enter（Windows）或 Command + Enter（Mac）来执行当前语句，以及 Ctrl + Shift + Enter（Windows）或 Command + Shift + Enter（Mac）来执行所有语句。
:::

## 共享工作表

你可以将你的工作表与组织中的每个人或特定个人共享。为此，请点击你要共享的工作表中的 **Share**，或者点击 **Share this Folder** 来共享一个工作表文件夹。

![Alt text](@site/static/img/documents/worksheet/share.png)

在出现的对话框中，选择共享范围。你可以复制并分享链接给预期的收件人，他们也会收到电子邮件通知。请注意，如果你选择 **Designated Members** 范围，收件人必须点击你分享的链接才能成功共享。

- 要查看与你共享的工作表，请点击侧边栏中的 **Worksheets**，然后在右侧点击 **Shared with Me** 标签。
- 当你与他人共享工作表时，如果他们有必要的权限，他们可以执行其中的 SQL 语句，但他们将无法对语句进行任何编辑。