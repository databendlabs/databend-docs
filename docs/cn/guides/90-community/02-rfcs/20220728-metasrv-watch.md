---
title: databend-meta中的Watch key支持
description: 
  databend-meta中的Watch key支持
---

Databend-meta使用GRPC流来监视key的变化，用户可以通过`KVApi`添加一个watch key，`WatchRequest`参数包括：

* key: 要注册监视的key。
* key_end: `key_end`是监视范围[key, key_end)的结束。如果key_end为None，则只监视key。要监视具有共同前缀的key，请使用`get_start_and_end_of_prefix`生成[key, key_end)。
* filter_type: 过滤监视事件的类型，可以是以下之一：
  * ALL: 接收所有类型的更新事件。
  * UPDATE: 仅过滤更新事件。
  * DELETE: 仅过滤删除事件。

每次接收到watch请求时，都会创建一个Grpc流。每次监视的key发生变化时，databend-meta使用创建的流通知客户端。

![](/img/rfc/20220728-metasrv-watch/watchstream.png)