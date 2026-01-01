import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const ThanksgivingEffect: React.FC = () => (
    <ParticleEffect
        count={50}
        colors={["#c66a1e", "#ffb347", "#8f5a2b"]}
        sizeMin={8}
        sizeMax={20}
        speedMin={0.3}
        speedMax={0.9}
        direction="down"
        shape="leaf"
    />
);

export default ThanksgivingEffect;
