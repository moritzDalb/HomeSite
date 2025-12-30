import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import LinkCard from '../../components/LinkCard';
import GreetingWidget from '../../components/GreetingWidget';
import SearchModal from '../../components/SearchModal';
import { linkCategories } from '../../data/links';
import './HomePage.css';

const HomePage = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);

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

    return (
        <div className="home-page">
            <Header onSearchClick={() => { setIsSearchOpen(true); setInitialQuery(undefined); }} />
            <main className="main-content">
                <GreetingWidget />
                <div className="link-cards-container">
                    {linkCategories.map((category) => (
                        <LinkCard key={category.id} category={category} />
                    ))}
                </div>
            </main>
            <SearchModal isOpen={isSearchOpen} onClose={() => { setIsSearchOpen(false); setInitialQuery(undefined); }} initialQuery={initialQuery} />
        </div>
    );
};

export default HomePage;
