---
title: "Connecting to Databend Cloud with AWS PrivateLink"
sidebar_label: "AWS PrivateLink"
---

# Why PrivateLink

Connecting to Databend Cloud with AWS PrivateLink provides a secure and private way to access Databend Cloud services without traversing the public internet.

By leveraging AWS PrivateLink, you can establish a private connection between your Virtual Private Cloud (VPC) and Databend Cloud, ensuring that your data remains within your VPC boundaries and is not exposed to the internet. This setup enhances the security of your data and minimizes the risk of unauthorized access.

To connect to Databend Cloud using AWS PrivateLink, you need to configure a VPC endpoint in your VPC. This endpoint acts as a proxy that allows traffic to flow securely between your VPC and Databend Cloud. The VPC endpoint has a private IP address within your VPC and facilitates direct communication with Databend Cloud services.

Once the VPC endpoint is established, you can securely access Databend Cloud services, such as data storage, data processing, and analytics tools, using private IP addresses. This ensures that your data remains within the secure boundaries of your VPC, providing an additional layer of protection.

# How to Setup AWS PrivateLink

1. Provide the AWS account ID you are planning to connect to Databend Cloud:

   For example: `952853449216`

2. Verify your VPC settings

   ![VPC Settings](/img/cloud/privatelink/vpc-settings.png)

   Ensure `Enable DNS resolution` and `Enable DNS hostnames` are checked.

3. Wait for cloud admin adding your account to whitelist, and get a service name for the cluster to connect to:

   - `com.amazonaws.vpce.us-east-2.vpce-svc-0e494364a37d35445` (aws, us-east-2, white)
   - `com.amazonaws.vpce.us-east-1.vpce-svc-0d9cd5a4a7c19796f` (aws, us-east-1, ivory)

4. Prepare a security group with tcp 443 port open:

   ![Security Group](/img/cloud/privatelink/security-group.png)

5. Goto AWS Console:

   https://us-east-2.console.aws.amazon.com/vpcconsole/home?region=us-east-2#Endpoints:

   Click `Create endpoint`:

   ![Create Endpoint Button](/img/cloud/privatelink/create-endpoint-1.png)

   ![Create Endpoint Sheet](/img/cloud/privatelink/create-endpoint-2.png)

   Select the previously created security group `HTTPS`

   ![Create Endpoint SG](/img/cloud/privatelink/create-endpoint-3.png)

   ![Create Endpoint Done](/img/cloud/privatelink/create-endpoint-4.png)

6. Wait for cloud admin approving your connect request:

   ![Request](/img/cloud/privatelink/request.png)

7. Wait for the PrivateLink creation:

   ![Creation](/img/cloud/privatelink/creation.png)

8. Modify private DNS name setting:

   ![DNS Menu](/img/cloud/privatelink/dns-1.png)

   Enable private DNS names:

   ![DNS Sheet](/img/cloud/privatelink/dns-2.png)

   Wait for changes to apply.

9. Verify accessing Databend Cloud via PrivateLink:

   ![Verify DNS](/img/cloud/privatelink/verify-1.png)

   ![Verify Response](/img/cloud/privatelink/verify-2.png)

   Gateway domain is resolved to VPC internal IP address.

:::info
Congratulations! You have successfully connected to Databend Cloud with AWS PrivateLink.
:::
