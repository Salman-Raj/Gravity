import { NextRequest, NextResponse } from "next/server";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    if (!startDate || !endDate) {
        return NextResponse.json(
            { error: "start_date and end_date are required" },
            { status: 400 }
        );
    }

    const params = new URLSearchParams({
        api_key: NASA_API_KEY,
        start_date: startDate,
        end_date: endDate,
    });

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(
            `https://api.nasa.gov/neo/rest/v1/feed?${params}`,
            { signal: controller.signal, cache: "force-cache" }
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
            const text = await res.text();
            console.error("NASA NEO API error:", res.status, text);
            return NextResponse.json(
                { error: `NASA API error: ${res.status}` },
                { status: res.status }
            );
        }

        const data = await res.json();

        interface NEOObject {
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
                relative_velocity: { kilometers_per_hour: string };
                miss_distance: { kilometers: string };
            }[];
        }

        const allNeos: NEOObject[] = [];
        Object.values(data.near_earth_objects).forEach((dayNeos) => {
            allNeos.push(...(dayNeos as NEOObject[]));
        });

        allNeos.sort(
            (a, b) =>
                Number(b.is_potentially_hazardous_asteroid) -
                Number(a.is_potentially_hazardous_asteroid)
        );

        return NextResponse.json(allNeos, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (err) {
        console.error("NEO fetch failed:", err);
        return NextResponse.json(
            { error: "Failed to fetch NEO data. NASA API may be rate-limited." },
            { status: 503 }
        );
    }
}
