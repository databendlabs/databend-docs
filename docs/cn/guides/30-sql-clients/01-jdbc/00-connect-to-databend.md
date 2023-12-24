---
title: 'Tutorial-1: Connecting to Databend through JDBC'
sidebar_label: 'Tutorial-1: Connecting to Databend'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, we will guide you through the process of connecting to Databend through the Databend JDBC driver as the user `root`.

<StepsWrap>
<StepContent number="0" title="Before You Start">

- Ensure that you have a local Databend instance ready for testing. See [Docker and Local Deployments](../../10-deploy/03-deploying-local.md) for detailed instructions.
- In this tutorial, you will use the `root` account to connect to Databend. During deployment, uncomment the following lines in the [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file to select this account:

    ```sql title="databend-query.toml"
    [[query.users]]
    name = "root"
    auth_type = "no_password"
    ```
- Ensure you have added the Databend JDBC driver to your DBeaver. See [Adding Databend JDBC Driver to DBeaver](index.md#adding-databend-jdbc-driver-to-dbeaver) for detailed instructions.

</StepContent>
<StepContent number="1" title="Create Connection">

1. In DBeaver, search for and select `databend` on **Database** > **New Database Connection** first, and then click **Next**.

![Alt text](@site/docs/public/img/integration/jdbc-new-driver.png)

2. Configure your connection settings if needed. The default settings connect to a local instance of Databend as the user `root`.

![Alt text](@site/docs/public/img/integration/jdbc-connect.png)

3. Click **Test Connection** to check if the connection is successful.

</StepContent>
</StepsWrap>