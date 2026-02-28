import { NextRequest, NextResponse } from "next/server";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const params = new URLSearchParams({ api_key: NASA_API_KEY });
    if (date) params.append("date", date);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(
            `https://api.nasa.gov/planetary/apod?${params}`,
            { signal: controller.signal, cache: "force-cache" }
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
            const text = await res.text();
            console.error("NASA APOD API error:", res.status, text);
            return NextResponse.json(
                { error: `NASA API error: ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (err) {
        console.error("APOD fetch failed:", err);
        return NextResponse.json(
            { error: "Failed to fetch APOD data. NASA API may be rate-limited." },
            { status: 503 }
        );
    }
}
