$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$webRoot = Join-Path $scriptDir "Web"
$venvPython = Join-Path $webRoot ".venv\Scripts\python.exe"
$requirements = Join-Path $webRoot "requirements.txt"
$healthUrl = "http://127.0.0.1:8000/api/health"
$appUrl = "http://127.0.0.1:8000"
$remotePath = "/Eldran"
$ollamaUrl = "http://127.0.0.1:11434/api/tags"
$ollamaModel = if ($env:ELDRAN_OLLAMA_MODEL) { $env:ELDRAN_OLLAMA_MODEL } elseif ($env:KONDTAI_OLLAMA_MODEL) { $env:KONDTAI_OLLAMA_MODEL } else { "qwen2.5:3b" }
$ollamaModelsPath = "D:\Eldran\OllamaModels"

function Get-LanIpAddress {
    $addresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "169.254.*" -and
        $_.PrefixOrigin -ne "WellKnown"
    }

    $preferred = $addresses | Where-Object {
        $_.InterfaceAlias -notlike "*Virtual*" -and
        $_.InterfaceAlias -notlike "*Host-Only*"
    } | Select-Object -First 1

    if ($preferred) {
        return $preferred.IPAddress
    }

    return ($addresses | Select-Object -First 1).IPAddress
}

function Get-ChromePath {
    $candidates = @(
        "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
        "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
    )

    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path $candidate)) {
            return $candidate
        }
    }

    return $null
}

function Stop-EldranServer {
    $processes = Get-CimInstance Win32_Process | Where-Object {
        $_.Name -eq "python.exe" -and
        $_.CommandLine -like "*\Web\.venv\Scripts\python.exe*uvicorn app:app*"
    }

    foreach ($process in $processes) {
        try {
            Stop-Process -Id $process.ProcessId -Force -ErrorAction Stop
        } catch {
        }
    }
}

function Ensure-Ollama {
    New-Item -ItemType Directory -Force -Path $ollamaModelsPath | Out-Null
    $env:OLLAMA_MODELS = $ollamaModelsPath

    try {
        $response = Invoke-WebRequest -Uri $ollamaUrl -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            return
        }
    } catch {
    }

    Write-Host "Starte Ollama..."
    Start-Process -FilePath "ollama" -ArgumentList "serve" -Environment @{ OLLAMA_MODELS = $ollamaModelsPath } | Out-Null

    for ($attempt = 1; $attempt -le 20; $attempt++) {
        Start-Sleep -Seconds 1
        try {
            $response = Invoke-WebRequest -Uri $ollamaUrl -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) {
                return
            }
        } catch {
        }
    }

    throw "Ollama antwortet nicht unter http://127.0.0.1:11434"
}

function Ensure-OllamaModel {
    $env:OLLAMA_MODELS = $ollamaModelsPath
    $listOutput = & ollama list
    if ($listOutput -match [regex]::Escape($ollamaModel)) {
        return
    }

    Write-Host "Lade Ollama-Modell $ollamaModel ..."
    & ollama pull $ollamaModel | Out-Host
}

if (-not (Test-Path $webRoot)) {
    throw "Web-Verzeichnis nicht gefunden: $webRoot"
}

if (-not (Test-Path $venvPython)) {
    Write-Host "Erstelle virtuelle Umgebung..."
    py -3 -m venv (Join-Path $webRoot ".venv")
}

Write-Host "Installiere oder pruefe Abhaengigkeiten..."
& $venvPython -m pip install -r $requirements | Out-Host

Ensure-Ollama
Ensure-OllamaModel

$ready = $false
$serverArgs = @("-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000")

Stop-EldranServer

Write-Host "Starte Webserver..."
Start-Process -FilePath $venvPython -ArgumentList $serverArgs -WorkingDirectory $webRoot | Out-Null

for ($attempt = 1; $attempt -le 30; $attempt++) {
    Start-Sleep -Seconds 1
    try {
        $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {
    }
}

if (-not $ready) {
    throw "Der Webserver antwortet nicht unter $healthUrl"
}

$chromePath = Get-ChromePath
if ($chromePath) {
    Write-Host "Oeffne Chrome..."
    Start-Process -FilePath $chromePath -ArgumentList $appUrl | Out-Null
} else {
    Write-Host "Chrome nicht gefunden, oeffne Standardbrowser..."
    Start-Process $appUrl | Out-Null
}

$lanIp = Get-LanIpAddress
if ($lanIp) {
    Write-Host "Remote-Chat im LAN: http://$lanIp`:8000$remotePath"
}
