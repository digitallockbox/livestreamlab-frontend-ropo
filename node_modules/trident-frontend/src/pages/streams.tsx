import { DashboardLayout } from "../layouts/DashboardLayout";

export default function StreamsPage(): JSX.Element {
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
          <h1 style={{ margin: 0, fontSize: "30px" }}>My Streams</h1>
          <button
            style={{
              border: 0,
              borderRadius: "10px",
              padding: "10px 14px",
              background: "#22c55e",
              color: "#052e16",
              fontWeight: 700,
            }}
          >
            Start Stream
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
          Schedule, status, replay links, and stream health checks appear here.
        </div>
      </section>
    </DashboardLayout>
  );
}
