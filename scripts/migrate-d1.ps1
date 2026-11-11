param(
  [switch]$Remote,
  [string]$Confirmation
)
$ErrorActionPreference = "Stop"
$database = "udyog-mitra-db"
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) { throw "Node.js/npm is required." }
if (-not (Test-Path "wrangler.jsonc")) { throw "Run this script from the UdyogMitra repository root." }
if ($Remote) {
  if ($Confirmation -ne "APPLY-UDYOGMITRA-REMOTE") {
    throw "Remote migration blocked. Re-run with -Remote -Confirmation APPLY-UDYOGMITRA-REMOTE after taking a D1 backup."
  }
  Write-Warning "You are about to apply pending migrations to REMOTE D1: $database"
  $answer = Read-Host "Type the database name to continue"
  if ($answer -ne $database) { throw "Confirmation did not match. No migration was run." }
  & npx wrangler d1 migrations apply $database --remote
} else {
  Write-Host "Applying migrations to LOCAL D1 only: $database"
  & npx wrangler d1 migrations apply $database --local
}
if ($LASTEXITCODE -ne 0) { throw "Wrangler migration command failed with exit code $LASTEXITCODE" }
