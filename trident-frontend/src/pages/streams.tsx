import { useEffect, useRef, useState } from "react";
import { useApiData } from "../hooks/useApiData";
import { useOverlayRuntime } from "../hooks/useOverlayRuntime";
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

type EditorState =
  | "loading"
  | "error"
  | "empty"
  | "preview-fallback"
  | "theme-save-failure"
  | "token-expired"
  | "token-revoked"
  | "ready";

export default function StreamsPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getStreams,
    "Could not load streams",
  );

  const {
    config,
    events,
    status,
    runtimeClassName,
    saveTheme,
    rotateToken,
    revokeToken,
    refresh: refreshRuntime,
  } = useOverlayRuntime("creator_default");

  const [editorState, setEditorState] = useState<EditorState>("loading");

  const previewFrameRef = useRef<{
    contentWindow?: {
      postMessage: (message: unknown, targetOrigin: string) => void;
    };
  } | null>(null);

  const postPreviewMessage = (message: {
    type: "theme.update" | "event.mock" | "token.rotated" | "token.revoked";
    payload?: {
      themeKey?: "neon" | "midnight" | "sunset";
      message?: string;
      eventType?: "alert" | "chat" | "ticker" | "goal";
      token?: string;
    };
  }): void => {
    const targetWindow = previewFrameRef.current?.contentWindow;
    if (!targetWindow || typeof window === "undefined") {
      return;
    }

    targetWindow.postMessage(
      {
        source: "overlay-editor",
        mode: "preview",
        ...message,
      },
      window.location.origin,
    );
  };

  useEffect(() => {
    if (!config) {
      return;
    }

    if (config.tokenStatus === "expired") {
      setEditorState("token-expired");
      return;
    }

    if (config.tokenStatus === "revoked") {
      setEditorState("token-revoked");
      return;
    }

    setEditorState("ready");

    postPreviewMessage({
      type: "theme.update",
      payload: { themeKey: config.themeKey },
    });
  }, [config?.themeKey, config?.tokenStatus]);

  useEffect(() => {
    if (error) {
      setEditorState("error");
      return;
    }

    if (data && data.streams.length === 0) {
      setEditorState("empty");
    }
  }, [data, error]);

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
    data.overlays.themePresets.find(
      (preset) => preset.key === (config?.themeKey ?? "neon"),
    ) ?? data.overlays.themePresets[0];

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
                  value={config?.themeKey ?? activeThemePreset?.key ?? "neon"}
                  onChange={(value) => {
                    const themeKey = value as "neon" | "midnight" | "sunset";
                    void (async () => {
                      try {
                        await saveTheme(themeKey);
                        setEditorState("ready");
                        postPreviewMessage({
                          type: "theme.update",
                          payload: { themeKey },
                        });
                      } catch {
                        setEditorState("theme-save-failure");
                      }
                    })();
                  }}
                  options={data.overlays.themePresets.map((preset) => ({
                    value: preset.key,
                    label: `${preset.name} (${preset.accent})`,
                  }))}
                />
              </div>
              <div>
                <p className="overlay-field-label">Overlay Channel</p>
                <p className="overlay-token-value">
                  {config?.channel ?? data.overlays.channel}
                </p>
              </div>
              <div>
                <p className="overlay-field-label">Overlay Token</p>
                <p className="overlay-token-value">
                  {config?.token ?? data.overlays.overlayToken}
                </p>
              </div>
            </div>
            <div className="overlay-editor-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  void (async () => {
                    await rotateToken();
                    postPreviewMessage({
                      type: "token.rotated",
                      payload: { token: config?.token },
                    });
                    setEditorState("ready");
                  })();
                }}
              >
                Rotate Token
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  void (async () => {
                    await revokeToken();
                    postPreviewMessage({ type: "token.revoked" });
                    setEditorState("token-revoked");
                  })();
                }}
              >
                Revoke Token
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  void (async () => {
                    try {
                      await refreshRuntime();
                      setEditorState("ready");
                    } catch {
                      setEditorState("preview-fallback");
                    }
                  })();
                }}
              >
                Refresh Runtime
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  postPreviewMessage({
                    type: "event.mock",
                    payload: {
                      eventType: "alert",
                      message: "preview: gifted sub x5",
                    },
                  })
                }
              >
                Send Mock Event
              </Button>
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
              <div className={runtimeClassName}>
                <p className="overlay-preview-title">
                  {activeThemePreset?.name}
                </p>
                <p className="overlay-runtime-status">Runtime: {status}</p>
                <ul>
                  {(events.length > 0
                    ? events
                    : data.overlays.recentEvents
                  ).map((event) => (
                    <li key={event.id}>
                      {event.type.toUpperCase()} -{" "}
                      {"viewer" in event ? event.viewer : event.message}
                      {"amount" in event && event.amount
                        ? ` ($${event.amount})`
                        : ""}
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
                      <progress
                        className="analytics-progress-meter"
                        value={percent}
                        max={100}
                        aria-label={`${goal.name} progress`}
                      />
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </PageSection>

        <PageSection>
          <Card title="Preview Sandbox">
            <iframe
              ref={previewFrameRef}
              title="Overlay Preview Sandbox"
              src="/overlay-preview?creatorId=creator_default"
              className="overlay-preview-frame"
              onError={() => setEditorState("preview-fallback")}
            />
            <p className="overlay-runtime-status">Editor: {editorState}</p>
          </Card>
        </PageSection>

        <PageSection>
          <Card title="Streams Navigation">
            <div className="overlay-nav-links">
              <a href="/streams">Go Live</a>
              <a href="/streams">Stream Health</a>
              <a href="/streams">Overlays</a>
            </div>
          </Card>
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
