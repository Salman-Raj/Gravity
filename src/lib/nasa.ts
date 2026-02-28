const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const BASE_URL = "https://api.nasa.gov";

export interface APODData {
    date: string;
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: "image" | "video";
    copyright?: string;
}

export interface MarsPhoto {
    id: number;
    sol: number;
    camera: {
        id: number;
        name: string;
        rover_id: number;
        full_name: string;
    };
    img_src: string;
    earth_date: string;
    rover: {
        id: number;
        name: string;
        landing_date: string;
        launch_date: string;
        status: string;
    };
}

export interface NEOData {
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

export async function getAPOD(date?: string): Promise<APODData> {
    const params = new URLSearchParams({ api_key: NASA_API_KEY });
    if (date) params.append("date", date);

    const res = await fetch(`${BASE_URL}/planetary/apod?${params}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Failed to fetch APOD");
    return res.json();
}

export async function getAPODRange(startDate: string, endDate: string): Promise<APODData[]> {
    const params = new URLSearchParams({
        api_key: NASA_API_KEY,
        start_date: startDate,
        end_date: endDate,
    });

    const res = await fetch(`${BASE_URL}/planetary/apod?${params}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Failed to fetch APOD range");
    return res.json();
}

export async function getMarsPhotos(
    rover: string = "curiosity",
    sol: number = 1000,
    page: number = 1
): Promise<MarsPhoto[]> {
    const params = new URLSearchParams({
        api_key: NASA_API_KEY,
        sol: sol.toString(),
        page: page.toString(),
    });

    const res = await fetch(
        `${BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos?${params}`,
        { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Failed to fetch Mars photos");
    const data = await res.json();
    return data.photos;
}

export async function getNEOs(
    startDate: string,
    endDate: string
): Promise<NEOData[]> {
    const params = new URLSearchParams({
        api_key: NASA_API_KEY,
        start_date: startDate,
        end_date: endDate,
    });

    const res = await fetch(
        `${BASE_URL}/neo/rest/v1/feed?${params}`,
        { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Failed to fetch NEO data");
    const data = await res.json();

    const allNeos: NEOData[] = [];
    Object.values(data.near_earth_objects).forEach((dayNeos: unknown) => {
        allNeos.push(...(dayNeos as NEOData[]));
    });

    return allNeos.sort(
        (a, b) =>
            Number(b.is_potentially_hazardous_asteroid) -
            Number(a.is_potentially_hazardous_asteroid)
    );
}

// Solar system planet data (static, since NASA doesn't have a direct planets API)
export interface PlanetData {
    id: string;
    name: string;
    type: string;
    emoji: string;
    image: string;
    description: string;
    diameter: string;
    mass: string;
    distanceFromSun: string;
    orbitalPeriod: string;
    dayLength: string;
    moons: number;
    temperature: string;
    atmosphere: string;
    color: string;
    gradient: string;
    funFact: string;
}

export const planets: PlanetData[] = [
    {
        id: "mercury",
        name: "Mercury",
        type: "Terrestrial Planet",
        emoji: "☿️",
        image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg",
        description: "The smallest planet in our Solar System and the closest to the Sun. Mercury has a heavily cratered surface similar to Earth's Moon. Despite being closest to the Sun, it's not the hottest planet—Venus holds that title.",
        diameter: "4,879 km",
        mass: "3.30 × 10²³ kg",
        distanceFromSun: "57.9 million km",
        orbitalPeriod: "88 Earth days",
        dayLength: "59 Earth days",
        moons: 0,
        temperature: "-180°C to 430°C",
        atmosphere: "Minimal (exosphere)",
        color: "#9e9e9e",
        gradient: "linear-gradient(135deg, #757575, #bdbdbd)",
        funFact: "A year on Mercury is just 88 Earth days, but a day lasts 59 Earth days!"
    },
    {
        id: "venus",
        name: "Venus",
        type: "Terrestrial Planet",
        emoji: "♀️",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
        description: "Often called Earth's twin due to similar size and mass, Venus has a thick, toxic atmosphere filled with carbon dioxide and clouds of sulfuric acid. It's the hottest planet in our Solar System, with surface temperatures enough to melt lead.",
        diameter: "12,104 km",
        mass: "4.87 × 10²⁴ kg",
        distanceFromSun: "108.2 million km",
        orbitalPeriod: "225 Earth days",
        dayLength: "243 Earth days",
        moons: 0,
        temperature: "462°C (average)",
        atmosphere: "CO₂, Nitrogen, Sulfuric acid clouds",
        color: "#e6a44e",
        gradient: "linear-gradient(135deg, #d4883e, #f0c774)",
        funFact: "Venus rotates backwards compared to most planets, so the Sun rises in the west!"
    },
    {
        id: "earth",
        name: "Earth",
        type: "Terrestrial Planet",
        emoji: "🌍",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
        description: "Our home planet is the only known world to harbor life. Earth's perfect distance from the Sun, liquid water, and protective atmosphere create the ideal conditions for life to thrive. It's the densest planet in the Solar System.",
        diameter: "12,742 km",
        mass: "5.97 × 10²⁴ kg",
        distanceFromSun: "149.6 million km",
        orbitalPeriod: "365.25 days",
        dayLength: "24 hours",
        moons: 1,
        temperature: "-89°C to 57°C",
        atmosphere: "N₂, O₂, Argon, CO₂",
        color: "#4a90d9",
        gradient: "linear-gradient(135deg, #2563eb, #22d3ee)",
        funFact: "Earth is the only planet not named after a Greek or Roman god."
    },
    {
        id: "mars",
        name: "Mars",
        type: "Terrestrial Planet",
        emoji: "🔴",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
        description: "The Red Planet has fascinated humanity for centuries. Mars features the tallest volcano (Olympus Mons) and the deepest canyon (Valles Marineris) in the Solar System. Evidence suggests it once had liquid water on its surface.",
        diameter: "6,779 km",
        mass: "6.42 × 10²³ kg",
        distanceFromSun: "227.9 million km",
        orbitalPeriod: "687 Earth days",
        dayLength: "24 hours, 37 min",
        moons: 2,
        temperature: "-140°C to 20°C",
        atmosphere: "CO₂, N₂, Argon",
        color: "#d94f30",
        gradient: "linear-gradient(135deg, #b91c1c, #fb923c)",
        funFact: "Mars has the largest dust storms in the Solar System, lasting for months and covering the entire planet!"
    },
    {
        id: "jupiter",
        name: "Jupiter",
        type: "Gas Giant",
        emoji: "🟤",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
        description: "The largest planet in our Solar System, Jupiter is a massive gas giant with a mesmerizing pattern of cloud bands and the famous Great Red Spot—a storm larger than Earth that has been raging for over 350 years.",
        diameter: "139,820 km",
        mass: "1.90 × 10²⁷ kg",
        distanceFromSun: "778.5 million km",
        orbitalPeriod: "12 Earth years",
        dayLength: "10 hours",
        moons: 95,
        temperature: "-108°C (cloud top)",
        atmosphere: "H₂, Helium",
        color: "#c4956a",
        gradient: "linear-gradient(135deg, #92400e, #d97706, #fbbf24)",
        funFact: "Jupiter's Great Red Spot is a storm that's been raging for over 350 years and is bigger than Earth!"
    },
    {
        id: "saturn",
        name: "Saturn",
        type: "Gas Giant",
        emoji: "🪐",
        image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
        description: "Famous for its stunning ring system made of ice and rock particles, Saturn is the second-largest planet. Despite its massive size, it's the least dense planet—it would float in water if there were an ocean large enough!",
        diameter: "116,460 km",
        mass: "5.68 × 10²⁶ kg",
        distanceFromSun: "1.43 billion km",
        orbitalPeriod: "29 Earth years",
        dayLength: "10.7 hours",
        moons: 146,
        temperature: "-138°C (cloud top)",
        atmosphere: "H₂, Helium",
        color: "#d4a745",
        gradient: "linear-gradient(135deg, #b8860b, #f0d68a)",
        funFact: "Saturn's rings span up to 282,000 km but are only about 10 meters thick!"
    },
    {
        id: "uranus",
        name: "Uranus",
        type: "Ice Giant",
        emoji: "🔵",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
        description: "Uranus is unique among the planets because it rotates on its side, likely from an ancient collision. This ice giant has a blue-green color from methane in its atmosphere and features faint rings and 27 known moons.",
        diameter: "50,724 km",
        mass: "8.68 × 10²⁵ kg",
        distanceFromSun: "2.87 billion km",
        orbitalPeriod: "84 Earth years",
        dayLength: "17 hours",
        moons: 27,
        temperature: "-224°C",
        atmosphere: "H₂, Helium, Methane",
        color: "#64b5f6",
        gradient: "linear-gradient(135deg, #00acc1, #80deea)",
        funFact: "Uranus rotates nearly on its side with a tilt of 98°, making it look like it's rolling around the Sun!"
    },
    {
        id: "neptune",
        name: "Neptune",
        type: "Ice Giant",
        emoji: "🔷",
        image: "https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
        description: "The most distant planet from the Sun, Neptune is a dark, cold world with the strongest winds in the Solar System—reaching speeds of 2,100 km/h. Its vivid blue color comes from methane in the atmosphere.",
        diameter: "49,244 km",
        mass: "1.02 × 10²⁶ kg",
        distanceFromSun: "4.50 billion km",
        orbitalPeriod: "165 Earth years",
        dayLength: "16 hours",
        moons: 16,
        temperature: "-214°C",
        atmosphere: "H₂, Helium, Methane",
        color: "#1e3a5f",
        gradient: "linear-gradient(135deg, #1565c0, #5c6bc0)",
        funFact: "Neptune's winds are the fastest in the Solar System, reaching speeds of 2,100 km/h!"
    },
];

export function getPlanetById(id: string): PlanetData | undefined {
    return planets.find((p) => p.id === id);
}
