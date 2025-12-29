# HomeSite

Persönliche Browser-Startseite mit React, TypeScript und Vite. Zeigt konfigurierbare Link-Kategorien, unterstützt Dark/Light-Theme und bietet eine Suchfunktion.

## Features

- 🔗 Link-Kategorien mit Favicons
- ⭐ Favoriten-System
- 🔍 Schnellsuche
- 🌙 Dark/Light Theme-Toggle
- 📱 Responsive Design

## Installation

**Voraussetzungen:** Node.js (18+), pnpm

```powershell
cd homesite-app
pnpm install
pnpm run dev
```

Die Anwendung läuft unter `http://localhost:5173/homesite/`

## Konfiguration

### Links anpassen

Bearbeite `homesite-app/src/data/links.ts`, um eigene Links hinzuzufügen:

```typescript
export const linkCategories: LinkCategory[] = [
    {
        id: 'kategorie-id',
        label: 'Kategorie-Name',
        links: [
            { name: 'Link-Name', url: 'https://example.com' },
            { name: 'Weiterer Link', url: 'https://andere-seite.de' },
        ],
    },
    // weitere Kategorien...
];
```

Jeder Link besteht aus:
- `name`: Anzeigename
- `url`: Vollständige URL
- `icon` (optional): Benutzerdefiniertes Icon

## Deployment (Tomcat)

1. **Build erstellen:**
   ```powershell
   cd homesite-app
   pnpm run build
   ```

2. **Mit Deploy-Skript (empfohlen):**
   ```powershell
   .\deploy-tomcat.ps1 -TomcatPath "C:\Pfad\zu\tomcat"
   ```

3. **Browser-Startseite setzen:**
   ```
   http://localhost:8080/homesite/
   ```

## Projektstruktur

```
homesite-app/
├── src/
│   ├── components/     # UI-Komponenten (Header, LinkCard, ThemeToggle, etc.)
│   ├── context/        # React Context (Theme, Favorites)
│   ├── data/
│   │   └── links.ts    # ⬅️ Hier eigene Links konfigurieren!
│   ├── pages/          # Seitenkomponenten (HomePage, CodingPage)
│   └── types/          # TypeScript-Typdefinitionen
└── public/             # Statische Assets
```

