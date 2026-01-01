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
        special_christmas: 'Weihnachten',
        special_newyear: 'Silvester & Neujahr',
        special_valentine: 'Valentinstag',
        special_easter: 'Ostern',
        special_good_friday: 'Karfreitag',
        special_easter_monday: 'Ostermontag',
        special_carnival: 'Karneval',
        special_mothers_day: 'Muttertag',
        special_fathers_day: 'Vatertag',
        special_st_patrick: "St. Patrick's Day",
        special_earth_day: 'Earth Day',
        special_halloween: 'Halloween',
        special_thanksgiving_us: 'Thanksgiving (US)',
        special_labor_day: 'Tag der Arbeit',
        special_st_nicholas: 'Nikolaus',
        special_solstice_winter: 'Wintersonnenwende',
        special_solstice_summer: 'Sommersonnenwende',
        special_black_friday: 'Black Friday',
        special_singles_day: "Singles' Day",
        special_hanukkah: 'Chanukka',
        special_ramadan_eid: 'Ramadan / Eid',
        special_pride: 'Pride',
        special_oktoberfest: 'Oktoberfest',
        special_pi_day: 'Pi-Tag',
    },
    en: {
        greeting_morning: 'Good morning',
        greeting_day: 'Good day',
        greeting_evening: 'Good evening',
        greeting_night: 'Good night',
        exclamation: '!',
        effects_on: 'Effects: On',
        effects_off: 'Effects: Off',
        special_christmas: 'Christmas',
        special_newyear: 'New Year',
        special_valentine: "Valentine's Day",
        special_easter: 'Easter',
        special_good_friday: 'Good Friday',
        special_easter_monday: 'Easter Monday',
        special_carnival: 'Carnival',
        special_mothers_day: "Mother's Day",
        special_fathers_day: "Father's Day",
        special_st_patrick: "St. Patrick's Day",
        special_earth_day: 'Earth Day',
        special_halloween: 'Halloween',
        special_thanksgiving_us: 'Thanksgiving (US)',
        special_labor_day: 'Labor Day',
        special_st_nicholas: 'St. Nicholas',
        special_solstice_winter: 'Winter Solstice',
        special_solstice_summer: 'Summer Solstice',
        special_black_friday: 'Black Friday',
        special_singles_day: "Singles' Day",
        special_hanukkah: 'Hanukkah',
        special_ramadan_eid: 'Ramadan / Eid',
        special_pride: 'Pride',
        special_oktoberfest: 'Oktoberfest',
        special_pi_day: 'Pi Day',
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
