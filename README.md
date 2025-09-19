# Habit Tracker App

A mobile application built with React Native and Expo to help you track your daily habits and stay consistent. This project uses Appwrite for backend services.

## Features

- User Authentication (Sign up, Login, Logout)
- Create, Read, Update, and Delete habits
- Track daily progress for each habit
- Clean and intuitive user interface

## Tech Stack

- **Frontend:**
  - [React Native](https://reactnative.dev/)
  - [Expo](https://expo.dev/)
  - [Expo Router](https://expo.github.io/router/) for navigation
  - [React Native Paper](https://reactnativepaper.com/) for UI components
- **Backend:**
  - [Appwrite](https://appwrite.io/) (for authentication and database)
- **Language:**
  - [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- Expo CLI
- An Appwrite project

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/adylshay/rn-habit-tracker-app.git
    cd habit-tracker-app-rn
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up your environment variables. Create a `.env` file in the root of the project and add your Appwrite project details:
    ```env
    EXPO_PUBLIC_APPWRITE_ENDPOINT=<YOUR_PROJECT_ENDPOINT>
    EXPO_PUBLIC_APPWRITE_PROJECT_ID=<YOUR_PROJECT_ID>
    ```

### Running the Application

1.  Start the development server:

    ```bash
    npm start
    ```

2.  Scan the QR code with the Expo Go app on your Android or iOS device, or run on an emulator.

    - To run on Android:
      ```bash
      npm run android
      ```
    - To run on iOS:
      ```bash
      npm run ios
      ```

## Project Structure

```
.
├── app/                # Expo Router pages and layouts
│   ├── (tabs)/         # Tab navigation layout and screens
│   ├── _layout.tsx     # Root layout
│   └── auth.tsx        # Authentication screen
├── assets/             # Images and other static assets
├── lib/                # Custom libraries and utilities
│   ├── appwrite.ts     # Appwrite client configuration
│   └── auth-context.tsx# Authentication context provider
├── app.json            # Expo configuration
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```
