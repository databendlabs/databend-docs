---
title: Work with Warehouses
---

## What is Warehouse?

The warehouse is an essential component of Databend Cloud. A warehouse represents a set of computing capacities including CPU, memory, and local caches. You must run a warehouse to perform the following SQL tasks in Databend Cloud:

- Query data with the SELECT statement
- Modify data with the INSERT, UPDATE, or DELETE statement
- Load data into a table with the COPY INTO TABLE command
- Unload data from a table with the COPY INTO LOCATION command

Running a warehouse consumes credits. For more information, see [Pricing and Billing](../20-manage/03-pricing.md).

## Warehouse Sizes

The warehouse comes in different sizes in Databend Cloud. Because Databend Cloud measures the computing capacity of a warehouse in vCPUs, the size of a warehouse basically reflects the number of vCPUs that the warehouse includes. You can have multiple warehouses in different sizes in Databend Cloud. The following sizes are available to select when you create a warehouse:

- XSmall: Includes 8 vCPUs.
- Small: Includes 16 vCPUs.
- Medium: Includes 32 vCPUs.
- Large: Includes 64 vCPUs.
- XLarge: Includes 128 vCPUs.

:::tip
**Choose the right warehouse size**. Generally, a small warehouse will take more time to execute the SQL tasks than a medium or large one. The best practice is to start from a small one. If it takes a long time (for example, minutes) to return the results, try a medium or large one.
:::

## Warehouse States
A warehouse can have the following types of states in Databend Cloud:

- Suspended
- Starting
- Running

Please note that Databend Cloud charges credits only when your warehouses are in the Running state. A warehouse automatically goes into the Suspended state in case of no activities to reduce your expense on credits.

When you select a suspended warehouse to perform a SQL task, the warehouse will automatically wake up and start to run the task. You can also manually start or suspend a warehouse on the **Warehouses** page.

![](@site/static/img/documents/warehouses/states.jpg)


## Managing Warehouses {#managing}

The **Warehouses** page lists the existing warehouses and allows you to start or suspend a warehouse manually. If you are an admin user, you can also create or delete a warehouse on the page.

![](@site/static/img/documents/warehouses/warehouse-overview.png)

Clicking a warehouse in the list opens the warehouse's details page where you can see your credit usage statistics and history.

![](@site/static/img/documents/warehouses/warehouse-detail.png)

## Connecting to a Warehouse {#connecting}

To obtain the necessary connection information, select and click a warehouse on the **Warehouses** page to enter the details page, then click **Connect** to show a pop-up.

![Alt text](@site/static/img/documents/warehouses/connect-warehouse.png)

The following is an example of a pop-up connection information window where Databend Cloud offers a SQL user named *cloudapp* with a randomly generated password. You will need the username and password for authentication when connecting to the warehouse. Please note that Databend will not store the generated password for you. You must copy and paste the password to a secure place. If you forget the password, click **Reset DB Password** to generate a new one.

![Alt text](@site/static/img/documents/warehouses/connect-warehouse-2.png)
