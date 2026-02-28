import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Galaxy from "@/components/Galaxy";

export const metadata: Metadata = {
  title: "Gravity — Explore the Cosmos",
  description:
    "Discover the wonders of our Solar System and beyond. Explore planets, view NASA's Astronomy Picture of the Day, browse Mars rover photos, and track near-Earth asteroids.",
  keywords: [
    "space",
    "planets",
    "solar system",
    "NASA",
    "astronomy",
    "Mars",
    "APOD",
    "asteroids",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <Galaxy
            starSpeed={0.5}
            density={2}
            hueShift={160}
            glowIntensity={0.2}
            rotationSpeed={0.05}
            mouseInteraction={true}
            transparent={true}
          />
        </div>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
