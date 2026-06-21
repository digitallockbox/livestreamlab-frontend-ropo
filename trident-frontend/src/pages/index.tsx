export default function HomePage(): JSX.Element {
  return (
    <main className="home-page">
      <section className="home-hero">
        <h1 className="home-title">livestreamlab.live</h1>
        <p className="home-subtitle">Creator operations dashboard</p>
        <a href="/dashboard" className="home-link">
          Open Dashboard
        </a>
      </section>
    </main>
  );
}
