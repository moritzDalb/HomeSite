import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
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

export function SpecialDayEffectsProvider({ children }: { children: React.ReactNode }) {
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

    const isEnabledForPlugin = useCallback((pluginId: string) => {
        return userMode === 'on';
    }, [userMode]);

    const setUserMode = useCallback((m: UserMode) => setUserModeState(m), []);

    const value = useMemo(() => ({ userMode, setUserMode, activePluginIds, isEnabledForPlugin }), [userMode, setUserMode, activePluginIds, isEnabledForPlugin]);

    return (
        <SpecialDayEffectsContext.Provider value={value}>
            {children}
        </SpecialDayEffectsContext.Provider>
    );
}

export function useSpecialDayEffectsContext() {
    const ctx = useContext(SpecialDayEffectsContext);
    if (!ctx) throw new Error('useSpecialDayEffectsContext must be used within SpecialDayEffectsProvider');
    return ctx;
}
