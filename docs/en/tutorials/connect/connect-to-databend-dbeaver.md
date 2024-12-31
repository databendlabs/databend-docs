---
title: "Connecting to Self-Hosted Databend using DBeaver"
sidebar_label: "Connecting to Self-Hosted Databend (DBeaver)"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, we will guide you through the process of connecting to a self-hosted Databend instance as the user `root`.

<StepsWrap>
<StepContent number="1">

### Before You Start

- Ensure that [Docker](https://www.docker.com/) is installed on your local machine, as it will be used to launch Databend.
- Verify that DBeaver 24.3.1 or a later version is installed on your local machine.

</StepContent>
<StepContent number="2">

### Start Databend

Run the following command in your terminal to launch a Databend instance:

```bash
docker run -d --name databend \
  -p 3307:3307 -p 8000:8000 -p 8124:8124 -p 8900:8900 \
  datafuselabs/databend:nightly
```

</StepContent>
<StepContent number="3">

### Create Connection

1. In DBeaver, go to **Database** > **New Database Connection** to open the connection wizard, then select **Databend** under the **Analytical** category.

![Alt text](/img/integration/jdbc-new-driver.png)

2. Configure your connection settings if needed. The default settings connect to a local instance of Databend as the user `root`.

![Alt text](/img/integration/jdbc-connect.png)

3. Click **Test Connection** to check if the connection is successful.

</StepContent>
</StepsWrap>
