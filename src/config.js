import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

export const appName = 'advancedreactcourse'
export const facebookAppId = '1943342692364166'
export const googleClientId = '865615408319-j22iilsbcld7of9nd4mbf98u3b2nfiqq.apps.googleusercontent.com'

export const config = {
  apiKey: 'AIzaSyCCtMGA9FTNVds_QTkB1oRTlqF2u07MHuk',
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: appName,
  storageBucket: `gs://${appName}.appspot.com`,
  messagingSenderId: '649150663252'
}

firebase.initializeApp(config)
