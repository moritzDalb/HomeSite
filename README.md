# HomeSite

Personal browser start page built with React, TypeScript and Vite. Shows configurable link categories, supports Dark/Light theme and provides a quick search.

## Features

- 🔗 Link categories with favicons
- ⭐ Favorites system
- 🔍 Quick search
- 🌙 Dark/Light theme toggle
- 📱 Responsive design
- 🎉 Special visual effects for certain days (e.g. Christmas, Halloween, Pride)

## What's new (Special Day Effects)

This project now includes a collection of visual effects that can be activated automatically or manually on special days. Examples of supported days:

- Christmas, New Year's Eve & New Year
- Valentine's Day
- Easter, Good Friday, Easter Monday
- Carnival
- Mother's Day, Father's Day (region-dependent)
- St. Patrick's Day
- Earth Day
- Halloween
- Thanksgiving (US)
- Labor Day / May Day
- St. Nicholas Day
- Winter / Summer Solstice
- Black Friday, Singles' Day
- Hanukkah, Ramadan / Eid (if supported by the runtime)
- Pride (entire June)
- Oktoberfest
- Pi Day

Technical note: effects are implemented as small, lazy-loaded React components under `src/components/SpecialDayEffects/effects`. The detection of which effects should be active on a given day is handled in `src/config/specialDays.ts`.

## Localization & region-specific rules

- The project supports at least the `de` and `en` locales via `src/i18n/index.ts`.
- Some holidays are region-specific. Example: Father's Day
  - For `de` (German) Father's Day is calculated as Ascension Day (39 days after Easter).
  - For other locales (e.g. `en`) the default is the third Sunday in June (US style).
- The functions `getLocale()` / `setLocale(locale)` in `src/i18n/index.ts` control the locale. You can call `setLocale('en')` at runtime to switch to English.

## Calendar / movable holidays

- Easter is calculated using the Computus algorithm (Gregorian calendar).
- Hanukkah and Ramadan/Eid are detected client-side using `Intl.DateTimeFormat` with calendar codes `en-u-ca-hebrew` and `en-u-ca-islamic` if the runtime supports these calendars. If `Intl` does not provide these calendars, these events are not automatically detected by default (you can add a library or service for more accurate calculations).

## Access & configuration of special days

- The list of special days is in `src/config/specialDays.ts`. Each entry has the following shape:
  - `id`: unique id
  - `name`: display name (German)
  - `match(date: Date) => boolean`: function that determines whether the day is active
  - `pluginId`: id of the effect component (file name under `effects`)

- Effect components are lazy-loaded via dynamic imports to reduce the initial bundle size.

## Enabling / disabling effects

- Effects are enabled by default. The user mode is stored in localStorage under the key `sde:userMode` (`'on'` or `'off'`).
- The UI provides a toggle (`EffectToggle`) in the SpecialDayEffects area. For manual testing you can also change localStorage or call `setUserMode` in the context.

## Accessibility

- Effects respect the `prefers-reduced-motion` media query and are disabled if the user prefers reduced motion.
- Titles and aria attributes are localized (if corresponding i18n keys exist).

## Development

**Prerequisites:** Node.js (18+), pnpm

Start dev server:

```powershell
pnpm install
pnpm run dev
```

The app usually runs at `http://localhost:5173/homesite/`.

Note: If you see HMR warnings during development (e.g. "Could not Fast Refresh ... export is incompatible"), restart the dev server or check that context/hook exports are named functions. The project was already adjusted to reduce those HMR issues.

## Deployment (Tomcat)

1. **Create a build:**
   ```powershell
   pnpm run build
   ```

2. **Use the deploy script (recommended):**
   ```powershell
   .\deploy-tomcat.ps1 -TomcatPath "C:\Path\to\tomcat"
   ```

3. **Set browser start page:**

```text
http://localhost:8080/homesite/
```

## Notes on the use of symbols / disclaimer (AI generation)

Some of the symbols, icons or generated decoration elements used in this application were created or edited with the help of AI tools. Please note:

- These symbols may be treated differently under copyright or licensing depending on the AI tool used and its specific terms.
- If you plan to use the symbols commercially, redistribute them or include them in a project with strict licensing requirements, please check the licensing terms of the AI tools used or replace the assets with license‑compliant alternatives.
- AI models can be trained on varied data sources; if you have concerns about copyright or provenance, consider using your own or explicitly license‑free assets.

## Project structure (short)

```
HomeSite/
├── src/
│   ├── components/     # UI components (Header, LinkCard, ThemeToggle, SpecialDayEffects, etc.)
│   ├── context/        # React contexts (Theme, Favorites, SpecialDayEffects)
│   ├── config/         # specialDays.ts (rules & detection for effects)
│   ├── data/           # links.ts
│   ├── pages/          # Page components
│   └── types/          # Type definitions
├── public/             # Static assets
├── package.json
├── vite.config.ts
└── deploy-tomcat.ps1   # Deployment script
```
