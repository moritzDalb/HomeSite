import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const PiDayEffect: React.FC = () => (
    <ParticleEffect
        count={30}
        colors={["#4caf50", "#2196f3"]}
        sizeMin={6}
        sizeMax={10}
        speedMin={0.2}
        speedMax={0.6}
        direction="down"
        shape="confetti"
    />
);

export default PiDayEffect;
