---
title: "Example: Sync a MySQL Table to Databend"
sidebar_label: "Example: Sync MySQL"
description: "Step-by-step example: an agent syncs a MySQL table to Databend with one account API token, from testing the connection to checking the data."
---

Read the [Overview](./index.md) first for authentication, request conventions, and errors.

An agent can do these steps with one API token. Each step names the endpoint.

1. Check that the connection works. Call [Test a Data Source Connection](./13-data-sources.md#test-a-data-source-connection) with `serviceId: 2` and `mysqlCredentials`.
2. Save the data source. Call [Create a Data Source](./13-data-sources.md#create-a-data-source) with the same body. Keep the returned `id`.
3. Find the source tables. Call [List MySQL Tables](./13-data-sources.md#list-mysql-tables). For several databases, call [Preview MySQL Table Rules](./13-data-sources.md#preview-mysql-table-rules) instead.
4. Choose a warehouse. Call [List Warehouses](./04-warehouses.md#list-warehouses).
5. Create the task. Call [Create a Task](./14-data-integration-tasks.md#create-a-task) with `mysqlTask.syncMode: 3`. Keep the returned `id`.
6. Start the task. Call [Operate Tasks](./14-data-integration-tasks.md#operate-tasks) with `operate: 1`.
7. Watch the progress. Call [Get a Task](./14-data-integration-tasks.md#get-a-task) and read [`taskStatus`](./14-data-integration-tasks.md#task-status) and [`lastRunData.mysqlLastRun`](./14-data-integration-tasks.md#last-run-data). For trends, call [Get Sync Metrics](./14-data-integration-tasks.md#get-sync-metrics) with `queryType: MySQLSync`.
8. If the run fails, call [List Task Runs](./14-data-integration-tasks.md#list-task-runs) and [Get Task Run Details](./14-data-integration-tasks.md#get-task-run-details), and read `responseData.error`.
9. Check the data. Run `SELECT count(*) FROM raw_shop.orders` through the [Query API](./01-query-api.md).

Steps 2, 5, and 6 change resources and can cost credits. Ask the user to confirm them before you call them.
