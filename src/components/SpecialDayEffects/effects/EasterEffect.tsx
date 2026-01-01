import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const EasterEffect: React.FC = () => (
    <ParticleEffect
        count={45}
        colors={["#ffd9b3", "#ffeead", "#cbe7a6"]}
        sizeMin={6}
        sizeMax={14}
        speedMin={0.2}
        speedMax={0.7}
        direction="down"
        shape="confetti"
    />
);

export default EasterEffect;
