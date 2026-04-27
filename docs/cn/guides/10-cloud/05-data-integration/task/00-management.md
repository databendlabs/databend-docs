---
title: 任务管理
---

本页介绍集成任务的通用操作方式，包括任务创建流程、启动与停止、状态说明，以及运行历史查看方式。具体的源端配置请参考各任务类型详情页。

## 创建任务的一般流程

1. 前往 **Data** > **Data Integration**，点击 **Create Task**。
2. 选择一个已有的数据源。
3. 根据任务类型填写源端参数，例如文件路径、源表、同步模式或过滤条件。
4. 预览源数据，确认表结构和字段类型。
5. 选择目标 Warehouse、目标数据库和目标表。
6. 创建任务，并在需要时手动启动。

## 启动与停止任务

任务创建完成后，初始状态为 **Stopped**。要开始同步数据，请在任务上点击 **Start** 按钮。

![任务列表](/img/cloud/dataintegration/dataintegration-task-list-with-action-button.png)

要停止正在运行的任务，请点击 **Stop** 按钮。任务会优雅停止并保存当前进度。

## 任务状态

Data Integration 页面会展示所有任务及其当前状态：

| 状态 | 说明 |
|------|------|
| Running | 任务正在主动同步或导入数据 |
| Stopped | 任务当前未运行 |
| Failed | 任务执行过程中发生错误 |

## 查看运行历史

点击某个任务即可查看其执行历史。运行历史包括：

- 执行开始与结束时间
- 已同步或已导入的行数
- 错误详情（如有）

![运行历史](/img/cloud/dataintegration/dataintegration-run-history-page.png)

## 不同任务类型的运行行为

- S3 任务可以是一次性导入，也可以启用持续轮询以自动导入新文件。
- MySQL `Snapshot` 任务通常在全量导入完成后自动停止。
- MySQL `CDC Only` 和 `Snapshot + CDC` 任务会持续运行，直到手动停止。

有关具体字段和配置项，请继续阅读对应任务类型页面：

- [Amazon S3 集成任务](./01-s3.md)
- [MySQL 集成任务](./02-mysql.md)
