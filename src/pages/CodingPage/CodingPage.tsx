import { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../../components/Header';
import LinkCard from '../../components/LinkCard';
import WidgetsArea from '../../components/WidgetsArea';
import SearchModal from '../../components/SearchModal';
import type { LinkCategory } from '../../types';
import '../HomePage/HomePage.css';

const codingLinks: LinkCategory[] = [
    {
        id: 'github',
        label: 'GitHub',
        links: [{ name: 'Mein GitHub', url: 'https://github.com/moritzDalb' }],
    },
    {
        id: 'tools',
        label: 'Tools',
        links: [
            { name: 'Platzhalter 1', url: '#' },
            { name: 'Platzhalter 2', url: '#' },
        ],
    },
    {
        id: 'docs',
        label: 'Docs',
        links: [
            { name: 'Platzhalter 1', url: '#' },
            { name: 'Platzhalter 2', url: '#' },
        ],
    },
    {
        id: 'learning',
        label: 'Learning',
        links: [
            { name: 'Platzhalter 1', url: '#' },
            { name: 'Platzhalter 2', url: '#' },
        ],
    },
];

const CodingPage = () => {
    // Open the search modal on initial page load so the search input is focused
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);
    const initialMountRef = useRef(true);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }

            const active = document.activeElement;
            const isTypingIntoInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable);
            if (!isTypingIntoInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const key = e.key;
                if (key.length === 1 && key !== ' ') {
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
        const id = setTimeout(() => { initialMountRef.current = false; }, 50);
        return () => clearTimeout(id);
    }, []);

    // prefers-reduced-motion per JS (optional, CSS ist primär)
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mq.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else mq.addListener(handler);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', handler);
            else mq.removeListener(handler);
        };
    }, []);

    const baseDelay = 0.08;
    const maxDelay = 0.9;

    const delays = useMemo(() => codingLinks.map((_, i) => `${Math.min(i * baseDelay, maxDelay)}s`), []);

    return (
        <div className="home-page">
            <Header onSearchClick={() => setIsSearchOpen(true)} />
            <main className="main-content">
                <WidgetsArea page="coding" />
                <div className="link-cards-container">
                    {codingLinks.map((category, index) => {
                        const delay = initialMountRef.current ? delays[index] : undefined;
                        return <LinkCard key={category.id} category={category} animationDelay={delay} disableAnimation={prefersReducedMotion} />;
                    })}
                </div>
            </main>
            <SearchModal isOpen={isSearchOpen} onClose={() => { setIsSearchOpen(false); setInitialQuery(undefined); }} initialQuery={initialQuery} />
        </div>
    );
};

export default CodingPage;
