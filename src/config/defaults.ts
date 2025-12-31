export type Locale = 'de' | 'en';

export const defaults = {
    // Standard-Sprache (wird beim Start verwendet)
    defaultLocale: 'en' as Locale,

    // Mapping von kurzen Locale-Keys zu Intl-kompatiblen BCP-47-Codes
    localeMap: {
        de: 'de-DE',
        en: 'en-US',
    } as Record<Locale, string>,

    // Standard-Optionen für Datum-/Zeit-Formatierung
    dateOptions: {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    } as Intl.DateTimeFormatOptions,

    timeOptions: {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    } as Intl.DateTimeFormatOptions,

    // Default location name for weather widget (coordinates are resolved via geocoding API)
    defaultWeatherLocation: {
        name: 'Berlebeck',
    },

    // ========================================
    // Search engine configuration
    // Define available search engines (suggest endpoint + search URL template)
    // `suggest.type` can be 'jsonp' or 'json' or 'none'. Parser is a hint for client parsing logic.
    // searchUrl supports {query} placeholder.
    // ========================================
    // Debounce interval in milliseconds for external suggest requests
    searchDebounceMs: 200,

    defaultSearchEngine: 'google',

    searchEngines: {
        google: {
            id: 'google',
            name: 'Google',
            suggest: {
                type: 'jsonp',
                url: 'https://suggestqueries.google.com/complete/search',
                params: { client: 'firefox', hl: 'en' },
                queryParam: 'q',
                callbackParam: 'callback',
                parser: 'google',
            },
            searchUrl: 'https://www.google.com/search?q={query}',
        },
        duckduckgo: {
            id: 'duckduckgo',
            name: 'DuckDuckGo',
            suggest: {
                type: 'json',
                url: 'https://ac.duckduckgo.com/ac/',
                params: { type: 'list' },
                queryParam: 'q',
                parser: 'duckduckgo',
            },
            searchUrl: 'https://duckduckgo.com/?q={query}',
        },
        bing: {
            id: 'bing',
            name: 'Bing',
            suggest: {
                type: 'json',
                url: 'https://api.bing.com/osjson.aspx',
                params: {},
                queryParam: 'query',
                parser: 'bing',
            },
            searchUrl: 'https://www.bing.com/search?q={query}',
        },
        ecosia: {
            id: 'ecosia',
            name: 'Ecosia',
            // Ecosia uses Bing's suggestion backend in practice; reuse bing parser
            suggest: {
                type: 'json',
                url: 'https://api.bing.com/osjson.aspx',
                params: {},
                queryParam: 'query',
                parser: 'bing',
            },
            searchUrl: 'https://www.ecosia.org/search?q={query}',
        },
    } as Record<string, any>,
};
