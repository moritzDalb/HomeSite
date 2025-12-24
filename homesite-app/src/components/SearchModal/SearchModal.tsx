import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ExternalLink, Star } from 'lucide-react';
import { linkCategories } from '../../data/links';
import { useFavorites } from '../../context/FavoritesContext';
import type { SearchResult } from '../../types';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isFavorite } = useFavorites();

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const matches: SearchResult[] = [];

    linkCategories.forEach(category => {
      category.links.forEach(link => {
        if (
          link.name.toLowerCase().includes(searchTerm) ||
          category.label.toLowerCase().includes(searchTerm)
        ) {
          matches.push({ link, category });
        }
      });
    });

    // Favoriten zuerst sortieren
    return matches.sort((a, b) => {
      const aFav = isFavorite(a.link.url);
      const bFav = isFavorite(b.link.url);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [query, isFavorite]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          if (results[selectedIndex]) {
            window.open(results[selectedIndex].link.url, '_blank');
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
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Links durchsuchen..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
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
                    {isFavorite(result.link.url) && <Star size={14} className="star-icon" />}
                    {result.link.name}
                  </span>
                  <span className="result-category">{result.category.label}</span>
                </div>
                <ExternalLink size={16} className="external-icon" />
              </a>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="no-results">
            Keine Ergebnisse für "{query}"
          </div>
        )}

        <div className="search-hints">
          <span><kbd>↑↓</kbd> Navigieren</span>
          <span><kbd>Enter</kbd> Öffnen</span>
          <span><kbd>Esc</kbd> Schließen</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

