import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useApiData } from "../hooks/useApiData";
import { dashboardApi } from "../utils/dashboardApi";
import { Button, Card, ErrorState, Skeleton, Table } from "../components/ui";

export default function SettingsPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getSettings,
    "Could not load settings",
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
              title="Settings unavailable"
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

  const approvedDocs = data.identityTrust.documents.filter(
    (doc) => doc.status === "approved",
  ).length;
  const verifiedWallets = data.identityTrust.linkedWallets.filter(
    (wallet) => wallet.verified,
  ).length;
  const highRiskEvents = data.identityTrust.sessionEvents.filter(
    (event) => event.risk === "high",
  ).length;

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Identity Trust Center"
          subtitle="KYC workflow, trust signals, and account security posture"
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <div className="metric-strip">
            <article className="metric-tile">
              <p className="metric-tile-label">KYC Status</p>
              <p className="metric-tile-value">
                {data.identityTrust.kycStatus.toUpperCase()}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Trust Tier</p>
              <p className="metric-tile-value">
                {data.identityTrust.trustTier.toUpperCase()}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Risk Score</p>
              <p className="metric-tile-value">
                {data.identityTrust.riskScore}
              </p>
            </article>
            <article className="metric-tile">
              <p className="metric-tile-label">Approved Documents</p>
              <p className="metric-tile-value">{approvedDocs}</p>
            </article>
          </div>
        </PageSection>
        <PageSection>
          <div className="page-grid">
            <Card title="Creator Profile">
              <ul className="identity-inline-list">
                <li>
                  <strong>Name:</strong> {data.profile.displayName}
                </li>
                <li>
                  <strong>Email:</strong> {data.profile.email}
                </li>
                <li>
                  <strong>Timezone:</strong> {data.profile.timezone}
                </li>
              </ul>
            </Card>
            <Card title="Security Controls">
              <ul className="identity-inline-list">
                <li>
                  <strong>2FA:</strong>{" "}
                  {data.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                </li>
                <li>
                  <strong>API Keys:</strong>{" "}
                  {data.security.apiKeysEnabled ? "Enabled" : "Disabled"}
                </li>
                <li>
                  <strong>Hardware Key:</strong>{" "}
                  {data.security.hardwareKeyEnabled ? "Enabled" : "Disabled"}
                </li>
                <li>
                  <strong>Wallet Signature Required:</strong>{" "}
                  {data.security.walletSignatureRequired
                    ? "Enabled"
                    : "Disabled"}
                </li>
              </ul>
            </Card>
            <Card title="Verification Workflow">
              <p className="identity-next-action">
                {data.identityTrust.nextAction}
              </p>
              <p className="identity-meta-line">
                Submitted:{" "}
                {new Date(
                  data.identityTrust.submittedAt ?? "",
                ).toLocaleString()}
              </p>
              <p className="identity-meta-line">
                Last Review:{" "}
                {new Date(data.identityTrust.reviewedAt ?? "").toLocaleString()}
              </p>
            </Card>
          </div>
        </PageSection>
        <PageSection>
          <Card title="KYC Document Queue">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Document", key: "type" },
                  { header: "Status", key: "status" },
                  { header: "Uploaded", key: "uploadedAt" },
                  { header: "Note", key: "note" },
                ]}
                rows={data.identityTrust.documents.map((doc) => ({
                  type: doc.type,
                  status: doc.status,
                  uploadedAt: new Date(doc.uploadedAt).toLocaleString(),
                  note: doc.note ?? "-",
                }))}
              />
            </div>
          </Card>
        </PageSection>
        <PageSection>
          <div className="page-grid">
            <Card title="Linked Wallets">
              <p className="identity-meta-line">
                Verified wallets: {verifiedWallets}/
                {data.identityTrust.linkedWallets.length}
              </p>
              <div className="surface-table-wrap">
                <Table
                  columns={[
                    { header: "Address", key: "address" },
                    { header: "Network", key: "network" },
                    { header: "Verified", key: "verified" },
                    { header: "At", key: "verifiedAt" },
                  ]}
                  rows={data.identityTrust.linkedWallets.map((wallet) => ({
                    address: wallet.address,
                    network: wallet.network,
                    verified: wallet.verified ? "Yes" : "No",
                    verifiedAt: wallet.verifiedAt
                      ? new Date(wallet.verifiedAt).toLocaleString()
                      : "-",
                  }))}
                />
              </div>
            </Card>
            <Card title="Trust Signals">
              <div className="surface-table-wrap">
                <Table
                  columns={[
                    { header: "Signal", key: "signal" },
                    { header: "Impact", key: "scoreImpact" },
                    { header: "Status", key: "status" },
                  ]}
                  rows={data.identityTrust.trustSignals.map((signal) => ({
                    signal: signal.signal,
                    scoreImpact:
                      signal.scoreImpact > 0
                        ? `+${signal.scoreImpact}`
                        : signal.scoreImpact,
                    status: signal.status,
                  }))}
                />
              </div>
            </Card>
          </div>
        </PageSection>
        <PageSection>
          <Card title="Session Risk Timeline">
            <p className="identity-meta-line">
              High-risk events: {highRiskEvents}
            </p>
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Event", key: "event" },
                  { header: "Location", key: "location" },
                  { header: "IP", key: "ip" },
                  { header: "Risk", key: "risk" },
                  { header: "Time", key: "at" },
                ]}
                rows={data.identityTrust.sessionEvents.map((session) => ({
                  event: session.event,
                  location: session.location,
                  ip: session.ip,
                  risk: session.risk,
                  at: new Date(session.at).toLocaleString(),
                }))}
              />
            </div>
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
