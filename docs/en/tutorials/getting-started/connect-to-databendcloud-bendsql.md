---
title: "Connect to Databend Cloud with BendSQL"
sidebar_label: "Databend Cloud with BendSQL"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, we will guide you through the process of connecting to Databend Cloud using BendSQL.

<StepsWrap>
<StepContent number="1">

### Before You Start

- Ensure that BendSQL is installed on your machine. See [Installing BendSQL](/guides/connect/sql-clients/bendsql/#installing-bendsql) for instructions on how to install BendSQL using various package managers.
- Ensure that you already have a Databend Cloud account and can log in successfully.

</StepContent>

<StepContent number="2">

### Obtain Connection Information

1. Log in to Databend Cloud, and then click **Connect**.

![Alt text](/img/connect/bendsql-4.gif)

2. Select the database you want to connect to, for example, "default"; then choose a warehouse. If you forget the password, reset it.

3. You can find the DSN details for the current warehouse and the connection string used to connect to Databend Cloud via BendSQL in the **Examples** section. For this step, simply copy the content provided in the **BendSQL** tab.

![Alt text](/img/connect/bendsql-5.png)

</StepContent>
<StepContent number="3">

### Launch BendSQL

To launch BendSQL, paste the content you copied into your terminal or command prompt. If the password you copied displays as "**\*\***", replace them with your actual password.

![Alt text](/img/connect/bendsql-6.png)

</StepContent>

<StepContent number="4">

### Execute Queries

Once connected, you can execute SQL queries in the BendSQL shell. For instance, type `SELECT NOW();` to return the current time.

![Alt text](/img/connect/bendsql-7.png)

</StepContent>
<StepContent number="5">

### Quit BendSQL

To quit BendSQL, type `quit`.

</StepContent>
</StepsWrap>
