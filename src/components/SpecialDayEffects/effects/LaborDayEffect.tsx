import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const LaborDayEffect: React.FC = () => (
    <ParticleEffect
        count={35}
        colors={["#4a90e2", "#50e3c2"]}
        sizeMin={6}
        sizeMax={12}
        speedMin={0.2}
        speedMax={0.6}
        direction="down"
        shape="confetti"
    />
);

export default LaborDayEffect;
