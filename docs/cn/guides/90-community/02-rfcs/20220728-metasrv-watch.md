---
title: Databend-meta中的键值监控支持
description: 
  Databend-meta中的键值监控支持
---

Databend-meta使用GRPC流来监控键值变化，用户可以通过`KVApi`添加一个监控键，而`WatchRequest`参数包括：

* key: 注册监控的键。
* key_end: `key_end`是范围[key, key_end)的结束，用于监控。如果key_end为None，则只监控key。要监控具有公共前缀的键，请使用`get_start_and_end_of_prefix`来生成[key, key_end)。
* filter_type: 过滤监控事件的类型，可以是以下之一：
  * ALL: 接收所有类型的更新事件。
  * UPDATE: 只过滤更新事件。
  * DELETE: 只过滤删除事件。

每次接收到监控请求时，都会创建一个Grpc流。每次被监控的键发生变化时，databend-meta都会使用创建的流来通知客户端。

![](/img/rfc/20220728-metasrv-watch/watchstream.png)