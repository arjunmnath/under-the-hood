# Under The Hood

A modern Next.js application for monitoring application logs in real-time using Firebase Firestore and Authentication.

## Features

- **Real-time Log Monitoring**: View logs as they arrive using Firestore's real-time listeners
- **Secure Authentication**: Firebase Authentication with email/password login
- **Log Levels**: Support for info, warning, error, and debug log levels
- **User Isolation**: Users can only view their own logs
- **Advanced Filtering**: Filter logs by level and other criteria

## Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firebase Authentication with Email/Password provider
3. Create a Firestore database in production mode
4. Generate a service account key for Firebase Admin SDK
5. Copy the web app configuration

### 2. Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```bash
# Firebase Web Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### 3. Firestore Security Rules

Apply these security rules in the Firestore console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /logs/{logId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4. Install and Run

```bash
npm install
npm run dev
```

## API Usage

### Sending Logs

Send logs to your application via POST request to `/api/logs`:

```javascript
const logData =  {
  'level': Level.SHOUT.name.toLowerCase(),
  'message': 'App crashed unexpectedly',
  'log_value': Level.SHOUT.value,
  'logger': 'crashLogger',
  'userid': 'userid_placeholder', // Replace this with actual user ID if available
  'timestamp': DateTime.now().toIso8601String(),
  'application': packageInfo.packageName,
  'metadata': {
    'error': error.toString(),
    'stackTrace': stackTrace.toString(),
    'zone': {
      'currentZone': Zone.current.toString(),
      'parentZone': Zone.current.parent.toString(),
    },
  }
};

fetch('https://logs.arjunmnath.me/api/logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(logData)
});
```

## Contributing

Feel free to submit issues and enhancement requests!
