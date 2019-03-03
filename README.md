# Moewchat
React Native mobile chat and social network application example

## Installation

### Setting backend
If you want to use your custom backend you should start a Firebase project using these Google products:
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
Set your [config.js](src/config.js) according to your project

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


![](https://media.giphy.com/media/1o1xaEGDLnqM9Xt1eb/giphy.gif)
