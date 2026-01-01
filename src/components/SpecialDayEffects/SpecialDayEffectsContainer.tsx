import React, { useEffect, useMemo, useRef, useState } from 'react';
import './SpecialDayEffects.css';
import { useSpecialDayEffectsContext } from '../../context/SpecialDayEffectsContext';

// Map pluginId -> dynamic import function
const PLUGIN_LOADERS: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
    christmas: () => import('./effects/ChristmasEffect'),
    newyear: () => import('./effects/NewYearEffect'),
};

const SpecialDayEffectsContainer: React.FC = () => {
    const { activePluginIds, isEnabledForPlugin } = useSpecialDayEffectsContext();
    const [loaded, setLoaded] = useState<Record<string, React.ComponentType<any>>>({});
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    // compute which plugin ids should be rendered
    const toRender = useMemo(() => {
        return activePluginIds.filter(id => isEnabledForPlugin(id));
    }, [activePluginIds, isEnabledForPlugin]);

    useEffect(() => {
        // lazy-load needed plugins
        toRender.forEach(id => {
            if (!loaded[id] && PLUGIN_LOADERS[id]) {
                PLUGIN_LOADERS[id]().then(mod => {
                    if (!mountedRef.current) return;
                    setLoaded(prev => ({ ...prev, [id]: mod.default }));
                }).catch(err => {
                    console.error('Failed to load effect plugin', id, err);
                });
            }
        });
    }, [toRender, loaded]);

    return (
        <div className="sde-overlay" aria-hidden>
            <div className="sde-container">
                {toRender.map(id => {
                    const C = loaded[id];
                    if (!C) return null;
                    return <C key={id} />;
                })}
            </div>
        </div>
    );
};

export default SpecialDayEffectsContainer;

