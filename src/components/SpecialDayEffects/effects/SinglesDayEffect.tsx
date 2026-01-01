import React from 'react';
import ParticleEffect from './ParticleEffect';

const SinglesDayEffect: React.FC = () => (
    <ParticleEffect
        count={30}
        colors={["#ff6b6b", "#ffb3b3"]}
        sizeMin={6}
        sizeMax={14}
        speedMin={0.2}
        speedMax={0.7}
        direction="down"
        shape="heart"
    />
);

export default SinglesDayEffect;
