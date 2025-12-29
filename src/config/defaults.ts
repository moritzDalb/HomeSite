export type Locale = 'de' | 'en';

export const defaults = {
    // Standard-Sprache (wird beim Start verwendet)
    defaultLocale: 'en' as Locale,

    // Mapping von kurzen Locale-Keys zu Intl-kompatiblen BCP-47-Codes
    localeMap: {
        de: 'de-DE',
        en: 'en-US',
    } as Record<Locale, string>,

    // Standard-Optionen für Datum-/Zeit-Formatierung
    dateOptions: {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    } as Intl.DateTimeFormatOptions,

    timeOptions: {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    } as Intl.DateTimeFormatOptions,
};
