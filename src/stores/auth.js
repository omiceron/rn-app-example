import {observable, action, computed} from 'mobx'
import firebase from 'firebase/app'
import BasicStore from './basic-store'
import {AsyncStorage, Alert} from 'react-native'
import validator from 'validator'
import {
    USERS_STORE,
    AVATAR_STORE,
    CURRENT_USER_STORE,
    FEED_STORE,
    MESSENGER_STORE,
    NAVIGATION_STORE
} from '../constants'
import * as Facebook from 'expo-facebook'
import * as Google from 'expo-google-app-auth'
import * as MediaLibrary from 'expo-media-library'
import {facebookAppId, googleClientId} from '../backend/firebase.config'
// import {LoginManager, AccessToken} from 'react-native-fbsdk'
// import EntitiesStore from './entities-store'
// import {FileSystem} from 'expo'
// import {entitiesFromFB} from './utils'

class AuthStore extends BasicStore {
    constructor(...args) {
        super(...args)
        firebase.auth().onAuthStateChanged(async (user) => {
            this.setUser(user)

            if (user) {
                AsyncStorage.getAllKeys().then(console.log)

                this.getStore(CURRENT_USER_STORE).startPresenceWatcher()
                this.getStore(CURRENT_USER_STORE).subscribeOnUserData(user.uid)
                this.getStore(AVATAR_STORE).subscribeOnUserAvatar()
                this.getStore(MESSENGER_STORE).subscribeOnChats()

                await this.getStore(USERS_STORE).fetchAllUsers()
                await this.getStore(FEED_STORE).fetchPosts()
                await this.getStore(MESSENGER_STORE).fetchChats()
            }
        })
    }

    @observable user = null
    @observable loading = false

    @observable email = ''
    @observable password = ''

    @observable signUpEmail = ''
    @observable signUpPassword = ''
    @observable firstName = ''

    @action setUser = (user) => {
        this.user = user
    }

    @action setEmail = (email) => {
        this.email = email
    }

    @action setPassword = (password) => {
        this.password = password
    }

    @action setSignUpEmail = (email) => {
        this.signUpEmail = email
    }

    @action setSignUpPassword = (password) => {
        this.signUpPassword = password
    }

    @action setFirstName = (firstName) => {
        this.firstName = firstName
    }

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
        this.loading = false

        this.signUpEmail = ''
        this.signUpPassword = ''
        this.firstName = ''
    }

    @action signIn = async () => {
        if (!this.isEmailValid || !this.isPasswordValid) {
            Alert.alert('Password or E-mail are not valid!')
            return
        }

        try {
            this.loading = true
            await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        } catch (e) {
            Alert.alert('Password or E-mail are not valid!')
            this.clear()
            return
        }

        this.clear()
        this.getStore(NAVIGATION_STORE).navigate('app')
    }

    @action signUp = async () => {
        if (!this.isSignUpEmailValid || !this.isSignUpPasswordValid || !this.isFirstNameValid) {
            Alert.alert('Password, E-mail or first name are not valid!')
            return
        }

        this.loading = true

        const email = this.signUpEmail
        const password = this.signUpPassword
        await firebase
            .functions()
            .httpsCallable('createUser')({
                email,
                password,
                displayName: this.firstName
            })
            .catch((err) => {
                throw err
            })

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
        } catch (e) {
            Alert.alert('Something went wrong...')
            this.clear()
            return
        }

        this.clear()
        this.getStore(NAVIGATION_STORE).navigate('app')
    }

    async checkUser() {
        const {firstName} = this || this.getStore(CURRENT_USER_STORE)
        return firebase.functions().httpsCallable('checkUser')({firstName})
    }

    signOut = async () => {
        this.clear()
        const stores = [MESSENGER_STORE, AVATAR_STORE, CURRENT_USER_STORE, FEED_STORE, USERS_STORE]
        stores.forEach((store) => this.getStore(store).off())
        // AsyncStorage.removeItem('user')
        await firebase.auth().signOut()
        await AsyncStorage.clear()
        this.getStore(NAVIGATION_STORE).navigate('auth')
    }

    @action loginWithFacebook = async () => {
        this.loading = true

        const {type, token} = await Facebook.logInWithReadPermissionsAsync(facebookAppId, {
            permissions: ['public_profile', 'email']
        })

        console.log(type, token)

        if (type === 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token)

            const {
                user: {uid},
                additionalUserInfo: {
                    isNewUser,
                    profile: {
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        picture: {
                            data: {url: avatar}
                        }
                    }
                }
            } = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

            if (isNewUser) {
                await firebase.functions().httpsCallable('checkUser')({uid, firstName, lastName, email})
            }

            this.getStore(NAVIGATION_STORE).navigate('app')
        }

        this.clear()
    }

    @action loginWithGoogle = async () => {
        this.loading = true

        const {type, idToken, accessToken} = await Google.logInAsync({
            iosClientId: googleClientId,
            scopes: ['profile', 'email']
        })

        if (type === 'success') {
            const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)

            const {
                user: {uid},
                additionalUserInfo: {
                    isNewUser,
                    profile: {family_name: lastName, given_name: firstName, email, picture: avatar}
                }
            } = await firebase.auth().signInAndRetrieveDataWithCredential(credential)

            if (isNewUser) {
                await firebase.functions().httpsCallable('checkUser')({uid, firstName, lastName, email})
            }

            this.getStore(NAVIGATION_STORE).navigate('app')
        }
        this.clear()
    }
}

export default AuthStore
