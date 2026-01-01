import React from 'react';
import ParticleEffect from './ParticleEffect';

const GoodFridayEffect: React.FC = () => (
    <ParticleEffect
        count={20}
        colors={["#444444", "#222222"]}
        sizeMin={6}
        sizeMax={12}
        speedMin={0.1}
        speedMax={0.4}
        direction="down"
        shape="spark"
    />
);

export default GoodFridayEffect;
