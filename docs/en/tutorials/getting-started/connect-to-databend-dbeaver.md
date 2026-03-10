---
title: "Connect with DBeaver (Self-hosted)"
sidebar_label: "Connect with DBeaver (Self-hosted)"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, we will guide you through the process of connecting to a self-hosted Databend instance using DBeaver.

<StepsWrap>
<StepContent number="1">

### Before You Start

- Ensure that [Docker](https://www.docker.com/) is installed on your local machine, as it will be used to launch Databend.
- Verify that DBeaver 24.3.1 or a later version is installed on your local machine.

</StepContent>
<StepContent number="2">

### Start Databend

Run the following command in your terminal to launch a Databend instance:

:::note
If no custom values for `QUERY_DEFAULT_USER` or `QUERY_DEFAULT_PASSWORD` are specified when starting the container, a default `root` user will be created with no password. 
:::

```bash
docker run -d --name databend \
  -p 3307:3307 -p 8000:8000 -p 8124:8124 -p 8900:8900 \
  datafuselabs/databend:nightly
```

</StepContent>
<StepContent number="3">

### Set up Connection

1. In DBeaver, go to **Database** > **New Database Connection** to open the connection wizard, then select **Databend** under the **Analytical** category.

![alt text](@site/static/img/connect/dbeaver-analytical.png)

2. Enter `root` for the **Username**.

![alt text](@site/static/img/connect/dbeaver-user-root.png)

3. Click **Test Connection** to verify the connection. If this is your first time connecting to Databend, you will be prompted to download the driver. Click **Download** to proceed.

![alt text](@site/static/img/connect/dbeaver-download-driver.png)

Once the download is complete, the test connection should succeed, as shown below:

![alt text](../../../../static/img/connect/dbeaver-success.png)

</StepContent>
</StepsWrap>
