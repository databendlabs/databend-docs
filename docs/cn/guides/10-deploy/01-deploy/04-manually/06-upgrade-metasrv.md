---
title: 升级 Meta Service
---

## 概述

本指南将引导您完成将 Databend Meta Service 升级到新版本的过程。升级流程包括下载新版发布包、替换二进制文件并重启服务。

## 下载新版本

1. 按照[准备包环境](01-prepare.md)中的说明下载新版发布包。

2. 解压软件包：
   ```bash
   tar xzf databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

## 升级 Meta Service

1. 检查当前集群状态：
   ```bash
   databend-metactl status
   ```
   验证所有节点是否健康，并记录当前领导者（leader）节点。

2. 替换二进制文件：
   ```bash
   sudo cp bin/databend-meta /usr/bin/
   sudo cp bin/databend-metactl /usr/bin/
   sudo chmod +x /usr/bin/databend-meta
   sudo chmod +x /usr/bin/databend-metactl
   ```

3. 重启 Meta Service：
   ```bash
   sudo systemctl restart databend-meta
   ```

4. 检查服务状态：
   ```bash
   # 检查服务是否正在运行
   sudo systemctl status databend-meta
   ```

5. 验证升级结果：
   ```bash
   # 检查集群状态
   databend-metactl status
   ```

## 问题排查

若升级过程中遇到问题：

1. 检查服务状态：
   ```bash
   sudo systemctl status databend-meta
   ```

2. 查看日志获取详细错误信息：
   ```bash
   sudo journalctl -u databend-meta -f
   ```

3. 升级失败时可通过以下方式回滚：
   - 恢复旧版二进制文件
   - 重启服务

## 后续步骤

成功升级 Meta Service 后，您可以：
- [扩展 Meta Service 节点](04-scale-metasrv.md)（适用于多节点部署）
- [升级 Query Service](07-upgrade-query.md)（如需要）