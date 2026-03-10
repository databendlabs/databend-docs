---
title: "Connecting to Databend Cloud with AWS PrivateLink"
sidebar_label: "AWS PrivateLink"
---

# How to Setup AWS PrivateLink

1. Provide the AWS account ID you are planning to connect to Databend Cloud:

   For example: `123456789012`

2. Verify your VPC settings

   ![VPC Settings](/img/cloud/privatelink/aws/vpc-settings.png)

   Ensure `Enable DNS resolution` and `Enable DNS hostnames` are checked.

3. Wait for cloud admin adding your account to whitelist, and get a service name for the cluster to connect to:

   For example: `com.amazonaws.vpce.us-east-2.vpce-svc-0123456789abcdef0`

4. Prepare a security group with tcp 443 port open:

   ![Security Group](/img/cloud/privatelink/aws/security-group.png)

5. Goto AWS Console:

   https://us-east-2.console.aws.amazon.com/vpcconsole/home?region=us-east-2#Endpoints:

   Click `Create endpoint`:

   ![Create Endpoint Button](/img/cloud/privatelink/aws/create-endpoint-1.png)

   ![Create Endpoint Sheet](/img/cloud/privatelink/aws/create-endpoint-2.png)

   Select the previously created security group `HTTPS`

   ![Create Endpoint SG](/img/cloud/privatelink/aws/create-endpoint-3.png)

   ![Create Endpoint Done](/img/cloud/privatelink/aws/create-endpoint-4.png)

6. Wait for cloud admin approving your connect request:

   ![Request](/img/cloud/privatelink/aws/request.png)

7. Wait for the PrivateLink creation:

   ![Creation](/img/cloud/privatelink/aws/creation.png)

8. Modify private DNS name setting:

   ![DNS Menu](/img/cloud/privatelink/aws/dns-1.png)

   Enable private DNS names:

   ![DNS Sheet](/img/cloud/privatelink/aws/dns-2.png)

   Wait for changes to apply.

9. Verify accessing Databend Cloud via PrivateLink:

   ![Verify DNS](/img/cloud/privatelink/aws/verify-1.png)

   ![Verify Response](/img/cloud/privatelink/aws/verify-2.png)

   Gateway domain is resolved to VPC internal IP address.

:::info
Congratulations! You have successfully connected to Databend Cloud with AWS PrivateLink.
:::
