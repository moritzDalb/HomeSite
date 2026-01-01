import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const SolsticeSummerEffect: React.FC = () => (
    <ParticleEffect
        count={30}
        colors={["#ffd76b", "#ffdd7a"]}
        sizeMin={6}
        sizeMax={14}
        speedMin={0.2}
        speedMax={0.6}
        direction="down"
        shape="spark"
    />
);

export default SolsticeSummerEffect;
