import { DashboardLayout } from "../layouts/DashboardLayout";

const cards = [
  { title: "Today Earnings", value: "$2,410.38", hint: "+12.3% vs yesterday" },
  {
    title: "Live Status",
    value: "Streaming Offline",
    hint: "Next stream in 2h 10m",
  },
  {
    title: "Notifications",
    value: "7 New Alerts",
    hint: "2 payout + 5 affiliate",
  },
];

export default function DashboardHome(): JSX.Element {
  return (
    <DashboardLayout>
      <section style={{ padding: "28px", display: "grid", gap: "18px" }}>
        <h1 style={{ margin: 0, fontSize: "30px" }}>Today</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {cards.map((card) => (
            <article
              key={card.title}
              style={{
                border: "1px solid #1f2937",
                borderRadius: "14px",
                padding: "14px",
                background: "#0d1520",
              }}
            >
              <p style={{ margin: 0, color: "#93c5fd", fontSize: "13px" }}>
                {card.title}
              </p>
              <h2 style={{ margin: "8px 0", fontSize: "24px" }}>
                {card.value}
              </h2>
              <p style={{ margin: 0, color: "#9ca3af", fontSize: "13px" }}>
                {card.hint}
              </p>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
