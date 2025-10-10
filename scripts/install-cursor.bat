@echo off
REM Code Captain Cursor Installation Script (Windows Batch)
REM Usage: install-cursor.bat C:\path\to\project

if "%~1"=="" (
    echo [ERROR] Usage: %0 ^<target_project_directory^>
    echo Example: %0 C:\sources\my_project
    exit /b 1
)

set TARGET_DIR=%~1
set SCRIPT_DIR=%~dp0
set REPO_ROOT=%SCRIPT_DIR%..

echo [INFO] Installing Code Captain for Cursor...
echo [INFO] Target directory: %TARGET_DIR%
echo [INFO] Source directory: %REPO_ROOT%

REM Verify target directory exists
if not exist "%TARGET_DIR%" (
    echo [ERROR] Target directory does not exist: %TARGET_DIR%
    exit /b 1
)

REM Verify we're in a Code Captain repository
if not exist "%REPO_ROOT%\cursor\cc.mdc" (
    echo [ERROR] Cannot find cursor files. Make sure you're running this from the Code Captain repository.
    exit /b 1
)

REM Change to target directory
cd /d "%TARGET_DIR%"
echo [INFO] Working in: %CD%

REM Load configuration using PowerShell
set CONFIG_FILE=%SCRIPT_DIR%install-config.json
echo [INFO] Loading configuration from %CONFIG_FILE%

REM Create directory structure from config
echo [INFO] Creating directory structure...
powershell -Command "Get-Content '%CONFIG_FILE%' | ConvertFrom-Json | Select-Object -ExpandProperty directories | ForEach-Object { New-Item -ItemType Directory -Path $_ -Force | Out-Null; Write-Host '[SUCCESS] Created directory: ' $_ }"
echo [SUCCESS] Directory structure created

REM Install files based on configuration
echo [INFO] Installing files...

REM Use PowerShell to process files from config
powershell -Command "$config = Get-Content '%CONFIG_FILE%' | ConvertFrom-Json; $config.files | ForEach-Object { $source = '%REPO_ROOT%\' + $_.source; $dest = $_.destination; if ($_.isDirectory) { if (Test-Path $source) { Copy-Item -Path ($source + '*') -Destination $dest -Recurse -Force; Write-Host '[SUCCESS] Directory copied:' $_.source '->' $dest } else { Write-Host '[WARNING] Source directory not found:' $source } } else { if (Test-Path $source) { Copy-Item -Path $source -Destination $dest -Force; Write-Host '[SUCCESS] File copied:' $_.source '->' $dest } else { Write-Host '[WARNING] Source file not found:' $source } } }"

REM Check for git repository
if not exist ".git" (
    echo [WARNING] No git repository found. Consider running 'git init' to track your changes.
)

REM Extract and display messages from config
powershell -Command "$config = Get-Content '%CONFIG_FILE%' | ConvertFrom-Json; Write-Host '[SUCCESS]' $config.messages.success -ForegroundColor Green; Write-Host ''; Write-Host '[INFO] Installation summary:' -ForegroundColor Blue; $config.files | ForEach-Object { Write-Host '  ✓' $_.destination -ForegroundColor Green }; Write-Host ''; Write-Host '[INFO] Next steps:' -ForegroundColor Blue; $config.messages.nextSteps | ForEach-Object { Write-Host '  ' $_ }; Write-Host ''; Write-Host '[INFO]' $config.messages.availableCommands -ForegroundColor Blue"
