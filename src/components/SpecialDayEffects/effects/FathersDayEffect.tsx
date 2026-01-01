import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const FathersDayEffect: React.FC = () => (
    <ParticleEffect
        count={25}
        colors={["#a0c4ff", "#6b8cff", "#dfeaff"]}
        sizeMin={6}
        sizeMax={12}
        speedMin={0.2}
        speedMax={0.7}
        direction="down"
        shape="spark"
    />
);

export default FathersDayEffect;
