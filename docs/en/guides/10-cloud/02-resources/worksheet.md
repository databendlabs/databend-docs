---
title: Worksheets
---

import DbSVG from '@site/static/img/icon/database.svg'
import RoleSVG from '@site/static/img/icon/role.svg'
import WarehouseSVG from '@site/static/img/icon/warehouse.svg'
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg'

Worksheets in Databend Cloud are used to organize, run, and save SQL statements. They can also be shared with others in your organization.

## Creating a Worksheet

To create a new worksheet, click on **Worksheets** in the sidebar and select **New Worksheet**.

If your SQL statements are already saved in an SQL file, you can also create a worksheet directly from the file. To do so, click the ellipsis icon <EllipsisSVG/> to the right of **New Worksheet**, then select **Create from SQL File**.

## Editing and Running SQL Statements

To edit and run an SQL statement:

1. Click on the database icon <DbSVG/> above the SQL editor and select the database you want to query.
2. Click on the user icon <RoleSVG/> above the SQL editor and choose a role to use. The dropdown list will display all the roles you have been granted, along with any child roles under your roles in the hierarchy. For more information about the role hierarchy, see [Inheriting Roles & Establishing Hierarchy](/guides/security/access-control/roles#inheriting-roles--establishing-hierarchy).

3. Edit the SQL statement in the SQL editor.
4. Click on the warehouse icon <WarehouseSVG/> under the SQL editor and select a warehouse from the list.
5. Click **Run Script**.

The query result shows in the output area. You can click **Export** to save the whole result to a CSV file, or select one or multiple cells in the output area and press Command + C (on Mac) or Ctrl + C (on Windows) to copy them to your clipboard.

:::tip

- Multiple SQL statements in a single API call are not supported. Ensure that each SQL query in the worksheet ends with a single semicolon (;).
- To make it easier for you to edit SQL statements, you can select a table in the database list and click the "..." button next to it. Then, follow the menu prompts to choose to copy the table name or all column names to the SQL input area on the right in one click.

- If you enter multiple statements in the SQL input area, Databend Cloud will only execute the statement where the cursor is located. You can move the cursor to execute other statements. Additionally, you can use keyboard shortcuts: Ctrl + Enter (Windows) or Command + Enter (Mac) to execute the current statement, and Ctrl + Shift + Enter (Windows) or Command + Shift + Enter (Mac) to execute all statements.
  :::

## Query Result Configs

To change how the worksheet shows and returns query results, click the settings icon in the bottom-right corner of the result area to open **Result Configs**:

| Setting | Default | Options | Description |
|---|---|---|---|
| Max Cell Content Length | 3,000 characters | 3K–Unlimited | Cell values longer than this are truncated in the display. |
| Max Display Rows | 10,000 | 5,000 or 10,000 | The most rows shown in the result table. It changes only what is shown; the query result and exports are not affected. |
| Max Result Rows | 10,000 | 10,000, 100,000, 1,000,000 or 10,000,000 | The query stops after returning this many rows, and exports contain the same rows. It is sent as the [`max_result_rows`](/sql/sql-reference/system-tables/system-settings) setting for each run. |

Max Result Rows does not apply in these cases:

- The SQL has its own `LIMIT`. The `LIMIT` decides how many rows are returned.
- The worksheet session sets `max_result_rows` with [`SET`](/sql/sql-commands/administration-cmds/set-global). That value applies to later runs in the session, whatever Max Result Rows is.

The result details next to the table show **Result Rows** (rows the query returned) and **Display Rows** (rows shown in the table).

Result Configs are saved in your browser for each organization and apply to the next run. Only the first 200 columns of a result are shown; this limit is fixed.

:::note
A large Max Cell Content Length, **Unlimited**, or a large Max Result Rows can make the browser slow or unresponsive with large result sets.
:::

## Sharing a Worksheet

You can share your worksheets with everyone in your organization or specific individuals. To do so, click **Share** in the worksheet you want to share, or click **Share this Folder** to share a worksheet folder.

![Alt text](@site/static/img/documents/worksheet/share.png)

In the dialog box that appears, select the sharing scope. You can copy and share the link with the intended recipients, who will also receive an email notification. Please note that if you choose the **Designated Members** scope, recipients must click the link you share for the sharing to be successful.

- To view the worksheets shared with you by others, click **Worksheets** in the sidebar, then click the **Shared with Me** tab on the right.
- When you share a worksheet with others, they can execute the SQL statements in it if they have the necessary permissions, but they won't be able to make any edits to the statements.

## Exporting Query Results

:::tip[Large result set downloads]

Downloading large result sets from the worksheet can time out or fail. For large downloads, export the results to a stage or external storage, then download the files directly. See [Download Exported Files](/guides/unload-data/download-files).

:::

Databend Cloud provides the ability to export query results. However, this feature requires the organization Owner to grant the **EXPORT** permission to team members. For data security purposes, this feature is disabled by default.

![Alt text](@site/static/img/documents/worksheet/download.png)

If you need to use this feature, please contact your organization Owner to enable the permission(**Admin** > **Users & Roles**):

![Alt text](@site/static/img/documents/worksheet/export.png)
