import React from 'react';
import { Sparkles } from 'lucide-react';
import { useSpecialDayEffectsContext } from '../../context/SpecialDayEffectsContext';
import { t } from '../../i18n';
import './SpecialDayEffects.css';

const EffectToggle: React.FC = () => {
    const { userMode, setUserMode } = useSpecialDayEffectsContext();

    const toggle = () => {
        setUserMode(userMode === 'on' ? 'off' : 'on');
    };

    const title = userMode === 'on' ? t('effects_on') : t('effects_off');

    return (
        <button className={`sde-toggle theme-toggle`} onClick={toggle} title={title} aria-pressed={userMode === 'on'} aria-label="Hintergrundeffekte">
            <div className={`toggle-track ${userMode === 'on' ? 'light' : ''}`}>
                <Sparkles size={14} />
                <div className="toggle-thumb" />
            </div>
        </button>
    );
};

export default EffectToggle;

