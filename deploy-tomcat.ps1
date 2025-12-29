# HomeSite Deployment Script für Tomcat
# Bitte den TOMCAT_PATH an Ihre Installation anpassen!

param(
    [string]$TomcatPath = "C:\bin\apache-tomcat-9.0.113"
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DistDir = Join-Path $ScriptDir "dist"
$WebAppsDir = Join-Path $TomcatPath "webapps"
$TargetDir = Join-Path $WebAppsDir "homesite"

Write-Host "=== HomeSite Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Build erstellen
Write-Host "1. Build erstellen..." -ForegroundColor Yellow
Set-Location $ScriptDir
pnpm run build

if (-not (Test-Path $DistDir)) {
    Write-Host "Fehler: Build fehlgeschlagen - dist Ordner nicht gefunden!" -ForegroundColor Red
    exit 1
}

Write-Host "   Build erfolgreich!" -ForegroundColor Green

# Prüfen ob Tomcat-Pfad existiert
if (-not (Test-Path $WebAppsDir)) {
    Write-Host ""
    Write-Host "Fehler: Tomcat webapps Ordner nicht gefunden unter: $WebAppsDir" -ForegroundColor Red
    Write-Host "Bitte den Pfad anpassen mit: .\deploy-tomcat.ps1 -TomcatPath 'C:\Ihr\Tomcat\Pfad'" -ForegroundColor Yellow
    exit 1
}

# Alten Ordner löschen falls vorhanden
Write-Host "2. Deployment nach Tomcat..." -ForegroundColor Yellow
if (Test-Path $TargetDir) {
    Remove-Item -Path $TargetDir -Recurse -Force
    Write-Host "   Alter homesite Ordner gelöscht" -ForegroundColor Gray
}

# Dateien kopieren
New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
Copy-Item -Path "$DistDir\*" -Destination $TargetDir -Recurse -Force

Write-Host "   Dateien kopiert nach: $TargetDir" -ForegroundColor Green

Write-Host ""
Write-Host "=== Deployment abgeschlossen! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Die Anwendung ist verfügbar unter:" -ForegroundColor White
Write-Host "  http://localhost:8080/homesite/" -ForegroundColor Green
Write-Host ""
Write-Host "Stellen Sie sicher, dass Tomcat läuft!" -ForegroundColor Yellow

Set-Location $ScriptDir

