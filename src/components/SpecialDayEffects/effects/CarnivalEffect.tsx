import React from 'react';
import ParticleEffect from './ParticleEffect';

const CarnivalEffect: React.FC = () => (
    <ParticleEffect
        count={60}
        colors={["#ff3b6b", "#ffdd57", "#4dd0e1", "#9b59b6"]}
        sizeMin={6}
        sizeMax={14}
        speedMin={0.4}
        speedMax={1.0}
        direction="down"
        shape="confetti"
    />
);

export default CarnivalEffect;
