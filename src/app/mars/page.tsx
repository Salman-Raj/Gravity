"use client";

import { useState, useEffect } from "react";
import type { MarsPhoto } from "@/lib/nasa";

const rovers = [
    { name: "Curiosity", id: "curiosity", defaultSol: 1000 },
    { name: "Opportunity", id: "opportunity", defaultSol: 1000 },
    { name: "Spirit", id: "spirit", defaultSol: 1000 },
];

export default function MarsPage() {
    const [activeRover, setActiveRover] = useState(rovers[0]);
    const [photos, setPhotos] = useState<MarsPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sol, setSol] = useState(1000);
    const [page, setPage] = useState(1);
    const [selectedPhoto, setSelectedPhoto] = useState<MarsPhoto | null>(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(
                    `/api/mars?rover=${activeRover.id}&sol=${sol}&page=${page}`
                );
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setPhotos(data);
            } catch {
                setError("Failed to load Mars photos. Try a different sol or rover.");
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [activeRover, sol, page]);

    return (
        <>
            <div className="page-header">
                <h1 className="page-header-title">
                    🔴 Mars{" "}
                    <span className="hero-title-gradient">Rover Photos</span>
                </h1>
                <p className="page-header-subtitle">
                    See the Red Planet through the eyes of NASA&apos;s rovers. Browse
                    thousands of real images from the Martian surface.
                </p>
            </div>

            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    {/* Rover Tabs */}
                    <div className="rover-tabs" id="rover-selector">
                        {rovers.map((r) => (
                            <button
                                key={r.id}
                                className={`rover-tab ${activeRover.id === r.id ? "active" : ""}`}
                                onClick={() => {
                                    setActiveRover(r);
                                    setSol(r.defaultSol);
                                    setPage(1);
                                }}
                                id={`rover-tab-${r.id}`}
                            >
                                {r.name}
                            </button>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="date-picker-wrapper" id="mars-controls">
                        <label style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                            Sol (Martian Day):
                        </label>
                        <input
                            type="number"
                            className="date-input"
                            value={sol}
                            onChange={(e) => {
                                setSol(Number(e.target.value));
                                setPage(1);
                            }}
                            min={0}
                            max={4000}
                            id="sol-input"
                        />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                className="page-btn"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                                id="mars-prev-page"
                            >
                                ← Prev
                            </button>
                            <span
                                style={{
                                    color: "var(--text-muted)",
                                    alignSelf: "center",
                                    fontSize: "0.85rem",
                                }}
                            >
                                Page {page}
                            </span>
                            <button
                                className="page-btn"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={photos.length === 0}
                                id="mars-next-page"
                            >
                                Next →
                            </button>
                        </div>
                    </div>

                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner" />
                            <div className="loading-text">
                                Receiving transmission from Mars...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error-container">
                            <div className="error-icon">📡</div>
                            <p className="error-message">{error}</p>
                        </div>
                    )}

                    {!loading && !error && photos.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🏜️</div>
                            <p>No photos found for Sol {sol}. Try a different sol value.</p>
                        </div>
                    )}

                    {!loading && !error && photos.length > 0 && (
                        <div className="gallery-grid">
                            {photos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="gallery-card"
                                    onClick={() => setSelectedPhoto(photo)}
                                    style={{ cursor: "pointer" }}
                                    id={`mars-photo-${photo.id}`}
                                >
                                    <img
                                        src={photo.img_src}
                                        alt={`Mars - ${photo.camera.full_name}`}
                                        className="gallery-image"
                                        loading="lazy"
                                    />
                                    <div className="gallery-content">
                                        <div className="gallery-date">📅 {photo.earth_date}</div>
                                        <h3 className="gallery-title">{photo.camera.full_name}</h3>
                                        <p className="gallery-desc">
                                            Rover: {photo.rover.name} · Sol {photo.sol} · Camera:{" "}
                                            {photo.camera.name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Photo Modal */}
            {selectedPhoto && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 200,
                        background: "rgba(0,0,0,0.9)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        cursor: "pointer",
                    }}
                    onClick={() => setSelectedPhoto(null)}
                    id="mars-modal-backdrop"
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
                        id="mars-modal"
                    >
                        <img
                            src={selectedPhoto.img_src}
                            alt={selectedPhoto.camera.full_name}
                            style={{
                                width: "100%",
                                borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
                            }}
                        />
                        <div style={{ padding: "1.5rem" }}>
                            <h2
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    marginBottom: "0.75rem",
                                }}
                            >
                                {selectedPhoto.camera.full_name}
                            </h2>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "1rem",
                                    flexWrap: "wrap",
                                    marginBottom: "1rem",
                                }}
                            >
                                <span className="meta-tag">🤖 {selectedPhoto.rover.name}</span>
                                <span className="meta-tag">📅 {selectedPhoto.earth_date}</span>
                                <span className="meta-tag">☀️ Sol {selectedPhoto.sol}</span>
                                <span className="meta-tag">📷 {selectedPhoto.camera.name}</span>
                            </div>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setSelectedPhoto(null)}
                                id="mars-modal-close"
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
