import React from 'react';
import './PlaceholderEffect.css';

interface Props { id: string; label?: string }

const PlaceholderEffect: React.FC<Props> = ({ id, label }) => {
    return (
        <div className={`placeholder-effect placeholder-${id}`} aria-hidden>
            <div className="placeholder-label">{label ?? id}</div>
        </div>
    );
};

export default PlaceholderEffect;

