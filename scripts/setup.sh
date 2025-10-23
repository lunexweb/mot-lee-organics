#!/bin/bash
# Setup script for Mot-Lee Organics Project

echo "🚀 Setting up Mot-Lee Organics development environment..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="20.18.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node version $NODE_VERSION is too old. Please upgrade to $REQUIRED_VERSION or higher."
    exit 1
fi

# Clean install
echo "🧹 Cleaning previous installation..."
rm -rf node_modules
rm -f bun.lockb

# Install dependencies
echo "📦 Installing dependencies with Bun..."
bun install

# Verify installation
echo "✅ Verifying installation..."
bun run type-check

echo "🎉 Setup complete! Run 'bun run dev' to start development."
