import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { Button, ErrorState, Skeleton, Table } from "../components/ui";

type AffiliateRow = {
  productName: string;
  clicks: number;
  conversions: number;
  earnings: number;
};

export default function AffiliatePage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getAffiliate,
    "Could not load affiliate metrics",
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
              title="Affiliate data unavailable"
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

  const rows: AffiliateRow[] = data.links.map((link) => ({
    productName: link.productName,
    clicks: link.clicks,
    conversions: link.conversions,
    earnings: link.earnings,
  }));

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Affiliate Hub"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <Table
            columns={[
              { header: "Product", key: "productName" },
              { header: "Clicks", key: "clicks" },
              { header: "Conversions", key: "conversions" },
              { header: "Earnings", key: "earnings" },
            ]}
            rows={rows}
          />
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
