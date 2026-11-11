param([string]$OutputDirectory = "backups")
$ErrorActionPreference = "Stop"
$database = "udyog-mitra-db"
if (-not (Get-Command npx -ErrorAction SilentlyContinue)) { throw "Node.js/npm is required." }
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$file = Join-Path $OutputDirectory "$database-$stamp.sql"
Write-Warning "Exporting REMOTE D1 database $database. The output may contain personal information."
$answer = Read-Host "Type BACKUP-UDYOGMITRA to continue"
if ($answer -ne "BACKUP-UDYOGMITRA") { throw "Backup cancelled." }
& npx wrangler d1 export $database --remote --output $file
if ($LASTEXITCODE -ne 0) { throw "D1 export failed with exit code $LASTEXITCODE" }
Write-Host "Backup created at $file. Move it to encrypted access-controlled storage. Do not commit it."
