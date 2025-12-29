# HomeSite deployment script for Tomcat
# Please adjust TOMCAT_PATH to your installation!

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

# Build project
Write-Host "1. Building project..." -ForegroundColor Yellow
Set-Location $ScriptDir
pnpm run build

if (-not (Test-Path $DistDir)) {
    Write-Host "Error: Build failed - dist folder not found!" -ForegroundColor Red
    exit 1
}

Write-Host "   Build successful!" -ForegroundColor Green

# Verify Tomcat path exists
if (-not (Test-Path $WebAppsDir)) {
    Write-Host ""
    Write-Host "Error: Tomcat webapps folder not found at: $WebAppsDir" -ForegroundColor Red
    Write-Host "Please adjust the path with: .\deploy-tomcat.ps1 -TomcatPath 'C:\Your\Tomcat\Path'" -ForegroundColor Yellow
    exit 1
}

# Remove previous folder if present
Write-Host "2. Deploying to Tomcat..." -ForegroundColor Yellow
if (Test-Path $TargetDir) {
    Remove-Item -Path $TargetDir -Recurse -Force
    Write-Host "   Previous homesite folder removed" -ForegroundColor Gray
}

# Copy files
New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
Copy-Item -Path "$DistDir\*" -Destination $TargetDir -Recurse -Force

Write-Host "   Files copied to: $TargetDir" -ForegroundColor Green

Write-Host ""
Write-Host "=== Deployment complete! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "The application is available at:" -ForegroundColor White
Write-Host "  http://localhost:8080/homesite/" -ForegroundColor Green
Write-Host ""
Write-Host "Ensure Tomcat is running!" -ForegroundColor Yellow

Set-Location $ScriptDir

