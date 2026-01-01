import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const SolsticeWinterEffect: React.FC = () => (
    <ParticleEffect
        count={60}
        colors={["#ffffff", "#cfe9ff", "#e6f7ff"]}
        sizeMin={2}
        sizeMax={8}
        speedMin={0.2}
        speedMax={0.8}
        direction="down"
        shape="circle"
    />
);

export default SolsticeWinterEffect;
