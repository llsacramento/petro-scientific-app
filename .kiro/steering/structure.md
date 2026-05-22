# Project Structure

## Root Directory

```
petro-scientific-app/
├── src/                    # Application source code
├── public/                 # Static assets (favicon, etc.)
├── dist/                   # Build output (generated)
├── node_modules/           # Dependencies (generated)
├── .kiro/                  # Kiro AI assistant configuration
├── angular.json            # Angular workspace configuration
├── package.json            # NPM dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── .editorconfig           # Editor formatting rules
```

## Source Directory (`src/`)

```
src/
├── app/                    # Application module and components
│   ├── app.component.ts    # Root component (TypeScript)
│   ├── app.component.html  # Root component template
│   ├── app.component.scss  # Root component styles
│   ├── app.component.spec.ts # Root component tests
│   ├── app.config.ts       # Application configuration
│   └── app.routes.ts       # Route definitions
├── index.html              # Main HTML entry point
├── main.ts                 # Application bootstrap
└── styles.scss             # Global styles
```

## Conventions

### Component Organization

- **Selector Prefix**: `app-` (configured in angular.json)
- **Style Format**: SCSS files (`.scss`)
- **File Naming**: kebab-case (e.g., `user-profile.component.ts`)
- **Component Structure**: Each component has 4 files:
  - `.ts` - Component logic
  - `.html` - Template
  - `.scss` - Styles
  - `.spec.ts` - Unit tests

### Standalone Components

This project uses Angular's standalone component architecture:
- Components import dependencies directly via `imports` array
- No NgModule declarations needed
- Routes configured in `app.routes.ts`

### Code Style

From `.editorconfig`:
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for TypeScript
- **Line Endings**: LF
- **Charset**: UTF-8
- **Trailing Whitespace**: Trimmed
- **Final Newline**: Required

### TypeScript Patterns

- Use strict typing (strict mode enabled)
- Leverage Angular's dependency injection
- Follow reactive patterns with RxJS
- Use decorators for Angular features (`@Component`, `@Injectable`, etc.)

## Asset Management

- Static assets go in `public/` directory
- Assets are automatically copied to build output
- Reference public assets from root path (e.g., `/favicon.ico`)

## Configuration Files

- `tsconfig.json` - Base TypeScript config
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.spec.json` - Test-specific TypeScript config
- `angular.json` - Angular CLI and build configuration
