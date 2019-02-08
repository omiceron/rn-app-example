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
        // this.signOut()
        // await this.checkUser(user.uid)

        this.getStore(USER_STORE).subscribeOnUserData(user.uid)
        this.getStore(AVATAR_STORE).subscribeOnUserAvatar(user.uid)

        this.getStore(MESSENGER_STORE).fetchChats()
        this.getStore(MESSENGER_STORE).subscribeOnChats()

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
    return validator.isAlpha(this.firstName) || validator.isAlpha(this.firstName, 'ru-RU')
  }

  @action
  clear() {
    this.email = ''
    this.password = ''

    this.signUpEmail = ''
    this.signUpPassword = ''
    this.firstName = ''
  }

  signIn = async (email, password) => {
    await firebase.auth().signInWithEmailAndPassword(email || this.email, password || this.password)
    this.getStore(NAVIGATION_STORE).navigate('app')
  }

  signUp = async () => {
    const email = this.signUpEmail
    const password = this.signUpPassword
    await firebase.functions().httpsCallable('createUser')({
      email,
      password,
      displayName: this.firstName
    }).catch(err => {
      throw err
    })

    this.signIn(email, password)

    // firebase.auth().createUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword)
  }

  async checkUser() {
    const {firstName} = this || this.getStore(USER_STORE)
    return firebase.functions().httpsCallable('checkUser')({firstName})

    // const isCreated = await this.getStore(PEOPLE_STORE).reference
    //   .child(uid)
    //   .once('value')
    //   .then(snapshot => snapshot.exists())
    //
    // if (isCreated) {
    //   console.log('user already created', uid)
    //   return
    // }
    //
    // let firstName = null, lastName = null
    //
    // const {email = null, photoURL = null, displayName = ''} = firebase.auth().currentUser
    //
    // if (displayName) {
    //   [firstName = null, lastName = null] = displayName.split(' ')
    // } else {
    //   firstName = this.getStore(AUTH_STORE).firstName || this.getStore(USER_STORE).firstName
    //   firebase.auth().currentUser.updateProfile({displayName: firstName})
    // }
    //
    // return this.getStore(PEOPLE_STORE)
    // .reference.child(uid)
    // .update({firstName, lastName, email, avatar: photoURL})

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

      const {
        user: {
          uid
        },
        additionalUserInfo: {
          isNewUser,
          profile: {
            first_name: firstName,
            last_name: lastName,
            email,
            picture: {
              data: {
                url: avatar
              }
            }
          }
        }
      } = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

      if (isNewUser) {
        await firebase.functions().httpsCallable('checkUser')({uid, firstName, lastName, avatar, email})
      }
    }
  }

  loginWithGoogle = async () => {
    const {type, idToken, accessToken} = await Google.logInAsync({
      iosClientId: googleClientId,
      scopes: ['profile', 'email']
    })

    if (type === 'success') {
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)

      const {
        user: {
          uid
        },
        additionalUserInfo: {
          isNewUser,
          profile: {
            family_name: lastName,
            given_name: firstName,
            email,
            picture: avatar
          }
        }
      } = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

      if (isNewUser) {
        await firebase.functions().httpsCallable('checkUser')({uid, firstName, lastName, avatar, email})
      }
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