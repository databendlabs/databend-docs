---
title: 升级查询服务（Query Service）
---

## 概述

本指南将引导你完成将 Databend 查询服务（Query Service）升级到新版本的过程。升级过程包括下载新版本发布包、替换二进制文件以及重启服务。

## 下载新版本

1. 按照 [准备软件包环境](01-prepare.md) 中的说明下载新版本发布包。

2. 解压软件包：
   ```bash
   tar xzf databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

## 升级查询服务（Query Service）

1. 替换二进制文件：
   ```bash
   sudo cp bin/databend-query /usr/bin/
   sudo cp bin/bendsql /usr/bin/
   sudo chmod +x /usr/bin/databend-query
   sudo chmod +x /usr/bin/bendsql
   ```

2. 重启查询服务（Query Service）：
   ```bash
   sudo systemctl restart databend-query
   ```

3. 检查服务状态：
   ```bash
   sudo systemctl status databend-query
   ```

4. 验证升级：
   ```bash
   bendsql -h 127.0.0.1 -u root
   ```

   连接后即可检查版本：
   ```sql
   SELECT version();
   ```

## 问题排查

升级过程中若遇到问题：

1. 检查服务状态：
   ```bash
   sudo systemctl status databend-query
   ```

2. 查看日志获取详细错误信息：
   ```bash
   sudo journalctl -u databend-query -f
   ```

3. 升级失败时可通过以下方式回滚：
   - 恢复原有二进制文件
   - 重启服务

## 后续步骤

成功升级查询服务（Query Service）后，可执行以下操作：
- [扩展查询服务节点](05-scale-query.md)（适用于多节点部署）
- [升级元数据服务（Meta Service）](06-upgrade-metasrv.md)（如需要）