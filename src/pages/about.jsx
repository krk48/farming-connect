export default function About() {
  return (
    <div className="page">
      <div className="page-container">
        <section className="page-hero">
          <div className="hero-kicker">About Agrova</div>
          <h1 className="hero-title mt-4 text-4xl md:text-6xl">A farming platform built around visible momentum.</h1>
          <p className="hero-subtitle mt-4 text-base md:text-lg">
            Agrova is designed to make agricultural progress readable. Farmers publish real field updates,
            experts turn knowledge into guidance, and admins maintain trust across the network.
          </p>

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Farmer Role</div>
              <div className="metric-value">Track</div>
              <div className="metric-note">Turn scattered progress into a visible field record.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Expert Role</div>
              <div className="metric-value">Guide</div>
              <div className="metric-note">Publish practical advice where farmers will actually see it.</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Admin Role</div>
              <div className="metric-value">Protect</div>
              <div className="metric-note">Keep the ecosystem reliable, useful, and moderation-ready.</div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="surface panel">
            <div className="section-title-row">
              <div>
                <div className="eyebrow">Vision</div>
                <h2 className="section-title mt-3">From guesswork to shared confidence</h2>
              </div>
            </div>
            <p className="section-copy">
              Agriculture works better when information is not trapped in private messages, memory, or isolated
              expertise. Agrova makes updates, advice, and oversight visible in one continuous product flow.
            </p>
          </section>

          <section className="surface panel">
            <div className="section-title-row">
              <div>
                <div className="eyebrow">System Design</div>
                <h2 className="section-title mt-3">One feed, multiple perspectives</h2>
              </div>
            </div>
            <div className="pill-row">
              <span className="soft-pill">Farmer journaling</span>
              <span className="soft-pill">Expert publishing</span>
              <span className="soft-pill">Admin moderation</span>
              <span className="soft-pill">Public trust</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
