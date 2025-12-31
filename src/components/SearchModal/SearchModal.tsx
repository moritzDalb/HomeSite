import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ExternalLink, Star } from 'lucide-react';
import { linkCategories } from '../../data/links';
import { useFavorites } from '../../context/FavoritesContext';
import type { SearchResult } from '../../types';
import './SearchModal.css';
import { defaults } from '../../config/defaults';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialQuery?: string;
}

const STORAGE_KEY = 'searchEngine';

const SearchModal = ({ isOpen, onClose, initialQuery }: SearchModalProps) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [externalSuggestions, setExternalSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const jsonpScriptRef = useRef<HTMLScriptElement | null>(null);
    const jsonpCbRef = useRef<string | null>(null);
    const lastFetchedQueryRef = useRef<string>('');
    const { isFavorite } = useFavorites();

    // Engine selection persisted in localStorage
    const [engineId, setEngineId] = useState<string>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored || defaults.defaultSearchEngine || 'google';
        } catch (e) {
            return defaults.defaultSearchEngine || 'google';
        }
    });

    const engine = defaults.searchEngines[engineId] || defaults.searchEngines[defaults.defaultSearchEngine];

    // derive locale info for suggest params
    const defaultLocale = (defaults.defaultLocale as string) || (typeof navigator !== 'undefined' ? navigator.language : 'en');
    const localeShort = (defaultLocale || 'en').split('-')[0];
    const localeCode = (defaults.localeMap && (defaults.localeMap as any)[defaultLocale as any]) || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');

    // debounce query input to avoid excessive suggest requests
    useEffect(() => {
        const ms = (defaults.searchDebounceMs as number) || 200;
        const t = setTimeout(() => setDebouncedQuery(query), ms);
        return () => clearTimeout(t);
    }, [query]);

    const parseSuggestions = (parser: string | undefined, data: any): string[] => {
        const suggestions: string[] = [];
        if (!data) return suggestions;

        switch (parser) {
            case 'google':
                if (Array.isArray(data) && Array.isArray(data[1])) {
                    for (const item of data[1]) {
                        const it: any = item;
                        if (typeof it === 'string') suggestions.push(it);
                        else if (Array.isArray(it) && typeof it[0] === 'string') suggestions.push(it[0]);
                    }
                }
                break;
            case 'bing':
                if (Array.isArray(data) && Array.isArray(data[1])) {
                    for (const item of data[1]) {
                        const it: any = item;
                        if (typeof it === 'string') suggestions.push(it);
                    }
                }
                break;
            case 'duckduckgo':
                if (Array.isArray(data)) {
                    for (const item of data) {
                        const it: any = item;
                        if (typeof it === 'string') suggestions.push(it);
                        else if (it && typeof it === 'object') {
                            if (typeof it.phrase === 'string') suggestions.push(it.phrase);
                            else if (typeof it[0] === 'string') suggestions.push(it[0]);
                            else if (typeof it.s === 'string') suggestions.push(it.s);
                        }
                    }
                }
                break;
            default:
                if (Array.isArray(data)) {
                    for (const item of data) {
                        const it: any = item;
                        if (typeof it === 'string') suggestions.push(it);
                        else if (Array.isArray(it) && typeof it[0] === 'string') suggestions.push(it[0]);
                    }
                }
                break;
        }

        return suggestions.slice(0, 5);
    };

    const results = useMemo<SearchResult[]>(() => {
        if (!query.trim()) return [];

        const searchTerm = query.toLowerCase();
        const matches: SearchResult[] = [];

        linkCategories.forEach((category) => {
            category.links.forEach((link) => {
                if (
                    link.name.toLowerCase().includes(searchTerm) ||
                    category.label.toLowerCase().includes(searchTerm)
                ) {
                    matches.push({ link, category });
                }
            });
        });

        // Sort favorites first
        return matches.sort((a, b) => {
            const aFav = isFavorite(a.link.url);
            const bFav = isFavorite(b.link.url);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
        });
    }, [query, isFavorite]);

    // Unified suggestion fetcher that supports jsonp and json backends defined in defaults
    useEffect(() => {
        const cleanupJsonp = () => {
            if (jsonpScriptRef.current && jsonpScriptRef.current.parentNode) {
                jsonpScriptRef.current.parentNode.removeChild(jsonpScriptRef.current);
            }
            if (jsonpCbRef.current) {
                try {
                    // @ts-ignore
                    delete (window as any)[jsonpCbRef.current];
                } catch (e) {
                    // ignore
                }
            }
            jsonpScriptRef.current = null;
            jsonpCbRef.current = null;
        };

        const q = debouncedQuery.trim();
        if (!isOpen || !q || results.length > 0) {
            setExternalSuggestions([]);
            cleanupJsonp();
            lastFetchedQueryRef.current = '';
            return;
        }

        // Avoid refetching same query
        if (lastFetchedQueryRef.current === q) return;
        lastFetchedQueryRef.current = q;

        const suggest = engine?.suggest;
        if (!suggest || suggest.type === 'none') {
            setExternalSuggestions([]);
            return;
        }

        // build params and include locale-specific keys where reasonable
        const params = { ...(suggest.params || {}) } as Record<string, string>;
        const queryParamKey = (suggest.queryParam as string) || 'q';
        params[queryParamKey] = q;
        if (suggest.parser === 'google') {
            // Google uses 'hl' for language
            params.hl = localeShort;
        } else if (suggest.parser === 'bing') {
            // Bing uses 'mkt' (market) like en-US
            params.mkt = localeCode;
        } else if (suggest.parser === 'duckduckgo') {
            // DuckDuckGo supports 'kl' for region
            params.kl = localeCode;
        }

        const tryJsonp = () => {
            const cbName = `__suggest_cb_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            jsonpCbRef.current = cbName;

            // @ts-ignore
            (window as any)[cbName] = (data: any) => {
                try {
                    const parsed = parseSuggestions(suggest.parser, data);
                    setExternalSuggestions(parsed);
                    setSelectedIndex(0);
                } finally {
                    cleanupJsonp();
                }
            };

            const callbackParam = suggest.callbackParam || 'callback';
            params[callbackParam] = cbName;

            const url = `${suggest.url}?${new URLSearchParams(params).toString()}`;
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            jsonpScriptRef.current = script;
            document.body.appendChild(script);
        };

        if (suggest.type === 'jsonp') {
            // re-use tryJsonp implementation
            tryJsonp();
            return () => {
                cleanupJsonp();
            };
        }

        // JSON fetch path
        (async () => {
            try {
                const url = `${suggest.url}?${new URLSearchParams(params).toString()}`;
                const res = await fetch(url, { method: 'GET' });
                if (!res.ok) {
                    // try jsonp fallback for providers that support it
                    tryJsonp();
                    return;
                }
                const data = await res.json();
                const parsed = parseSuggestions(suggest.parser, data);
                if (!parsed || parsed.length === 0) {
                    // fallback to jsonp if fetch returned nothing
                    tryJsonp();
                } else {
                    setExternalSuggestions(parsed);
                    setSelectedIndex(0);
                }
            } catch (e) {
                // on error, try jsonp fallback
                tryJsonp();
            }
        })();
    }, [debouncedQuery, results.length, isOpen, engine, localeShort, localeCode]);

    useEffect(() => {
        if (isOpen) {
            // Prefill query when modal opens (e.g. first typed character) and focus the input
            setQuery(initialQuery ?? '');
            requestAnimationFrame(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    if (initialQuery) {
                        const len = initialQuery.length;
                        try {
                            inputRef.current.setSelectionRange(len, len);
                        } catch (e) {
                            // ignore if not supported
                        }
                    }
                }
            });
        }
        if (!isOpen) {
            // Reset state when modal closes - intentional synchronization
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuery('');
            setDebouncedQuery('');
            setSelectedIndex(0);
            setExternalSuggestions([]);
        }
    }, [isOpen, initialQuery]);

    useEffect(() => {
        // Reset selection when query changes - intentional synchronization
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    // total items depend on internal results or external suggestions
                    {
                        const total = results.length > 0 ? results.length : externalSuggestions.length;
                        setSelectedIndex((prev) => Math.min(prev + 1, Math.max(0, total - 1)));
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    // If internal results exist, open them. Otherwise, handle external suggestion or engine search template.
                    if (results.length > 0 && results[selectedIndex]) {
                        window.open(results[selectedIndex].link.url, '_blank');
                        onClose();
                    } else if (externalSuggestions.length > 0 && externalSuggestions[selectedIndex]) {
                        const q = externalSuggestions[selectedIndex];
                        const url = (engine?.searchUrl || 'https://www.google.com/search?q={query}').replace('{query}', encodeURIComponent(q));
                        window.open(url, '_blank');
                        onClose();
                    } else if (query.trim()) {
                        const url = (engine?.searchUrl || 'https://www.google.com/search?q={query}').replace('{query}', encodeURIComponent(query.trim()));
                        window.open(url, '_blank');
                        onClose();
                    }
                    break;
                case 'Escape':
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, onClose, externalSuggestions, query, engine]);

    if (!isOpen) return null;

    return (
        <div className="search-modal-overlay" onClick={onClose}>
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="search-input-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search links..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />

                    {/* engine selector */}
                    <select
                        className="search-engine-select"
                        value={engineId}
                        onChange={(e) => {
                            const v = e.target.value;
                            setEngineId(v);
                            setExternalSuggestions([]);
                            try {
                                localStorage.setItem(STORAGE_KEY, v);
                            } catch (err) {
                                // ignore
                            }
                        }}
                    >
                        {Object.values(defaults.searchEngines).map((se: any) => (
                            <option key={se.id} value={se.id}>{se.name}</option>
                        ))}
                    </select>

                    <button className="close-button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="search-results">
                        {results.map((result, index) => (
                            <a
                                key={`${result.category.id}-${result.link.url}`}
                                href={result.link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="result-info">
                                    <span className="result-name">
                                        {isFavorite(result.link.url) && (
                                            <Star size={14} className="star-icon" />
                                        )}
                                        {result.link.name}
                                    </span>
                                    <span className="result-category">{result.category.label}</span>
                                </div>
                                <ExternalLink size={16} className="external-icon" />
                            </a>
                        ))}
                    </div>
                )}

                {results.length === 0 && externalSuggestions.length > 0 && (
                    <div className="search-results">
                        {externalSuggestions.map((sugg, index) => (
                            <a
                                key={`suggest-${sugg}-${index}`}
                                href={(engine?.searchUrl || 'https://www.google.com/search?q={query}').replace('{query}', encodeURIComponent(sugg))}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="result-info">
                                    <span className="result-name">{sugg}</span>
                                    <span className="result-category">{engine?.name || 'Search'}</span>
                                </div>
                                <ExternalLink size={16} className="external-icon" />
                            </a>
                        ))}
                    </div>
                )}

                {query && results.length === 0 && externalSuggestions.length === 0 && (
                    <div className="no-results">No results for "{query}"</div>
                )}

                <div className="search-hints">
                    <span>
                        <kbd>↑↓</kbd> Navigate
                    </span>
                    <span>
                        <kbd>Enter</kbd> Open
                    </span>
                    <span>
                        <kbd>Esc</kbd> Close
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
