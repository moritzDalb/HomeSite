export type UserMode = 'off' | 'on';

export interface EffectConfig {
    id: string;
    name: string;
    priority?: number;
    prefersReducedMotion?: boolean;
}

// Simple plugin contract: effect is a React component that will be mounted when active
// The provider/container will import and render the component.
export type EffectComponent = React.FC;

export interface SpecialDayConfigEntry {
    id: string;
    name: string;
    match: (date: Date) => boolean;
    pluginId: string; // same as id for now
}
