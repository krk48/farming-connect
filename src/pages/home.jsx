import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero-real w-full flex items-center text-center px-6">
      <div className="hero-content">
        <div className="hero-chip mb-5">Smart Agriculture Network</div>

        <h1 className="hero-title hero-home-title font-extrabold text-4xl md:text-6xl leading-tight drop-shadow-lg">
          Agriculture that feels coordinated, modern, and alive.
        </h1>

        <p className="hero-home-copy text-base md:text-xl mt-5 max-w-3xl mx-auto">
          Agrova turns crop updates, expert insight, and platform moderation into one visible system.
          Farmers document progress, experts publish high-signal advice, and the public sees a living feed
          instead of a static platform.
        </p>

        <div className="pill-row justify-center mt-8">
          <span className="soft-pill hero-home-pill">Field Journals</span>
          <span className="soft-pill hero-home-pill">Expert Intelligence</span>
          <span className="soft-pill hero-home-pill">Public Trust Layer</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <button onClick={() => navigate("/login")} className="btn-hero-primary">
            Enter Dashboard
          </button>

          <button onClick={() => navigate("/public")} className="btn-hero-secondary">
            Explore Public Feed
          </button>

          <button onClick={() => navigate("/about")} className="btn-hero-secondary">
            Learn More
          </button>
        </div>

        <div className="metric-grid mt-12">
          <div className="metric-card text-left">
            <div className="metric-label">For Farmers</div>
            <div className="metric-value">Visual</div>
            <div className="metric-note">Share progress in a way experts can act on immediately.</div>
          </div>
          <div className="metric-card text-left">
            <div className="metric-label">For Experts</div>
            <div className="metric-value">Clear</div>
            <div className="metric-note">Publish guidance that stays visible across the full ecosystem.</div>
          </div>
          <div className="metric-card text-left">
            <div className="metric-label">For Admins</div>
            <div className="metric-value">Control</div>
            <div className="metric-note">Moderate everything from one high-signal operational layer.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
