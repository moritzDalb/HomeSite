import React from 'react';
import ParticleEffect from './ParticleEffect';

const OktoberfestEffect: React.FC = () => (
    <ParticleEffect
        count={40}
        colors={["#1e90ff", "#ffffff"]}
        sizeMin={6}
        sizeMax={12}
        speedMin={0.2}
        speedMax={0.7}
        direction="down"
        shape="confetti"
    />
);

export default OktoberfestEffect;
