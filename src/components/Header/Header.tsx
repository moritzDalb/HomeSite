import { Link } from 'react-router-dom';
import { Search, Link2, FolderOpen, Star } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { useFavorites } from '../../context/FavoritesContext';
import { linkCategories } from '../../data/links';
import './Header.css';
import EffectToggle from '../SpecialDayEffects/EffectToggle';

interface HeaderProps {
    onSearchClick?: () => void;
}

const Header = ({ onSearchClick }: HeaderProps) => {
    const { favorites } = useFavorites();
    const totalLinks = linkCategories.reduce((sum, cat) => sum + cat.links.length, 0);

    return (
        <header className="header">
            <nav className="header-nav">
                <div className="nav-links">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    <Link to="/coding" className="nav-link">
                        Coding
                    </Link>
                </div>

                <div className="header-center">
                    <div className="mini-stats">
                        <span className="mini-stat" title="Categories">
                            <FolderOpen size={16} />
                            {linkCategories.length}
                        </span>
                        <span className="mini-stat" title="Links">
                            <Link2 size={16} />
                            {totalLinks}
                        </span>
                        <span className="mini-stat" title="Favorites">
                            <Star size={16} />
                            {favorites.length}
                        </span>
                    </div>
                </div>

                <div className="header-actions">
                    {onSearchClick && (
                        <button
                            className="search-button"
                            onClick={onSearchClick}
                            title="Search (Ctrl+K)"
                        >
                            <Search size={20} />
                            <span className="search-label">Search</span>
                            <kbd>⌘K</kbd>
                        </button>
                    )}
                    <ThemeToggle />
                    <EffectToggle />
                </div>
            </nav>
        </header>
    );
};

export default Header;
