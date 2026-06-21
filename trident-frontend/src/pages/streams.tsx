import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import {
  Badge,
  Button,
  ErrorState,
  LiveIndicator,
  Skeleton,
  Table,
} from "../components/ui";

type StreamRow = {
  title: string;
  status: string;
  schedule: string;
};

export default function StreamsPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getStreams,
    "Could not load streams",
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
              title="Streams unavailable"
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

  const rows: StreamRow[] = data.streams.map((stream) => ({
    title: stream.title,
    status: stream.status,
    schedule: stream.scheduledAt ?? stream.startedAt ?? "TBD",
  }));

  const liveCount = data.streams.filter(
    (stream) => stream.status === "live",
  ).length;
  const scheduledCount = data.streams.filter(
    (stream) => stream.status === "scheduled",
  ).length;
  const endedCount = data.streams.filter(
    (stream) => stream.status === "ended",
  ).length;

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="My Streams"
          actions={
            <div className="page-header-actions">
              <LiveIndicator />
              <Button variant="primary">Start Stream</Button>
              <Button variant="ghost" onClick={() => void reload()}>
                Refresh
              </Button>
            </div>
          }
        />
        <PageSection>
          <div className="metric-strip">
            <article className="metric-tile">
              <p className="metric-tile-label">Live Now</p>
              <p className="metric-tile-value">{liveCount}</p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Scheduled</p>
              <p className="metric-tile-value">{scheduledCount}</p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Completed</p>
              <p className="metric-tile-value">{endedCount}</p>
            </article>
          </div>
        </PageSection>
        <PageSection>
          <div className="surface-table-wrap">
            <Table
              columns={[
                { header: "Stream", key: "title" },
                { header: "Status", key: "status" },
                { header: "When", key: "schedule" },
              ]}
              rows={rows}
            />
          </div>
        </PageSection>
        <PageSection>
          <Badge
            text={`Total Streams: ${data.streams.length}`}
            variant="neutral"
          />
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
