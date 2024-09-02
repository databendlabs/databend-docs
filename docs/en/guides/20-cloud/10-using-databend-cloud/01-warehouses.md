---
title: Warehouses
---

import PlaySVG from '@site/static/img/icon/play.svg'
import SuspendSVG from '@site/static/img/icon/suspend.svg'
import CheckboxSVG from '@site/static/img/icon/checkbox.svg'
import EllipsisSVG from '@site/static/img/icon/ellipsis.svg'
import  { Button } from 'antd'

The warehouse is an essential component of Databend Cloud. A warehouse represents a set of computing capacities including CPU, memory, and local caches. You must run a warehouse to perform SQL tasks such as:

- Querying data with the SELECT statement
- Modifying data with the INSERT, UPDATE, or DELETE statement
- Loading data into a table with the COPY INTO command

Running a warehouse incurs expenses. For more information, see [Warehouse Pricing](/guides/overview/editions/dc/pricing#warehouse-pricing).

## Warehouse Sizes

In Databend Cloud, warehouses are available in various sizes, each defined by the number of vCPUs it includes and the maximum number of concurrent queries it can handle. When creating a warehouse, you can choose from the following sizes:

| Size   | vCPUs | Max. Running Queries |
|--------|-------|----------------------|
| XSmall | 8     | 1-2                  |
| Small  | 16    | 1-4                  |
| Medium | 32    | 1-8                  |
| Large  | 64    | 1-16                 |
| XLarge | 128   | 1-32                 |

To choose the appropriate warehouse size, Databend recommends starting with a smaller size. Smaller warehouses may take longer to execute SQL tasks compared to medium or large ones. If you find that query execution is taking too long (for example, several minutes), consider scaling up to a medium or large warehouse for faster results.

## Managing Warehouses {#managing}

An organization can have as many warehouses as needed. The **Warehouses** page displays all the warehouses in your organization and allows you to manage them. Please note that only `account_admin` can create or delete a warehouse.

### Suspending / Resuming Warehouses

A suspended warehouse does not consume any credits. You can manually suspend or resume a warehouse by clicking the <SuspendSVG/> or <PlaySVG/> button on the warehouse. However, a warehouse can automatically suspend or resume in the following scenarios: 

- A warehouse can automatically suspend if there is no activity, based on its auto-suspend setting.
- When you select a suspended warehouse to perform a SQL task, the warehouse will automatically resume.

### Performing Bulk Operations

You can perform bulk operations on warehouses, including bulk restart, bulk suspend, bulk resume, and bulk delete. To do so, select the warehouses for bulk operations by checking the checkboxes <CheckboxSVG/> in the warehouse list, and then click the ellipse button <EllipsisSVG/> for the desired operation.

![alt text](../../../../../static/img/cloud/bulk.png)

## Connecting to a Warehouse {#connecting}

To obtain the necessary connection information, select and click a warehouse on the **Warehouses** page to enter the details page, then click **Connect** to show a pop-up.

![Alt text](@site/static/img/documents/warehouses/connect-warehouse.png)

The following is an example of a pop-up connection information window where Databend Cloud offers a SQL user named *cloudapp* with a randomly generated password. You will need the username and password for authentication when connecting to the warehouse. Please note that Databend will not store the generated password for you. You must copy and paste the password to a secure place. If you forget the password, click **Reset** to generate a new one.

![Alt text](@site/static/img/documents/warehouses/connect-warehouse-2.png)
