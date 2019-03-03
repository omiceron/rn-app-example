# Moewchat
React Native mobile chat and social network application example for Expo

## Installation

### Setting up backend
Skip this step if you don't want to use your custom backend. In other case you should start a Firebase project using these Google products:
* [Firebase Realtime Database](https://firebase.google.com/products/realtime-database/)
* [Firebase Cloud Storage](https://firebase.google.com/products/storage/)
* [Firebase Cloud Functions](https://firebase.google.com/products/functions/)

Then deploy [Meowchat Firebase Cloud Functions](https://github.com/omiceron/firebase-functions-example). Apply your settings by modifying `.firebaserc`:
```json
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_NAME"
  }
}
```

Set your [config.js](src/config.js) according to your project:
```js
export const appName = 'YOUR_FIREBASE_PROJECT_NAME'
export const facebookAppId = 'YOUR_FACEBOOK_APP_ID'
export const googleClientId = 'YOUR_GOOGLE_CLIENT_ID'
export const apiKey = 'YOUR_API_KEY'
export const messagingSenderId = 'YOUR_MESSAGING_SENDER_ID'

export const config = {
  apiKey,
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: appName,
  storageBucket: `gs://${appName}.appspot.com`,
  messagingSenderId
}
```
### Running app on your phone
Meowchat is a React Native Expo project. You should use Expo to compile your app. Follow the instructions on [Expo](https://expo.io/).

## Features
Some features of Meowchat
### Authentication
#### Creating your user with e-mail

![](https://media.giphy.com/media/9xcvP1RryNHX3KQUDu/giphy.gif)

#### Signing in
#### Creating your user with Facebook or Google+

