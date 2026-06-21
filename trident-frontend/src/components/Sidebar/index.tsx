const NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/analytics", label: "Analytics" },
  { href: "/streams", label: "My Streams" },
  { href: "/earnings", label: "Earnings & Payouts" },
  { href: "/autosplit", label: "AutoSplit Rules" },
  { href: "/content", label: "Content Manager" },
  { href: "/affiliate", label: "Affiliate Hub" },
  { href: "/integrations", label: "Integrations" },
  { href: "/settings", label: "Settings" },
  { href: "/help", label: "Help Center" },
  { href: "/support", label: "Support" },
];

export function Sidebar(): JSX.Element {
  return (
    <aside
      style={{
        width: "280px",
        minWidth: "280px",
        borderRight: "1px solid #1f2937",
        background:
          "radial-gradient(circle at top left, #1a2a1f 0%, #0b1114 45%, #05080b 100%)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "24px 16px",
      }}
    >
      <div style={{ padding: "0 8px" }}>
        <p
          style={{
            margin: 0,
            color: "#86efac",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Creator Console
        </p>
        <h2 style={{ margin: "8px 0 0 0", fontSize: "24px", lineHeight: 1.2 }}>
          livestreamlab.live
        </h2>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              color: "#e5e7eb",
              textDecoration: "none",
              border: "1px solid #1f2937",
              background: "#0b1114",
              borderRadius: "10px",
              padding: "10px 12px",
              fontSize: "14px",
              lineHeight: 1.3,
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div
        style={{
          marginTop: "auto",
          border: "1px solid #1f2937",
          borderRadius: "12px",
          padding: "12px",
          background: "#0b1114",
        }}
      >
        <p style={{ margin: 0, color: "#93c5fd", fontSize: "12px" }}>
          Live API
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
          api.livestreamlab.live:8080
        </p>
      </div>
    </aside>
  );
}
