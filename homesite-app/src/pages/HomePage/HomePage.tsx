import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import LinkCard from '../../components/LinkCard';
import GreetingWidget from '../../components/GreetingWidget';
import SearchModal from '../../components/SearchModal';
import { linkCategories } from '../../data/links';
import './HomePage.css';

const HomePage = () => {
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
          {linkCategories.map((category) => (
            <LinkCard key={category.id} category={category} />
          ))}
        </div>
      </main>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default HomePage;
