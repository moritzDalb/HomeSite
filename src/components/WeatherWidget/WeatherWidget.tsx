import { useEffect, useRef, useState } from 'react';
import './WeatherWidget.css';
import { defaults } from '../../config/defaults';

type WeatherData = {
    tempC: number;
    condition: string;
    location: string;
    icon?: string;
};

// Mapping from Open-Meteo weathercode to simple emoji + description (de)
const weatherCodeMap: Record<number, { icon: string; text: string }> = {
    0: { icon: '☀️', text: 'Klar' },
    1: { icon: '🌤️', text: 'Überwiegend sonnig' },
    2: { icon: '⛅', text: 'Teilweise bewölkt' },
    3: { icon: '☁️', text: 'Bedeckt' },
    45: { icon: '🌫️', text: 'Nebel' },
    48: { icon: '🌫️', text: 'Eisnebel' },
    51: { icon: '🌦️', text: 'Sprühregen' },
    53: { icon: '🌧️', text: 'Leichter Regen' },
    55: { icon: '🌧️', text: 'Mäßiger Regen' },
    56: { icon: '🌧️', text: 'Gefrierender Sprühregen' },
    57: { icon: '🌧️', text: 'Gefrierender Regen' },
    61: { icon: '🌧️', text: 'Regenschauer' },
    63: { icon: '🌧️', text: 'Mäßiger Regen' },
    65: { icon: '🌧️', text: 'Starker Regen' },
    71: { icon: '❄️', text: 'Schneefall' },
    73: { icon: '❄️', text: 'Leichter Schneefall' },
    75: { icon: '❄️', text: 'Starker Schneefall' },
    80: { icon: '🌧️', text: 'Regenschauer' },
    81: { icon: '🌧️', text: 'Starke Regenschauer' },
    82: { icon: '⛈️', text: 'Heftige Gewitter' },
    95: { icon: '⛈️', text: 'Gewitter' },
    96: { icon: '⛈️', text: 'Leichtes Gewitter' },
    99: { icon: '⛈️', text: 'Starkes Gewitter' },
};

const CACHE_KEY_BASE = 'openmeteo_weather_cache_v1';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minuten

const fetchWeatherForCoords = async (lat: number, lon: number) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo Anfrage fehlgeschlagen');
    return res.json();
};

// Short-format helpers
const formatShortFromNominatim = (first: any) => {
    if (!first) return null;
    const addr = first.address || {};
    const city = addr.city || addr.town || addr.village || addr.hamlet || addr.county || first.name || '';
    const country = addr.country || '';
    return country ? `${city}, ${country}`.trim() : city || first.display_name || '';
};

const forwardGeocodeShort = async (place: string) => {
    const q = encodeURIComponent(place);
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
    const res = await fetch(nomUrl, { headers: { 'Accept-Language': 'de', 'User-Agent': 'HomeSite/1.0 (github.com)' } });
    if (!res.ok) throw new Error('Geocoding fehlgeschlagen');
    const data = await res.json();
    const first = data && data[0];
    if (!first) throw new Error('Ort nicht gefunden');
    const short = formatShortFromNominatim(first) || first.display_name || place;
    return { lat: parseFloat(first.lat), lon: parseFloat(first.lon), shortName: short };
};

const reverseGeocodeShort = async (lat: number, lon: number) => {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=de&count=1`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        const first = data?.results?.[0];
        if (!first) return null;
        // Open-Meteo reverse returns name and country fields in many cases
        const name = first.name || first.locality || first.admin1 || '';
        const country = first.country || '';
        return country ? `${name}, ${country}`.trim() : name || first?.name || null;
    } catch (e) {
        return null;
    }
};

// Format helper: ensure we display at most "City, Country" and truncate long names
const formatDisplayLocation = (loc?: string | null) => {
    if (!loc) return '';
    // Prefer first two comma-separated parts (e.g. City, Country)
    const parts = loc.split(',').map((p) => p.trim()).filter(Boolean);
    let out = parts.length >= 2 ? `${parts[0]}, ${parts[parts.length - 1]}` : parts[0] || loc;
    // If still too long, truncate to 30 chars
    if (out.length > 30) out = out.slice(0, 27).trim() + '…';
    return out;
};

const WeatherWidget = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingFallback, setUsingFallback] = useState(false);
    const mountedRef = useRef(true);

    // kleine Hilfsfunktion um Wetter für Koordinaten zu holen und State/Cache zu setzen
    const fetchAndSet = async (lat: number, lon: number, locationName: string) => {
        const key = `${CACHE_KEY_BASE}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
        const data = await fetchWeatherForCoords(lat, lon);
        const cw = data.current_weather;
        const mapping = weatherCodeMap[cw.weathercode] ?? { icon: '☁️', text: 'Unbekannt' };
        const result: WeatherData = {
            tempC: Math.round(cw.temperature),
            condition: mapping.text,
            location: locationName,
            icon: mapping.icon,
        };
        try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), value: result })); } catch (e) { /* ignore */ }
        if (mountedRef.current) {
            setWeather(result);
            setLoading(false);
        }
    };

    const getCoords = async () : Promise<{lat:number, lon:number, shortName:string}> => {
        // 1) try browser geolocation
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                if (!navigator.geolocation) return reject(new Error('No geolocation'));
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const short = await reverseGeocodeShort(lat, lon);
            return { lat, lon, shortName: short || defaults.defaultWeatherLocation.name || '' };
        } catch (e) {
            // fallback to forward geocode of default name
        }

        const place = defaults.defaultWeatherLocation.name || 'Berlin';
        const geo = await forwardGeocodeShort(place);
        setUsingFallback(true);
        return { lat: geo.lat, lon: geo.lon, shortName: geo.shortName };
    };

    useEffect(() => {
        mountedRef.current = true;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const { lat, lon, shortName } = await getCoords();
                const key = `${CACHE_KEY_BASE}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
                try {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        const parsed = JSON.parse(cached);
                        if (Date.now() - parsed.ts < CACHE_TTL_MS) {
                            if (mountedRef.current) { setWeather(parsed.value); setLoading(false); }
                            return;
                        }
                    }
                } catch (e) { /* ignore */ }

                await fetchAndSet(lat, lon, shortName);
            } catch (e) {
                if (mountedRef.current) { setError('Fehler beim Laden des Wetters'); setLoading(false); }
            }
        };

        load();
        const interval = setInterval(() => load(), CACHE_TTL_MS);
        return () => { mountedRef.current = false; clearInterval(interval); };
    }, []);

    const handleRefresh = async () => {
        setError(null);
        setLoading(true);
        try {
            const { lat, lon, shortName } = await getCoords();
            const key = `${CACHE_KEY_BASE}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
            try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
            await fetchAndSet(lat, lon, shortName);
        } catch (e) {
            setError('Fehler beim Aktualisieren');
            setLoading(false);
        }
    };

    return (
        <div className="weather-widget">
            {error ? (
                <div className="weather-error-view">
                    <div className="weather-error-message">{error}</div>
                    <div className="weather-error-actions">
                        <button className="weather-btn" onClick={handleRefresh}>Erneut versuchen</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="weather-panel">
                        <div className="weather-left">
                            <div className="weather-icon">{weather?.icon ?? '☁️'}</div>
                            <div className="weather-location">{loading ? '' : formatDisplayLocation(weather?.location)}</div>
                        </div>
                        <div className="weather-right">
                            <div className="weather-temp">{loading ? '...' : `${weather?.tempC}°C`}</div>
                            <div className="weather-cond">{loading ? 'Lädt...' : weather?.condition}</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default WeatherWidget;
