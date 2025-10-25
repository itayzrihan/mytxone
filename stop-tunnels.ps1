$ErrorActionPreference = "Stop"

# Color output functions
function Write-Success {
    param([string]$message)
    Write-Host "✅ $message" -ForegroundColor Green
}

function Write-Info {
    param([string]$message)
    Write-Host "ℹ️  $message" -ForegroundColor Cyan
}

function Write-Error-Custom {
    param([string]$message)
    Write-Host "❌ $message" -ForegroundColor Red
}

Write-Info "Stopping SSH tunnels..."

# Stop PostgreSQL tunnel
Write-Info "Stopping PostgreSQL tunnel (port 53332)..."
try {
    Get-Process ssh | Where-Object { $_.CommandLine -like "*53332*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Success "PostgreSQL tunnel stopped"
} catch {
    Write-Error-Custom "Error stopping PostgreSQL tunnel: $_"
}

# Stop Redis tunnel
Write-Info "Stopping Redis tunnel (port 6189)..."
try {
    Get-Process ssh | Where-Object { $_.CommandLine -like "*6189*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Success "Redis tunnel stopped"
} catch {
    Write-Error-Custom "Error stopping Redis tunnel: $_"
}

Write-Success "All tunnels stopped!"
