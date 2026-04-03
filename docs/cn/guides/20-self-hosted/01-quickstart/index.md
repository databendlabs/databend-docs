---
title: 快速入门
---

5 分钟内在本地启动 Databend。

## 1. 启动 Databend

```shell
docker run -d \
    --name databend \
    --network host \
    -e MINIO_ENABLED=true \
    -e QUERY_DEFAULT_USER=databend \
    -e QUERY_DEFAULT_PASSWORD=databend \
    -v minio_data_dir:/var/lib/minio \
    --restart unless-stopped \
    datafuselabs/databend
```

:::tip 国内用户
如果拉取镜像较慢，可替换为国内镜像：
```shell
registry.databend.cn/public/databend:latest
```
:::

等待 Databend 就绪：

```shell
docker logs -f databend
```

看到 `Databend Query started` 即表示启动成功。

## 2. 连接

安装 BendSQL：

```shell
curl -fsSL https://repo.databend.com/install/bendsql.sh | bash
echo "export PATH=$PATH:~/.bendsql/bin" >> ~/.bash_profile
source ~/.bash_profile
```

连接到 Databend：

```shell
bendsql -u databend -p databend
```

## 3. 验证

```sql
CREATE TABLE t (id INT, name VARCHAR);
INSERT INTO t VALUES (1, 'Databend');
SELECT * FROM t;
```

完成！如需了解分组件部署的方式，请参考[在 Docker 上部署](../02-deployment/01-deploying-local.md)。

## 替代方案：Databend Cloud

如果不想搭建本地环境，可以直接使用 [Databend Cloud](https://www.databend.com) 的全托管服务。
