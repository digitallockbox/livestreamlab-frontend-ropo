import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { Button, Card, ErrorState, Skeleton, Table } from "../components/ui";

type IntegrationRow = {
  provider: string;
  connected: string;
  health: string;
  mode: string;
  latency: string;
  updatedAt: string;
};

export default function IntegrationsPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getIntegrations,
    "Could not load integrations",
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageSection>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-24 w-full" />
          </PageSection>
        </PageContainer>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageSection>
            <ErrorState
              title="Integrations unavailable"
              message={error ?? undefined}
            />
            <Button variant="secondary" onClick={() => void reload()}>
              Retry
            </Button>
          </PageSection>
        </PageContainer>
      </DashboardLayout>
    );
  }

  const rows: IntegrationRow[] = data.providers.map((provider) => ({
    provider: provider.key,
    connected: provider.isConnected ? "Connected" : "Disconnected",
    health: provider.health,
    mode: provider.syncMode,
    latency: provider.latencyMs ? `${provider.latencyMs} ms` : "-",
    updatedAt: provider.updatedAt
      ? new Date(provider.updatedAt).toLocaleString()
      : "n/a",
  }));

  const healthyProviders = data.providers.filter(
    (provider) => provider.health === "healthy",
  ).length;
  const runningJobs = data.syncJobs.filter(
    (job) => job.status === "running" || job.status === "queued",
  ).length;
  const activeIncidents = data.incidents.filter(
    (incident) => !incident.resolvedAt,
  ).length;

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Integrations Control Center"
          subtitle="Provider health, sync pipeline, webhook reliability, and incident watch"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <div className="metric-strip">
            <article className="metric-tile">
              <p className="metric-tile-label">Healthy Providers</p>
              <p className="metric-tile-value">
                {healthyProviders}/{data.providers.length}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Running Sync Jobs</p>
              <p className="metric-tile-value">{runningJobs}</p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Webhook Endpoints</p>
              <p className="metric-tile-value">{data.webhooks.length}</p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Open Incidents</p>
              <p className="metric-tile-value">{activeIncidents}</p>
            </article>
          </div>
        </PageSection>
        <PageSection>
          <Card title="Provider Matrix">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Provider", key: "provider" },
                  { header: "Connection", key: "connected" },
                  { header: "Health", key: "health" },
                  { header: "Sync Mode", key: "mode" },
                  { header: "Latency", key: "latency" },
                  { header: "Updated", key: "updatedAt" },
                ]}
                rows={rows}
              />
            </div>
          </Card>
        </PageSection>
        <PageSection>
          <div className="page-grid">
            <Card title="Sync Pipeline Jobs">
              <div className="surface-table-wrap">
                <Table
                  columns={[
                    { header: "Provider", key: "provider" },
                    { header: "Status", key: "status" },
                    { header: "Started", key: "startedAt" },
                    { header: "Completed", key: "completedAt" },
                    { header: "Records", key: "recordsProcessed" },
                  ]}
                  rows={data.syncJobs.map((job) => ({
                    provider: job.provider,
                    status: job.status,
                    startedAt: new Date(job.startedAt).toLocaleString(),
                    completedAt: job.completedAt
                      ? new Date(job.completedAt).toLocaleString()
                      : "-",
                    recordsProcessed: job.recordsProcessed,
                  }))}
                />
              </div>
            </Card>
            <Card title="Webhook Delivery Status">
              <div className="surface-table-wrap">
                <Table
                  columns={[
                    { header: "Event", key: "event" },
                    { header: "Status", key: "status" },
                    { header: "Failure Rate", key: "failureRate" },
                    { header: "Last Delivery", key: "lastDeliveryAt" },
                  ]}
                  rows={data.webhooks.map((hook) => ({
                    event: `${hook.event} -> ${hook.target}`,
                    status: hook.status,
                    failureRate: `${hook.failureRate.toFixed(1)}%`,
                    lastDeliveryAt: hook.lastDeliveryAt
                      ? new Date(hook.lastDeliveryAt).toLocaleString()
                      : "-",
                  }))}
                />
              </div>
            </Card>
          </div>
        </PageSection>
        <PageSection>
          <Card title="Incident Timeline">
            <ul className="integrations-incident-list">
              {data.incidents.map((incident) => (
                <li key={incident.id}>
                  <p>
                    <strong>{incident.severity.toUpperCase()}</strong> -{" "}
                    {incident.provider}: {incident.summary}
                  </p>
                  <span>
                    Opened: {new Date(incident.openedAt).toLocaleString()} |
                    Resolved:{" "}
                    {incident.resolvedAt
                      ? new Date(incident.resolvedAt).toLocaleString()
                      : "Open"}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
