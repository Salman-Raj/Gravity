"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { href: "/", label: "Home" },
        { href: "/planets", label: "Planets" },
        { href: "/apod", label: "APOD" },
        { href: "/mars", label: "Mars Rover" },
        { href: "/asteroids", label: "Asteroids" },
    ];

    return (
        <nav className="navbar" id="main-nav">
            <Link href="/" className="navbar-logo" id="logo-link">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" stroke="url(#logoGrad)" strokeWidth="2" />
                    <circle cx="18" cy="18" r="6" fill="url(#logoGrad)" />
                    <ellipse
                        cx="18"
                        cy="18"
                        rx="16"
                        ry="6"
                        stroke="url(#logoGrad)"
                        strokeWidth="1.5"
                        transform="rotate(-25 18 18)"
                    />
                    <defs>
                        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
                            <stop stopColor="#06b6d4" />
                            <stop offset="0.5" stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>
                <span className="logo-gradient">Gravity</span>
            </Link>

            <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                id="mobile-menu-toggle"
            >
                {mobileOpen ? "✕" : "☰"}
            </button>

            <ul className={`navbar-links ${mobileOpen ? "open" : ""}`} id="nav-links">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? "active" : ""}`}
                            onClick={() => setMobileOpen(false)}
                            id={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
