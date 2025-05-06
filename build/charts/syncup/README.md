# syncup

Installs SyncUp, a collaborative meeting tool built on the Yorkie framework.

## Prerequisites

- Kubernetes 1.24+
- Helm 3+

## Get Helm Repository Info

```bash
helm repo add yorkie-team https://yorkie-team.github.io/yorkie/helm-charts
helm repo update
```

_See [`helm repo`](https://helm.sh/docs/helm/helm_repo/) for command documentation._

## Install Helm Chart

```bash
# Install syncup helm chart
helm install [RELEASE_NAME] yorkie-team/syncup -n syncup --create-namespace
```

_See [configuration](#configuration) below for custom installation_

_See [`helm install`](https://helm.sh/docs/helm/helm_install/) for command documentation._

## Uninstall Helm Chart

```bash
helm uninstall [RELEASE_NAME] -n syncup
```

This removes all the Kubernetes components associated with the chart and deletes the release.

_See [`helm uninstall`](https://helm.sh/docs/helm/helm_uninstall/) for command documentation._

## Upgrading Chart

```bash
helm upgrade [RELEASE_NAME] yorkie-team/syncup -n syncup
```

_See [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/) for command documentation._

## Configuration

See [Customizing the Chart Before Installing](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing). To see all configurable options with detailed comments:

```console
helm show values yorkie-team/syncup
```

### Environment Variables

The following table lists the configurable environment variables for the SyncUp deployment and their default values.

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `env.frontendUrl` | Frontend URL for CORS | `"https://syncup.yorkie.dev"` |
| `env.githubClientId` | GitHub OAuth Client ID | `""` |
| `env.githubClientSecret` | GitHub OAuth Client Secret | `""` |
| `env.githubCallbackUrl` | GitHub OAuth Callback URL | `"https://syncup-api.yorkie.dev/auth/github/callback"` |
| `env.jwtSecret` | Secret for JWT token signing | `""` |

### Ingress Configuration

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.className` | Ingress class name | `"alb"` |
| `ingress.annotations` | Ingress annotations | See `values.yaml` |
| `ingress.host` | Ingress host | `"syncup-api.yorkie.dev"` |
| `ingress.awsAlb.enabled` | Enable AWS ALB settings | `true` |
| `ingress.awsAlb.certArn` | AWS ACM Certificate ARN | `""` |
