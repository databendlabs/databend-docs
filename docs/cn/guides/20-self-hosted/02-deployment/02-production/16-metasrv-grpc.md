---
title: 发送和接收 gRPC 元数据
sidebar_label: 发送和接收 gRPC 元数据
description:
  发送和接收 gRPC 元数据
---

Databend 允许你使用命令行界面（CLI）命令，向正在运行的 meta service 集群发送和接收 gRPC（gRPC Remote Procedure Calls）元数据（键值对）。

## 更新和创建键值对

如果指定的键已存在，此命令将更新现有的键值对；如果指定的键不存在，则创建新的键值对：

```shell
./databend-meta --grpc-api-address "<grpc-api-address>" --cmd kvapi::upsert --key <key> --value <value>
```

### 示例

```shell
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::upsert --key 1:key1 --value value1
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::upsert --key 1:key2 --value value2
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::upsert --key 1:key3 --value value3
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::upsert --key 2:key1 --value value1
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::upsert --key 2:key2 --value value2
```

## 通过键获取值

此命令获取指定键的值：

```shell
./databend-meta --grpc-api-address "<grpc-api-address>" --cmd kvapi::get --key <key>
```

### 示例

```shell
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::get --key 1:key1
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::get --key 2:key2
```

## 通过多个键获取值

此命令获取多个指定键的值：

```shell
./databend-meta --grpc-api-address "<grpc-api-address>" --cmd kvapi::mget --key <key1> <key2> ...
```

### 示例

```shell
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::mget --key 1:key1 2:key2
```

## 通过前缀列出键值对

此命令通过指定的键前缀列出已存在的键值对：

```shell
./databend-meta --grpc-api-address "<grpc-api-address>" --cmd kvapi::list --prefix <prefix>
```

### 示例

```shell
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::list --prefix 1:
./databend-meta --grpc-api-address "127.0.0.1:9191" --cmd kvapi::list --prefix 2:
```