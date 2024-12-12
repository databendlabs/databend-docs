---
title: 从文件加载数据
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 提供了多种工具和命令，可以帮助您将数据文件加载到表中。大多数操作都非常简单，意味着您只需一个命令即可加载数据。请注意，您的数据文件必须采用 Databend 支持的格式之一。有关支持的文件格式列表，请参阅 [输入 & 输出文件格式](/sql/sql-reference/file-format-options)。以下是数据加载和卸载流程及其相应方法的概述。请参阅本章中的主题以获取详细说明。

![Alt text](/img/load/load-unload.jpeg)

本主题并未涵盖所有可用的数据加载方法，但根据您的数据文件存储位置提供了推荐方法。要找到推荐的方法并链接到相应的详细页面，请切换以下块：

<DetailsWrap>

<details>
  <summary>我想加载已暂存的数据文件 ...</summary>
  <div>
    <div>如果您在内部/外部阶段或用户阶段中有数据文件，Databend 建议您使用 COPY INTO 命令加载它们。COPY INTO 命令是一个强大的工具，可以快速高效地加载大量数据。</div>
    <br/>
    <div>要了解有关使用 COPY INTO 命令从阶段加载数据的更多信息，请查看 <a href="stage">从阶段加载</a> 页面。该页面包含详细的教程，展示了如何使用该命令从内部/外部阶段或用户阶段中的示例文件加载数据。</div>
  </div>
</details>

<details>
  <summary>我想加载存储桶中的数据文件 ...</summary>
  <div>
    <div>如果您在对象存储（如 Amazon S3、Google Cloud Storage 和 Microsoft Azure）的存储桶或容器中有数据文件，Databend 建议您使用 COPY INTO 命令加载它们。COPY INTO 命令是一个强大的工具，可以快速高效地加载大量数据。</div>
    <br/>
    <div>要了解有关使用 COPY INTO 命令从存储桶或容器加载数据的更多信息，请查看 <a href="s3">从存储桶加载</a> 页面。该页面包含一个教程，展示了如何使用该命令从 Amazon S3 存储桶中的示例文件加载数据。</div>
  </div>
</details>

<details>
  <summary>我想加载本地数据文件 ...</summary>
  <div>
    <div>如果您在本地系统中有数据文件，Databend 建议您使用 <a href="https://github.com/databendlabs/BendSQL">BendSQL</a>，这是 Databend 的原生 CLI 工具，允许您与 Databend 建立连接并直接从 CLI 窗口执行查询。</div>
    <br/>
    <div>要了解有关使用 BendSQL 加载本地数据文件的更多信息，请查看 <a href="local">从本地文件加载</a> 页面。该页面包含教程，展示了如何使用该工具从本地示例文件加载数据。</div>
  </div>
</details>

<details>
  <summary>我想加载远程数据文件 ...</summary>
  <div>
    <div>如果您有远程数据文件，Databend 建议您使用 COPY INTO 命令加载它们。COPY INTO 命令是一个强大的工具，可以快速高效地加载大量数据。</div>
    <br/>
    <div>要了解有关使用 COPY INTO 命令加载远程数据文件的更多信息，请查看 <a href="http">从远程文件加载</a> 页面。该页面包含一个教程，展示了如何使用该命令从远程示例文件加载数据。</div>
  </div>
</details>

</DetailsWrap>
