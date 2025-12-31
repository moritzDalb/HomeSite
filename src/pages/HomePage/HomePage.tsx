import { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../../components/Header';
import LinkCard from '../../components/LinkCard';
import SearchModal from '../../components/SearchModal';
import WidgetsArea from '../../components/WidgetsArea';
import { linkCategories } from '../../data/links';
import './HomePage.css';

const HomePage = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);
    // Flag, damit Stagger-Animation nur beim initialen Mount abgespielt wird
    const initialMountRef = useRef(true);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
                setInitialQuery(undefined);
            }

            // If user types a printable character while not focusing an input, open search and pass that character
            const active = document.activeElement;
            const isTypingIntoInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable);
            if (!isTypingIntoInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const key = e.key;
                // Only consider single-character printable keys (letters, numbers, punctuation) but ignore ' ' (space)
                if (key.length === 1 && key !== ' ') {
                    // Open modal and prefill with the typed character
                    setIsSearchOpen(true);
                    setInitialQuery(key);
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        // Nach dem ersten Render auf false setzen, damit bei späteren Updates keine Delays mehr gesetzt werden
        const id = setTimeout(() => { initialMountRef.current = false; }, 50);
        return () => clearTimeout(id);
    }, []);

    // prefers-reduced-motion per JS (optional, CSS ist primär) -> setze disableAnimation wenn der User es bevorzugt
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mq.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        // older browsers use addListener
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else mq.addListener(handler);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', handler);
            else mq.removeListener(handler);
        };
    }, []);

    const baseDelay = 0.08; // Sekunden pro Karte
    const maxDelay = 0.9; // kappen, falls viele Karten vorhanden sind

    const delays = useMemo(() => {
        return linkCategories.map((_, i) => `${Math.min(i * baseDelay, maxDelay)}s`);
    }, []);

    return (
        <div className="home-page">
            <Header onSearchClick={() => { setIsSearchOpen(true); setInitialQuery(undefined); }} />
            <main className="main-content">
                <WidgetsArea page="home" />
                <div className="link-cards-container">
                    {linkCategories.map((category, index) => {
                        const delay = initialMountRef.current ? delays[index] : undefined;
                        return (
                            <LinkCard key={category.id} category={category} animationDelay={delay} disableAnimation={prefersReducedMotion} />
                        );
                    })}
                </div>
            </main>
            <SearchModal isOpen={isSearchOpen} onClose={() => { setIsSearchOpen(false); setInitialQuery(undefined); }} initialQuery={initialQuery} />
        </div>
    );
};

export default HomePage;
