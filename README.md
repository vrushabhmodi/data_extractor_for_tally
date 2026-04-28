# Data Extractor for Tally

Extract and manage data from Tally ERP efficiently using this Expo-based mobile and web application.

## Quick Start

### Prerequisites
- Node.js ≥ 16.0.0
- npm ≥ 7.0.0
- Expo CLI (will be installed with `npm install`)

### Installation

1. **Clone and navigate to the repository**
   ```bash
   cd data-extractor-for-tally
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   This opens the Expo CLI menu. Choose an option:
   - Press `w` to run on the web
   - Press `i` to run on iOS simulator (macOS only)
   - Press `a` to run on Android emulator
   - Scan the QR code with Expo Go app (iOS/Android)

### Available Scripts

- `npm start` — Start Expo dev server
- `npm run web` — Run on web browser
- `npm run android` — Run on Android emulator/device
- `npm run ios` — Run on iOS simulator/device
- `npm run type-check` — Check TypeScript types without emitting
- `npm run lint` — Run ESLint (if configured)

## Project Structure

```
data-extractor-for-tally/
├── src/
│   ├── app/                # Root app component
│   │   └── App.tsx        # Main app wrapper
│   ├── screens/           # Screen components
│   │   └── HomeScreen.tsx # Home screen example
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions and constants
│   ├── types/             # TypeScript type definitions
│   └── assets/            # Images, fonts, and static assets
├── index.js               # Entry point
├── app.json               # Expo app manifest
├── tsconfig.json          # TypeScript configuration
├── babel.config.js        # Babel configuration
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
└── .gitignore             # Git exclusions
```

## Development Workflow

1. **Make changes** to any file in `src/`
2. **Hot reload** — Changes appear instantly in the running app
3. **Type checking** — TypeScript catches errors as you code
4. **Debug** — Use console.log, React Native Debugger, or VS Code debugger

## Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   ```env
   REACT_APP_API_URL=http://your-api.com
   REACT_APP_ENV=production
   ```

3. Access in code:
   ```typescript
   const apiUrl = process.env.REACT_APP_API_URL;
   ```

## Features (Ready to Add)

- ✅ TypeScript support for type safety
- ✅ Expo managed workflow for easy deployment
- ✅ Web, iOS, and Android support
- ⚙️ Navigation (React Navigation) — add as needed
- ⚙️ State Management (Redux/Zustand/Context) — add as needed
- ⚙️ API Integration — add HTTP clients
- ⚙️ Local Storage (AsyncStorage/SQLite) — add as needed
- ⚙️ Authentication — add as needed

## Building for Production

### Web
```bash
npm run web
# Build for static hosting
npx expo export --platform web
```

### iOS & Android (using EAS Build)
```bash
# Install EAS CLI
npm install -g eas-cli

# Create account at https://expo.dev and authenticate
eas login

# Configure your project
eas build:configure

# Build
eas build --platform ios
eas build --platform android
```

## Troubleshooting

### Port Already in Use
Expo dev server uses port 8081 by default. If busy:
```bash
npm start -- --port 8082
```

### Clear Cache and Rebuild
```bash
npm start -- --clear
```

### TypeScript Errors
Verify your `tsconfig.json` is correct and dependencies are installed:
```bash
npm install
npm run type-check
```

## Learn More

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript in React Native](https://www.typescriptlang.org/docs/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

## License

MIT

## Support

For issues or questions, create an issue in the GitHub repository.
