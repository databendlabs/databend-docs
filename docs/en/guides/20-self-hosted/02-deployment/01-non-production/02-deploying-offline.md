---
title: Offline Deployment with Docker
---

This guide covers deploying Databend in air-gapped or restricted network environments where direct access to Docker Hub is unavailable.

## Step 1: Download Images on a Connected Machine

On a machine with internet access, pull and export the required images:

```shell
docker pull datafuselabs/databend-meta:latest
docker pull datafuselabs/databend-query:latest
docker pull minio/minio:latest

docker save datafuselabs/databend-meta:latest | gzip > databend-meta.tar.gz
docker save datafuselabs/databend-query:latest | gzip > databend-query.tar.gz
docker save minio/minio:latest | gzip > minio.tar.gz
```

To pin a specific version (recommended for production):

```shell
VERSION=v1.2.735-nightly
docker pull datafuselabs/databend-meta:${VERSION}
docker pull datafuselabs/databend-query:${VERSION}
docker save datafuselabs/databend-meta:${VERSION} | gzip > databend-meta-${VERSION}.tar.gz
docker save datafuselabs/databend-query:${VERSION} | gzip > databend-query-${VERSION}.tar.gz
```

## Step 2: Transfer and Load Images

Copy the `.tar.gz` files to the target machine, then load them:

```shell
docker load -i databend-meta.tar.gz
docker load -i databend-query.tar.gz
docker load -i minio.tar.gz
```

Verify the images are available:

```shell
docker images | grep -E "databend|minio"
```

## Step 3: Deploy

Use the same `docker-compose.yml` from [Deploying on Docker](./00-deploying-local.md) — no changes needed since the images are now available locally.

```shell
docker compose up -d
```

## Optional: Push to a Private Registry

If your organization uses a private Docker registry (e.g., `registry.example.com`):

```shell
VERSION=v1.2.735-nightly
REGISTRY=registry.example.com

docker tag datafuselabs/databend-meta:${VERSION} ${REGISTRY}/databend-meta:${VERSION}
docker tag datafuselabs/databend-query:${VERSION} ${REGISTRY}/databend-query:${VERSION}

docker push ${REGISTRY}/databend-meta:${VERSION}
docker push ${REGISTRY}/databend-query:${VERSION}
```

Then update the image references in your `docker-compose.yml` accordingly.
