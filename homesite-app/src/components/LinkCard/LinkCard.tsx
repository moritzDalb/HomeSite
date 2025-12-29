import { useState } from 'react';
import { Star } from 'lucide-react';
import type { LinkCategory } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import './LinkCard.css';

interface LinkCardProps {
    category: LinkCategory;
}

const LinkCard = ({ category }: LinkCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();

    const handleFavoriteClick = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(url);
    };

    return (
        <div
            className={`link-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h2 className={`card-label ${isHovered ? 'hidden' : ''}`}>{category.label}</h2>
            <div className={`dropdown-content ${isHovered ? 'visible' : ''}`}>
                {category.links.map((link) => (
                    <div key={link.url} className="link-item">
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.name}
                        </a>
                        <button
                            className={`favorite-btn ${isFavorite(link.url) ? 'is-favorite' : ''}`}
                            onClick={(e) => handleFavoriteClick(e, link.url)}
                            aria-label={
                                isFavorite(link.url)
                                    ? 'Aus Favoriten entfernen'
                                    : 'Zu Favoriten hinzufügen'
                            }
                        >
                            <Star size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LinkCard;
