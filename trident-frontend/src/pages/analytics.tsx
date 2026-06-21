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
  rank: string;
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

  const rankedTopRows: TopContentRow[] = data.topContent.map((item, index) => ({
    rank: `#${index + 1}`,
    title: item.title,
    views: item.views,
    revenue: item.revenue,
  }));

  const bestTrafficSource = data.trafficSources
    .slice()
    .sort((left, right) => right.revenue - left.revenue)[0];

  const bestGeo = data.viewerGeography
    .slice()
    .sort((left, right) => right.viewers - left.viewers)[0];

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
                {bestTrafficSource ? bestTrafficSource.source : "No source"}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Top Geography</p>
              <p className="metric-tile-value">
                {bestGeo
                  ? `${bestGeo.countryCode} (${bestGeo.viewers})`
                  : "No data"}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Audience Quality (RPM)</p>
              <p className="metric-tile-value">
                ${data.overview.rpm.toFixed(2)}
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
            <Card title="CTR" className="metric-card">
              <span className="metric-card-value">
                {data.overview.ctr.toFixed(2)}%
              </span>
              <span className="metric-card-meta">
                Click-through performance
              </span>
            </Card>
            <Card title="RPM" className="metric-card">
              <span className="metric-card-value">
                ${data.overview.rpm.toFixed(2)}
              </span>
              <span className="metric-card-meta">Revenue per 1k views</span>
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
          <Card title="Retention Curve">
            <ul className="analytics-retention-list">
              {data.retentionCurve.map((point) => (
                <li key={point.minute}>
                  <span className="analytics-retention-label">
                    {point.minute}m
                  </span>
                  <div className="analytics-progress-track" aria-hidden="true">
                    <span
                      className="analytics-progress-fill"
                      style={{
                        width: `${Math.max(0, Math.min(point.retention, 100))}%`,
                      }}
                    />
                  </div>
                  <span className="analytics-retention-value">
                    {point.retention}%
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </PageSection>
        <PageSection>
          <PageGrid>
            <Card title="Traffic Sources">
              <div className="surface-table-wrap">
                <Table
                  columns={[
                    { header: "Source", key: "source" },
                    { header: "Visitors", key: "visitors" },
                    { header: "CTR", key: "ctr" },
                    { header: "Revenue", key: "revenue" },
                  ]}
                  rows={data.trafficSources.map((item) => ({
                    source: item.source,
                    visitors: item.visitors,
                    ctr: `${item.ctr.toFixed(2)}%`,
                    revenue: `$${item.revenue.toFixed(2)}`,
                  }))}
                />
              </div>
            </Card>
            <Card title="Viewer Geography">
              <div className="surface-table-wrap">
                <Table
                  columns={[
                    { header: "Country", key: "country" },
                    { header: "Viewers", key: "viewers" },
                    { header: "Revenue", key: "revenue" },
                  ]}
                  rows={data.viewerGeography.map((item) => ({
                    country: `${item.country} (${item.countryCode})`,
                    viewers: item.viewers,
                    revenue: `$${item.revenue.toFixed(2)}`,
                  }))}
                />
              </div>
            </Card>
          </PageGrid>
        </PageSection>
        <PageSection>
          <PageGrid>
            <Card title="Earnings Over Time">
              <div
                className="analytics-bars"
                aria-label="Earnings over time chart"
              >
                {data.earningsOverTime.map((point) => (
                  <div key={point.label} className="analytics-bar-item">
                    <span
                      className="analytics-bar"
                      style={{
                        height: `${Math.max(18, (point.earnings / Math.max(data.overview.revenue, 1)) * 160)}px`,
                      }}
                      title={`${point.label}: $${point.earnings.toFixed(2)}`}
                    />
                    <span className="analytics-bar-label">{point.label}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Stream Performance Heatmap">
              <ul className="analytics-heatmap-list">
                {data.streamPerformanceHeatmap.map((cell) => (
                  <li key={`${cell.day}-${cell.hour}`}>
                    <span>{cell.day}</span>
                    <span>{cell.hour}:00</span>
                    <div
                      className="analytics-progress-track"
                      aria-hidden="true"
                    >
                      <span
                        className="analytics-progress-fill"
                        style={{ width: `${cell.score}%` }}
                      />
                    </div>
                    <span>{cell.score}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </PageGrid>
        </PageSection>
        <PageSection>
          <Card title="Top Performing Content">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Rank", key: "rank" },
                  { header: "Title", key: "title" },
                  { header: "Views", key: "views" },
                  { header: "Revenue", key: "revenue" },
                ]}
                rows={rankedTopRows.map((item) => ({
                  rank: item.rank,
                  title: item.title,
                  views: item.views,
                  revenue: `$${item.revenue.toFixed(2)}`,
                }))}
              />
            </div>
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
