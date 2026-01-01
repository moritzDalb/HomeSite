import React from 'react';
import ParticleEffect from './ParticleEffect';

const BlackFridayEffect: React.FC = () => (
    <ParticleEffect
        count={40}
        colors={["#ffffff", "#ffd700", "#000000"]}
        sizeMin={6}
        sizeMax={18}
        speedMin={0.3}
        speedMax={1.0}
        direction="down"
        shape="confetti"
    />
);

export default BlackFridayEffect;
