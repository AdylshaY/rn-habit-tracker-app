# Habit Tracker App

A mobile application built with React Native and Expo to help you track your daily habits and stay consistent. This project uses Appwrite for backend services.

## Features

- **User Authentication:** Secure sign-up, login, and logout functionality.
- **Habit Management:** Create, read, update, and delete habits.
- **Daily Tracking:** Mark habits as completed for the day.
- **Streak Counter:** Keep track of your consecutive days of success for each habit.
- **Clean UI:** A simple and intuitive user interface built with React Native Paper.

## Screens

- **Login/Sign Up:** A simple authentication screen to get you started.
- **Habits:** The main screen where you can see all your habits and mark them as complete.
- **Add Habit:** A screen to add new habits to your list.
- **Streaks:** A screen to view your current and longest streaks for each habit.

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
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An Appwrite project

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/adylshay/rn-habit-tracker-app.git
    cd rn-habit-tracker-app
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up your environment variables. Create a `.env` file in the root of the project and add your Appwrite project details:
    ```env
    EXPO_PUBLIC_APPWRITE_ENDPOINT=<YOUR_PROJECT_ENDPOINT>
    EXPO_PUBLIC_APPWRITE_PROJECT_ID=<YOUR_PROJECT_ID>
    EXPO_PUBLIC_APPWRITE_PLATFORM=<YOUR_APP_ID>
    EXPO_PUBLIC_DB_ID=<YOUR_DATABASE_ID>
    EXPO_PUBLIC_HABITS_TABLE_NAME=<YOUR_HABITS_COLLECTION_ID>
    EXPO_PUBLIC_HABIT_COMPLETIONS_TABLE_NAME=<YOUR_COMPLETIONS_COLLECTION_ID>
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
│   │   ├── _layout.tsx
│   │   ├── add-habit.tsx
│   │   ├── index.tsx
│   │   └── streaks.tsx
│   ├── _layout.tsx     # Root layout
│   └── auth.tsx        # Authentication screen
├── assets/             # Images and other static assets
├── lib/                # Custom libraries and utilities
│   ├── appwrite.ts     # Appwrite client configuration
│   └── auth-context.tsx# Authentication context provider
├── types/              # TypeScript type definitions
│   └── appwrite.ts
├── .env                # Environment variables
├── app.json            # Expo configuration
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
