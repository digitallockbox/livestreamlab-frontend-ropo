import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { Button, ErrorState, Skeleton, Table } from "../components/ui";

type AssetRow = {
  fileName: string;
  mediaType: string;
  createdAt: string;
};

export default function ContentPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getContent,
    "Could not load content",
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
    createdAt: new Date(asset.createdAt).toLocaleString(),
  }));

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Content Manager"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <Table
            columns={[
              { header: "Asset", key: "fileName" },
              { header: "Type", key: "mediaType" },
              { header: "Created", key: "createdAt" },
            ]}
            rows={rows}
          />
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
