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

// Robust: fetch + JSON-Parsing + Prüfungen
const fetchWeatherForCoords = async (lat: number, lon: number) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    console.debug('[Weather] fetching', url);
    let res;
    try {
        res = await fetch(url);
    } catch (networkErr) {
        console.error('[Weather] Network error while fetching weather', networkErr, url);
        throw new Error('Netzwerkfehler beim Abrufen des Wetters');
    }
    const text = await res.text();
    console.debug('[Weather] response status', res.status, 'body preview:', text.slice(0, 300));
    if (!res.ok) {
        throw new Error(`Open-Meteo Anfrage fehlgeschlagen: ${res.status} ${res.statusText} - ${text}`);
    }
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.error('[Weather] JSON parse error', e, 'raw:', text.slice(0, 300));
        throw new Error(`Open-Meteo: Ungültiges JSON`);
    }
    if (!data || !data.current_weather) {
        console.error('[Weather] missing current_weather in response', JSON.stringify(data).slice(0, 800));
        throw new Error(`Open-Meteo: keine aktuellen Wetterdaten im Response`);
    }
    return data;
};

// Reverse geocoding (Open-Meteo reverse API)
const reverseGeocodeShort = async (lat: number, lon: number) => {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=de&count=1`;
        console.debug('[Geo] reverse geocode', url);
        const res = await fetch(url);
        const text = await res.text();
        console.debug('[Geo] reverse response', res.status, text.slice(0, 300));
        if (!res.ok) {
            console.error('Reverse-Geocode fehlgeschlagen', res.status, res.statusText, text.slice(0, 300));
            return null;
        }
        const data = JSON.parse(text);
        const first = data?.results?.[0];
        if (!first) return null;
        const name = first.name || first.locality || first.admin1 || '';
        const country = first.country || '';
        return country ? `${name}, ${country}`.trim() : name || first?.name || null;
    } catch (e) {
        console.error('Reverse-Geocode Error', e);
        return null;
    }
};

// Forward geocode (Open-Meteo search API) used only as fallback when geolocation denied
const forwardGeocodeShort = async (place: string) => {
    try {
        const q = encodeURIComponent(place);
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1&language=de`;
        console.debug('[Geo] forward geocode', url);
        const res = await fetch(url);
        const text = await res.text();
        console.debug('[Geo] forward response', res.status, text.slice(0, 300));
        if (!res.ok) {
            console.error('Forward-Geocode fehlgeschlagen', res.status, res.statusText, text.slice(0, 300));
            throw new Error('Geocoding fehlgeschlagen');
        }
        const data = JSON.parse(text);
        const first = data?.results?.[0];
        if (!first) throw new Error('Ort nicht gefunden');
        const short = first.name || first.display_name || `${first.locality || ''}`;
        return { lat: parseFloat(first.latitude ?? first.lat), lon: parseFloat(first.longitude ?? first.lon), shortName: short };
    } catch (e) {
        console.error('Forward geocode error', e);
        throw e;
    }
};

// Helper to format location for display
const formatDisplayLocation = (loc?: string | null) => {
    if (!loc) return '';
    const parts = loc.split(',').map((p) => p.trim()).filter(Boolean);
    let out = parts.length >= 2 ? `${parts[0]}, ${parts[parts.length - 1]}` : parts[0] || loc;
    if (out.length > 30) out = out.slice(0, 27).trim() + '…';
    return out;
};

const WeatherWidget = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mountedRef = useRef(true);

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
        // dev override: if localStorage.weatherCoords is set ("lat,lon,Name"), use it
        try {
            const stored = localStorage.getItem('weatherCoords');
            if (stored) {
                const parts = stored.split(',');
                const lat = parseFloat(parts[0]);
                const lon = parseFloat(parts[1]);
                const shortName = parts.slice(2).join(',') || defaults.defaultWeatherLocation.name || '';
                if (!isNaN(lat) && !isNaN(lon)) {
                    console.debug('[Weather] using override coords from localStorage', lat, lon, shortName);
                    return { lat, lon, shortName };
                }
            }
        } catch (e) { /* ignore localStorage read errors */ }
        // Try browser geolocation first; if permission denied or unavailable, fallback to default place via forwardGeocode
        try {
            if (!navigator.geolocation) throw new Error('Geolocation nicht verfügbar');
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, (err) => {
                    let msg = 'Geolocation Fehler';
                    if (err?.code === 1) msg = 'Geolocation abgelehnt (Permission denied)';
                    else if (err?.code === 2) msg = 'Position nicht verfügbar';
                    else if (err?.code === 3) msg = 'Geolocation Timeout';
                    reject(new Error(msg));
                }, { timeout: 5000 });
            });
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const short = await reverseGeocodeShort(lat, lon);
            return { lat, lon, shortName: short || defaults.defaultWeatherLocation.name || '' };
        } catch (geoErr) {
            console.warn('Geolocation failed, attempting forward geocode fallback:', geoErr);
            const place = defaults.defaultWeatherLocation?.name;
            if (place) {
                try {
                    const g = await forwardGeocodeShort(place);
                    return { lat: g.lat, lon: g.lon, shortName: g.shortName };
                } catch (fgErr) {
                    console.error('Forward geocode fallback failed', fgErr);
                    throw geoErr;
                }
            }
            throw geoErr;
        }
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
                } catch (e) { console.error('Cache parse error', e); }

                await fetchAndSet(lat, lon, shortName);
            } catch (e: any) {
                console.error('Weather load error', e);
                if (mountedRef.current) { setError(e?.message ?? 'Fehler beim Laden des Wetters'); setLoading(false); }
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
            try { localStorage.removeItem(key); } catch (e) { console.error('Remove cache error', e); }
            await fetchAndSet(lat, lon, shortName);
        } catch (e: any) {
            console.error('Refresh error', e);
            setError(e?.message ?? 'Fehler beim Aktualisieren');
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
