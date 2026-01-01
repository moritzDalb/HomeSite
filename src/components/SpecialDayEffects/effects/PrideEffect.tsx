import React from 'react';
import ParticleEffect from './ParticleEffect';

const PrideEffect: React.FC = () => (
    <ParticleEffect
        count={60}
        colors={["#e40303","#ff8c00","#ffed00","#008026","#004dff","#750787"]}
        sizeMin={6}
        sizeMax={14}
        speedMin={0.3}
        speedMax={1.0}
        direction="down"
        shape="confetti"
    />
);

export default PrideEffect;
