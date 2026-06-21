import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { Button, Card, ErrorState, Skeleton } from "../components/ui";

export default function SettingsPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getSettings,
    "Could not load settings",
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
              title="Settings unavailable"
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

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Settings"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <Card title="Profile">
            {data.profile.displayName} | {data.profile.email} |{" "}
            {data.profile.timezone}
          </Card>
          <Card title="Security">
            2FA: {data.security.twoFactorEnabled ? "Enabled" : "Disabled"} | API
            Keys: {data.security.apiKeysEnabled ? "Enabled" : "Disabled"}
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
