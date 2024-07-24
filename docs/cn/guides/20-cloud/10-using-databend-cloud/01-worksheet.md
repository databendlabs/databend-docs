---
title: 使用工作表
---
import DbSVG from '@site/static/img/icon/database.svg'
import RoleSVG from '@site/static/img/icon/role.svg'
import WarehouseSVG from '@site/static/img/icon/warehouse.svg'

工作表是 Databend Cloud 中用于组织和管理 SQL 语句的重要工具。您可以在工作表中编辑和运行 SQL 语句，也可以将它们保存在工作表中以供将来参考和使用。这可以大大提高工作效率，避免重复编码。

要创建一个新的工作表，请点击侧边栏中的 **Worksheets** 并选择 **New Worksheet**。

## 编辑和运行 SQL 语句

要编辑和运行 SQL 语句：

1. 点击 SQL 编辑器上方的数据库图标 <DbSVG/> 并选择您要查询的数据库。
2. 点击 SQL 编辑器上方的用户图标 <RoleSVG/> 并选择一个角色使用。下拉列表将显示您被授予的所有角色，以及您角色层次结构下的任何子角色。有关角色层次结构的更多信息，请参阅 [继承角色与建立层次结构](/guides/security/access-control/roles#inheriting-roles--establishing-hierarchy)。

3. 在 SQL 编辑器中编辑 SQL 语句。
4. 点击 SQL 编辑器下方的仓库图标 <WarehouseSVG/> 并从列表中选择一个仓库。
4. 点击 **Run Script**。

查询结果显示在输出区域。您可以点击 **Export** 将整个结果保存为 CSV 文件，或者在输出区域选择一个或多个单元格并按 Command + C（在 Mac 上）或 Ctrl + C（在 Windows 上）将其复制到剪贴板。

:::tip
- 为了方便您编辑 SQL 语句，您可以在数据库列表中选择一个表并点击其旁边的 "..." 按钮。然后，按照菜单提示选择一键复制表名或所有列名到右侧的 SQL 输入区域。

- Databend Cloud 编辑器中提供了 AI 辅助编辑 SQL 语句的功能。只需在新行的开头输入 "/" 并输入您的查询，例如 "查询当前时间"。编辑器将显示一个 AI 生成的 SQL 语句。如需进一步指导该语句，请突出显示它，并点击 **Edit** 解释您的期望更改或请求更多帮助。或者，点击 **Chat** 与 AI 进行对话以获得更全面的支持。

- 如果您在 SQL 输入区域输入多个语句，Databend Cloud 将仅执行光标所在位置的语句。您可以移动光标以执行其他语句。此外，您可以使用键盘快捷键：Ctrl + Enter（Windows）或 Command + Enter（Mac）执行当前语句，以及 Ctrl + Shift + Enter（Windows）或 Command + Shift + Enter（Mac）执行所有语句。
:::

## 管理工作表

您可以创建多个工作表，并使用文件夹对不同项目的查询进行分类和组织。这些工作表以标签页的形式打开，方便在同一网页内进行切换和查看。

:::tip
如果您的 SQL 语句已经保存在一个 SQL 文件中，您也可以直接从文件创建工作表：点击 **New Worksheet** 右侧的 **...** 按钮，然后选择 **Create from SQL File**。
:::

Databend Cloud 还提供了方便的操作来管理单个工作表。您可以通过 UI 界面克隆、移动、重命名或删除工作表。为此，请从列表中选择一个工作表，然后点击顶部的 **⋮** 按钮并选择所需的操作。此外，您可以与组织内的特定个人共享工作表。要进行操作，请点击顶部的 **Share** 按钮。在出现的对话框中，选择您希望与之共享的个人并复制工作表链接。然后，您可以将链接分享给预期的收件人，他们还将收到一封电子邮件通知。

![Alt text](@site/static/img/documents/worksheet/worksheet-operations.png)