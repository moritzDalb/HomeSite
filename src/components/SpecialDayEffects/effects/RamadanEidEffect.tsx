import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

// Note: match for Ramadan/Eid currently disabled; effect can still be manually enabled
const RamadanEidEffect: React.FC = () => (
    <ParticleEffect
        count={35}
        colors={["#ffd700", "#4b8b3b"]}
        sizeMin={6}
        sizeMax={14}
        speedMin={0.2}
        speedMax={0.6}
        direction="down"
        shape="star"
    />
);

export default RamadanEidEffect;
