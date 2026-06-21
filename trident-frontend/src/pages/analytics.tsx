import { DashboardLayout } from "../layouts/DashboardLayout";

export default function AnalyticsPage(): JSX.Element {
  return (
    <DashboardLayout>
      <section style={{ padding: "28px", display: "grid", gap: "16px" }}>
        <h1 style={{ margin: 0, fontSize: "30px" }}>Analytics</h1>
        <div
          style={{
            border: "1px solid #1f2937",
            borderRadius: "14px",
            background: "#0d1520",
            padding: "16px",
          }}
        >
          <p style={{ margin: 0, color: "#93c5fd" }}>Charts</p>
          <p style={{ margin: "10px 0 0 0", color: "#d1d5db" }}>
            Views, watch time, conversion flow, and revenue snapshots go here.
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}
