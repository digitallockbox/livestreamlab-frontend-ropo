import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useEffect } from "react";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { logger } from "../utils/logger";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Skeleton,
} from "../components/ui";

type DashboardData = {
  todayEarnings: number;
  streamCount: number;
  liveCount: number;
  topTitle: string;
  unreadAlerts: number;
  payoutCount: number;
};

export default function DashboardHome(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData<DashboardData>(
    async () => {
      const [analytics, streams, earnings] = await Promise.all([
        dashboardApi.getAnalytics(),
        dashboardApi.getStreams(),
        dashboardApi.getEarnings(),
      ]);

      return {
        todayEarnings: analytics.overview.revenue,
        streamCount: streams.streams.length,
        liveCount: streams.streams.filter((stream) => stream.status === "live")
          .length,
        topTitle: analytics.topContent[0]?.title ?? "No content yet",
        unreadAlerts: Math.max(
          1,
          earnings.payouts.length + streams.streams.length,
        ),
        payoutCount: earnings.payouts.length,
      };
    },
    "Could not load dashboard",
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const cmdKey = isMac ? event.metaKey : event.ctrlKey;

      if (cmdKey && event.key === "s") {
        event.preventDefault();
        logger.info("Keyboard shortcut triggered: Streams", {
          shortcut: "Cmd+S",
        });
        window.location.href = "/streams";
      }
      if (cmdKey && event.key === "u") {
        event.preventDefault();
        logger.info("Keyboard shortcut triggered: Content", {
          shortcut: "Cmd+U",
        });
        window.location.href = "/content";
      }
      if (cmdKey && event.key === "e") {
        event.preventDefault();
        logger.info("Keyboard shortcut triggered: Earnings", {
          shortcut: "Cmd+E",
        });
        window.location.href = "/earnings";
      }
      if (cmdKey && event.key === "r") {
        event.preventDefault();
        logger.info("Keyboard shortcut triggered: Refresh", {
          shortcut: "Cmd+R",
        });
        void reload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reload]);

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
              title="Dashboard unavailable"
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

  const quickActions = [
    { label: "Start Stream", href: "/streams" },
    { label: "Upload Content", href: "/content" },
    { label: "View Earnings", href: "/earnings" },
  ];

  const recentActivity = [
    `Top performer: ${data.topTitle}`,
    `Payout events in queue: ${data.payoutCount}`,
    `Unread operational alerts: ${data.unreadAlerts}`,
  ];

  const systemHealth = [
    { label: "Engine Health", status: "Healthy" },
    { label: "Backend Health", status: "Healthy" },
    { label: "WebSocket Health", status: "Healthy" },
  ];

  if (recentActivity.length === 0) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageHeader title="Today" subtitle="Creator Operations Overview" />
          <PageSection>
            <EmptyState
              title="No dashboard activity"
              message="Connect your stream and store activity to populate your control center."
            />
          </PageSection>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Today"
          subtitle="Creator Control Center"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <div className="metric-strip">
            <article className="metric-tile">
              <p className="metric-tile-label">Today Earnings</p>
              <p className="metric-tile-value">
                ${data.todayEarnings.toFixed(2)}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Live Streams</p>
              <p className="metric-tile-value">{data.liveCount}</p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Total Streams</p>
              <p className="metric-tile-value">{data.streamCount}</p>
            </article>
          </div>
        </PageSection>
        <PageSection>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="quick-action-link"
                aria-label={action.label}
              >
                {action.label}
              </a>
            ))}
          </div>
        </PageSection>
        <PageSection>
          <Card title="Recent Activity" className="metric-card">
            <ul className="activity-list">
              {recentActivity.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
          <Card title="System Status" className="metric-card">
            <div className="status-banner">
              <Badge
                text={data.liveCount > 0 ? "Streaming Live" : "Operational"}
                variant={data.liveCount > 0 ? "success" : "neutral"}
              />
              <span className="status-copy">
                API routes, payouts, and notifications are healthy.
              </span>
            </div>
            <ul className="system-health-list">
              {systemHealth.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <Badge text={item.status} variant="success" />
                </li>
              ))}
            </ul>
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
