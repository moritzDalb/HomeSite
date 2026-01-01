import type { SpecialDayConfigEntry } from '../types/specialEffects';
import { getLocale } from '../i18n';

// helper: nth weekday of a month (weekday: 0=Sun..6=Sat). n = 1..5
const nthWeekdayOfMonth = (year: number, month: number, weekday: number, n: number) => {
    const first = new Date(year, month - 1, 1);
    const firstWeekday = first.getDay();
    const offset = (7 + weekday - firstWeekday) % 7;
    const day = 1 + offset + (n - 1) * 7;
    return new Date(year, month - 1, day);
};

// Computus: calculate Easter Sunday for a given year (Gregorian)
const easterDate = (Y: number) => {
    const a = Y % 19;
    const b = Math.floor(Y / 100);
    const c = Y % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March,4=April
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Y, month - 1, day);
};

const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

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
    {
        id: 'valentine',
        name: 'Valentinstag',
        match: (date: Date) => date.getMonth() + 1 === 2 && date.getDate() === 14,
        pluginId: 'valentine',
    },
    {
        id: 'easter',
        name: 'Ostern',
        match: (date: Date) => {
            const e = easterDate(date.getFullYear());
            return isSameDay(e, date);
        },
        pluginId: 'easter',
    },
    {
        id: 'good_friday',
        name: 'Karfreitag',
        match: (date: Date) => {
            const e = easterDate(date.getFullYear());
            const gf = new Date(e);
            gf.setDate(e.getDate() - 2); // Good Friday: two days before Easter
            return isSameDay(gf, date);
        },
        pluginId: 'good_friday',
    },
    {
        id: 'easter_monday',
        name: 'Ostermontag',
        match: (date: Date) => {
            const e = easterDate(date.getFullYear());
            const em = new Date(e);
            em.setDate(e.getDate() + 1);
            return isSameDay(em, date);
        },
        pluginId: 'easter_monday',
    },
    {
        id: 'carnival',
        name: 'Karneval',
        match: (date: Date) => {
            // approximate: Rosenmontag = Monday before Ash Wednesday; we approximate by checking February/March and weekdays near late Feb
            const m = date.getMonth() + 1;
            return (m === 2 || m === 3) && date.getDay() === 1; // simple approximation: Mondays in Feb/Mar
        },
        pluginId: 'carnival',
    },
    {
        id: 'mothers_day',
        name: 'Muttertag',
        match: (date: Date) => {
            // second Sunday in May
            const y = date.getFullYear();
            const d = nthWeekdayOfMonth(y, 5, 0, 2);
            return isSameDay(d, date);
        },
        pluginId: 'mothers_day',
    },
    {
        id: 'fathers_day',
        name: 'Vatertag',
        match: (date: Date) => {
            // region-specific: Germany => Christi Himmelfahrt (Ascension, 39 days after Easter)
            // English locale => US-style third Sunday in June
            const locale = getLocale();
            const y = date.getFullYear();
            if (locale === 'de') {
                const e = easterDate(y);
                const asc = new Date(e);
                asc.setDate(e.getDate() + 39); // Ascension Day
                return isSameDay(asc, date);
            }
            // default: third Sunday in June
            const d = nthWeekdayOfMonth(y, 6, 0, 3);
            return isSameDay(d, date);
        },
        pluginId: 'fathers_day',
    },
    {
        id: 'st_patrick',
        name: 'St. Patrick\'s Day',
        match: (date: Date) => date.getMonth() + 1 === 3 && date.getDate() === 17,
        pluginId: 'st_patrick',
    },
    {
        id: 'earth_day',
        name: 'Earth Day',
        match: (date: Date) => date.getMonth() + 1 === 4 && date.getDate() === 22,
        pluginId: 'earth_day',
    },
    {
        id: 'halloween',
        name: 'Halloween',
        match: (date: Date) => date.getMonth() + 1 === 10 && date.getDate() === 31,
        pluginId: 'halloween',
    },
    {
        id: 'thanksgiving_us',
        name: 'Thanksgiving (US)',
        match: (date: Date) => {
            // fourth Thursday in November
            const y = date.getFullYear();
            const d = nthWeekdayOfMonth(y, 11, 4, 4);
            return isSameDay(d, date);
        },
        pluginId: 'thanksgiving_us',
    },
    {
        id: 'labor_day',
        name: 'Tag der Arbeit',
        match: (date: Date) => date.getMonth() + 1 === 5 && date.getDate() === 1,
        pluginId: 'labor_day',
    },
    {
        id: 'st_nicholas',
        name: 'Nikolaus',
        match: (date: Date) => date.getMonth() + 1 === 12 && date.getDate() === 6,
        pluginId: 'st_nicholas',
    },
    {
        id: 'solstice_winter',
        name: 'Wintersonnenwende',
        match: (date: Date) => date.getMonth() + 1 === 12 && date.getDate() === 21,
        pluginId: 'solstice_winter',
    },
    {
        id: 'solstice_summer',
        name: 'Sommersonnenwende',
        match: (date: Date) => date.getMonth() + 1 === 6 && date.getDate() === 21,
        pluginId: 'solstice_summer',
    },
    {
        id: 'black_friday',
        name: 'Black Friday',
        match: (date: Date) => {
            // day after US Thanksgiving
            const y = date.getFullYear();
            const t = nthWeekdayOfMonth(y, 11, 4, 4); // thanksgiving
            const bf = new Date(t);
            bf.setDate(t.getDate() + 1);
            return isSameDay(bf, date);
        },
        pluginId: 'black_friday',
    },
    {
        id: 'singles_day',
        name: "Singles' Day",
        match: (date: Date) => date.getMonth() + 1 === 11 && date.getDate() === 11,
        pluginId: 'singles_day',
    },
    {
        id: 'hanukkah',
        name: 'Chanukka',
        match: (date: Date) => {
            // Use Intl Hebrew calendar conversion (runs in browser): Hanukkah starts Kislev 25 and lasts 8 days
            try {
                const fmt = new Intl.DateTimeFormat('en-u-ca-hebrew', { month: 'numeric', day: 'numeric' });
                const parts = fmt.formatToParts(date);
                const monthPart = parts.find(p => p.type === 'month');
                const dayPart = parts.find(p => p.type === 'day');
                if (!monthPart || !dayPart) return false;
                const hMonth = Number(monthPart.value);
                const hDay = Number(dayPart.value);
                // Kislev is Hebrew month 3, Tevet is 4. Hanukkah: Kislev 25..Kislev 30 + Tevet 1..2 (8 days)
                if ((hMonth === 3 && hDay >= 25) || (hMonth === 4 && hDay <= 2)) return true;
            } catch (e) {
                // Intl may not be available in some environments; fall back to disabled
            }
            return false;
        },
        pluginId: 'hanukkah',
    },
    {
        id: 'ramadan_eid',
        name: 'Ramadan / Eid',
        match: (date: Date) => {
            // Use Intl Islamic calendar conversion (approximate, depends on civil/tabular algorithm of the environment).
            // Eid al-Fitr is 1 Shawwal (Islamic month 10, day 1). We match that day.
            try {
                const fmt = new Intl.DateTimeFormat('en-u-ca-islamic', { month: 'numeric', day: 'numeric' });
                const parts = fmt.formatToParts(date);
                const monthPart = parts.find(p => p.type === 'month');
                const dayPart = parts.find(p => p.type === 'day');
                if (!monthPart || !dayPart) return false;
                const iMonth = Number(monthPart.value);
                const iDay = Number(dayPart.value);
                // Shawwal is Islamic month 10; Eid al-Fitr is 1 Shawwal
                return iMonth === 10 && iDay === 1;
            } catch (e) {
                // Intl may not be available -> disable by default
            }
            return false;
        },
        pluginId: 'ramadan_eid',
    },
];
