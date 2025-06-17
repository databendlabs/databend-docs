---
title: 部署 Meta Service
---

## 概述

Meta Service 是 Databend 的关键组件，负责管理元数据和集群协调。本指南将引导您完成部署 Meta Service 节点的过程。

## 前置准备

- 已完成[准备软件包环境](01-prepare.md)中的步骤
- 已准备好解压后的 Databend 软件包
- 拥有 sudo 权限

## 安装二进制文件

1. 将 Meta Service 二进制文件复制到系统二进制目录：
   ```bash
   sudo cp bin/databend-meta /usr/bin/
   sudo chmod +x /usr/bin/databend-meta
   ```

2. 复制 Meta Service 控制工具二进制文件：
   ```bash
   sudo cp bin/databend-metactl /usr/bin/
   sudo chmod +x /usr/bin/databend-metactl
   ```

## 配置 Meta Service

1. 进入解压后的软件包目录并复制默认配置：
   ```bash
   sudo mkdir -p /etc/databend
   sudo cp configs/databend-meta.toml /etc/databend/databend-meta.toml
   ```

2. 编辑配置文件：
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   默认配置如下：
   ```toml
   admin_api_address       = "0.0.0.0:28002"
   grpc_api_address        = "0.0.0.0:9191"
   grpc_api_advertise_host = "localhost" # change this

   [log]
   [log.file]
   level = "WARN"
   format = "text"
   dir = "/var/log/databend"

   [raft_config]
   id            = 0 # keep this as 0 for single-node deployment or first node in cluster
   raft_dir      = "/var/lib/databend/raft"
   raft_api_port = 28004
   raft_listen_host = "0.0.0.0"
   raft_advertise_host = "localhost" # change this
   single        = true # keep this as true for single-node deployment or first node in cluster
   ```

   根据您的环境修改以下设置：
   - `grpc_api_advertise_host`：用于 gRPC 通信的主机名或 IP 地址，应与机器的主机名或 IP 地址相同
   - `raft_advertise_host`：其他节点用于连接的主机名或 IP 地址，应与机器的主机名或 IP 地址相同

## 设置 Systemd 服务

1. 复制 systemd 服务文件：
   ```bash
   sudo cp systemd/databend-meta.service /etc/systemd/system/
   ```

2. 复制默认环境文件：
   ```bash
   sudo cp systemd/databend-meta.default /etc/default/databend-meta
   ```

3. 编辑环境文件（可选）：
   ```bash
   sudo vim /etc/default/databend-meta
   ```

   需要时可设置以下变量（可选）：
   ```bash
   RUST_BACKTRACE=1 # enable backtrace for debugging
   SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt # set the path to the CA certificate file if you are using custom CA certificate
   ```

4. 重新加载 systemd 以识别新服务：
   ```bash
   sudo systemctl daemon-reload
   ```

5. 启用开机自启动服务：
   ```bash
   sudo systemctl enable databend-meta
   ```

## 启动 Meta Service

1. 启动 Meta Service：
   ```bash
   sudo systemctl start databend-meta
   ```

2. 检查服务状态：
   ```bash
   sudo systemctl status databend-meta
   ```

3. 查看日志：
   ```bash
   sudo journalctl -u databend-meta -f
   ```

## 验证 Meta Service

1. 检查 Meta Service 是否在配置端口监听：
   ```bash
   sudo netstat -tulpn | grep databend-meta
   ```

2. 测试管理 API 端点：
   ```bash
   curl http://127.0.0.1:28002/v1/health
   ```

   您应收到表示服务运行正常的响应

3. 使用 metactl 检查 Meta Service 状态：
   ```bash
   databend-metactl status
   ```

   您应看到 Meta Service 的当前状态，包括：
   - 节点 ID
   - Raft 状态
   - Leader 信息
   - 集群配置

## 故障排查

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
   - 权限被拒绝：确保 databend 用户在前序步骤拥有适当权限
   - 端口已被占用：检查是否有其他服务使用配置端口
   - 配置错误：验证配置文件语法和路径

## 后续步骤

完成 Meta Service 部署后，可继续：
- [部署 Query Service](03-deploy-query.md)
- [扩展 Meta Service 节点](04-scale-metasrv.md)（适用于多节点部署）