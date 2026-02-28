"use client";

import { useState, useEffect } from "react";

interface NEOItem {
    id: string;
    name: string;
    nasa_jpl_url: string;
    absolute_magnitude_h: number;
    estimated_diameter: {
        kilometers: {
            estimated_diameter_min: number;
            estimated_diameter_max: number;
        };
    };
    is_potentially_hazardous_asteroid: boolean;
    close_approach_data: {
        close_approach_date: string;
        relative_velocity: {
            kilometers_per_hour: string;
        };
        miss_distance: {
            kilometers: string;
        };
    }[];
}

export default function AsteroidsPage() {
    const [neos, setNeos] = useState<NEOItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const today = new Date().toISOString().split("T")[0];
    const threeDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const [startDate, setStartDate] = useState(threeDaysAgo);
    const [endDate, setEndDate] = useState(today);

    const fetchNEOs = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `/api/asteroids?start_date=${startDate}&end_date=${endDate}`
            );
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setNeos(data);
        } catch {
            setError(
                "Failed to load asteroid data. The date range must be 7 days or less."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNEOs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="page-header">
                <h1 className="page-header-title">
                    ☄️ Near-Earth{" "}
                    <span className="hero-title-gradient">Asteroids</span>
                </h1>
                <p className="page-header-subtitle">
                    Track asteroids passing close to Earth. See their size, speed, distance,
                    and potential hazard status in real-time.
                </p>
            </div>

            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    {/* Date Controls */}
                    <div className="date-picker-wrapper" id="asteroid-controls">
                        <label style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                            From:
                        </label>
                        <input
                            type="date"
                            className="date-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            id="asteroid-start-date"
                        />
                        <label style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                            To:
                        </label>
                        <input
                            type="date"
                            className="date-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            id="asteroid-end-date"
                        />
                        <button
                            className="btn btn-primary"
                            onClick={fetchNEOs}
                            id="asteroid-search-btn"
                        >
                            🔍 Search
                        </button>
                    </div>

                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner" />
                            <div className="loading-text">Scanning near-Earth space...</div>
                        </div>
                    )}

                    {error && (
                        <div className="error-container">
                            <div className="error-icon">⚠️</div>
                            <p className="error-message">{error}</p>
                        </div>
                    )}

                    {!loading && !error && neos.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🛸</div>
                            <p>No asteroids found for this date range.</p>
                        </div>
                    )}

                    {!loading && !error && neos.length > 0 && (
                        <>
                            <p
                                style={{
                                    textAlign: "center",
                                    color: "var(--text-muted)",
                                    fontSize: "0.85rem",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                Found {neos.length} near-Earth objects
                            </p>

                            <div className="neo-table-wrapper" id="neo-table">
                                <table className="neo-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Date</th>
                                            <th>Diameter (km)</th>
                                            <th>Velocity (km/h)</th>
                                            <th>Miss Distance (km)</th>
                                            <th>Hazard</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {neos.map((neo) => (
                                            <tr key={neo.id}>
                                                <td>
                                                    <a
                                                        href={neo.nasa_jpl_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: "var(--accent-blue)",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        {neo.name}
                                                    </a>
                                                </td>
                                                <td>
                                                    {neo.close_approach_data[0]?.close_approach_date || "—"}
                                                </td>
                                                <td>
                                                    {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
                                                        3
                                                    )}{" "}
                                                    –{" "}
                                                    {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
                                                        3
                                                    )}
                                                </td>
                                                <td>
                                                    {Number(
                                                        neo.close_approach_data[0]?.relative_velocity
                                                            .kilometers_per_hour
                                                    ).toLocaleString(undefined, {
                                                        maximumFractionDigits: 0,
                                                    })}
                                                </td>
                                                <td>
                                                    {Number(
                                                        neo.close_approach_data[0]?.miss_distance.kilometers
                                                    ).toLocaleString(undefined, {
                                                        maximumFractionDigits: 0,
                                                    })}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`hazard-badge ${neo.is_potentially_hazardous_asteroid
                                                            ? "dangerous"
                                                            : "safe"
                                                            }`}
                                                    >
                                                        {neo.is_potentially_hazardous_asteroid
                                                            ? "⚠ Hazardous"
                                                            : "✓ Safe"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
