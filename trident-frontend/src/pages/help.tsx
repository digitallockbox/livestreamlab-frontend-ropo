import { DashboardLayout } from "../layouts/DashboardLayout";

export default function HelpPage(): JSX.Element {
  return (
    <DashboardLayout>
      <section style={{ padding: "28px", display: "grid", gap: "16px" }}>
        <h1 style={{ margin: 0, fontSize: "30px" }}>Help Center</h1>
        <div
          style={{
            border: "1px solid #1f2937",
            borderRadius: "14px",
            background: "#0d1520",
            padding: "16px",
          }}
        >
          FAQs, docs shortcuts, and troubleshooting links appear here.
        </div>
      </section>
    </DashboardLayout>
  );
}
