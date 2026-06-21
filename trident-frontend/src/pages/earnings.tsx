import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import {
  Badge,
  Button,
  Card,
  ErrorState,
  Skeleton,
  Table,
} from "../components/ui";

type PayoutRow = {
  payoutId: string;
  createdAt: string;
  amount: number;
  status: string;
};

export default function EarningsPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getEarnings,
    "Could not load earnings",
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
              title="Earnings unavailable"
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

  const payoutRows: PayoutRow[] = data.payouts.map((item) => ({
    payoutId: item.payoutId,
    createdAt: new Date(item.createdAt).toLocaleDateString(),
    amount: item.amount,
    status: item.status,
  }));

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Earnings & Payouts"
          subtitle="Live cashflow visibility across available, pending, and lifetime balances"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <div className="metric-strip">
            <article className="metric-tile">
              <p className="metric-tile-label">Available</p>
              <p className="metric-tile-value">
                {data.currency} {data.availableBalance.toFixed(2)}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Pending</p>
              <p className="metric-tile-value">
                {data.currency} {data.pendingBalance.toFixed(2)}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Lifetime</p>
              <p className="metric-tile-value">
                {data.currency} {data.lifetimeEarnings.toFixed(2)}
              </p>
            </article>
          </div>
        </PageSection>
        <PageSection>
          <Card title="Balance" className="metric-card">
            <span className="metric-card-value">
              {data.currency} {data.availableBalance.toFixed(2)}
            </span>
            <span className="metric-card-meta">Ready for payout</span>
          </Card>
          <Card title="Pending" className="metric-card">
            <span className="metric-card-value">
              {data.currency} {data.pendingBalance.toFixed(2)}
            </span>
            <span className="metric-card-meta">In settlement queue</span>
          </Card>
          <Card title="Lifetime" className="metric-card">
            <span className="metric-card-value">
              {data.currency} {data.lifetimeEarnings.toFixed(2)}
            </span>
            <span className="metric-card-meta">
              Cumulative creator earnings
            </span>
          </Card>
        </PageSection>
        <PageSection>
          <Badge text={`${data.payouts.length} payouts`} variant="neutral" />
          <div className="surface-table-wrap">
            <Table
              columns={[
                { header: "Payout", key: "payoutId" },
                { header: "Date", key: "createdAt" },
                { header: "Amount", key: "amount" },
                { header: "Status", key: "status" },
              ]}
              rows={payoutRows}
            />
          </div>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
