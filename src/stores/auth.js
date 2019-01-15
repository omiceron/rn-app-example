import {observable, action, computed} from 'mobx'
import firebase from 'firebase/app'
import BasicStore from './basic-store'
import {AsyncStorage} from 'react-native'
import validator from 'validator'
import {
  PEOPLE_STORE,
  AVATAR_STORE,
  USER_STORE,
  FEED_STORE,
  MESSENGER_STORE,
  NAVIGATION_STORE
} from '../constants'
import {Facebook, Google} from 'expo'
import {facebookAppId, googleClientId} from '../config'
// import {LoginManager, AccessToken} from 'react-native-fbsdk'
// import EntitiesStore from './entities-store'
// import {FileSystem} from 'expo'
// import {entitiesFromFB} from './utils'
// import {observer} from 'mobx-react'

class AuthStore extends BasicStore {
  constructor(...args) {
    super(...args)

    firebase.auth().onAuthStateChanged(async user => {
      this.setUser(user)

      if (user) {
        await this.getStore(PEOPLE_STORE).createPerson(user.uid)
        this.getStore(USER_STORE).subscribeOnUserData(user.uid)
        this.getStore(AVATAR_STORE).subscribeOnUserAvatar(user.uid)
        // this.getStore(MESSENGER_STORE).subscribeOnChats()
        this.getStore(MESSENGER_STORE).DANGER_subscribeOnChats()
        this.getStore(FEED_STORE).fetchPosts()

        // this.getStore(EVENTS_STORE).loadAll()
        // this.getStore(FEED_STORE).subscribeOnPosts()
        // this.getStore(FEED_STORE).postsToFb()

      }
    })

  }

  @observable user = null

  @observable email = ''
  @observable password = ''

  @observable signUpEmail = ''
  @observable signUpPassword = ''
  @observable firstName = ''

  @action setUser = user => this.user = user
  @action setEmail = email => this.email = email
  @action setPassword = password => this.password = password

  @action setSignUpEmail = email => this.signUpEmail = email
  @action setSignUpPassword = password => this.signUpPassword = password
  @action setFirstName = firstName => this.firstName = firstName

  @computed
  get isEmailValid() {
    return validator.isEmail(this.email)
  }

  @computed
  get isPasswordValid() {
    return this.password.length >= 6
  }

  @computed
  get isSignUpEmailValid() {
    return validator.isEmail(this.signUpEmail)
  }

  @computed
  get isSignUpPasswordValid() {
    return this.signUpPassword.length >= 6
  }

  @computed
  get isFirstNameValid() {
    return validator.isAlpha(this.firstName)
  }

  @action
  clear() {
    this.email = ''
    this.password = ''

    this.signUpEmail = ''
    this.signUpPassword = ''
    this.firstName = ''
  }

  signIn = async () => {
    await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
    this.getStore(NAVIGATION_STORE).navigate('app')
  }

  signUp = () => {
    // alert('registered!')
    firebase.auth().createUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword)
  }

  signOut = async () => {
    this.clear()
    await AsyncStorage.removeItem('user')
    const stores = [MESSENGER_STORE, AVATAR_STORE, USER_STORE, FEED_STORE, PEOPLE_STORE]
    stores.forEach(store => this.getStore(store).off())
    firebase.auth().signOut()
    this.getStore(NAVIGATION_STORE).navigate('auth')
  }

  loginWithFacebook = async () => {
    const {type, token} = await Facebook.logInWithReadPermissionsAsync(
      facebookAppId,
      {permissions: ['public_profile', 'email']}
    )

    console.log(type, token)

    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token)

      console.log(credential)

      await firebase.auth().signInAndRetrieveDataWithCredential(credential).then(console.log, console.error)

    }
  }

  loginWithGoogle = async () => {
    const {type, idToken, accessToken} = await Google.logInAsync({
      iosClientId: googleClientId,
      scopes: ['profile']
    })

    if (type === 'success') {
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)

      await firebase.auth().signInAndRetrieveDataWithCredential(credential).then(console.log, console.error)
    }
  }

  /*
    loginFacebook = () => {
      console.log(LoginManager.logInWithReadPermissions)
      // LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email'])

      /!*
        .then(
          (result) => {
            if (result.isCancelled) {
              alert('Whoops!')
            } else {
              AccessToken.getCurrentAccessToken()
                .then((data) => {
                  const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
                  firebase.auth().signInWithCredential(credential)
                    // .then(loginUserSuccess(dispatch))
                    // .catch((error) => {
                    //   loginSingUpFail(dispatch, error.message)
                    // })
                })
            }
          },
          (error) => {
            alert('Sign in error')
          },
        )*!/
    }
  */

  /*
    updateDisplayName = () => {
      const user = firebase.auth().currentUser

      user.updateProfile({
        displayName: this.displayName
      })
    }
  */

}

export default AuthStore