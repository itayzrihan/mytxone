$ErrorActionPreference = "Stop"

# Color output functions
function Write-Success {
    param([string]$message)
    Write-Host "SUCCESS: $message" -ForegroundColor Green
}

function Write-Info {
    param([string]$message)
    Write-Host "INFO: $message" -ForegroundColor Cyan
}

function Write-Error-Custom {
    param([string]$message)
    Write-Host "ERROR: $message" -ForegroundColor Red
}

Write-Info "Starting SSH tunnels..."

# Tunnel for PostgreSQL (53332)
Write-Info "Creating tunnel for PostgreSQL: localhost:53332 -> 85.215.209.220:53332"
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "ssh -L 53332:85.215.209.220:53332 -p 36936 itay@ssh.mytx.co -N" `
        -RedirectStandardError "$PSScriptRoot\tunnel-53332-error.log" `
        -RedirectStandardOutput "$PSScriptRoot\tunnel-53332.log"
    Write-Success "PostgreSQL tunnel started in new window"
} catch {
    Write-Error-Custom "Failed to start PostgreSQL tunnel: $_"
}

# Tunnel for Redis (6189)
Write-Info "Creating tunnel for Redis: localhost:6189 -> 85.215.209.220:6189"
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "ssh -L 6189:85.215.209.220:6189 -p 36936 itay@ssh.mytx.co -N" `
        -RedirectStandardError "$PSScriptRoot\tunnel-6189-error.log" `
        -RedirectStandardOutput "$PSScriptRoot\tunnel-6189.log"
    Write-Success "Redis tunnel started in new window"
} catch {
    Write-Error-Custom "Failed to start Redis tunnel: $_"
}

Write-Success "All tunnels started!"
Write-Info "Tunnels will run in background. Logs saved to:"
Write-Info "PostgreSQL: $PSScriptRoot\tunnel-53332.log"
Write-Info "Redis: $PSScriptRoot\tunnel-6189.log"
