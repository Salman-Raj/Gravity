import { NextRequest, NextResponse } from "next/server";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const rover = searchParams.get("rover") || "curiosity";
    const sol = searchParams.get("sol") || "1000";
    const page = searchParams.get("page") || "1";

    const params = new URLSearchParams({
        api_key: NASA_API_KEY,
        sol,
        page,
    });

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${params}`,
            { signal: controller.signal, cache: "force-cache" }
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
            const text = await res.text();
            console.error("NASA Mars API error:", res.status, text);
            return NextResponse.json(
                { error: `NASA API error: ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data.photos || [], {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (err) {
        console.error("Mars fetch failed:", err);
        return NextResponse.json(
            { error: "Failed to fetch Mars photos. NASA API may be rate-limited." },
            { status: 503 }
        );
    }
}
