import type { SpecialDayConfigEntry } from '../types/specialEffects';

export const specialDaysConfig: SpecialDayConfigEntry[] = [
    {
        id: 'christmas',
        name: 'Weihnachten',
        match: (date: Date) => {
            const m = date.getMonth() + 1;
            const d = date.getDate();
            // Weihnachten: 24-26 Dez
            return m === 12 && d >= 24 && d <= 26;
        },
        pluginId: 'christmas',
    },
    {
        id: 'newyear',
        name: 'Silvester & Neujahr',
        match: (date: Date) => {
            const m = date.getMonth() + 1;
            const d = date.getDate();
            // Silvester: 31 Dez und 1 Jan
            return (m === 12 && d === 31) || (m === 1 && d === 1);
        },
        pluginId: 'newyear',
    },
];
