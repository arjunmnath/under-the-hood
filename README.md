# Firebase Real-time Logs Dashboard

A modern Next.js application for monitoring application logs in real-time using Firebase Firestore and Authentication.

## Features

- **Real-time Log Monitoring**: View logs as they arrive using Firestore's real-time listeners
- **Secure Authentication**: Firebase Authentication with email/password login
- **Log Levels**: Support for info, warning, error, and debug log levels
- **User Isolation**: Users can only view their own logs
- **Dark Theme**: Modern dark UI optimized for log monitoring
- **Responsive Design**: Works on desktop and mobile devices
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
const logData = {
  message: "User login successful",
  level: "info", // info, warning, error, debug
  userId: "user_firebase_uid",
  metadata: { // optional
    endpoint: "/api/auth/login",
    duration: "234ms"
  }
};

fetch('/api/logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(logData)
});
```

### Flutter Integration Example

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class LogService {
  static const String _baseUrl = 'https://your-app.vercel.app';
  
  static Future<void> sendLog(String message, String level, String userId, [Map<String, dynamic>? metadata]) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/logs'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'message': message,
          'level': level,
          'userId': userId,
          'metadata': metadata,
        }),
      );
      
      if (response.statusCode != 200) {
        print('Failed to send log: ${response.body}');
      }
    } catch (e) {
      print('Error sending log: $e');
    }
  }
}

// Usage
await LogService.sendLog('User completed onboarding', 'info', currentUser.uid);
```

## Features Breakdown

### Real-time Dashboard
- Automatically updates when new logs arrive
- Color-coded log levels for easy identification
- Expandable metadata sections
- Responsive design for all screen sizes

### Authentication
- Secure Firebase Authentication
- User-specific log isolation
- Session management

### API Security
- Firebase Admin SDK for secure server-side operations
- Input validation and error handling
- User authentication verification

### UI/UX
- Modern dark theme optimized for log monitoring
- Smooth animations and transitions
- Professional dashboard layout
- Mobile-responsive design

## Deployment

The application can be deployed to platforms like Vercel, Netlify, or any Node.js hosting service. Make sure to:

1. Set up environment variables in your deployment platform
2. Configure Firebase project settings
3. Update CORS settings if needed
4. Test the API endpoints after deployment

## Contributing

Feel free to submit issues and enhancement requests!