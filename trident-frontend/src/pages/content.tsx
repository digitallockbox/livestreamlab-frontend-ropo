import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { useState } from "react";
import {
  Button,
  Card,
  ErrorState,
  Input,
  Select,
  Skeleton,
  Table,
} from "../components/ui";

type AssetRow = {
  fileName: string;
  mediaType: string;
  status: string;
  createdAt: string;
};

type QueueRow = {
  title: string;
  platform: string;
  campaign: string;
  status: string;
  scheduledFor: string;
  estimatedReach: string;
};

export default function ContentPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getContent,
    "Could not load content",
  );
  const [selectedWindowId, setSelectedWindowId] = useState("window-001");
  const [campaignName, setCampaignName] = useState("creator-launch");
  const [selectedPlatform, setSelectedPlatform] = useState("youtube");

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
              title="Content unavailable"
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

  const rows: AssetRow[] = data.assets.map((asset) => ({
    fileName: asset.fileName,
    mediaType: asset.mediaType,
    status: asset.status,
    createdAt: new Date(asset.createdAt).toLocaleString(),
  }));

  const selectedWindow =
    data.scheduler.publishWindows.find(
      (window) => window.id === selectedWindowId,
    ) ?? data.scheduler.publishWindows[0];

  const queueRows: QueueRow[] = data.scheduler.queue.map((item) => ({
    title: item.title,
    platform: item.platform,
    campaign: item.campaign,
    status: item.status,
    scheduledFor: new Date(item.scheduledFor).toLocaleString(),
    estimatedReach: item.estimatedReach.toLocaleString(),
  }));

  const queueReach = data.scheduler.queue.reduce(
    (sum, item) => sum + item.estimatedReach,
    0,
  );
  const readyAssets = data.assets.filter(
    (asset) => asset.status === "ready",
  ).length;
  const generatedSlotSummary = `${selectedWindow?.label ?? "-"} | ${selectedWindow?.day ?? "-"} ${selectedWindow?.startHourUtc ?? "-"}:00 UTC | ${selectedPlatform.toUpperCase()} | ${campaignName || "default-campaign"}`;

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Content Scheduling"
          subtitle="Plan publish windows, queue campaigns, and track scheduled reach"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <div className="metric-strip">
            <article className="metric-tile">
              <p className="metric-tile-label">Queued Posts</p>
              <p className="metric-tile-value">{data.scheduler.queuedPosts}</p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Scheduled This Week</p>
              <p className="metric-tile-value">
                {data.scheduler.scheduledThisWeek}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Ready Assets</p>
              <p className="metric-tile-value">{readyAssets}</p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Estimated Queue Reach</p>
              <p className="metric-tile-value">{queueReach.toLocaleString()}</p>
            </article>
          </div>
        </PageSection>
        <PageSection>
          <Card title="Scheduling Console">
            <div className="content-scheduler-grid">
              <div>
                <p className="overlay-field-label">Publish Window</p>
                <Select
                  ariaLabel="Select publish window"
                  value={selectedWindow?.id}
                  onChange={setSelectedWindowId}
                  options={data.scheduler.publishWindows.map((window) => ({
                    value: window.id,
                    label: `${window.label} (${window.day} ${window.startHourUtc}:00 UTC)`,
                  }))}
                />
              </div>
              <div>
                <p className="overlay-field-label">Campaign Name</p>
                <Input
                  ariaLabel="Campaign name"
                  value={campaignName}
                  onChange={setCampaignName}
                />
              </div>
              <div>
                <p className="overlay-field-label">Platform Override</p>
                <Select
                  ariaLabel="Select target platform"
                  value={selectedPlatform}
                  onChange={setSelectedPlatform}
                  options={[
                    { value: "youtube", label: "YouTube" },
                    { value: "twitch", label: "Twitch" },
                    { value: "instagram", label: "Instagram" },
                    { value: "tiktok", label: "TikTok" },
                  ]}
                />
              </div>
            </div>
            <p className="content-slot-preview">{generatedSlotSummary}</p>
            <p className="content-slot-meta">
              Next publish:{" "}
              {new Date(data.scheduler.nextPublishAt).toLocaleString()} (
              {data.scheduler.timezone})
            </p>
          </Card>
        </PageSection>
        <PageSection>
          <div className="page-grid">
            <Card title="Publish Windows">
              <ul className="content-window-list">
                {data.scheduler.publishWindows.map((window) => (
                  <li key={window.id}>
                    <p>
                      <strong>{window.label}</strong> - {window.day}{" "}
                      {window.startHourUtc}:00 UTC
                    </p>
                    <span>
                      {window.platform.toUpperCase()} | {window.durationHours}h
                      | Goal: {window.goal}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Campaign Performance">
              <div className="surface-table-wrap">
                <Table
                  columns={[
                    { header: "Campaign", key: "campaign" },
                    { header: "Scheduled", key: "scheduledPosts" },
                    { header: "Published", key: "publishedPosts" },
                    { header: "Engagement", key: "engagementRate" },
                  ]}
                  rows={data.scheduler.campaignPerformance.map((campaign) => ({
                    campaign: campaign.campaign,
                    scheduledPosts: campaign.scheduledPosts,
                    publishedPosts: campaign.publishedPosts,
                    engagementRate: `${campaign.engagementRate.toFixed(1)}%`,
                  }))}
                />
              </div>
            </Card>
          </div>
        </PageSection>
        <PageSection>
          <Card title="Scheduled Queue">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Title", key: "title" },
                  { header: "Platform", key: "platform" },
                  { header: "Campaign", key: "campaign" },
                  { header: "Status", key: "status" },
                  { header: "When", key: "scheduledFor" },
                  { header: "Reach", key: "estimatedReach" },
                ]}
                rows={queueRows}
              />
            </div>
          </Card>
        </PageSection>
        <PageSection>
          <Card title="Content Assets">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Asset", key: "fileName" },
                  { header: "Type", key: "mediaType" },
                  { header: "Status", key: "status" },
                  { header: "Created", key: "createdAt" },
                ]}
                rows={rows}
              />
            </div>
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
