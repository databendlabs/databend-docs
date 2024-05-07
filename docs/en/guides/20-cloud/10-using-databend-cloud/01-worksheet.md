---
title: Work with Worksheets
---

The worksheet is an important tool in Databend Cloud used for organizing and managing SQL statements. You can edit and run SQL statements in a worksheet, as well as save them in the worksheet for future reference and use. This can greatly improve work efficiency and avoid repetitive coding.

To open a new worksheet, click on **Worksheets** in the sidebar and select **New Worksheet**.

![Alt text](@site/static/img/documents/worksheet/worksheet.png)

The worksheet interface is divided into the following parts:

- Sidebar (left side): Shows existing databases and tables, making it easy to copy table and column names to the editor. It also allows data preview and facilitates pipeline creation.
- Editor (upper right): The area where you edit SQL statements.
- Output area (lower right): Displays query results.

## Editing and Running SQL Statements

To edit and run an SQL statement:

1. Click on the database button above the SQL input area and select the database you want to query.
2. Edit the SQL statement in the editor.
3. Choose a warehouse: click the button to the right of **Run Script** and select a warehouse from the list.
4. Click **Run Script**.

The query result shows in the output area. You can click **Export** to save the whole result to a CSV file, or select one or multiple cells in the output area and press Command + C (on Mac) or Ctrl + C (on Windows) to copy them to your clipboard.

:::tip
- To make it easier for you to edit SQL statements, you can select a table in the database list and click the "..." button next to it. Then, follow the menu prompts to choose to copy the table name or all column names to the SQL input area on the right in one click.

- AI assistance is available for editing SQL statements within the Databend Cloud editor. Simply type "/" at the beginning of a new line and input your query, like "Query the current time". The editor will display an AI-generated SQL statement. For additional guidance on the statement, highlight it, and click **Edit** to explain your desired changes or request further assistance. Alternatively, click **Chat** to engage in a conversation with AI for more comprehensive support.

- If you enter multiple statements in the SQL input area, Databend Cloud will only execute the statement where the cursor is located. You can move the cursor to execute other statements. Additionally, you can use keyboard shortcuts: Ctrl + Enter (Windows) or Command + Enter (Mac) to execute the current statement, and Ctrl + Shift + Enter (Windows) or Command + Shift + Enter (Mac) to execute all statements.
:::

## Managing Worksheets

You can create multiple worksheets and use folders to categorize and organize queries for different projects. These worksheets are opened as tabs, enabling convenient switching and viewing within the same web page.

:::tip
If your SQL statements are already saved in an SQL file, you can also create a worksheet directly from the file: click the **...** button to the right of **New Worksheet**, then select **Create from SQL File**.
:::

Databend Cloud also offers convenient operations to manage individual worksheets. You can clone, move, rename, or delete a worksheet through the UI interface. To do this, select a worksheet from the list, and then click the **⋮** button at the top and choose the desired operation. Additionally, you can share a worksheet with specific individuals within your organization. To proceed, click the **Share** button located at the top. In the dialog box that appears, select the individuals you wish to share with and copy the worksheet link. You can then share the link with the intended recipients, and they will receive an email notification as well.

![Alt text](@site/static/img/documents/worksheet/worksheet-operations.png)
