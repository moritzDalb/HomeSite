import React from 'react';
import ParticleEffect from './ParticleEffect';

const MothersDayEffect: React.FC = () => (
    <ParticleEffect
        count={35}
        colors={["#ffb6c1", "#ffd1dc", "#fff5e6"]}
        sizeMin={8}
        sizeMax={16}
        speedMin={0.2}
        speedMax={0.6}
        direction="down"
        shape="heart"
    />
);

export default MothersDayEffect;
