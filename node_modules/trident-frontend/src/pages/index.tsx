export default function HomePage(): JSX.Element {
  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top, #1a2a1f 0%, #0b1114 50%, #05080b 100%)",
        color: "#f3f4f6",
      }}
    >
      <section style={{ textAlign: "center", display: "grid", gap: "10px" }}>
        <h1 style={{ margin: 0, fontSize: "42px" }}>livestreamlab.live</h1>
        <p style={{ margin: 0, color: "#9ca3af" }}>
          Creator operations dashboard
        </p>
        <a
          href="/dashboard"
          style={{
            color: "#ecfeff",
            textDecoration: "none",
            background: "#0ea5e9",
            borderRadius: "10px",
            padding: "10px 14px",
            display: "inline-block",
            fontWeight: 700,
          }}
        >
          Open Dashboard
        </a>
      </section>
    </main>
  );
}
