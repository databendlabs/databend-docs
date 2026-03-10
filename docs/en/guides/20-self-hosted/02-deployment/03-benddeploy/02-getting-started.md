---
title: Getting Started with BendDeploy
---

This guide walks you through setting up a Databend deployment with BendDeploy — from configuring the system meta to creating tenants and warehouses.

## Before You Start

Before proceeding, ensure that BendDeploy is properly installed and that you're logged in to your environment. For setup instructions, refer to [Installing BendDeploy](01-installing-benddeploy.md).

## Step 1: Create a System Meta

1. In the left navigation pane, click **System Meta**, then click **Create Meta** on the right.
2. Choose the desired `databend-meta` image version, set the replica count, and configure the CPU limit.
3. (Optional) If you have persistent storage available, toggle the **Enabled** switch and specify the size, storage class, and mount path.
4. Click **Create** to deploy the System Meta service.

## Step 2: Create a Tenant

1. In the left navigation pane, click **Tenant**, then click **Create Tenant** on the right.
2. Enter a name for the tenant, then click **Next**.
3. Select **I have a system meta**, confirm that the previously created meta instance is listed below, then click **Next** to proceed.
4. Specify the object storage configuration for your tenant, then click **Next** to proceed.
5. Create a SQL user by specifying a username and password, then click **Next** to proceed.
6. Specify the ingress domain, such as `*.example.domain`, to define the domain through which your tenant will be accessible externally, then click **Next** to proceed.
7. (Optional) If you have a license for Databend Enterprise, enter your license, then click **Create**.

## Step 3: Create a Warehouse

1. In the left navigation pane, click **Tenant**, then click on the tenant you have created. 
2. click **Create Warehouse**. 
3. On the page that opens, specify the warehouse name, `databend-query` image version, and configure the CPU limit.
4. Click **Confirm** to start creating the warehouse. 

## Step 4: (Optional) Enable Logging

If you have installed the logging components, you can enable the logging feature for your tenant. Please note that, once logging is enabled for a tenant, a warehouse is automatically created for log collection.

1. In the left navigation pane, click **Logs**, then click **Enable Logs** on the right.
2. Specify the tenant you want to enable logging for, user credentials, and the log storage bucket.
3. Click **OK**. 