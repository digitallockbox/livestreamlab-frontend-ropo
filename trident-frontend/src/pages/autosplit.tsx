import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { Button, ErrorState, Skeleton, Table } from "../components/ui";

type AllocationRow = {
  wallet: string;
  percentage: number;
};

export default function AutoSplitPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getAutoSplitRules,
    "Could not load autosplit rules",
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
              title="Autosplit unavailable"
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

  const firstRule = data.rules[0];
  const allocations: AllocationRow[] = (firstRule?.allocations ?? []).map(
    (entry) => ({
      wallet: entry.wallet,
      percentage: entry.percentage,
    }),
  );

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="AutoSplit Rules"
          actions={
            <div className="page-header-actions">
              <Button variant="primary">New Rule</Button>
              <Button variant="ghost" onClick={() => void reload()}>
                Refresh
              </Button>
            </div>
          }
        />
        <PageSection>
          <Table
            columns={[
              { header: "Wallet", key: "wallet" },
              { header: "Split %", key: "percentage" },
            ]}
            rows={allocations}
          />
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
