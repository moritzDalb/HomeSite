import { useState } from 'react';
import { Star } from 'lucide-react';
import type { LinkCategory } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import './LinkCard.css';

interface LinkCardProps {
    category: LinkCategory;
    animationDelay?: string; // z.B. '0.16s'
    disableAnimation?: boolean; // wenn true, wird animation per inline-style ausgeschaltet
}

const LinkCard = ({ category, animationDelay, disableAnimation }: LinkCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();

    const handleFavoriteClick = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(url);
    };

    // Setze die Verzögerung als CSS-Variable, damit die CSS-Definition (animation + fill-mode) erhalten bleibt.
    const style: React.CSSProperties = {};
    if (disableAnimation) {
        // komplett ausschalten
        style.animation = 'none';
    } else if (animationDelay) {
        // CSS-Variable verwenden: --animation-delay
        (style as any)['--animation-delay'] = animationDelay;
    }

    return (
        <div
            className={`link-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={style}
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
                                    ? 'Remove from favorites'
                                    : 'Add to favorites'
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
