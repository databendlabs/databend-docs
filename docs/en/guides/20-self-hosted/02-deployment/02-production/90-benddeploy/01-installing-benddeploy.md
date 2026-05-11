---
title: Installing BendDeploy
---

This guide walks you through deploying BendDeploy and its optional Logging component using [k3d](https://k3d.io/), [Helm](https://helm.sh/), and [kubectl](https://kubernetes.io/docs/tasks/tools/) in a Kubernetes environment.

## Prerequisites

Before you begin, make sure the following tools are installed:

- **S3 Bucket**: Used to store logs collected from BendDeploy. This guide uses an Amazon S3 bucket named `databend-doc` in the `us-east-2` region as an example, but you can use any S3-compatible storage. Make sure you have the appropriate Access Key ID and Secret Access Key.
- **k3d**: This guide uses k3d to create a local Kubernetes cluster for testing and development. k3d runs lightweight K3s clusters inside Docker containers, making it easy to get started quickly. However, you can use any Kubernetes environment that fits your needs. Install it from [k3d.io](https://k3d.io/stable/).
- **kubectl**: Needed to manage and interact with the Kubernetes cluster. Installation instructions are available in the [official Kubernetes docs](https://kubernetes.io/docs/tasks/tools/).
- **Helm**: Required for installing BendDeploy and the optional logging component as Helm charts. It simplifies the deployment process and handles configuration for you. Install Helm from [helm.sh](https://helm.sh/docs/intro/install/).

## Step 1: Create the Kubernetes Cluster

To begin, you’ll need a Kubernetes environment to run BendDeploy and its logging components.

1. Create a local cluster named `benddeploy-tutorial`:

```bash
k3d cluster create benddeploy-tutorial
```

You’ll see output showing the steps as the cluster is being set up. Once it completes, your cluster is ready:

```bash
INFO[0000] Prep: Network
INFO[0000] Created network 'k3d-benddeploy-tutorial'
INFO[0000] Created image volume k3d-benddeploy-tutorial-images
INFO[0000] Starting new tools node...
INFO[0000] Starting node 'k3d-benddeploy-tutorial-tools'
INFO[0001] Creating node 'k3d-benddeploy-tutorial-server-0'
INFO[0001] Creating LoadBalancer 'k3d-benddeploy-tutorial-serverlb'
INFO[0001] Using the k3d-tools node to gather environment information
INFO[0001] Starting new tools node...
INFO[0001] Starting node 'k3d-benddeploy-tutorial-tools'
INFO[0002] Starting cluster 'benddeploy-tutorial'
INFO[0002] Starting servers...
INFO[0002] Starting node 'k3d-benddeploy-tutorial-server-0'
INFO[0005] All agents already running.
INFO[0005] Starting helpers...
INFO[0005] Starting node 'k3d-benddeploy-tutorial-serverlb'
INFO[0011] Injecting records for hostAliases (incl. host.k3d.internal) and for 3 network members into CoreDNS configmap...
INFO[0013] Cluster 'benddeploy-tutorial' created successfully!
INFO[0013] You can now use it like this:
kubectl cluster-info
➜  ~ k3d cluster list

NAME                  SERVERS   AGENTS   LOADBALANCER
benddeploy-tutorial   1/1       0/0      true
```

2. Verify the Kubernetes node is up and running:

```bash
kubectl get nodes
```

You should see the control plane node in the `Ready` state:

```bash
NAME                               STATUS   ROLES                  AGE     VERSION
k3d-benddeploy-tutorial-server-0   Ready    control-plane,master   7m35s   v1.31.5+k3s1
```

3. Install Prometheus CRDs. Before continuing, make sure your cluster has the required Prometheus Operator CRDs, especially ServiceMonitor.

```bash
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml
```

4. Clone the BendDeploy Helm charts repository:

```bash
git clone https://github.com/databendcloud/benddeploy-charts.git
cd benddeploy-charts/charts/logging
```

## Step 2: Deploy the Logging Components (Optional)

This step is optional but recommended if you want to collect system logs from BendDeploy and store them in S3 for further analysis.

1. Update the **values.yaml** file in the `charts/logging` directory to enable the `warehouseLogCollector` and configure it to use your S3-compatible storage:

```yaml
...

warehouseLogCollector:
  enabled: true
  replicas: 1
  nameOverride: warehouse-log-collector
  fullnameOverride: warehouse-log-collector
  s3:
    endpoint: "https://s3.us-east-2.amazonaws.com"
    bucket: "databend-doc"
    region: "us-east-2"
    auth:
      accessKeyId: "<your-access-key-id>"
      secretAccessKey: "<your-secret-access-key>"

...
```

2. Edit the **agent.yaml** file located in `configs/vector/` to configure the S3 sink for log storage:

```yaml
...

 # S3 sink
 s3_logs:
   type: aws_s3
   inputs:
#      - filter_kubernetes_logs
     - filter_warehouse_system_logs
   endpoint: "https://s3.us-east-2.amazonaws.com"
   bucket: "databend-doc"
   key_prefix: "logs/{{ tenant }}/system/"
   compression: gzip
   encoding:
     codec: native_json

   auth:
      access_key_id: "<your-access-key-id>"
      secret_access_key: "<your-secret-access-key>"

   region: "us-east-2" 

...
```

3. Deploy the logging components using Helm:

```bash
helm upgrade --install logging . --namespace=logging --create-namespace
```

On success, Helm will show a message confirming the deployment:

```bash
Release "logging" does not exist. Installing it now.
NAME: logging
LAST DEPLOYED: Sun Apr 20 11:36:46 2025
NAMESPACE: logging
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

4. Verify the logging components are running:

```bash
kubectl get pod -n logging
```

You should see output like:

```bash
NAME                         READY   STATUS    RESTARTS   AGE
vector-xpshl                 1/1     Running   0          6s
warehouse-log-aggregator-0   1/1     Running   0          70m
warehouse-log-collector-0    1/1     Running   0          3s
```

## Step 3: Deploy BendDeploy

Now that your cluster is ready, you can install BendDeploy into the Kubernetes environment.

1. For production deployments, customize the **configmap-benddeploy.yaml** file in the `charts/benddeploy/templates` directory to ensure BendDeploy can properly pull images, store logs, connect to metrics and databases, and authenticate users. If left unchanged, the default settings will be used, which are suitable for testing but not recommended for production use.

| Field                  | Description                                                                                                                                                                                           |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imageRegistry`        | The image registry for pulling Databend Docker images. If your cluster has no internet access, push the images to your own registry (e.g., `registry.databend.local`). Leave empty to use Docker Hub. |
| `registryUsername`     | Username for accessing your image registry, if required.                                                                                                                                              |
| `registryPassword`     | Password for accessing your image registry, if required.                                                                                                                                              |
| `repoNamespace`        | The namespace under which Databend images are stored. For example, if the image is `registry.databend.local/datafuselabs/databend-query:tag`, the `repoNamespace` is `datafuselabs`.                  |
| `promEndpoint`         | Endpoint of your Prometheus server, e.g., `prometheus-k8s.monitoring.svc.cluster.local:9090`.                                                                                                         |
| `logCollectorEndpoint` | Endpoint for your log collector (e.g., Vector or OpenTelemetry), e.g., `http://warehouse-log-collector.logging.svc.cluster.local:4318`.                                                               |
| `grafanaEndpoint`      | Address of your Grafana dashboard, e.g., `http://grafana.monitoring.svc.cluster.local:80`.                                                                                                            |
| `db.postgresDSN`       | DSN for an external PostgreSQL database.                                                                                                                                                              |
| `oidcProvider`         | OIDC provider URL for authentication. Must be accessible from within the cluster or exposed via Ingress.                                                                                              |

2. Install BendDeploy using Helm from the root of the cloned repository. Visit the [BendDeploy image repository on Amazon ECR Public Gallery](https://gallery.ecr.aws/databendlabs/benddeploy) and check the **Image tags** section to find the latest version, such as `v1.0.2`.

```bash
# Replace <version> with the latest release version:
helm install benddeploy -n benddeploy --create-namespace ./charts/benddeploy --set image=public.ecr.aws/databendlabs/benddeploy:<version>
```

Helm will confirm the deployment:

```bash
NAME: benddeploy
LAST DEPLOYED: Sun Apr 20 12:44:44 2025
NAMESPACE: benddeploy
STATUS: deployed
REVISION: 1
TEST SUITE: None
➜  benddeploy-charts git:(main) ✗
```

3. Verify BendDeploy pods are running:

```bash
kubectl get pod -n benddeploy
```

Expected output:

```bash
NAME                                   READY   STATUS    RESTARTS   AGE
benddeploy-cfdd898d5-pkfwd             1/1     Running   0          69s
benddeploy-frontend-6988fdc5b9-blt2n   1/1     Running   0          69s
pg-benddeploy-64c64b95c-wd55m          1/1     Running   0          69s
```

## Step 4: Access the Web Interface

With the deployment complete, you can now access the BendDeploy web UI in your browser.

1. Expose the frontend via port forwarding.

:::tip
While port forwarding is great for quick local access, for production or shared environments, consider configuring an Ingress controller (like NGINX Ingress) or exposing the service via a LoadBalancer to make BendDeploy accessible from outside the cluster. This allows you to access the web UI through a real domain or IP address.
:::

First, check the service:

```bash
kubectl get svc -n benddeploy
```

```bash
NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
benddeploy-service   ClusterIP   10.43.74.161   <none>        8080/TCP   9m23s
frontend-service     ClusterIP   10.43.70.22    <none>        8080/TCP   9m23s
pg-benddeploy        ClusterIP   10.43.38.197   <none>        5432/TCP   9m23s
```

Then forward the frontend service to your local machine:

```bash
kubectl port-forward -n benddeploy svc/frontend-service 8080:8080
```

You’ll see:

```bash
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
```

2. Navigate to [http://localhost:8080](http://localhost:8080) to access BendDeploy using the default credentials (Username: `databend`, Password: `Databend@1*`).

![alt text](@site/static/img/documents/benddeploy/login.png)