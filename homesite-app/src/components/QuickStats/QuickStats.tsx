import { Link2, FolderOpen, Star, Search } from 'lucide-react';
import { linkCategories } from '../../data/links';
import { useFavorites } from '../../context/FavoritesContext';
import './QuickStats.css';

interface QuickStatsProps {
    onSearchClick: () => void;
}

const QuickStats = ({ onSearchClick }: QuickStatsProps) => {
    const { favorites } = useFavorites();

    const totalLinks = linkCategories.reduce((sum, cat) => sum + cat.links.length, 0);

    const stats = [
        {
            icon: <FolderOpen size={20} />,
            value: linkCategories.length,
            label: 'Kategorien',
            color: '#fcbf49',
        },
        {
            icon: <Link2 size={20} />,
            value: totalLinks,
            label: 'Links',
            color: '#d62828',
        },
        {
            icon: <Star size={20} />,
            value: favorites.length,
            label: 'Favoriten',
            color: '#f77f00',
        },
    ];

    return (
        <div className="quick-stats">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="stat-item"
                    style={{ '--stat-color': stat.color } as React.CSSProperties}
                >
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-info">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                </div>
            ))}
            <button className="search-trigger" onClick={onSearchClick}>
                <Search size={18} />
                <span>Suche</span>
                <kbd>Strg+K</kbd>
            </button>
        </div>
    );
};

export default QuickStats;
