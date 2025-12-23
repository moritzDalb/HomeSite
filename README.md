# HomeSite - React + TypeScript Startseite

Eine Single-Page-Anwendung als Browser-Startseite, gebaut mit React und TypeScript.

## Entwicklung

### Installation

```bash
cd homesite-app
npm install
```

### Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung läuft dann unter `http://localhost:5173/homesite/`

### Produktions-Build erstellen

```bash
npm run build
```

Die Build-Dateien werden im `dist/` Ordner erstellt.

## Tomcat Deployment

### 1. Tomcat installieren

Falls noch nicht geschehen, lade Apache Tomcat herunter von: https://tomcat.apache.org/download-10.cgi

Empfohlen: Tomcat 10.x für Windows als ZIP-Archiv oder Windows Service Installer.

### 2. Build für Tomcat kopieren

Nach dem Build müssen die Dateien aus dem `dist/` Ordner in den Tomcat `webapps/homesite/` Ordner kopiert werden:

```powershell
# Beispiel (Pfade anpassen!)
Copy-Item -Path ".\homesite-app\dist\*" -Destination "C:\Tomcat\webapps\homesite\" -Recurse -Force
```

### 3. Tomcat bei Windows-Start automatisch starten

#### Option A: Tomcat als Windows-Dienst installieren (Empfohlen)

1. **Mit dem Windows Service Installer:**
   - Lade den "Windows Service Installer" von der Tomcat-Download-Seite herunter
   - Führe die Installation aus - Tomcat wird automatisch als Windows-Dienst installiert

2. **Manuell mit service.bat:**
   ```powershell
   # Als Administrator ausführen!
   cd C:\Tomcat\bin
   .\service.bat install
   ```

3. **Dienst konfigurieren:**
   - Öffne `services.msc` (Windows + R → `services.msc`)
   - Finde "Apache Tomcat" in der Liste
   - Rechtsklick → "Eigenschaften"
   - Setze "Starttyp" auf "Automatisch"
   - Klicke "OK"

   Oder per PowerShell (als Administrator):
   ```powershell
   Set-Service -Name "Tomcat10" -StartupType Automatic
   Start-Service -Name "Tomcat10"
   ```

#### Option B: Aufgabenplanung (Task Scheduler)

1. Öffne den Aufgabenplaner (Windows + R → `taskschd.msc`)
2. Klicke "Aufgabe erstellen..."
3. Konfiguriere:
   - **Allgemein:** 
     - Name: "Tomcat Autostart"
     - "Mit höchsten Privilegien ausführen" aktivieren
   - **Trigger:** 
     - "Bei Anmeldung" oder "Beim Systemstart"
   - **Aktion:** 
     - Programm: `C:\Tomcat\bin\startup.bat`
   
#### Option C: Startup-Ordner

1. Drücke Windows + R und gib ein: `shell:startup`
2. Erstelle eine Verknüpfung zu `C:\Tomcat\bin\startup.bat`

### 4. Browser-Startseite setzen

Nachdem Tomcat läuft, setze deine Browser-Startseite auf:

```
http://localhost:8080/homesite/
```

## Projektstruktur

```
homesite-app/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.css
│   │   │   └── index.ts
│   │   └── LinkCard/
│   │       ├── LinkCard.tsx
│   │       ├── LinkCard.css
│   │       └── index.ts
│   ├── data/
│   │   └── links.ts        # Link-Kategorien (hier neue Links hinzufügen!)
│   ├── pages/
│   │   └── HomePage/
│   │       ├── HomePage.tsx
│   │       ├── HomePage.css
│   │       └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Links hinzufügen/bearbeiten

Bearbeite die Datei `src/data/links.ts`, um neue Kategorien oder Links hinzuzufügen:

```typescript
{
  id: 'neue-kategorie';
  label: 'Neue Kategorie';
  links: [
    { name: 'Link Name', url: 'https://example.com' },
  ]
}
```

