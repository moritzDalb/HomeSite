import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const ValentineEffect: React.FC = () => (
    <ParticleEffect
        count={30}
        colors={["#ff6b9a", "#ff2d6f", "#ffd1e3"]}
        sizeMin={8}
        sizeMax={18}
        speedMin={0.3}
        speedMax={0.8}
        direction="down"
        shape="heart"
    />
);

export default ValentineEffect;
