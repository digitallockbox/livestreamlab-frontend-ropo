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
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="sidebar-kicker">Creator Console</p>
        <h2 className="sidebar-title">livestreamlab.live</h2>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="sidebar-link">
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-status">
        <p className="sidebar-status-label">Live API</p>
        <p className="sidebar-status-value">api.livestreamlab.live:8080</p>
      </div>
    </aside>
  );
}
