export type Locale = 'de' | 'en';

export const translations: Record<Locale, Record<string, string>> = {
    de: {
        greeting_morning: 'Guten Morgen',
        greeting_day: 'Guten Tag',
        greeting_evening: 'Guten Abend',
        greeting_night: 'Gute Nacht',
        exclamation: '!',
        effects_on: 'Effekte: Ein',
        effects_off: 'Effekte: Aus',
    },
    en: {
        greeting_morning: 'Good morning',
        greeting_day: 'Good day',
        greeting_evening: 'Good evening',
        greeting_night: 'Good night',
        exclamation: '!',
        effects_on: 'Effects: On',
        effects_off: 'Effects: Off',
    },
};

let currentLocale: Locale = 'de';

export const setLocale = (locale: Locale) => {
    currentLocale = locale;
};

export const getLocale = () => currentLocale;

export const t = (key: string) => {
    return translations[currentLocale][key] ?? key;
};
