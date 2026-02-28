import Link from "next/link";
import Image from "next/image";
import { getAPOD, planets } from "@/lib/nasa";

export default async function HomePage() {
  let apod = null;
  try {
    apod = await getAPOD();
  } catch {
    // fallback gracefully
  }

  return (
    <>
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot" />
            Powered by NASA Open APIs
          </div>

          <h1 className="hero-title">
            Explore the{" "}
            <span className="hero-title-gradient">Cosmos</span>
            <br />
            Like Never Before
          </h1>

          <p className="hero-subtitle">
            Dive into our Solar System, discover stunning space imagery, browse
            Mars rover photos, and track near-Earth asteroids — all powered by
            real NASA data.
          </p>

          <div className="hero-actions">
            <Link href="/planets" className="btn btn-primary" id="hero-explore-btn">
              🪐 Explore Planets
            </Link>
            <Link href="/apod" className="btn btn-secondary" id="hero-apod-btn">
              🌌 Picture of the Day
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">8</div>
              <div className="stat-label">Planets</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">200+</div>
              <div className="stat-label">Known Moons</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4.6B</div>
              <div className="stat-label">Years Old</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">∞</div>
              <div className="stat-label">To Explore</div>
            </div>
          </div>
        </div>
      </section>

      {/* APOD Preview */}
      {apod && (
        <section className="section" id="apod-preview">
          <div className="container">
            <div className="section-header">
              <div className="section-label">✨ NASA Highlight</div>
              <h2 className="section-title">Astronomy Picture of the Day</h2>
              <p className="section-subtitle">
                Each day a different image or video of our fascinating universe
                is featured, along with a brief explanation by a professional
                astronomer.
              </p>
            </div>

            <div className="apod-container">
              {apod.media_type === "image" ? (
                <div className="apod-image-wrapper">
                  <img
                    src={apod.url}
                    alt={apod.title}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ) : (
                <div className="apod-video-wrapper">
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    allowFullScreen
                  />
                </div>
              )}

              <div className="apod-info">
                <div className="apod-date">📅 {apod.date}</div>
                <h3 className="apod-title">{apod.title}</h3>
                <p className="apod-explanation">
                  {apod.explanation.length > 400
                    ? apod.explanation.slice(0, 400) + "..."
                    : apod.explanation}
                </p>
                {apod.copyright && (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    © {apod.copyright}
                  </p>
                )}
                <Link href="/apod" className="btn btn-primary" style={{ marginTop: "1rem" }} id="apod-explore-btn">
                  Explore Gallery →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Planets Preview */}
      <section className="section" id="planets-preview">
        <div className="container">
          <div className="section-header">
            <div className="section-label">🪐 Solar System</div>
            <h2 className="section-title">Our Celestial Neighbors</h2>
            <p className="section-subtitle">
              From scorching Mercury to icy Neptune, explore the eight planets
              that make up our Solar System.
            </p>
          </div>

          <div className="planets-grid">
            {planets.map((planet) => (
              <Link
                href={`/planets/${planet.id}`}
                key={planet.id}
                className="planet-card"
                id={`planet-card-${planet.id}`}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  aspectRatio: '1/1',
                  borderRadius: 0,
                  boxShadow: 'none'
                }}
              >
                <div className="planet-card-image" style={{ height: '100%', marginBottom: 0 }}>
                  <Image
                    src={planet.image}
                    alt={planet.name}
                    fill
                    style={{
                      objectFit: "cover",
                      borderRadius: 0
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/planets" className="btn btn-secondary" id="planets-view-all-btn">
              View All Planets →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-label">🚀 Features</div>
            <h2 className="section-title">What You Can Explore</h2>
            <p className="section-subtitle">
              Powered by NASA&apos;s open APIs, Gravity brings space data to
              your fingertips.
            </p>
          </div>

          <div className="features-grid">
            <Link href="/planets" className="feature-card" id="feature-planets">
              <div className="feature-icon blue">🪐</div>
              <h3 className="feature-title">Solar System Explorer</h3>
              <p className="feature-desc">
                Detailed profiles of all 8 planets with stats, facts, and
                stunning visuals. Learn about composition, atmosphere, and more.
              </p>
            </Link>

            <Link href="/apod" className="feature-card" id="feature-apod">
              <div className="feature-icon purple">🌌</div>
              <h3 className="feature-title">APOD Gallery</h3>
              <p className="feature-desc">
                Browse NASA&apos;s Astronomy Picture of the Day — a curated
                archive of mind-blowing space photography and videos.
              </p>
            </Link>

            <Link href="/mars" className="feature-card" id="feature-mars">
              <div className="feature-icon orange">🔴</div>
              <h3 className="feature-title">Mars Rover Photos</h3>
              <p className="feature-desc">
                See the Red Planet through the eyes of Curiosity, Opportunity,
                and Spirit. Browse thousands of real Mars surface images.
              </p>
            </Link>

            <Link href="/asteroids" className="feature-card" id="feature-asteroids">
              <div className="feature-icon cyan">☄️</div>
              <h3 className="feature-title">Asteroid Tracker</h3>
              <p className="feature-desc">
                Monitor near-Earth objects in real-time. See size, velocity, miss
                distance, and hazard status of passing asteroids.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
