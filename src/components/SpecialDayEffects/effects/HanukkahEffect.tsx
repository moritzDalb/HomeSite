import React from 'react';
import ParticleEffect from './ParticleEffect';
import { t } from '../../../i18n';

// Note: match for hanukkah currently disabled; effect can still be manually enabled
const HanukkahEffect: React.FC = () => (
    <ParticleEffect
        count={30}
        colors={["#2e77bb", "#ffffff"]}
        sizeMin={6}
        sizeMax={14}
        speedMin={0.2}
        speedMax={0.6}
        direction="down"
        shape="star"
    />
);

export default HanukkahEffect;
