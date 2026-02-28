import Link from "next/link";
import Image from "next/image";
import { planets } from "@/lib/nasa";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Planets — Gravity",
    description:
        "Explore all 8 planets of our Solar System. Learn about their size, atmosphere, moons, and fascinating facts.",
};

export default function PlanetsPage() {
    return (
        <>
            <div className="page-header">
                <h1 className="page-header-title">
                    🪐 Solar System{" "}
                    <span className="hero-title-gradient">Planets</span>
                </h1>
                <p className="page-header-subtitle">
                    From the scorching surface of Mercury to the icy winds of Neptune —
                    explore every planet in our cosmic neighborhood.
                </p>
            </div>

            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="planets-grid">
                        {planets.map((planet) => (
                            <Link
                                href={`/planets/${planet.id}`}
                                key={planet.id}
                                className="planet-card"
                                id={`planets-page-card-${planet.id}`}
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
                </div>
            </section>
        </>
    );
}
