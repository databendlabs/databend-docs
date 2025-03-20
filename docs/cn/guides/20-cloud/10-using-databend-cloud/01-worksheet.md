---
title: 工作表
---
import DbSVG from '@site/static/img/icon/database.svg'
import RoleSVG from '@site/static/img/icon/role.svg'
import WarehouseSVG from '@site/static/img/icon/warehouse.svg'
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg'

Databend Cloud 中的工作表用于组织、运行和保存 SQL 语句。您还可以与组织中的其他人共享这些工作表。

## 创建工作表

要创建一个新的工作表，请在侧边栏中点击 **Worksheets**，然后选择 **New Worksheet**。

如果您的 SQL 语句已经保存在一个 SQL 文件中，您也可以直接从该文件创建工作表。为此，请点击 **New Worksheet** 右侧的省略号图标 <EllipsisSVG/>，然后选择 **Create from SQL File**。

## 编辑和运行 SQL 语句

要编辑和运行 SQL 语句：

1. 点击 SQL 编辑器上方的数据库图标 <DbSVG/>，选择您要查询的数据库。
2. 点击 SQL 编辑器上方的用户图标 <RoleSVG/>，选择要使用的角色。下拉列表将显示您被授予的所有角色，以及您角色层次结构中的任何子角色。有关角色层次结构的更多信息，请参见[继承角色与建立层次结构](/guides/security/access-control/roles#inheriting-roles--establishing-hierarchy)。

3. 在 SQL 编辑器中编辑 SQL 语句。
4. 点击 SQL 编辑器下方的计算集群图标 <WarehouseSVG/>，从列表中选择一个计算集群。
4. 点击 **Run Script**。

查询结果将显示在输出区域。您可以点击 **Export** 将整个结果保存为 CSV 文件，或者在输出区域中选择一个或多个单元格，然后按 Command + C (Mac) 或 Ctrl + C (Windows) 将它们复制到剪贴板。

:::tip
- 为了便于您编辑 SQL 语句，您可以在数据库列表中选择一个表，然后点击其旁边的“...”按钮。接着，按照菜单提示选择复制表名或所有列名到右侧的 SQL 输入区域，只需点击一次即可。

- 如果您在 SQL 输入区域中输入多个语句，Databend Cloud 只会执行光标所在的语句。您可以移动光标以执行其他语句。此外，您还可以使用键盘快捷键：Ctrl + Enter（Windows）或 Command + Enter（Mac）来执行当前语句，使用 Ctrl + Shift + Enter（Windows）或 Command + Shift + Enter（Mac）来执行所有语句。
:::

## 共享工作表

您可以将工作表共享给组织中的所有人或特定个人。为此，请点击要共享的工作表中的 **Share**，或点击 **Share this Folder** 以共享一个工作表文件夹。

![Alt text](@site/static/img/documents/worksheet/share.png)

在出现的对话框中，选择共享范围。您可以复制并分享链接给指定的接收者，他们也会收到电子邮件通知。请注意，如果您选择了 **Designated Members** 范围，接收者必须点击您分享的链接才能使共享成功。

- 要查看其他人共享给您的表格，请点击侧边栏中的 **Worksheets**，然后点击右侧的 **Shared with Me** 标签。
- 当您与他人共享工作表时，如果他们有必要的权限，他们可以执行其中的 SQL 语句，但他们无法对语句进行任何编辑。