---
title: 分享端点
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

分享端点作为数据共享中的一个概念，其作用是指明数据共享实体的端点和租户名称。它是在需要访问和消费共享数据的租户内创建的，使得数据消费者能够定位并访问与他们共享的数据。

例如，如果租户A正在与租户B共享数据，租户B需要创建一个分享端点，该端点将提供必要的信息，包括端点URL和租户名称，使租户B能够定位并访问共享的数据。

```sql title='在租户B上创建分享端点:'
CREATE SHARE ENDPOINT IF NOT EXISTS from_TenantA
    URL = '<share_endpoint_url>'
    TENANT = A
    COMMENT = '分享端点以访问来自租户A的数据';
```

要了解Databend中完整的数据共享工作流程，请参见[开始使用共享](../08-share/index.md#getting-started-with-share)。要在租户上管理分享端点，请使用以下命令：

<IndexOverviewList />