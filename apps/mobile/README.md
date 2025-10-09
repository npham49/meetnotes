# Mobile App

React Native mobile app for MeetNotes using Expo.

## Development

```bash
# From root directory
bun run mobile:dev

# Or from apps/mobile directory
bun run dev
```

This will start the Expo development server. You can then:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your phone

## Platform-specific commands

```bash
# Android
bun run android

# iOS
bun run ios

# Web
bun run web
```

## Requirements

- For Android: Android Studio and Android SDK
- For iOS: macOS with Xcode
- For testing on physical device: Expo Go app

## Tech Stack

- React Native
- Expo
- TypeScript
