# Technology Stack

## Framework & Core Libraries

- **Angular**: 19.2.0 (latest stable)
- **TypeScript**: 5.7.2 with strict mode enabled
- **RxJS**: 7.8.0 for reactive programming
- **Zone.js**: 0.15.0 for change detection

## Build System

- **Angular CLI**: 19.2.22
- **Build Tool**: @angular-devkit/build-angular (application builder)
- **Module System**: ES2022 with bundler resolution

## Testing

- **Test Framework**: Jasmine 5.6.0
- **Test Runner**: Karma 6.4.0
- **Coverage**: karma-coverage

## Styling

- **Preprocessor**: SCSS
- **Component Styles**: SCSS with component-scoped styling

## TypeScript Configuration

Strict mode enabled with:
- `noImplicitOverride`
- `noPropertyAccessFromIndexSignature`
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`
- `strictInjectionParameters`
- `strictInputAccessModifiers`
- `strictTemplates`

## Common Commands

```bash
# Development
npm start              # Start dev server (http://localhost:4200)
ng serve              # Alternative dev server command

# Building
npm run build         # Production build (outputs to dist/)
npm run watch         # Development build with watch mode

# Testing
npm test              # Run unit tests with Karma
ng test               # Alternative test command

# Code Generation
ng generate component <name>    # Generate new component
ng generate service <name>      # Generate new service
ng generate --help              # See all generation options
```

## Build Budgets

Production builds enforce:
- Initial bundle: 500kB warning, 1MB error
- Component styles: 4kB warning, 8kB error
