import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/functions'
import {firebaseConfig} from './firebase.config'

const initializeBackend = () => firebase.initializeApp(firebaseConfig)

export {initializeBackend, firebase}
