import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

const EarthDayEffect: React.FC = () => (
    <ParticleEffect
        count={40}
        colors={["#2e8b57", "#66c26b", "#2d9cdb"]}
        sizeMin={6}
        sizeMax={14}
        speedMin={0.2}
        speedMax={0.7}
        direction="down"
        shape="leaf"
    />
);

export default EarthDayEffect;
