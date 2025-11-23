---
title: MetaSrv Watch Key 支持
description: 
  Databend-meta 中的 Watch key 支持
---

Databend-meta 使用 GRPC 流来监视 key 的更改，用户可以通过 `KVApi` 添加一个 watch key，`WatchRequest` 参数包括：

* key：要注册以进行监视的 key。
* key_end：`key_end` 是要监视的范围 [key, key_end) 的结尾。如果 key_end 为 None，则仅监视 key。要监视具有共同前缀的 key，请使用 `get_start_and_end_of_prefix` 生成 [key, key_end)。
* filter_type：过滤监视事件的类型，它是以下类型之一：
  * ALL：接收所有类型的更新事件。
  * UPDATE：仅过滤更新事件。
  * DELETE：仅过滤删除事件。

每次收到 watch 请求时，都会创建一个 Grpc 流。每次监视的 key 更改时，databend-meta 都会使用创建的流来通知客户端。

![](/img/rfc/20220728-metasrv-watch/watchstream.png)