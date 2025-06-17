---
title: 部署查询服务（Query Service）
---

## 概述

查询服务（Query Service）是 Databend 处理 SQL 查询和数据处理的核心组件。本指南将引导您完成部署查询服务（Query Service）节点的过程。

## 前提条件

- 已完成[准备软件包环境](01-prepare.md)中的步骤
- 已准备好解压后的 Databend 软件包
- 拥有 sudo 权限
- 已部署运行中的元数据服务（Meta Service）节点（完成[部署元数据服务（Meta Service）](02-deploy-metasrv.md)）

## 安装二进制文件

1. 将查询服务二进制文件复制到系统二进制目录：
   ```bash
   sudo cp bin/databend-query /usr/bin/
   sudo chmod +x /usr/bin/databend-query
   ```

2. 复制 BendSQL 客户端二进制文件：
   ```bash
   sudo cp bin/bendsql /usr/bin/
   sudo chmod +x /usr/bin/bendsql
   ```

## 配置查询服务（Query Service）

1. 进入解压后的软件包目录并复制默认配置：
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
   tenant_id = "default" # 按需修改（可选）
   cluster_id = "default" # 按需修改（可选）

   [[query.users]] # 取消注释以启用默认内置用户 "root"
   name = "root"
   auth_type = "no_password"

   [log]
   [log.file]
   level = "WARN"
   format = "text"
   dir = "/var/log/databend"

   [meta]
   endpoints = ["0.0.0.0:9191"] # 修改为所有 Meta Service 节点地址
   username = "root"
   password = "root"
   client_timeout_in_second = 10
   auto_sync_interval = 60

   # （重要）修改为您的存储配置
   [storage]
   # fs | s3 | azblob | gcs | oss | cos | hdfs | webhdfs
   type = "fs"

   [storage.fs]
   data_path = "/var/lib/databend/data"

   # 使用 Amazon S3 类存储服务
   [storage.s3]
   bucket = "<your-bucket-name>"
   endpoint_url = "<your-endpoint>"
   access_key_id = "<your-key-id>"
   secret_access_key = "<your-account-key>"
   enable_virtual_host_style = false

   [cache]
   data_cache_storage = "none" # 启用本地磁盘缓存时改为 "disk"

   [cache.disk]
   path = "/var/lib/databend/cache"
   max_bytes = 21474836480
   ```

   根据环境修改以下配置：
   - `[meta].endpoints`：元数据服务（Meta Service）节点地址（格式：["host:port"]）
   - `[storage]`：数据存储类型及配置，每个租户（Tenant）应有独立配置（重要）
   - `[query].users`：查询服务身份验证用户，创建自有用户后可注释此块（可选）
   - `[query].tenant_id`：多租户部署的租户 ID（可选）
   - `[query].cluster_id`：多集群部署的集群 ID（可选）
   - `[cache]`：缓存（Cache）配置（可选）

## 设置 systemd 服务

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

   按需设置以下变量（可选）：
   ```bash
   RUST_BACKTRACE=1 # 启用调试回溯
   SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt # 使用自定义 CA 证书时设置路径
   ```

4. 重新加载 systemd 配置：
   ```bash
   sudo systemctl daemon-reload
   ```

5. 启用开机自启动：
   ```bash
   sudo systemctl enable databend-query
   ```

## 启动查询服务（Query Service）

1. 启动服务：
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

## 验证查询服务（Query Service）

1. 检查端口监听状态：
   ```bash
   sudo netstat -tulpn | grep databend-query
   ```

2. 测试 HTTP 端点：
   ```bash
   curl http://127.0.0.1:8000/health
   ```

   应返回服务健康状态响应。

3. 使用 BendSQL 测试：
   ```bash
   bendsql -h 127.0.0.1 -u root
   ```

## 故障排查

遇到问题时：

1. 检查服务状态：
   ```bash
   sudo systemctl status databend-query
   ```

2. 查看详细错误日志：
   ```bash
   # 查看 systemd 日志
   sudo journalctl -u databend-query -f

   # 查看 /var/log/databend 日志文件
   sudo tail -f /var/log/databend/databend-query-*.log
   ```

3. 常见问题解决方案：
   - 权限拒绝：确保 databend 用户具备操作权限
   - 端口占用：检查配置端口是否被占用
   - 配置错误：验证配置文件语法和路径
   - 元数据服务连接失败：确认元数据服务（Meta Service）运行状态及可达性

## 后续步骤

完成元数据服务（Meta Service）和查询服务（Query Service）部署后，可继续：
- [扩展查询服务节点](05-scale-query.md)（多节点部署）
- [升级查询服务](07-upgrade-query.md)