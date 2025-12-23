import { useState } from 'react';
import type { LinkCategory } from '../../types';
import './LinkCard.css';

interface LinkCardProps {
  category: LinkCategory;
}

const LinkCard = ({ category }: LinkCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`link-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className={`card-label ${isHovered ? 'hidden' : ''}`}>
        {category.label}
      </h2>
      <div className={`dropdown-content ${isHovered ? 'visible' : ''}`}>
        {category.links.map((link, index) => (
          <div key={link.url} className={index === 0 ? 'border-first' : 'border'}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkCard;

