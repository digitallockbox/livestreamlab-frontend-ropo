import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import {
  DashboardLayout,
  PageContainer,
  PageGrid,
  PageHeader,
  PageSection,
} from "../components/layout";
import { Button, Card, ErrorState, Skeleton, Table } from "../components/ui";

type TopContentRow = {
  title: string;
  views: number;
  revenue: number;
};

export default function AnalyticsPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getAnalytics,
    "Could not load analytics",
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
              title="Analytics unavailable"
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

  const topRows: TopContentRow[] = data.topContent.map((item) => ({
    title: item.title,
    views: item.views,
    revenue: item.revenue,
  }));

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Analytics"
          subtitle={`Range: ${data.range} | Updated ${new Date(data.generatedAt).toLocaleString()}`}
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <div className="metric-strip">
            <article className="metric-tile">
              <p className="metric-tile-label">Top Conversion Driver</p>
              <p className="metric-tile-value">
                {data.topContent[0]?.title ?? "No content"}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Top Content Revenue</p>
              <p className="metric-tile-value">
                ${Number(data.topContent[0]?.revenue ?? 0).toFixed(2)}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Audience Quality</p>
              <p className="metric-tile-value">
                {data.overview.conversionRate >= 5 ? "Strong" : "Growing"}
              </p>
            </article>
          </div>
        </PageSection>
        <PageSection>
          <PageGrid>
            <Card title="Views" className="metric-card">
              <span className="metric-card-value">
                {data.overview.totalViews}
              </span>
              <span className="metric-card-meta">Across selected range</span>
            </Card>
            <Card title="Unique Viewers" className="metric-card">
              <span className="metric-card-value">
                {data.overview.uniqueViewers}
              </span>
              <span className="metric-card-meta">Distinct audience count</span>
            </Card>
            <Card title="Watch Minutes" className="metric-card">
              <span className="metric-card-value">
                {data.overview.watchTimeMinutes}
              </span>
              <span className="metric-card-meta">Total engaged minutes</span>
            </Card>
            <Card title="Conversion Rate" className="metric-card">
              <span className="metric-card-value">
                {data.overview.conversionRate.toFixed(2)}%
              </span>
              <span className="metric-card-meta">Viewer to action</span>
            </Card>
            <Card title="Revenue" className="metric-card">
              <span className="metric-card-value">
                ${data.overview.revenue.toFixed(2)}
              </span>
              <span className="metric-card-meta">Estimated gross</span>
            </Card>
          </PageGrid>
        </PageSection>
        <PageSection>
          <Card title="Top Content">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Title", key: "title" },
                  { header: "Views", key: "views" },
                  { header: "Revenue", key: "revenue" },
                ]}
                rows={topRows}
              />
            </div>
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
