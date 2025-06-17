---
title: 伸缩 Meta 服务节点
---

## 概述

本指南将引导你完成 Databend Meta 服务集群的伸缩操作。你可以向集群中添加新节点（扩容）或移除现有节点（缩容）。

## 前提条件

- 已完成 [部署 Meta 服务](02-deploy-metasrv.md) 并拥有运行中的 Meta 服务节点
- 已在新节点上完成 [准备软件包环境](01-prepare.md)（用于扩容）
- 在节点上拥有 sudo 权限

## 扩容：添加新的 Meta 服务节点

要添加新的 Meta 服务节点，请在新节点上按照 [部署 Meta 服务](02-deploy-metasrv.md) 的步骤操作。请确保：

1. 从现有节点复制配置：
   ```bash
   sudo mkdir -p /etc/databend
   sudo scp root@<existing-node-ip>:/etc/databend/databend-meta.toml /etc/databend/
   ```

2. 修改配置文件：
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   更新以下设置：
   ```toml
   [raft_config]
   id = 1  # 为每个节点更改为唯一的 ID（例如 1, 2, 3 等）
   single = false  # 对于多节点部署，请将其更改为 false
   join = ["127.0.0.1:28004"]  # 在此处添加所有现有的 Meta 服务节点
   ```

3. 按照 [部署 Meta 服务](02-deploy-metasrv.md) 的步骤，在新节点上安装并启动服务。

4. 验证新节点是否已加入集群：
   ```bash
   databend-metactl status
   ```

5. 确认新节点加入集群后，更新所有现有节点的配置：
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   在每个现有节点上更新以下设置：
   ```toml
   [raft_config]
   single = false  # 将此项更改为 false
   join = ["127.0.0.1:28004", "127.0.0.2:28004", "127.0.0.3:28004"]  # 添加所有 Meta 服务节点（含新节点）
   ```

6. 更新所有 Query 节点配置中的 Meta 服务端点：
   ```bash
   sudo vim /etc/databend/databend-query.toml
   ```

   在每个 Query 节点中更新以下设置：
   ```toml
   [meta]
   endpoints = ["127.0.0.1:9191", "127.0.0.2:9191", "127.0.0.3:9191"]  # 添加所有 Meta 服务节点（含新节点）
   ```

## 缩容：移除 Meta 服务节点

要从集群中移除 Meta 服务节点，请按以下步骤操作：

1. 首先检查待移除节点是否为当前领导者（Leader）：
   ```bash
   databend-metactl status
   ```
   在输出中查找 “leader” 信息。若待移除节点是领导者，需先转移领导权。

2. 若该节点是领导者，将领导权转移至其他节点：
   ```bash
   databend-metactl transfer-leader
   ```

3. 验证领导权转移：
   ```bash
   databend-metactl status
   ```
   确认领导权已转移至目标节点。

4. 使用 `databend-meta` 命令将节点优雅移出集群：
   ```bash
   databend-meta --leave-id <node_id_to_remove> --leave-via <node_addr_1> <node_addr_2>...
   ```

   例如移除 ID 为 1 的节点：
   ```bash
   databend-meta --leave-id 1 --leave-via 127.0.0.1:28004
   ```

   注意：
   - `--leave-id` 指定待移除节点的 ID
   - `--leave-via` 指定用于发送离开请求的节点广播地址列表
   - 此命令可在任意安装 `databend-meta` 的节点执行
   - 节点在离开请求完成前将被禁止与集群交互

5. 检查节点是否成功移出集群：
   ```bash
   databend-metactl status
   ```
   确认该节点 ID 已从集群成员列表中消失。

6. 确认节点移出集群后，停止服务：
   ```bash
   sudo systemctl stop databend-meta
   ```

7. 从任意剩余节点验证集群状态：
   ```bash
   databend-metactl status
   ```

8. 确认集群稳定后，更新所有剩余 Meta 节点的配置：
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   在每个剩余节点上更新以下设置：
   ```toml
   [raft_config]
   join = ["127.0.0.2:28004", "127.0.0.3:28004"]  # 从列表中移除待离开节点
   ```

9. 更新所有 Query 节点配置中的 Meta 服务端点：
   ```bash
   sudo vim /etc/databend/databend-query.toml
   ```

   在每个 Query 节点中更新以下设置：
   ```toml
   [meta]
   endpoints = ["127.0.0.2:9191", "127.0.0.3:9191"]  # 从列表中移除待离开节点
   ```

## 故障排除

若遇到问题：

1. 检查服务状态：
   ```bash
   sudo systemctl status databend-meta
   ```

2. 查看日志获取详细错误信息：
   ```bash
   # 查看 systemd 日志
   sudo journalctl -u databend-meta -f

   # 查看 /var/log/databend 中的日志文件
   sudo tail -f /var/log/databend/databend-meta-*.log
   ```

3. 常见问题及解决方案：
   - 权限被拒绝：确保 databend 用户具备适当权限
   - 端口已被占用：检查其他服务是否占用配置端口
   - 配置错误：验证配置文件语法与路径
   - Raft 连接问题：确保所有 Meta 服务节点可互通

## 后续步骤

成功伸缩 Meta 服务集群后，你可以：
- [伸缩 Query 服务节点](05-scale-query.md)（按需）
- [升级 Meta 服务](06-upgrade-metasrv.md)（按需）