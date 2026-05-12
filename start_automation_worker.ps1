$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = Join-Path $root ".venv\Scripts\python.exe"

if (-not (Test-Path -LiteralPath $python)) {
  $python = "python"
}

if (-not $env:ELDRAN_AUTOMATION_BASE_URL) {
  $env:ELDRAN_AUTOMATION_BASE_URL = "http://127.0.0.1:8000"
}

if (-not $env:ELDRAN_AUTOMATION_WORKSPACE) {
  $env:ELDRAN_AUTOMATION_WORKSPACE = $root
}

if (-not $env:ELDRAN_AUTOMATION_INTERVAL) {
  $env:ELDRAN_AUTOMATION_INTERVAL = "20"
}

if (-not $env:ELDRAN_AUTOMATION_COMMAND) {
  Write-Host "ELDRAN_AUTOMATION_COMMAND ist nicht gesetzt."
  Write-Host "Beispiel:"
  Write-Host '$env:ELDRAN_AUTOMATION_COMMAND = "codex exec --prompt-file {prompt_file}"'
  Write-Host ""
}

& $python (Join-Path $root "automation_worker.py")
