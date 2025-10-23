# 🧘 Mot-Lee Organics - Development Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥20.18.0 ([Download](https://nodejs.org/))
- **Bun** ≥1.0.0 ([Install Bun](https://bun.sh/docs/installation))

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd motlee-zen-shop-main

# Run setup script (choose one)
# For Unix/Linux/Mac:
chmod +x scripts/setup.sh && ./scripts/setup.sh

# For Windows PowerShell:
.\scripts\setup.ps1

# Or manually:
bun install
bun run dev
```

## 📦 Package Management

### ⚠️ Important: Use Bun Only
This project uses **Bun** as the package manager. Never use npm, yarn, or pnpm.

**Correct commands:**
```bash
bun install          # Install dependencies
bun add <package>    # Add new dependency
bun remove <package> # Remove dependency
bun run <script>     # Run npm script
```

**❌ Never use:**
```bash
npm install
yarn install
pnpm install
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run lint:fix` | Fix ESLint issues |
| `bun run type-check` | Check TypeScript types |
| `bun run validate` | Run all checks (type-check + lint + build) |
| `bun run clean` | Remove node_modules and build files |
| `bun run fresh-install` | Clean install + validate |
| `bun run setup` | Complete project setup |

## 🔧 Development Workflow

### Before Starting Work
1. ✅ Check Node version: `node -v` (should be ≥20.18.0)
2. ✅ Check Bun version: `bun -v` (should be ≥1.0.0)
3. ✅ Install dependencies: `bun install`
4. ✅ Verify setup: `bun run validate`

### Daily Development
1. Start dev server: `bun run dev`
2. Make changes to code
3. Check for errors: `bun run type-check`
4. Fix linting issues: `bun run lint:fix`

### Adding Dependencies
1. Add package: `bun add <package-name>`
2. Verify installation: `bun run type-check`
3. Test build: `bun run build`

### Before Committing
1. Run validation: `bun run validate`
2. Fix any issues
3. Commit your changes

## 🚨 Troubleshooting

### Common Issues

#### "ENOENT: no such file or directory, open 'preflight.css'"
**Cause:** Incomplete or corrupted dependencies
**Solution:**
```bash
bun run fresh-install
```

#### "Module not found" errors
**Cause:** Missing dependencies or incorrect imports
**Solution:**
```bash
bun install
bun run type-check
```

#### Build failures
**Cause:** TypeScript errors or missing dependencies
**Solution:**
```bash
bun run type-check
bun run lint
bun run build
```

#### "Please use Bun instead of npm" error
**Cause:** Accidentally used npm instead of bun
**Solution:** Always use `bun` commands, never `npm`

### Nuclear Option (Complete Reset)
If nothing else works:
```bash
bun run clean
bun install
bun run validate
```

## 🏗️ Project Structure

```
motlee-zen-shop-main/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom hooks
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   └── contexts/      # React contexts
├── public/            # Static assets
├── scripts/           # Setup scripts
├── .vscode/           # VS Code configuration
├── .nvmrc             # Node version lock
├── .node-version      # Alternative Node version lock
├── bun.lockb          # Bun lock file
└── package.json       # Dependencies and scripts
```

## 🎯 Best Practices

### Code Quality
- Always run `bun run type-check` before committing
- Fix linting issues with `bun run lint:fix`
- Use TypeScript for all new files
- Follow the existing code style

### Dependencies
- Always use `bun add` to add packages
- Check compatibility with Node 20+ and Bun
- Avoid adding unnecessary dependencies
- Keep dependencies up to date

### Git Workflow
- Run `bun run validate` before pushing
- Use meaningful commit messages
- Keep commits focused and atomic
- Never commit `node_modules` or lock files (except `bun.lockb`)

## 🔍 VS Code Setup

### Recommended Extensions
Install these VS Code extensions for the best experience:
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- TypeScript Importer
- Bun for VS Code

### Settings
The project includes `.vscode/settings.json` with optimal settings for:
- TypeScript configuration
- Tailwind CSS support
- Code formatting
- Linting integration

## 📞 Getting Help

If you encounter issues:
1. Check this documentation first
2. Run `bun run validate` to check for errors
3. Try the troubleshooting steps above
4. Check the project's issue tracker
5. Ask for help with specific error messages

## 🎉 Success Indicators

Your setup is working correctly when:
- ✅ `bun run dev` starts without errors
- ✅ `bun run type-check` passes
- ✅ `bun run lint` shows no errors
- ✅ `bun run build` completes successfully
- ✅ VS Code shows no red squiggles
- ✅ Tailwind CSS classes are highlighted

---

**Happy coding! 🧘‍♀️✨**
