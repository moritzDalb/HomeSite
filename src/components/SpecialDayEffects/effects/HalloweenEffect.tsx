import React from 'react';
import ParticleEffect from './ParticleEffect';

const HalloweenEffect: React.FC = () => (
    <ParticleEffect
        count={50}
        colors={["#ffb347", "#ff5e62", "#663300"]}
        sizeMin={6}
        sizeMax={16}
        speedMin={0.4}
        speedMax={1.0}
        direction="down"
        shape="confetti"
    />
);

export default HalloweenEffect;
