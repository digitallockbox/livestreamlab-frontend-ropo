import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { Button, ErrorState, Skeleton, Table } from "../components/ui";

type IntegrationRow = {
  provider: string;
  connected: string;
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
    updatedAt: provider.updatedAt
      ? new Date(provider.updatedAt).toLocaleString()
      : "n/a",
  }));

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Integrations"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <Table
            columns={[
              { header: "Provider", key: "provider" },
              { header: "Status", key: "connected" },
              { header: "Updated", key: "updatedAt" },
            ]}
            rows={rows}
          />
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
