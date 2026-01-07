---
title: "通过阿里云私网连接连接到 Databend Cloud"
sidebar_label: "阿里云私网连接"
---

# 如何设置阿里云私网连接

1. 提供计划使用 PrivateLink 的 AccountID（主账号 ID）

![AccountID](/img/cloud/privatelink/aliyun/accountid.png)

2. 等待 Databend Cloud 将 AccountID 加入到白名单

3. Databend Cloud 提供终端节点服务名称

例如: `com.aliyuncs.privatelink.cn-beijing.epsrv-2zelaf38jasnuv54go9j`

4. 准备一个开放 443 端口的安全组

![Security Group](/img/cloud/privatelink/aliyun/security-group.png)

5. 到 aliyun 控制台创建终端节点

https://vpc.console.aliyun.com/endpoint/cn-beijing/endpoints/new
输入第三步 Databend Cloud 提供的终端节点服务名称并点击验证
![Create Endpoint](/img/cloud/privatelink/aliyun/create-endpoint.png)
点击最下方的【确定创建】

6. 通知 Databend Cloud 并等待通过连接请求

![Request](/img/cloud/privatelink/aliyun/request.png)

7. 开启自定义服务域名

![Custom Service Domain](/img/cloud/privatelink/aliyun/custom-service-domain.png)

8. 验证终端连接可用

```bash
curl -v https://gw.aliyun-cn-beijing.default.databend.cn/status | jq
```

检查请求是否解析到正确的内网 IP 地址

![Verify Endpoint Request](/img/cloud/privatelink/aliyun/verify-endpoint-request.png)

如果返回结果中包含 `"status": "ok"`，则表示终端连接可用

![Verify Endpoint Response](/img/cloud/privatelink/aliyun/verify-endpoint-response.png)

:::info
恭喜！您已成功通过阿里云私网连接连接到 Databend Cloud。
:::
