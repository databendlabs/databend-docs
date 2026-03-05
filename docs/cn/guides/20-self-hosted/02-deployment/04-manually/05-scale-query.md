---
title: 伸缩查询（Query）服务节点
---

## 概述

本指南将引导您完成 Databend 查询（Query）服务集群的伸缩操作。您可以选择向集群添加新节点（扩容）或移除现有节点（缩容）。

## 前提条件

- 已完成 [部署查询服务](03-deploy-query.md) 且存在运行中的查询（Query）服务节点
- 已在新节点完成 [准备软件包环境](01-prepare.md)（扩容场景）
- 在节点上拥有 sudo 权限

## 扩容：添加新查询（Query）服务节点

添加新查询（Query）服务节点时，请在新节点执行 [部署查询服务](03-deploy-query.md) 的步骤，并确保：

1. 从现有节点复制配置：
   ```bash
   sudo mkdir -p /etc/databend
   sudo scp root@<existing-node-ip>:/etc/databend/databend-query.toml /etc/databend/
   ```

2. 按照 [部署查询服务](03-deploy-query.md) 的步骤安装并启动服务

3. 部署完成后验证新节点是否加入集群：
   ```bash
   bendsql -h 127.0.0.1 -u root
   ```

   ```sql
   SELECT * FROM system.clusters;
   ```

## 缩容：移除查询（Query）服务节点

移除查询（Query）服务节点时，只需停止目标节点的服务：

```bash
sudo systemctl stop databend-query
```

节点将自动从集群移除。可通过任意存留节点验证集群状态：

```bash
bendsql -h 127.0.0.1 -u root
```

```sql
SELECT * FROM system.clusters;
```

## 故障排除

遇到问题时：

1. 检查服务状态：
   ```bash
   sudo systemctl status databend-query
   ```

2. 查看日志获取详细错误信息：
   ```bash
   sudo journalctl -u databend-query -f
   ```

3. 常见问题及解决方案：
   - 权限被拒绝：确保 databend 用户具备适当权限
   - 端口已被占用：检查配置端口是否被其他服务占用
   - 配置错误：验证配置文件语法和路径正确性
   - Meta 服务 (Meta Service) 连接问题：确保新节点可访问 Meta 服务

## 后续步骤

成功伸缩查询（Query）服务集群后，您可：
- [伸缩 Meta 服务节点](04-scale-metasrv.md)（按需）
- [升级查询服务](07-upgrade-query.md)（按需）