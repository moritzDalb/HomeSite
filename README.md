# HomeSite

Personal browser start page built with React, TypeScript and Vite. Shows configurable link categories, supports Dark/Light theme and provides a search function.

## Features

- 🔗 Link categories with favicons
- ⭐ Favorites system
- 🔍 Quick search
- 🌙 Dark/Light theme toggle
- 📱 Responsive design

## Installation

**Prerequisites:** Node.js (18+), pnpm

```powershell
pnpm install
pnpm run dev
```

The app runs at `http://localhost:5173/homesite/`

## Configuration

### Adjust links

Edit `src/data/links.ts` to add your own links:

```typescript
export const linkCategories: LinkCategory[] = [
    {
        id: 'category-id',
        label: 'Category Name',
        links: [
            { name: 'Link Name', url: 'https://example.com' },
            { name: 'Another Link', url: 'https://andere-seite.de' },
        ],
    },
    // more categories...
];
```

Each link consists of:
- `name`: display name
- `url`: full URL
- `icon` (optional): custom icon

## Deployment (Tomcat)

1. **Create build:**
   ```powershell
   pnpm run build
   ```

2. **Use deploy script (recommended):**
   ```powershell
   .\deploy-tomcat.ps1 -TomcatPath "C:\Path\to\tomcat"
   ```

3. **Set browser start page:**
   ```
   http://localhost:8080/homesite/
   ```

## Project structure

```
HomeSite/
├── src/
│   ├── components/     # UI components (Header, LinkCard, ThemeToggle, etc.)
│   ├── context/        # React context (Theme, Favorites)
│   ├── data/
│   │   └── links.ts    # ⬅️ Configure your links here!
│   ├── pages/          # Page components (HomePage, CodingPage)
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── package.json
├── vite.config.ts
└── deploy-tomcat.ps1   # Deployment script
```
