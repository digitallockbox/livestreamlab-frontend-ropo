import { DashboardLayout } from "../layouts/DashboardLayout";

export default function AutoSplitPage(): JSX.Element {
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
          <h1 style={{ margin: 0, fontSize: "30px" }}>AutoSplit Rules</h1>
          <button
            style={{
              border: 0,
              borderRadius: "10px",
              padding: "10px 14px",
              background: "#3b82f6",
              color: "#eff6ff",
              fontWeight: 700,
            }}
          >
            New Rule
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
          Rule list, split preview, and editor modal mount point.
        </div>
      </section>
    </DashboardLayout>
  );
}
