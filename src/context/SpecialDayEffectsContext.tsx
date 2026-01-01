import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { specialDaysConfig } from '../config/specialDays';
import type { UserMode } from '../types/specialEffects';

type ContextValue = {
    userMode: UserMode;
    setUserMode: (m: UserMode) => void;
    activePluginIds: string[]; // plugins that should be active today
    isEnabledForPlugin: (pluginId: string) => boolean;
};

const SDE_USER_MODE_KEY = 'sde:userMode';

const SpecialDayEffectsContext = createContext<ContextValue | undefined>(undefined);

export const SpecialDayEffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userMode, setUserModeState] = useState<UserMode>(() => {
        try {
            const v = localStorage.getItem(SDE_USER_MODE_KEY) as UserMode | null;
            return v ?? 'on';
        } catch (e) {
            return 'on';
        }
    });

    useEffect(() => {
        try { localStorage.setItem(SDE_USER_MODE_KEY, userMode); } catch (e) { /* ignore */ }
    }, [userMode]);

    const today = useMemo(() => new Date(), []);
    const activePluginIds = useMemo(() => {
        return specialDaysConfig.filter(s => s.match(today)).map(s => s.pluginId);
    }, [today]);

    const isEnabledForPlugin = (pluginId: string) => {
        return userMode === 'on';
    };

    const setUserMode = (m: UserMode) => setUserModeState(m);

    return (
        <SpecialDayEffectsContext.Provider value={{ userMode, setUserMode, activePluginIds, isEnabledForPlugin }}>
            {children}
        </SpecialDayEffectsContext.Provider>
    );
};

export const useSpecialDayEffectsContext = () => {
    const ctx = useContext(SpecialDayEffectsContext);
    if (!ctx) throw new Error('useSpecialDayEffectsContext must be used within SpecialDayEffectsProvider');
    return ctx;
};
