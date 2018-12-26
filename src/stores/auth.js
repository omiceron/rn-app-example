import mobx, {observable, action, computed} from 'mobx'
import firebase from 'firebase/app'
import BasicStore from './basic-store'
import {AsyncStorage} from 'react-native'
import validator from 'validator'
import {
  PEOPLE_STORE,
  EVENTS_STORE,
  AVATAR_STORE,
  USER_STORE,
  FEED_STORE,
  MESSENGER_STORE,
  NAVIGATION_STORE
} from '../constants'
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
        this.getStore(MESSENGER_STORE).subscribeOnChats()
        this.getStore(FEED_STORE).fetchPosts()

        // this.getStore(EVENTS_STORE).loadAll()
        // this.getStore(FEED_STORE).subscribeOnPosts()
        // this.getStore(FEED_STORE).postsToFb()

      }
    })

  }

  @observable email = ''
  @observable password = ''

  @observable signUpEmail = ''
  @observable signUpPassword = ''
  @observable firstName = ''

  @observable user = null

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

  signIn = async () => {
    await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
    this.getStore(NAVIGATION_STORE).navigate('app')
  }

  signUp = () => {
    // alert('registered!')
    firebase.auth().createUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword)
  }

  signOut = async () => {
    await AsyncStorage.removeItem('user')
    this.getStore(MESSENGER_STORE).off()
    this.getStore(AVATAR_STORE).off()
    this.getStore(USER_STORE).off()
    firebase.auth().signOut()
    this.getStore(NAVIGATION_STORE).navigate('auth')

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

  loginWithFacebook = async () => {
    const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(
      '1943342692364166',
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
    const {type, idToken, accessToken} = await Expo.Google.logInAsync({
      iosClientId: '865615408319-j22iilsbcld7of9nd4mbf98u3b2nfiqq.apps.googleusercontent.com',
      scopes: ['profile']
    })

    if (type === 'success') {
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)

      await firebase.auth().signInAndRetrieveDataWithCredential(credential).then(console.log, console.error)
    }
  }

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