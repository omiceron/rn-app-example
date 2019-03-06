import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/functions'

// export const appName = 'meowchat-90a99'
// export const facebookAppId = '1211994208956699'
// export const googleClientId = '822760147204-mbc0qnddr5vdn7nj5korf9a6g7i6mgfp.apps.googleusercontent.com'
// export const apiKey = 'AIzaSyDumTmD6xpw82HpQdPmTbonGu6jc_KBCcs'
// export const messagingSenderId = '822760147204'

export const appName = 'advancedreactcourse'
export const facebookAppId = '1943342692364166'
export const googleClientId = '865615408319-j22iilsbcld7of9nd4mbf98u3b2nfiqq.apps.googleusercontent.com'
export const apiKey = 'AIzaSyCCtMGA9FTNVds_QTkB1oRTlqF2u07MHuk'
export const messagingSenderId = '649150663252'

export const config = {
  apiKey,
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: appName,
  storageBucket: `gs://${appName}.appspot.com`,
  messagingSenderId
}

firebase.initializeApp(config)
