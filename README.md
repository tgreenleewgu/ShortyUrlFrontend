# ShortyURL Frontend Guide

## Overview
This guide walks you through setting up and maintaining the **ShortyURL** frontend application. The frontend is built with React Native and Expo, providing a mobile-friendly interface for the URL shortener service.

## ⚙️ System Requirements
* **Node.js:** 18+
* **Git:** for version control
* **Expo CLI:** for mobile development
* **iOS/Android Simulator** or physical device for testing (optional)

##  Frontend Setup (React Native + Expo)

### 1. Clone the Repository (if not already done)
```bash
git clone https://github.com/tgreenleewgu/ShortyUrlFrontend.git
cd shortyurl
```

### 2. Navigate to the Frontend Directory
```bash
cd frontend/ShortyUrlFrontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a .env file in the frontend directory:
```
API_URL=http://localhost:8000/api
```

### 5. Start Development Server
```bash
npm start
# OR
npx expo start
```

### 6. Run on Web
- Press 'w' to run in web browser (localhost is only configured for web at this point)


**Note:** The localhost API configuration currently only works when running in web mode. You'll need to update the API endpoint in your `.env file to point to your machine's IP address or a deployed backend for mobile development.

