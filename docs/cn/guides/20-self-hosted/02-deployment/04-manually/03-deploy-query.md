---
title: 部署查询服务
---

## 概述

查询服务（Query Service）是 Databend 中处理 SQL 查询和数据处理的主要组件。本指南将引导您完成部署查询服务（Query Service）节点的过程。

## 前置准备

- 已完成 [准备包环境](01-prepare.md) 中的步骤
- 已准备好解压后的 Databend 包
- 拥有 sudo 权限
- 拥有一个正在运行的元数据服务（Meta Service）节点（已完成 [部署元数据服务](02-deploy-metasrv.md)）

## 安装二进制文件

1. 将查询服务（Query Service）的二进制文件复制到系统二进制目录：
   ```bash
   sudo cp bin/databend-query /usr/bin/
   sudo chmod +x /usr/bin/databend-query
   ```

2. 复制 BendSQL 客户端二进制文件：
   ```bash
   sudo cp bin/bendsql /usr/bin/
   sudo chmod +x /usr/bin/bendsql
   ```

## 配置查询服务

1. 导航到解压后的包目录并复制默认配置：
   ```bash
   sudo mkdir -p /etc/databend
   sudo cp configs/databend-query.toml /etc/databend/databend-query.toml
   ```

2. 编辑配置文件：
   ```bash
   sudo vim /etc/databend/databend-query.toml
   ```

   默认配置如下：
   ```toml
   [query]
   max_active_sessions = 256
   shutdown_wait_timeout_ms = 5000
   flight_api_address = "0.0.0.0:9091"
   admin_api_address = "0.0.0.0:8080"
   metric_api_address = "0.0.0.0:7070"
   mysql_handler_host = "0.0.0.0"
   mysql_handler_port = 3307
   clickhouse_http_handler_host = "0.0.0.0"
   clickhouse_http_handler_port = 8124
   http_handler_host = "0.0.0.0"
   http_handler_port = 8000
   flight_sql_handler_host = "0.0.0.0"
   flight_sql_handler_port = 8900
   tenant_id = "default" # 根据需要进行更改（可选）
   cluster_id = "default" # 根据需要进行更改（可选）

   [[query.users]] # 取消注释此块以启用默认内置用户 "root"
   name = "root"
   auth_type = "no_password"

   [log]
   [log.file]
   level = "WARN"
   format = "text"
   dir = "/var/log/databend"

   [meta]
   endpoints = ["0.0.0.0:9191"] # 将此更改为所有 Meta Service 节点的地址
   username = "root"
   password = "root"
   client_timeout_in_second = 10
   auto_sync_interval = 60

   # (重要) 将此更改为您自己的存储配置
   [storage]
   # fs | s3 | azblob | gcs | oss | cos | hdfs | webhdfs
   type = "fs"

   [storage.fs]
   data_path = "/var/lib/databend/data"

   # 使用类似 Amazon S3 的存储服务
   [storage.s3]
   bucket = "<your-bucket-name>"
   endpoint_url = "<your-endpoint>"
   access_key_id = "<your-key-id>"
   secret_access_key = "<your-account-key>"
   enable_virtual_host_style = false

   [cache]
   data_cache_storage = "none" # 如果要启用本地磁盘缓存，请将其更改为 "disk"

   [cache.disk]
   path = "/var/lib/databend/cache"
   max_bytes = 21474836480
   ```

   根据您的环境修改以下设置：
   - `[meta].endpoints`: 您的元数据服务（Meta Service）节点的地址（格式：["host:port"]）
   - `[storage]`: 用于存储数据的存储类型和配置。每个租户都应有自己的存储配置（重要）
   - `[query].users`: 用于查询服务（Query Service）身份验证的用户，在创建自己的用户后，您可以稍后注释掉此块（可选）
   - `[query].tenant_id`: 用于多租户部署的租户 ID（可选）
   - `[query].cluster_id`: 用于多集群部署的集群 ID（可选）
   - `[cache]`: 要使用的缓存配置（可选）

## 设置 Systemd 服务

1. 复制 systemd 服务文件：
   ```bash
   sudo cp systemd/databend-query.service /etc/systemd/system/
   ```

2. 复制默认环境文件：
   ```bash
   sudo cp systemd/databend-query.default /etc/default/databend-query
   ```

3. 编辑环境文件（可选）：
   ```bash
   sudo vim /etc/default/databend-query
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

5. 启用服务以在启动时自启：
   ```bash
   sudo systemctl enable databend-query
   ```

## 启动查询服务

1. 启动查询服务（Query Service）：
   ```bash
   sudo systemctl start databend-query
   ```

2. 检查服务状态：
   ```bash
   sudo systemctl status databend-query
   ```

3. 查看日志：
   ```bash
   sudo journalctl -u databend-query -f
   ```

## 验证查询服务

1. 检查查询服务（Query Service）是否正在监听配置的端口：
   ```bash
   sudo netstat -tulpn | grep databend-query
   ```

2. 测试 HTTP 端点：
   ```bash
   curl http://127.0.0.1:8000/health
   ```

   您应该会收到一个表示服务健康的回应。

3. 使用 BendSQL 进行测试：
   ```bash
   bendsql -h 127.0.0.1 -u root
   ```

## 故障排查

如果遇到问题：

1. 检查服务状态：
   ```bash
   sudo systemctl status databend-query
   ```

2. 查看日志以获取详细的错误信息：
   ```bash
   # 查看 systemd 日志
   sudo journalctl -u databend-query -f

   # 查看 /var/log/databend 中的日志文件
   sudo tail -f /var/log/databend/databend-query-*.log
   ```

3. 常见问题及解决方案：
   - 权限被拒绝：确保 databend 用户在前序步骤中具有适当的权限
   - 端口已被占用：检查是否有其他服务正在使用配置的端口
   - 配置错误：验证配置文件的语法和路径
   - 元数据服务（Meta Service）连接问题：确保元数据服务（Meta Service）正在运行且可访问

## 后续步骤

现在您已经部署了元数据服务（Meta Service）和查询服务（Query Service），可以继续进行以下操作：
- [扩展查询服务节点](05-scale-query.md)（用于多节点部署）
- [升级查询服务](07-upgrade-query.md)