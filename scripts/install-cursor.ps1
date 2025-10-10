# Code Captain Cursor Installation Script (PowerShell)
# Usage: .\scripts\install-cursor.ps1 -TargetPath "C:\path\to\project"

param(
    [Parameter(Mandatory=$true)]
    [string]$TargetPath
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Colors = @{
    Green = "Green"
    Red = "Red" 
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
}

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

# Get script directory and repository root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$ConfigPath = Join-Path $ScriptDir "install-config.json"

Write-Status "Installing Code Captain for Cursor..."
Write-Status "Target directory: $TargetPath"
Write-Status "Source directory: $RepoRoot"

# Verify target directory exists
if (-not (Test-Path $TargetPath -PathType Container)) {
    Write-Error "Target directory does not exist: $TargetPath"
    exit 1
}

# Verify we're in a Code Captain repository
$CursorFile = Join-Path $RepoRoot "cursor\cc.mdc"
if (-not (Test-Path $CursorFile)) {
    Write-Error "Cannot find cursor files. Make sure you're running this from the Code Captain repository."
    exit 1
}

# Load configuration
if (-not (Test-Path $ConfigPath)) {
    Write-Error "Configuration file not found: $ConfigPath"
    exit 1
}

try {
    $Config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
} catch {
    Write-Error "Failed to parse configuration file: $($_.Exception.Message)"
    exit 1
}

# Change to target directory
Set-Location $TargetPath
Write-Status "Working in: $(Get-Location)"

# Create directory structure
Write-Status "Creating directory structure..."

foreach ($dir in $Config.directories) {
    if (-not (Test-Path $dir -PathType Container)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Success "Directory structure created"

# Install files based on configuration
Write-Status "Installing files..."

foreach ($file in $Config.files) {
    $sourcePath = Join-Path $RepoRoot $file.source
    $destPath = $file.destination
    
    if ($file.isDirectory) {
        # Copy directory contents
        if (Test-Path $sourcePath -PathType Container) {
            Copy-Item -Path "$sourcePath*" -Destination $destPath -Recurse -Force
            Write-Success "Directory copied: $($file.source) -> $destPath"
        } else {
            Write-Warning "Source directory not found: $sourcePath"
        }
    } else {
        # Copy single file
        if (Test-Path $sourcePath -PathType Leaf) {
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            Write-Success "File copied: $($file.source) -> $destPath"
        } else {
            Write-Warning "Source file not found: $sourcePath"
        }
    }
}

# Check for git repository
if (-not (Test-Path ".git" -PathType Container)) {
    Write-Warning "No git repository found. Consider running 'git init' to track your changes."
}

Write-Success $Config.messages.success
Write-Host ""
Write-Status "Installation summary:"
Write-Host "  ✓ Cursor rules: .cursor/rules/cc.mdc" -ForegroundColor $Colors.Green
Write-Host "  ✓ Commands: .cursor/commands/*.md" -ForegroundColor $Colors.Green  
Write-Host "  ✓ Documentation: .code-captain/docs/" -ForegroundColor $Colors.Green
Write-Host "  ✓ Code Captain guide: CODE_CAPTAINS.md" -ForegroundColor $Colors.Green
Write-Host ""

Write-Status "Next steps:"
foreach ($step in $Config.messages.nextSteps) {
    Write-Host "  $step" -ForegroundColor $Colors.White
}
Write-Host ""

Write-Status "Available commands: $($Config.messages.availableCommands)"
