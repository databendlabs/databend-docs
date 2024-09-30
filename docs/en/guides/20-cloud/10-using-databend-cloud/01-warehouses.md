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

In Databend Cloud, warehouses are available in various sizes, each defined by the maximum number of concurrent queries it can handle. When creating a warehouse, you can choose from the following sizes:

| Size                  | Max. Concurrency | Recommended Use Cases                                                                                                                            |
|-----------------------|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| XSmall                | 2                | Best for simple tasks like testing or running light queries. Suitable for small datasets (around 50GB).                                          |
| Small                 | 4                | Great for running regular reports and moderate workloads. Suitable for medium-sized datasets (around 200GB).                                     |
| Medium                | 8                | Ideal for teams handling more complex queries and higher concurrency. Suitable for larger datasets (around 1TB).                                 |
| Large                 | 16               | Perfect for organizations running many concurrent queries. Suitable for large datasets (around 5TB).                                             |
| XLarge                | 32               | Built for enterprise-scale workloads with high concurrency. Suitable for very large datasets (over 10TB).                                        |
| Multi-Cluster Scaling | Unlimited        | Automatically scales out and scales in to match your workload, providing the most cost-efficient way to improve concurrency based on your needs. |

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

### Best Practices

To effectively manage your warehouses and ensure optimal performance and cost-efficiency, consider the following best practices. These guidelines will help you size, organize, and fine-tune your warehouses for various workloads and environments:

- **Choose the Right Size**  
  - For **development & testing**, use smaller warehouses (XSmall, Small).  
  - For **production**, opt for larger warehouses (Medium, Large, XLarge).  

- **Separate Warehouses**  
  - Use separate warehouses for **data loading** and **query execution**.  
  - Create distinct warehouses for **development**, **testing**, and **production** environments.  

- **Data Loading Tips**  
  - Smaller warehouses (Small, Medium) are suitable for data loading.  
  - Optimize file size and the number of files to enhance performance.  

- **Optimize for Cost & Performance**  
  - Avoid running simple queries like `SELECT 1` to minimize credit usage.  
  - Use bulk loading (`COPY`) rather than individual `INSERT` statements.  
  - Monitor long-running queries and optimize them to improve performance.  

- **Auto-Suspend**  
  - Enable auto-suspend to save credits when the warehouse is idle.  

- **Disable Auto-Suspend for Frequent Queries**  
  - Keep warehouses active for frequent or repetitive queries to maintain cache and avoid delays.  

- **Use Auto-Scaling (Business & Dedicated Plans Only)**  
  - Multi-cluster scaling automatically adjusts resources based on workload demand.  

- **Monitor & Adjust Usage**  
  - Regularly review warehouse usage and resize as needed to balance cost and performance.

## Connecting to a Warehouse {#connecting}

Connecting to a warehouse provides the compute resources required to run queries and analyze data within Databend Cloud. This connection is necessary when accessing Databend Cloud from your applications or SQL clients.

To obtain the connection information for a warehouse:

1. Click **Connect** on the **Overview** page.
2. Select the database and warehouse you wish to connect to. The connection information will update based on your selection.
3. The connection details include a SQL user named `cloudapp` with a randomly generated password. Databend Cloud does not store this password. Be sure to copy and save it securely. If you forget the password, click **Reset** to generate a new one.
