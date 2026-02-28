"use client";

import { useState, useEffect } from "react";
import type { APODData } from "@/lib/nasa";

export default function APODPage() {
    const [apodList, setApodList] = useState<APODData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedApod, setSelectedApod] = useState<APODData | null>(null);

    // Generate last 12 days
    const getLast12Days = () => {
        const dates: string[] = [];
        for (let i = 0; i < 12; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split("T")[0]);
        }
        return dates;
    };

    useEffect(() => {
        const fetchAPOD = async () => {
            setLoading(true);
            setError("");
            try {
                const dates = getLast12Days();
                const startDate = dates[dates.length - 1];
                const endDate = dates[0];
                const res = await fetch(
                    `/api/apod?start_date=${startDate}&end_date=${endDate}`
                );
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setApodList(
                    Array.isArray(data) ? data.reverse() : [data]
                );
            } catch {
                setError("Failed to load APOD data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAPOD();
    }, []);

    return (
        <>
            <div className="page-header">
                <h1 className="page-header-title">
                    🌌 Astronomy{" "}
                    <span className="hero-title-gradient">Picture of the Day</span>
                </h1>
                <p className="page-header-subtitle">
                    A curated gallery of breathtaking space images, each hand-picked by
                    NASA astronomers. Updated daily.
                </p>
            </div>

            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner" />
                            <div className="loading-text">
                                Fetching images from deep space...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error-container">
                            <div className="error-icon">⚠️</div>
                            <p className="error-message">{error}</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => window.location.reload()}
                                id="apod-retry-btn"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="gallery-grid">
                            {apodList.map((item) => (
                                <div
                                    key={item.date}
                                    className="gallery-card"
                                    onClick={() => setSelectedApod(item)}
                                    style={{ cursor: "pointer" }}
                                    id={`apod-card-${item.date}`}
                                >
                                    {item.media_type === "image" ? (
                                        <img
                                            src={item.url}
                                            alt={item.title}
                                            className="gallery-image"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div
                                            className="gallery-image"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "var(--bg-secondary)",
                                                fontSize: "3rem",
                                            }}
                                        >
                                            🎬
                                        </div>
                                    )}
                                    <div className="gallery-content">
                                        <div className="gallery-date">📅 {item.date}</div>
                                        <h3 className="gallery-title">{item.title}</h3>
                                        <p className="gallery-desc">{item.explanation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal */}
            {selectedApod && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 200,
                        background: "rgba(0,0,0,0.85)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        cursor: "pointer",
                    }}
                    onClick={() => setSelectedApod(null)}
                    id="apod-modal-backdrop"
                >
                    <div
                        style={{
                            maxWidth: "900px",
                            width: "100%",
                            maxHeight: "90vh",
                            overflow: "auto",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-xl)",
                            cursor: "default",
                        }}
                        onClick={(e) => e.stopPropagation()}
                        id="apod-modal"
                    >
                        {selectedApod.media_type === "image" ? (
                            <img
                                src={selectedApod.hdurl || selectedApod.url}
                                alt={selectedApod.title}
                                style={{
                                    width: "100%",
                                    borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
                                }}
                            />
                        ) : (
                            <div style={{ padding: "1rem" }}>
                                <iframe
                                    src={selectedApod.url}
                                    title={selectedApod.title}
                                    allowFullScreen
                                    style={{
                                        width: "100%",
                                        aspectRatio: "16/9",
                                        border: "none",
                                        borderRadius: "var(--radius-md)",
                                    }}
                                />
                            </div>
                        )}
                        <div style={{ padding: "1.5rem" }}>
                            <div className="gallery-date">📅 {selectedApod.date}</div>
                            <h2
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    margin: "0.5rem 0 1rem",
                                }}
                            >
                                {selectedApod.title}
                            </h2>
                            <p
                                style={{
                                    color: "var(--text-secondary)",
                                    fontSize: "0.95rem",
                                    lineHeight: 1.8,
                                }}
                            >
                                {selectedApod.explanation}
                            </p>
                            {selectedApod.copyright && (
                                <p
                                    style={{
                                        marginTop: "1rem",
                                        fontSize: "0.8rem",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    © {selectedApod.copyright}
                                </p>
                            )}

                            <button
                                className="btn btn-secondary"
                                style={{ marginTop: "1.5rem" }}
                                onClick={() => setSelectedApod(null)}
                                id="apod-modal-close"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
