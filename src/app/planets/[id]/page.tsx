import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPlanetById, planets } from "@/lib/nasa";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
    return planets.map((planet) => ({ id: planet.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const planet = getPlanetById(id);
    if (!planet) return { title: "Planet Not Found — Gravity" };
    return {
        title: `${planet.name} — Gravity`,
        description: planet.description,
    };
}

export default async function PlanetDetailPage({ params }: Props) {
    const { id } = await params;
    const planet = getPlanetById(id);

    if (!planet) {
        notFound();
    }

    return (
        <div className="planet-detail" id={`planet-detail-${planet.id}`}>
            <div className="container">
                <Link href="/planets" className="back-btn" id="back-to-planets">
                    ← Back to Planets
                </Link>

                <div className="planet-detail-grid">
                    {/* Visual */}
                    <div className="planet-visual">
                        <div className="planet-orbit-ring" />
                        <div
                            className="planet-sphere"
                        // style={{ background: planet.gradient }}
                        >
                            <Image
                                src={planet.image}
                                alt={planet.name}
                                width={250}
                                height={250}
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "50%",
                                    filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.6))"
                                }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="planet-detail-info">
                        <h1 className="planet-detail-name">{planet.name}</h1>
                        <div className="planet-detail-type">{planet.type}</div>
                        <p className="planet-detail-desc">{planet.description}</p>

                        <div className="planet-stats-grid">
                            <div className="planet-stat-card">
                                <div className="planet-stat-label">Diameter</div>
                                <div className="planet-stat-value">{planet.diameter}</div>
                            </div>
                            <div className="planet-stat-card">
                                <div className="planet-stat-label">Mass</div>
                                <div className="planet-stat-value">{planet.mass}</div>
                            </div>
                            <div className="planet-stat-card">
                                <div className="planet-stat-label">Distance from Sun</div>
                                <div className="planet-stat-value">{planet.distanceFromSun}</div>
                            </div>
                            <div className="planet-stat-card">
                                <div className="planet-stat-label">Orbital Period</div>
                                <div className="planet-stat-value">{planet.orbitalPeriod}</div>
                            </div>
                            <div className="planet-stat-card">
                                <div className="planet-stat-label">Day Length</div>
                                <div className="planet-stat-value">{planet.dayLength}</div>
                            </div>
                            <div className="planet-stat-card">
                                <div className="planet-stat-label">Known Moons</div>
                                <div className="planet-stat-value">{planet.moons}</div>
                            </div>
                            <div className="planet-stat-card">
                                <div className="planet-stat-label">Temperature</div>
                                <div className="planet-stat-value">{planet.temperature}</div>
                            </div>
                            <div className="planet-stat-card">
                                <div className="planet-stat-label">Atmosphere</div>
                                <div className="planet-stat-value" style={{ fontSize: "0.95rem" }}>
                                    {planet.atmosphere}
                                </div>
                            </div>
                        </div>

                        {/* Fun Fact */}
                        <div
                            style={{
                                marginTop: "2rem",
                                padding: "1.25rem",
                                background: "rgba(59, 130, 246, 0.08)",
                                border: "1px solid rgba(59, 130, 246, 0.15)",
                                borderRadius: "var(--radius-md)",
                            }}
                        >
                            <div style={{ fontSize: "0.75rem", color: "var(--accent-blue)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>
                                💡 Fun Fact
                            </div>
                            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                                {planet.funFact}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
