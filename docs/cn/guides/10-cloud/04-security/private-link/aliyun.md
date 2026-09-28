---
title: "通过阿里云私网连接连接到 Databend Cloud"
sidebar_label: "阿里云私网连接"
---

# 如何设置阿里云私网连接

1. 在 **Connect to Databend Cloud** 对话框中获取终端节点服务名称

   例如: `com.aliyuncs.privatelink.cn-beijing.epsrv-2zelaf38jasnuv54go9j`

2. 准备一个开放 443 端口的安全组

   ![Security Group](/img/cloud/privatelink/aliyun/security-group.png)

3. 到 aliyun 控制台创建终端节点

   https://vpc.console.aliyun.com/endpoint/cn-beijing/endpoints/new
   输入第一步获取的终端节点服务名称并点击验证
   ![Create Endpoint](/img/cloud/privatelink/aliyun/create-endpoint.png)
   点击最下方的【确定创建】

4. 开启自定义服务域名

   ![Custom Service Domain](/img/cloud/privatelink/aliyun/endpoint-domain.png)

5. 验证终端连接可用

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
