import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { useState } from "react";
import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import {
  Badge,
  Button,
  Card,
  ErrorState,
  LiveIndicator,
  Select,
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
  const [activeTheme, setActiveTheme] = useState("neon");

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

  const activeThemePreset =
    data.overlays.themePresets.find((preset) => preset.key === activeTheme) ??
    data.overlays.themePresets[0];
  const previewThemeClass = `overlay-preview-${activeThemePreset?.key ?? "neon"}`;

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
          <Card title="Overlay Editor">
            <div className="overlay-editor-grid">
              <div>
                <p className="overlay-field-label">Theme Preset</p>
                <Select
                  ariaLabel="Overlay theme preset"
                  value={activeThemePreset?.key ?? "neon"}
                  onChange={setActiveTheme}
                  options={data.overlays.themePresets.map((preset) => ({
                    value: preset.key,
                    label: `${preset.name} (${preset.accent})`,
                  }))}
                />
              </div>
              <div>
                <p className="overlay-field-label">Overlay Channel</p>
                <p className="overlay-token-value">{data.overlays.channel}</p>
              </div>
              <div>
                <p className="overlay-field-label">Overlay Token</p>
                <p className="overlay-token-value">
                  {data.overlays.overlayToken}
                </p>
              </div>
            </div>
          </Card>
        </PageSection>
        <PageSection>
          <Card title="Browser Source URLs (OBS / Streamlabs)">
            <ul className="overlay-url-list">
              <li>
                <span>Alert Box</span>
                <code>{data.overlays.browserSourceUrls.alertBox}</code>
              </li>
              <li>
                <span>Chat Overlay</span>
                <code>{data.overlays.browserSourceUrls.chatOverlay}</code>
              </li>
              <li>
                <span>Event Ticker</span>
                <code>{data.overlays.browserSourceUrls.eventTicker}</code>
              </li>
              <li>
                <span>Stream Goal</span>
                <code>{data.overlays.browserSourceUrls.streamGoal}</code>
              </li>
            </ul>
          </Card>
        </PageSection>
        <PageSection>
          <Card title="Widgets">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Widget", key: "title" },
                  { header: "Status", key: "status" },
                  { header: "Preview", key: "sample" },
                ]}
                rows={data.overlays.widgets.map((widget) => ({
                  title: widget.title,
                  status: widget.enabled ? "Enabled" : "Disabled",
                  sample: widget.sampleText,
                }))}
              />
            </div>
          </Card>
        </PageSection>
        <PageSection>
          <div className="page-grid">
            <Card title="Live Preview">
              <div className={`overlay-preview ${previewThemeClass}`}>
                <p className="overlay-preview-title">
                  {activeThemePreset?.name}
                </p>
                <ul>
                  {data.overlays.recentEvents.map((event) => (
                    <li key={event.id}>
                      {event.type.toUpperCase()} - {event.viewer}
                      {event.amount ? ` ($${event.amount})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            <Card title="Stream Goals">
              <ul className="overlay-goals-list">
                {data.overlays.goals.map((goal) => {
                  const percent = Math.min(
                    100,
                    Math.round((goal.current / Math.max(goal.target, 1)) * 100),
                  );

                  return (
                    <li key={goal.id}>
                      <div className="split-row">
                        <span>{goal.name}</span>
                        <span>
                          {goal.current} / {goal.target}
                        </span>
                      </div>
                      <div
                        className="analytics-progress-track"
                        aria-hidden="true"
                      >
                        <span
                          className="analytics-progress-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
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
