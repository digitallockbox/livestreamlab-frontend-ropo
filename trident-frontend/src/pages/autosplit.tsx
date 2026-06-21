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
  Select,
  Skeleton,
  Table,
} from "../components/ui";

type AllocationRow = {
  party: string;
  wallet: string;
  percentage: number;
};

export default function AutoSplitPage(): JSX.Element {
  const { data, isLoading, error, reload } = useApiData(
    dashboardApi.getAutoSplitRules,
    "Could not load autosplit rules",
  );
  const [activeRuleId, setActiveRuleId] = useState("rule-001");

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
              title="Autosplit unavailable"
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

  const activeRule =
    data.rules.find((rule) => rule.id === activeRuleId) ?? data.rules[0];
  const allocations: AllocationRow[] = (activeRule?.allocations ?? []).map(
    (entry) => ({
      party: entry.party,
      wallet: entry.wallet,
      percentage: entry.percentage,
    }),
  );

  const ruleRows = data.rules.map((rule) => ({
    name: rule.name,
    trigger: rule.trigger.description,
    status: rule.isEnabled ? "Enabled" : "Disabled",
    updatedAt: new Date(rule.updatedAt).toLocaleString(),
  }));

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="AutoSplit Rules"
          actions={
            <div className="page-header-actions">
              <Button variant="primary">New Rule</Button>
              <Button variant="ghost" onClick={() => void reload()}>
                Refresh
              </Button>
            </div>
          }
        />
        <PageSection>
          <Card title="Rule Builder">
            <div className="autosplit-editor-grid">
              <div>
                <p className="overlay-field-label">Active Rule</p>
                <Select
                  ariaLabel="Active autosplit rule"
                  value={activeRule?.id ?? ""}
                  onChange={setActiveRuleId}
                  options={data.rules.map((rule) => ({
                    value: rule.id,
                    label: rule.name,
                  }))}
                />
              </div>
              <div>
                <p className="overlay-field-label">Trigger Type</p>
                <p className="overlay-token-value">
                  {activeRule?.trigger.type ?? "default"}
                </p>
              </div>
              <div>
                <p className="overlay-field-label">Condition</p>
                <p className="overlay-token-value">
                  {activeRule?.trigger.operator ?? "eq"}{" "}
                  {activeRule?.trigger.value ?? 1}
                </p>
              </div>
            </div>
          </Card>
        </PageSection>
        <PageSection>
          <Card title="Conditional Rules">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Rule", key: "name" },
                  { header: "Trigger", key: "trigger" },
                  { header: "Status", key: "status" },
                  { header: "Updated", key: "updatedAt" },
                ]}
                rows={ruleRows}
              />
            </div>
          </Card>
        </PageSection>
        <PageSection>
          <Card title="Multi-Party Allocation">
            <div className="surface-table-wrap">
              <Table
                columns={[
                  { header: "Party", key: "party" },
                  { header: "Wallet", key: "wallet" },
                  { header: "Split %", key: "percentage" },
                ]}
                rows={allocations}
              />
            </div>
          </Card>
        </PageSection>
        <PageSection>
          <div className="page-grid">
            <Card title="Rule History">
              <ul className="autosplit-history-list">
                {data.ruleHistory.map((entry) => (
                  <li key={entry.id}>
                    <p>
                      <strong>{entry.action.toUpperCase()}</strong> -{" "}
                      {entry.summary}
                    </p>
                    <span>{new Date(entry.at).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Simulation Preview">
              <p className="autosplit-sim-header">
                Sample Revenue: ${data.simulation.sampleRevenue.toFixed(2)}
              </p>
              <p className="autosplit-sim-subheader">
                Applied Rule: {data.simulation.appliedRuleId}
              </p>
              <div className="surface-table-wrap">
                <Table
                  columns={[
                    { header: "Party", key: "party" },
                    { header: "Percent", key: "percentage" },
                    { header: "Payout", key: "amount" },
                  ]}
                  rows={data.simulation.result.map((row) => ({
                    party: row.party,
                    percentage: `${row.percentage}%`,
                    amount: `$${row.amount.toFixed(2)}`,
                  }))}
                />
              </div>
            </Card>
          </div>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
