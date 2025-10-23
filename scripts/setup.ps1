# Setup script for Mot-Lee Organics Project (Windows PowerShell)

Write-Host "🚀 Setting up Mot-Lee Organics development environment..." -ForegroundColor Green

# Check if Bun is installed
try {
    $bunVersion = bun --version
    Write-Host "✅ Bun is installed: $bunVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Bun is not installed. Please install Bun first:" -ForegroundColor Red
    Write-Host "   irm bun.sh/install.ps1 | iex" -ForegroundColor Yellow
    exit 1
}

# Check Node version
$nodeVersion = node --version
$requiredVersion = "20.18.0"

if ([version]$nodeVersion.TrimStart('v') -lt [version]$requiredVersion) {
    Write-Host "❌ Node version $nodeVersion is too old. Please upgrade to $requiredVersion or higher." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node version $nodeVersion is compatible" -ForegroundColor Green

# Clean install
Write-Host "🧹 Cleaning previous installation..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "bun.lockb") { Remove-Item -Force "bun.lockb" }

# Install dependencies
Write-Host "📦 Installing dependencies with Bun..." -ForegroundColor Yellow
bun install

# Verify installation
Write-Host "✅ Verifying installation..." -ForegroundColor Yellow
bun run type-check

Write-Host "🎉 Setup complete! Run 'bun run dev' to start development." -ForegroundColor Green
