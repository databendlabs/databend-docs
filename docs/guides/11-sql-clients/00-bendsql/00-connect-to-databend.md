---
title: 'Tutorial-1: Connecting to Databend using BendSQL'
sidebar_label: 'Tutorial-1: Connecting to Databend'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, we will guide you through the process of connecting to Databend using BendSQL as the user `root`.

<StepsWrap>
<StepContent number="1" title="Before You Start">

- Ensure that BendSQL is installed on your machine. See [Installing BendSQL](index.md#installing-bendsql) for instructions on how to install BendSQL using various package managers.
- Ensure that you have a local Databend instance ready for testing. See [Docker and Local Deployments](../../10-deploy/05-deploying-local.md) for detailed instructions. 
- In this tutorial, you will use the `root` account to connect to Databend. During deployment, uncomment the following lines in the [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file to select this account:

    ```sql title="databend-query.toml"
    [[query.users]]
    name = "root"
    auth_type = "no_password"
    ```

</StepContent>
<StepContent number="2" title="Open BendSQL">

To initiate BendSQL, type 'bendsql' directly into your terminal or command prompt.


</StepContent>
</StepsWrap>

<!--
Steps:
Step 1: Open BendSQL

Launch BendSQL on your terminal or command prompt.

bash
Copy code
bendsql
This will open the BendSQL interactive shell.

Step 2: Connect to Databend

Connect to your Databend cluster using the following command:

sql
```sql
CONNECT databend://<DATABEND_HOST>:<DATABEND_PORT>?username=<USERNAME>&password=<PASSWORD>
Replace <DATABEND_HOST>, <DATABEND_PORT>, <USERNAME>, and <PASSWORD> with the appropriate values for your Databend cluster.
```

For example:

sql
Copy code
CONNECT databend://localhost:9000?username=admin&password=your_password
Step 3: Execute Queries

Once connected, you can execute SQL queries in the BendSQL shell. For instance, let's run a simple query to show databases:

sql
Copy code
SHOW DATABASES;
Explore more SQL commands and interact with your Databend cluster using BendSQL.

Step 4: Disconnect

When you're done, disconnect from the Databend cluster using:

sql
Copy code
DISCONNECT;
-->