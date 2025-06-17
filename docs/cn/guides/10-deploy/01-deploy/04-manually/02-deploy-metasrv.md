---
title: 部署 Meta Service
---

## 概述

Meta Service 是 Databend 的关键组件，负责管理元数据和集群协调。本指南将引导你完成部署 Meta Service 节点的过程。

## 前置要求

- 已完成 [准备软件包环境](01-prepare.md) 中的步骤
- 已准备好解压后的 Databend 软件包
- 拥有 sudo 权限

## 安装二进制文件

1. 将 Meta Service 二进制文件复制到系统二进制目录：
   ```bash
   sudo cp bin/databend-meta /usr/bin/
   sudo chmod +x /usr/bin/databend-meta
   ```

2. 复制 Meta Service 控制工具的二进制文件：
   ```bash
   sudo cp bin/databend-metactl /usr/bin/
   sudo chmod +x /usr/bin/databend-metactl
   ```

## 配置 Meta Service

1. 导航到解压后的软件包目录并复制默认配置：
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
   grpc_api_advertise_host = "localhost" # 修改此项

   [log]
   [log.file]
   level = "WARN"
   format = "text"
   dir = "/var/log/databend"

   [raft_config]
   id            = 0 # 对于单节点部署或集群中的第一个节点，请保持为 0
   raft_dir      = "/var/lib/databend/raft"
   raft_api_port = 28004
   raft_listen_host = "0.0.0.0"
   raft_advertise_host = "localhost" # 修改此项
   single        = true # 对于单节点部署或集群中的第一个节点，请保持为 true
   ```

   根据你的环境修改以下设置：
   - `grpc_api_advertise_host`：用于 gRPC 通信的主机名或 IP 地址，应与机器的主机名或 IP 地址相同
   - `raft_advertise_host`：其他节点用来连接的主机名或 IP 地址，应与机器的主机名或 IP 地址相同

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

   在需要时设置以下变量（可选）：
   ```bash
   RUST_BACKTRACE=1 # 启用回溯以进行调试
   SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt # 如果使用自定义 CA 证书，请设置 CA 证书文件的路径
   ```

4. 重新加载 systemd 以识别新服务：
   ```bash
   sudo systemctl daemon-reload
   ```

5. 启用服务以在启动时自动运行：
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

1. 检查 Meta Service 是否在配置的端口上监听：
   ```bash
   sudo netstat -tulpn | grep databend-meta
   ```

2. 测试管理 API 端点：
   ```bash
   curl http://127.0.0.1:28002/v1/health
   ```

   你应该会收到一个表示服务健康的响应。

3. 使用 metactl 检查 Meta Service 状态：
   ```bash
   databend-metactl status
   ```

   你应该能看到 Meta Service 的当前状态，包括：
   - 节点 ID
   - Raft 状态
   - Leader 信息
   - 集群配置

## 故障排查

如果遇到问题：

1. 检查服务状态：
   ```bash
   sudo systemctl status databend-meta
   ```

2. 查看日志以获取详细的错误信息：
   ```bash
   # 查看 systemd 日志
   sudo journalctl -u databend-meta -f

   # 查看 /var/log/databend 中的日志文件
   sudo tail -f /var/log/databend/databend-meta-*.log
   ```

3. 常见问题及解决方案：
   - 权限被拒绝：确保 databend 用户在之前的步骤中具有适当权限
   - 端口已被占用：检查是否有其他服务正在使用配置的端口
   - 配置错误：验证配置文件的语法和路径

## 下一步

现在你已经部署了 Meta Service，可以继续进行以下操作：
- [部署 Query Service](03-deploy-query.md)
- [扩展 Meta Service 节点](04-scale-metasrv.md)（用于多节点部署）