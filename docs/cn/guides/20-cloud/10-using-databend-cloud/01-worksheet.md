```md
---
title: Worksheets
---
import DbSVG from '@site/static/img/icon/database.svg'
import RoleSVG from '@site/static/img/icon/role.svg'
import WarehouseSVG from '@site/static/img/icon/warehouse.svg'
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg'

Databend Cloud 中的 Worksheets 用于组织、运行和保存 SQL 语句。它们还可以与组织中的其他人共享。

## 创建 Worksheet

要创建新的 Worksheet，请点击侧边栏中的 **Worksheets**，然后选择 **New Worksheet**。

如果您的 SQL 语句已经保存在 SQL 文件中，您也可以直接从文件创建 Worksheet。为此，请点击 **New Worksheet** 右侧的省略号图标 <EllipsisSVG/>，然后选择 **Create from SQL File**。

## 编辑和运行 SQL 语句

要编辑和运行 SQL 语句：

1. 点击 SQL 编辑器上方的数据库图标 <DbSVG/>，然后选择要查询的数据库。
2. 点击 SQL 编辑器上方的用户图标 <RoleSVG/>，然后选择要使用的 role。下拉列表将显示您已被授予的所有 role，以及您在层次结构中的 role 下的任何子 role。有关 role 层次结构的更多信息，请参见 [继承 Role & 建立层次结构](/guides/security/access-control/roles#inheriting-roles--establishing-hierarchy)。

3. 在 SQL 编辑器中编辑 SQL 语句。
4. 点击 SQL 编辑器下方的计算集群图标 <WarehouseSVG/>，然后从列表中选择一个计算集群。
4. 点击 **Run Script**。

查询结果显示在输出区域中。您可以点击 **Export** 将整个结果保存到 CSV 文件，或者在输出区域中选择一个或多个单元格，然后按 Command + C (在 Mac 上) 或 Ctrl + C (在 Windows 上) 将它们复制到剪贴板。

:::tip
- 为了方便您编辑 SQL 语句，您可以选择数据库列表中的一个表，然后点击它旁边的 "..." 按钮。然后，按照菜单提示选择将表名或所有列名一键复制到右侧的 SQL 输入区域。

- 如果您在 SQL 输入区域中输入多个语句，Databend Cloud 将仅执行光标所在的语句。您可以移动光标以执行其他语句。此外，您可以使用键盘快捷键：Ctrl + Enter (Windows) 或 Command + Enter (Mac) 执行当前语句，以及 Ctrl + Shift + Enter (Windows) 或 Command + Shift + Enter (Mac) 执行所有语句。
:::

## 共享 Worksheet

您可以与组织中的所有人或特定个人共享您的 Worksheets。为此，请点击要共享的 Worksheet 中的 **Share**，或点击 **Share this Folder** 以共享 Worksheet 文件夹。

![Alt text](@site/static/img/documents/worksheet/share.png)

在出现的对话框中，选择共享范围。您可以复制链接并与预期的接收者共享，他们也会收到电子邮件通知。请注意，如果您选择 **Designated Members** 范围，接收者必须点击您共享的链接才能成功共享。

- 要查看其他人与您共享的 Worksheets，请点击侧边栏中的 **Worksheets**，然后点击右侧的 **Shared with Me** 选项卡。
- 当您与他人共享 Worksheet 时，如果他们具有必要的权限，他们可以执行其中的 SQL 语句，但他们无法对语句进行任何编辑。
```