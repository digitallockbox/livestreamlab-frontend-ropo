import { DashboardLayout } from "../layouts/DashboardLayout";
import { dashboardApi } from "../utils/dashboardApi";

const handleRefreshPreview = async (): Promise<void> => {
  try {
    const payload = await dashboardApi.getEarnings();
    console.log("Earnings payload", payload);
  } catch (error) {
    console.error("Failed to load /api/earnings", error);
  }
};

export default function EarningsPage(): JSX.Element {
  return (
    <DashboardLayout>
      <section style={{ padding: "28px", display: "grid", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "30px" }}>Earnings & Payouts</h1>
          <button
            type="button"
            onClick={handleRefreshPreview}
            style={{
              border: 0,
              borderRadius: "10px",
              padding: "10px 14px",
              background: "#f59e0b",
              color: "#1f2937",
              fontWeight: 700,
            }}
          >
            Refresh Preview
          </button>
        </div>
        <div
          style={{
            border: "1px solid #1f2937",
            borderRadius: "14px",
            background: "#0d1520",
            padding: "16px",
          }}
        >
          Balance, pending payout queue, and payout history table appear here.
          Use Refresh Preview to validate the contract for /api/earnings.
        </div>
      </section>
    </DashboardLayout>
  );
}
