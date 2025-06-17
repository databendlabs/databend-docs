---
title: 伸缩 Meta Service 节点
---

## 概述

本指南将引导您完成 Databend Meta Service 集群的伸缩操作。您可以选择向集群添加新节点（扩容）或移除现有节点（缩容）。

## 前置条件

- 已完成 [部署 Meta Service](02-deploy-metasrv.md) 并拥有运行中的 Meta Service 节点
- 已在新节点完成 [准备软件包环境](01-prepare.md)（扩容场景）
- 在节点上拥有 sudo 权限

## 扩容：添加新的 Meta Service 节点

添加新 Meta Service 节点时，请在新节点执行 [部署 Meta Service](02-deploy-metasrv.md) 的步骤，并确保：

1. 从现有节点复制配置：
   ```bash
   sudo mkdir -p /etc/databend
   sudo scp root@<existing-node-ip>:/etc/databend/databend-meta.toml /etc/databend/
   ```

2. 修改配置文件：
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   更新以下参数：
   ```toml
   [raft_config]
   id = 1  # Change this to a unique ID for each node (1, 2, 3, etc.)
   single = false  # Change this to false for multi-node deployment
   join = ["127.0.0.1:28004"]  # Add all existing Meta Service nodes here
   ```

3. 按 [部署 Meta Service](02-deploy-metasrv.md) 的步骤在新节点安装并启动服务。

4. 验证新节点是否加入集群：
   ```bash
   databend-metactl status
   ```

5. 确认新节点加入后，更新所有现有节点的配置：
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   在每个现有节点更新：
   ```toml
   [raft_config]
   single = false  # Change this to false
   join = ["127.0.0.1:28004", "127.0.0.2:28004", "127.0.0.3:28004"]  # Add all Meta Service nodes including the new one
   ```

6. 更新所有 Query 节点的 Meta Service 端点配置：
   ```bash
   sudo vim /etc/databend/databend-query.toml
   ```

   在每个 Query 节点更新：
   ```toml
   [meta]
   endpoints = ["127.0.0.1:9191", "127.0.0.2:9191", "127.0.0.3:9191"]  # Add all Meta Service nodes including the new one
   ```

## 缩容：移除 Meta Service 节点

从集群移除 Meta Service 节点的步骤：

1. 检查目标节点是否为当前 leader：
   ```bash
   databend-metactl status
   ```
   若目标节点是 leader，需先转移领导权。

2. 转移 leader 节点权限：
   ```bash
   databend-metactl transfer-leader
   ```

3. 验证权限转移：
   ```bash
   databend-metactl status
   ```
   确认领导权已移交至目标节点。

4. 使用 `databend-meta` 命令安全移除节点：
   ```bash
   databend-meta --leave-id <node_id_to_remove> --leave-via <node_addr_1> <node_addr_2>...
   ```

   示例（移除 ID=1 的节点）：
   ```bash
   databend-meta --leave-id 1 --leave-via 127.0.0.1:28004
   ```

   注意：
   - `--leave-id` 指定待移除节点的 ID
   - `--leave-via` 指定接收离开请求的节点广播地址
   - 可在任意安装 `databend-meta` 的节点执行
   - 节点在离开请求完成前将暂停集群交互

5. 验证节点是否成功移除：
   ```bash
   databend-metactl status
   ```
   确认目标节点 ID 已从集群成员列表消失。

6. 节点移除后停止服务：
   ```bash
   sudo systemctl stop databend-meta
   ```

7. 从任意存活节点检查集群状态：
   ```bash
   databend-metactl status
   ```

8. 集群稳定后更新所有存活 Meta 节点配置：
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   在每个存活节点更新：
   ```toml
   [raft_config]
   join = ["127.0.0.2:28004", "127.0.0.3:28004"]  # Remove the leaving node from the list
   ```

9. 更新所有 Query 节点的 Meta Service 端点：
   ```bash
   sudo vim /etc/databend/databend-query.toml
   ```

   在每个 Query 节点更新：
   ```toml
   [meta]
   endpoints = ["127.0.0.2:9191", "127.0.0.3:9191"]  # Remove the leaving node from the list
   ```

## 故障排查

问题处理步骤：

1. 检查服务状态：
   ```bash
   sudo systemctl status databend-meta
   ```

2. 查看错误日志：
   ```bash
   # 查看 systemd 日志
   sudo journalctl -u databend-meta -f

   # 查看 /var/log/databend 日志文件
   sudo tail -f /var/log/databend/databend-meta-*.log
   ```

3. 常见问题解决方案：
   - 权限错误：确保 databend 用户具备相应权限
   - 端口冲突：检查端口是否被其他服务占用
   - 配置错误：验证配置文件语法与路径
   - Raft 通信故障：确保所有 Meta Service 节点网络互通

## 后续步骤

完成 Meta Service 集群伸缩后，可执行：
- [伸缩 Query Service 节点](05-scale-query.md)（按需）
- [升级 Meta Service](06-upgrade-metasrv.md)（按需）