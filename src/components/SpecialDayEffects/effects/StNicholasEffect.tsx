import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const StNicholasEffect: React.FC = () => (
    <ParticleEffect
        count={30}
        colors={["#ffd700", "#ffffff", "#ffecb3"]}
        sizeMin={6}
        sizeMax={12}
        speedMin={0.2}
        speedMax={0.6}
        direction="down"
        shape="star"
    />
);

export default StNicholasEffect;
