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
  const [selectedProductId, setSelectedProductId] = useState("product-001");
  const [campaign, setCampaign] = useState("creator-launch");

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

  const selectedProduct =
    data.catalog.find((product) => product.id === selectedProductId) ??
    data.catalog[0];

  const generatedUrl = `${data.generator.baseUrl}/${selectedProduct?.name
    .toLowerCase()
    .replace(
      /\s+/g,
      "-",
    )}?campaign=${encodeURIComponent(campaign || data.generator.defaultCampaign)}`;

  const totalEarnings = data.links.reduce(
    (sum, link) => sum + link.earnings,
    0,
  );
  const totalClicks = data.links.reduce((sum, link) => sum + link.clicks, 0);
  const totalConversions = data.links.reduce(
    (sum, link) => sum + link.conversions,
    0,
  );

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Affiliate Hub"
          subtitle="Marketplace + conversion analytics + link generation"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <div className="metric-strip">
            <article className="metric-tile">
              <p className="metric-tile-label">Total Clicks</p>
              <p className="metric-tile-value">{totalClicks}</p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Total Conversions</p>
              <p className="metric-tile-value">{totalConversions}</p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Affiliate Earnings</p>
              <p className="metric-tile-value">${totalEarnings.toFixed(2)}</p>
            </article>
          </div>
        </PageSection>
        <PageSection>
          <Card title="Affiliate Link Generator">
            <div className="affiliate-generator-grid">
              <div>
                <p className="overlay-field-label">Product</p>
                <Select
                  ariaLabel="Select affiliate product"
                  value={selectedProduct?.id}
                  onChange={setSelectedProductId}
                  options={data.catalog.map((product) => ({
                    value: product.id,
                    label: `${product.name} ($${product.price})`,
                  }))}
                />
              </div>
              <div>
                <p className="overlay-field-label">Campaign</p>
                <Input
                  ariaLabel="Campaign name"
                  value={campaign}
                  onChange={setCampaign}
                  placeholder={data.generator.defaultCampaign}
                />
              </div>
            </div>
            <p className="affiliate-generated-url">{generatedUrl}</p>
          </Card>
        </PageSection>
        <PageSection>
          <div className="page-grid">
            <Card title="Product Catalog">
              <div className="surface-table-wrap">
                <Table
                  columns={[
                    { header: "Product", key: "name" },
                    { header: "Category", key: "category" },
                    { header: "Price", key: "price" },
                    { header: "Commission", key: "commissionRate" },
                  ]}
                  rows={data.catalog.map((product) => ({
                    name: product.name,
                    category: product.category,
                    price: `$${product.price.toFixed(2)}`,
                    commissionRate: `${(product.commissionRate * 100).toFixed(0)}%`,
                  }))}
                />
              </div>
            </Card>
            <Card title="Conversion Trend">
              <ul
                className="analytics-bar-list"
                aria-label="Affiliate conversion trend"
              >
                {data.conversionTrend.map((point) => (
                  <li key={point.label} className="analytics-bar-row">
                    <span className="analytics-bar-label">{point.label}</span>
                    <progress
                      className="analytics-progress-meter analytics-bar-meter"
                      value={Math.max(
                        0,
                        Math.min(
                          100,
                          Math.round((point.conversions / 16) * 100),
                        ),
                      )}
                      max={100}
                      aria-label={`${point.label} conversions`}
                    />
                    <span className="analytics-retention-value">
                      {point.conversions}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </PageSection>
        <PageSection>
          <Card title="Top Performing Products">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Product", key: "productName" },
                  { header: "Conversion Rate", key: "conversionRate" },
                  { header: "Earnings", key: "earnings" },
                ]}
                rows={data.topProducts.map((product) => ({
                  productName: product.productName,
                  conversionRate: `${product.conversionRate.toFixed(2)}%`,
                  earnings: `$${product.earnings.toFixed(2)}`,
                }))}
              />
            </div>
          </Card>
        </PageSection>
        <PageSection>
          <Card title="Affiliate Links">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Product", key: "productName" },
                  { header: "Clicks", key: "clicks" },
                  { header: "Conversions", key: "conversions" },
                  { header: "Earnings", key: "earnings" },
                ]}
                rows={rows.map((row) => ({
                  ...row,
                  earnings: `$${row.earnings.toFixed(2)}`,
                }))}
              />
            </div>
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
