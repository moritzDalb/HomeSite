import React from 'react';
import ParticleEffect from './ParticleEffect';

const EasterMondayEffect: React.FC = () => (
    <ParticleEffect
        count={30}
        colors={["#dff0d8", "#fff2cc", "#fce4ec"]}
        sizeMin={6}
        sizeMax={12}
        speedMin={0.2}
        speedMax={0.6}
        direction="down"
        shape="leaf"
    />
);

export default EasterMondayEffect;
