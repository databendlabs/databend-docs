---
title: 离线环境 Docker 部署
---

本指南适用于无法直接访问 Docker Hub 的离线或受限网络环境。

## 第一步：在有网络的机器上下载镜像

在可以联网的机器上拉取并导出所需镜像：

```shell
docker pull datafuselabs/databend-meta:latest
docker pull datafuselabs/databend-query:latest
docker pull minio/minio:latest

docker save datafuselabs/databend-meta:latest | gzip > databend-meta.tar.gz
docker save datafuselabs/databend-query:latest | gzip > databend-query.tar.gz
docker save minio/minio:latest | gzip > minio.tar.gz
```

:::tip 国内用户
也可以从国内镜像源拉取，速度更快：
```shell
VERSION=latest
docker pull registry.databend.cn/public/databend-meta:${VERSION}
docker pull registry.databend.cn/public/databend-query:${VERSION}
```
:::

如需固定版本（生产环境推荐）：

```shell
VERSION=latest
docker pull datafuselabs/databend-meta:${VERSION}
docker pull datafuselabs/databend-query:${VERSION}
docker save datafuselabs/databend-meta:${VERSION} | gzip > databend-meta-${VERSION}.tar.gz
docker save datafuselabs/databend-query:${VERSION} | gzip > databend-query-${VERSION}.tar.gz
```

## 第二步：传输并加载镜像

将 `.tar.gz` 文件上传到目标机器后，执行加载：

```shell
docker load -i databend-meta.tar.gz
docker load -i databend-query.tar.gz
docker load -i minio.tar.gz
```

验证镜像已加载：

```shell
docker images | grep -E "databend|minio"
```

## 第三步：启动

使用[在 Docker 上部署](./00-deploying-local.md)中的 `docker-compose.yml`，无需修改，镜像已在本地可用。

```shell
docker compose up -d
```

## 可选：推送到私有镜像仓库

如果公司内部有私有镜像仓库（例如 `registry.example.com`）：

```shell
VERSION=latest
REGISTRY=registry.example.com

docker tag datafuselabs/databend-meta:${VERSION} ${REGISTRY}/databend-meta:${VERSION}
docker tag datafuselabs/databend-query:${VERSION} ${REGISTRY}/databend-query:${VERSION}

docker push ${REGISTRY}/databend-meta:${VERSION}
docker push ${REGISTRY}/databend-query:${VERSION}
```

然后将 `docker-compose.yml` 中的镜像地址替换为私有仓库地址即可。
