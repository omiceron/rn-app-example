# Moewchat
React Native mobile chat and social network application example for Expo.

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
Simple user creating.

![](https://media.giphy.com/media/9xcvP1RryNHX3KQUDu/giphy.gif)

#### Signing in
All fields are validated.

![](https://media.giphy.com/media/2sbLWwUPztCxPq21Cv/giphy.gif)

#### Creating your user with Facebook or Google+
Creating user or signing in via OAuth 2.0.

![](https://media.giphy.com/media/woeRYRKL4f9mZ0Nv20/giphy.gif)

#### Revealing password
There is no such behavior in React Native to reveal password, so I did it myself.

![](https://media.giphy.com/media/iee6cDJjplRxryzc1w/giphy.gif)

#### Signing out
If you're signing out all cached data will be wiped out. Apropos, you can see the presence watcher working there.

![](https://media.giphy.com/media/5SBLekZH5RPMMDOFOW/giphy.gif)

### Chatting
Chatting features

#### Creating chat
If user has no chat with other user new chat will be created, but nobody will see that

![](https://media.giphy.com/media/ScBNh9A3UPabj7eFjB/giphy.gif)

#### Sending messages
Simple chatting. New message raises chat to the top of the list, even if it's from user you have no chat with

![](https://media.giphy.com/media/xWfaOMKpqRd2UPsJzc/giphy.gif)

#### Lazy loading chats
Chats are loading by last message order.

![](https://media.giphy.com/media/ReBwkQvACPKkUslvkf/giphy.gif)

#### Archive and Deleting chats
Swipeable rows deliver some good options.

![](https://media.giphy.com/media/KyyZakKyp8TB6MQP5X/giphy.gif)
![](https://media.giphy.com/media/jy1RFIdpQ6yiD14MKB/giphy.gif)

### Posting

#### Creating post

![](https://media.giphy.com/media/23dQTW9QPAJTYATE7B/giphy.gif)

#### Attach location
Location stored on Firebase as an object of a coordinates

![](https://media.giphy.com/media/d2S8bKdxqSVKc1oKsd/giphy.gif)

#### Location parse
You can extract your location from address

![](https://media.giphy.com/media/9rlv85NylAXvcmDfvv/giphy.gif)

#### Revealing post

![](https://media.giphy.com/media/1hMaBK8zJCb4ea8Eum/giphy.gif)

#### Lazy loading posts

![](https://media.giphy.com/media/2SYqtUZVygVt81e6qV/giphy.gif)

#### Likes
Likes screen. Refreshing with each interaction. Posts and likes realtime update are disabled for performance reasons.

![](https://media.giphy.com/media/8Z5Ozn2IYm0Zi46nZ1/giphy.gif)

### Users

#### User screen

![](https://media.giphy.com/media/31WWI0XlrHuqyOfamK/giphy.gif)

#### User presence

![](https://media.giphy.com/media/yN5yGzdzMx1ulBB2My/giphy.gif)

#### Editing current user

![](https://media.giphy.com/media/33G91Npxpg7GjQxnLK/giphy.gif)

#### Add photo for current user

![](https://media.giphy.com/media/9oI623JG6TIzvOOFe5/giphy.gif)

### Other
#### Caching store
Fetched info stored on your device. When you open Meowchat next time, you'll see last state you had before closing.

![](https://media.giphy.com/media/1yMPVby8mafX2nprpN/giphy.gif)

#### Deep navigation
You can surf deep inside the app and all your navigation history will be saved until you close Meowchat.

![](https://media.giphy.com/media/TgFmTo7K3c0NSkLzy5/giphy.gif)

#### Independent navigation screens
Navigation screens are independent. That means you can open same chats due to deep navigation and that will not break you navigation history.

![](https://media.giphy.com/media/2sYDjdZ9tppLsJtrPK/giphy.gif)
