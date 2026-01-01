import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const StPatrickEffect: React.FC = () => (
    <ParticleEffect
        count={40}
        colors={["#2b8a3e", "#66c26b"]}
        sizeMin={6}
        sizeMax={12}
        speedMin={0.2}
        speedMax={0.7}
        direction="down"
        shape="leaf"
    />
);

export default StPatrickEffect;
