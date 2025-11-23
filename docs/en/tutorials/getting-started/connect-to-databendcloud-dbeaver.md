---
title: 'Connect to Databend Cloud with DBeaver'
sidebar_label: 'Databend Cloud with DBeaver'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, we will guide you through the process of connecting to Databend Cloud using DBeaver.

<StepsWrap>
<StepContent number="1">

### Before You Start

- Verify that DBeaver 24.3.1 or a later version is installed on your local machine.

</StepContent>
<StepContent number="2">

### Obtain Connection Information

Before creating a connection to Databend Cloud, you need to log in to Databend Cloud to obtain connection information. For more information, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting). In this tutorial, we will use the following connection information:

![alt text](@site/static/img/connect/dbeaver-connect-info.png)
> **Note**:
> If your `user` or `password` contains special characters, you need to provide them separately in the corresponding fields (e.g., the `Username` and `Password` fields in DBeaver). In this case, Databend will handle the necessary encoding for you. However, if you're providing the credentials together (e.g., as `user:password`), you must ensure that the entire string is properly encoded before use.

</StepContent>
<StepContent number="3">

### Set up Connection

1. In DBeaver, go to **Database** > **New Database Connection** to open the connection wizard, then select **Databend** under the **Analytical** category.

![alt text](@site/static/img/connect/dbeaver-analytical.png)

2. In the **Main** tab, enter the **Host**, **Port**, **Username**, and **Password** based on the connection information obtained in the previous step.

![alt text](@site/static/img/connect/dbeaver-main-tab.png)

3. In the **Driver properties** tab, enter the **Warehouse** name based on the connection information obtained in the previous step.

![alt text](@site/static/img/connect/dbeaver-driver-properties.png)

4. In the **SSL** tab, select the **Use SSL** checkbox.

![alt text](@site/static/img/connect/dbeaver-use-ssl.png)

5. Click **Test Connection** to verify the connection. If this is your first time connecting to Databend, you will be prompted to download the driver. Click **Download** to proceed. Once the download is complete, the test connection should succeed, as shown below:

![alt text](@site/static/img/connect/dbeaver-cloud-success.png)

</StepContent>
</StepsWrap>
