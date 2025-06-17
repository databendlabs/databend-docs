---
title: 伸缩查询（Query）服务节点
---

## 概述

本指南将引导你完成 Databend 查询（Query）服务集群的伸缩过程。你可以向集群中添加新节点（扩容），也可以从集群中移除现有节点（缩容）。

## 前提条件

- 已完成 [部署查询（Query）服务](03-deploy-query.md) 并拥有一个正在运行的查询（Query）服务节点
- 已在新节点上完成 [准备软件包环境](01-prepare.md)（用于扩容）
- 在节点上拥有 sudo 权限

## 扩容：添加新的查询（Query）服务节点

要添加新的查询（Query）服务节点，请在新节点上按照 [部署查询（Query）服务](03-deploy-query.md) 中的步骤操作。请确保：

1. 从现有节点复制配置：
   ```bash
   sudo mkdir -p /etc/databend
   sudo scp root@<existing-node-ip>:/etc/databend/databend-query.toml /etc/databend/
   ```

2. 按照 [部署查询（Query）服务](03-deploy-query.md) 中的步骤安装并启动服务。

3. 部署后，验证新节点是否已加入集群：
   ```bash
   bendsql -h 127.0.0.1 -u root
   ```

   ```sql
   SELECT * FROM system.clusters;
   ```

## 缩容：移除查询（Query）服务节点

要从集群中移除查询（Query）服务节点，只需在该节点停止服务：

```bash
sudo systemctl stop databend-query
```

节点将自动从集群中移除。可从任意剩余节点验证集群状态：

```bash
bendsql -h 127.0.0.1 -u root
```

```sql
SELECT * FROM system.clusters;
```

## 故障排查

若遇到问题：

1. 检查服务状态：
   ```bash
   sudo systemctl status databend-query
   ```

2. 查看日志获取详细错误信息：
   ```bash
   sudo journalctl -u databend-query -f
   ```

3. 常见问题及解决方案：
   - 权限被拒绝：确保 databend 用户具有适当权限
   - 端口已被占用：检查是否有其他服务占用配置端口
   - 配置错误：验证配置文件语法与路径
   - 元数据服务（Meta Service）连接问题：确保新节点可访问元数据服务（Meta Service）

## 后续步骤

成功伸缩查询（Query）服务集群后，你可以：
- [伸缩元数据服务（Meta Service）节点](04-scale-metasrv.md)（如需要）
- [升级查询（Query）服务](07-upgrade-query.md)（如需要）