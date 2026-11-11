---
title: "示例：把 MySQL 表同步到 Databend"
sidebar_label: "示例：同步 MySQL"
---

调用前请先阅读[概览](./index.md)，了解鉴权、请求约定和错误处理。

Agent 可以用一个 API token 完成以下步骤，每一步都注明了对应接口。

1. 检查连接是否可用。调用[测试数据源连接](./13-data-sources.md#test-a-data-source-connection)，传 `serviceId: 2` 和 `mysqlCredentials`。
2. 保存数据源。用相同的请求体调用[创建数据源](./13-data-sources.md#create-a-data-source)，记下返回的 `id`。
3. 查找源表。调用[列出 MySQL 表](./13-data-sources.md#list-mysql-tables)。涉及多个数据库时，改为调用[预览 MySQL 表规则](./13-data-sources.md#preview-mysql-table-rules)。
4. 选择计算集群。调用[列出计算集群](./04-warehouses.md#list-warehouses)。
5. 创建任务。调用[创建任务](./14-data-integration-tasks.md#create-a-task)，传 `mysqlTask.syncMode: 3`，记下返回的 `id`。
6. 启动任务。调用[操作任务](./14-data-integration-tasks.md#operate-tasks)，传 `operate: 1`。
7. 查看进度。调用[获取任务](./14-data-integration-tasks.md#get-a-task)，读取 `taskStatus` 和 `lastRunData.mysqlLastRun`。查看趋势时，调用[获取同步指标](./14-data-integration-tasks.md#get-sync-metrics)并传 `queryType: MySQLSync`。
8. 如果运行失败，调用[列出任务运行记录](./14-data-integration-tasks.md#list-task-runs)和[获取任务运行详情](./14-data-integration-tasks.md#get-task-run-details)，读取 `responseData.error`。
9. 检查数据。通过 [Query API](./01-query-api.md) 执行 `SELECT count(*) FROM raw_shop.orders`。

第 2、5、6 步会修改资源，并可能消耗 credits。调用前请先让用户确认。
