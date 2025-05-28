---
title: 工作区
---
import DbSVG from '@site/static/img/icon/database.svg'
import RoleSVG from '@site/static/img/icon/role.svg'
import WarehouseSVG from '@site/static/img/icon/warehouse.svg'
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg'

Databend Cloud 中的工作区用于组织、运行和保存 SQL 语句。它们也可以与组织中的其他人共享。

## 创建工作区

要创建新的工作区，请点击侧边栏中的**工作区**，然后选择**新建工作区**。

如果您的 SQL 语句已经保存在 SQL 文件中，您也可以直接从文件创建工作区。为此，请点击**新建工作区**右侧的省略号图标 <EllipsisSVG/>，然后选择**从 SQL 文件创建**。

## 编辑和运行 SQL 语句

要编辑和运行 SQL 语句：

1. 点击 SQL 编辑器上方的数据库图标 <DbSVG/>，选择您要查询的数据库。
2. 点击 SQL 编辑器上方的用户图标 <RoleSVG/>，选择要使用的角色。下拉列表将显示您被授予的所有角色，以及层次结构中您角色下的任何子角色。有关角色层次结构的更多信息，请参阅 [角色继承与层次结构建立](/guides/security/access-control/roles#inheriting-roles--establishing-hierarchy)。

3. 在 SQL 编辑器中编辑 SQL 语句。
4. 点击 SQL 编辑器下方的计算集群图标 <WarehouseSVG/>，从列表中选择一个计算集群。
4. 点击**运行脚本**。

查询结果显示在输出区域中。您可以点击**导出**将整个结果保存为 CSV 文件，或者在输出区域中选择一个或多个单元格，然后按 Command + C (在 Mac 上) 或 Ctrl + C (在 Windows 上) 将它们复制到剪贴板。

:::tip
- 为了让您更容易编辑 SQL 语句，您可以在数据库列表中选择一个表，然后点击旁边的"..."按钮。接着，按照菜单提示选择一键复制表名或所有列名到右侧的 SQL 输入区域。

- 如果您在 SQL 输入区域中输入多个语句，Databend Cloud 将只执行光标所在位置的语句。您可以移动光标来执行其他语句。此外，您可以使用键盘快捷键：Ctrl + Enter (Windows) 或 Command + Enter (Mac) 执行当前语句，以及 Ctrl + Shift + Enter (Windows) 或 Command + Shift + Enter (Mac) 执行所有语句。
:::

## 共享工作区

您可以与组织中的每个人或特定个人共享您的工作区。为此，请在您要共享的工作区中点击**共享**，或点击**共享此文件夹**来共享工作区文件夹。

![Alt text](@site/static/img/documents/worksheet/share.png)

在出现的对话框中，选择共享范围。您可以复制链接并与目标接收者共享，他们也会收到电子邮件通知。请注意，如果您选择**指定成员**范围，接收者必须点击您共享的链接才能成功共享。

- 要查看其他人与您共享的工作区，请点击侧边栏中的**工作区**，然后点击右侧的**与我共享**选项卡。
- 当您与他人共享工作区时，如果他们具有必要的权限，他们可以执行其中的 SQL 语句，但无法对语句进行任何编辑。