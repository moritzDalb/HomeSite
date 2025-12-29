import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import LinkCard from '../../components/LinkCard';
import GreetingWidget from '../../components/GreetingWidget';
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
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="home-page">
            <Header onSearchClick={() => setIsSearchOpen(true)} />
            <main className="main-content">
                <GreetingWidget />
                <div className="link-cards-container">
                    {codingLinks.map((category) => (
                        <LinkCard key={category.id} category={category} />
                    ))}
                </div>
            </main>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
};

export default CodingPage;
